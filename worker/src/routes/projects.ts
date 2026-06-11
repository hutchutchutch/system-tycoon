import { Hono } from 'hono';
import type { AppEnv, Env, AuthUser, Npc, Project, ProjectMetrics } from '../types';
import { generateId, now, query, queryOne, execute, parseJson, toBool, toJson } from '../lib/db';

export const projectRoutes = new Hono<AppEnv>();

async function getOwnedProject(env: Env, id: string, userId: string): Promise<Project | null> {
  const row = await queryOne<Project>(env.DB, 'SELECT * FROM projects WHERE id = ?', [id]);
  if (!row || row.player_id !== userId) return null;
  return row;
}

async function hydrateProject(env: Env, row: Project) {
  const mission = await queryOne(
    env.DB,
    'SELECT id, slug, title, tagline, difficulty, estimated_duration_minutes, min_level FROM missions WHERE id = ?',
    [row.mission_id]
  );
  const npc = row.npc_id ? await queryOne<Npc>(env.DB, 'SELECT * FROM npcs WHERE id = ?', [row.npc_id]) : null;
  return {
    ...row,
    design_state: row.design_state ? parseJson(row.design_state, { nodes: [], edges: [] }) : null,
    requirements_met: parseJson<string[]>(row.requirements_met, []),
    mission: mission ?? undefined,
    npc: npc ? { ...npc, verified: toBool(npc.verified), personality: parseJson(npc.personality, {}) } : undefined,
  };
}

function calculateScore(m: ProjectMetrics | null): number {
  if (!m) return 0;
  const uptime = m.uptime_percentage * 0.4;
  const error = Math.max(0, 100 - m.error_rate * 100) * 0.3;
  const latency = Math.max(0, 100 - m.latency_p99 / 10) * 0.2;
  const revenue = Math.min(100, (m.revenue_earned / 10000) * 100) * 0.1;
  return Math.round(uptime + error + latency + revenue);
}

// ------------------------------------------------------------
// Reads
// ------------------------------------------------------------
projectRoutes.get('/', async (c) => {
  const user = c.get('user') as AuthUser;
  const rows = await query<Project>(c.env.DB, 'SELECT * FROM projects WHERE player_id = ? ORDER BY created_at DESC', [user.id]);
  return c.json(await Promise.all(rows.map((r) => hydrateProject(c.env, r))));
});

projectRoutes.get('/:id', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  return c.json(await hydrateProject(c.env, row));
});

projectRoutes.get('/:id/metrics', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  const m = await queryOne<ProjectMetrics>(c.env.DB, 'SELECT * FROM project_metrics WHERE project_id = ?', [row.id]);
  return c.json(m ?? null);
});

projectRoutes.get('/:id/events', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  const limit = Math.min(Number(new URL(c.req.url).searchParams.get('limit')) || 50, 200);
  const events = await query(
    c.env.DB,
    'SELECT * FROM project_events WHERE project_id = ? ORDER BY created_at DESC LIMIT ?',
    [row.id, limit]
  );
  return c.json(events.map((e: any) => ({ ...e, acknowledged: toBool(e.acknowledged), metadata: parseJson(e.metadata, {}) })));
});

// ------------------------------------------------------------
// Create
// ------------------------------------------------------------
projectRoutes.post('/', async (c) => {
  const user = c.get('user') as AuthUser;
  const body = await c.req.json<{ missionId: string; npcId?: string; conversationId?: string }>();

  const firstStage = await queryOne<{ initial_system_state: string | null }>(
    c.env.DB,
    'SELECT initial_system_state FROM mission_stages WHERE mission_id = ? AND stage_number = 1',
    [body.missionId]
  );
  const designState = firstStage?.initial_system_state ?? toJson({ nodes: [], edges: [] });

  const id = generateId();
  const ts = now();
  await execute(
    c.env.DB,
    `INSERT INTO projects (id, player_id, mission_id, npc_id, conversation_id, status, current_stage, design_state, requirements_met, score, revenue_earned, started_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'designing', 1, ?, '[]', 0, 0, ?, ?, ?)`,
    [id, user.id, body.missionId, body.npcId ?? null, body.conversationId ?? null, designState, ts, ts, ts]
  );
  await execute(
    c.env.DB,
    'INSERT INTO project_metrics (id, project_id, uptime_percentage, updated_at) VALUES (?, ?, 100, ?)',
    [generateId(), id, ts]
  );
  if (body.conversationId) {
    await execute(
      c.env.DB,
      'UPDATE conversations SET status = ?, mission_id = ?, updated_at = ? WHERE id = ? AND player_id = ?',
      ['project_accepted', body.missionId, ts, body.conversationId, user.id]
    );
  }

  const row = (await getOwnedProject(c.env, id, user.id))!;
  return c.json(await hydrateProject(c.env, row), 201);
});

// ------------------------------------------------------------
// Mutations
// ------------------------------------------------------------
projectRoutes.patch('/:id/status', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  const { status } = await c.req.json<{ status: string }>();
  const ts = now();
  const extra =
    status === 'deployed' ? ', deployed_at = ?' : status === 'completed' || status === 'failed' ? ', completed_at = ?' : '';
  const params: unknown[] = [status, ts];
  if (extra) params.push(ts);
  params.push(row.id);
  await execute(c.env.DB, `UPDATE projects SET status = ?, updated_at = ?${extra} WHERE id = ?`, params);
  return c.json({ success: true });
});

projectRoutes.put('/:id/design', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  const { nodes, edges } = await c.req.json<{ nodes: unknown[]; edges: unknown[] }>();
  await execute(c.env.DB, 'UPDATE projects SET design_state = ?, updated_at = ? WHERE id = ?', [toJson({ nodes, edges }), now(), row.id]);
  return c.json({ success: true });
});

projectRoutes.patch('/:id/requirements', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  const { requirementIds } = await c.req.json<{ requirementIds: string[] }>();
  await execute(c.env.DB, 'UPDATE projects SET requirements_met = ?, updated_at = ? WHERE id = ?', [toJson(requirementIds), now(), row.id]);
  return c.json({ success: true });
});

projectRoutes.post('/:id/deploy', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  if (!row.design_state) return c.json({ error: 'No design to deploy' }, 400);
  const ts = now();
  await execute(c.env.DB, "UPDATE projects SET status = 'deployed', deployed_at = ?, updated_at = ? WHERE id = ?", [ts, ts, row.id]);
  await execute(
    c.env.DB,
    'INSERT INTO project_events (id, project_id, event_type, message, severity, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [generateId(), row.id, 'milestone', 'System deployed! Simulation starting...', 'success', ts]
  );
  return c.json({ success: true, message: 'Deployed successfully' });
});

projectRoutes.post('/:id/complete', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  const metrics = await queryOne<ProjectMetrics>(c.env.DB, 'SELECT * FROM project_metrics WHERE project_id = ?', [row.id]);
  const score = calculateScore(metrics);
  const revenue = metrics?.revenue_earned ?? 0;
  const ts = now();
  await execute(
    c.env.DB,
    "UPDATE projects SET status = 'completed', score = ?, revenue_earned = ?, completed_at = ?, updated_at = ? WHERE id = ?",
    [score, revenue, ts, ts, row.id]
  );
  await execute(
    c.env.DB,
    'INSERT INTO project_events (id, project_id, event_type, message, severity, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [generateId(), row.id, 'success', `Project completed! Score: ${score}, Revenue: $${revenue}`, 'success', ts]
  );
  return c.json({ score, revenue });
});

projectRoutes.post('/:id/abandon', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  const ts = now();
  await execute(c.env.DB, "UPDATE projects SET status = 'abandoned', completed_at = ?, updated_at = ? WHERE id = ?", [ts, ts, row.id]);
  return c.json({ success: true });
});

// ------------------------------------------------------------
// Events
// ------------------------------------------------------------
projectRoutes.post('/:id/events', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  const body = await c.req.json<{ event_type: string; message: string; severity?: string; metadata?: unknown }>();
  const id = generateId();
  const ts = now();
  await execute(
    c.env.DB,
    'INSERT INTO project_events (id, project_id, event_type, message, severity, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, row.id, body.event_type, body.message, body.severity ?? 'info', toJson(body.metadata ?? {}), ts]
  );
  return c.json({ id, project_id: row.id, ...body, acknowledged: false, created_at: ts }, 201);
});

projectRoutes.post('/:id/ack-events', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwnedProject(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Project not found' }, 404);
  await execute(c.env.DB, 'UPDATE project_events SET acknowledged = 1 WHERE project_id = ? AND acknowledged = 0', [row.id]);
  return c.json({ success: true });
});

projectRoutes.patch('/events/:eventId/ack', async (c) => {
  const user = c.get('user') as AuthUser;
  const eventId = c.req.param('eventId');
  // ownership via project join
  const owned = await queryOne(
    c.env.DB,
    `SELECT e.id FROM project_events e JOIN projects p ON p.id = e.project_id WHERE e.id = ? AND p.player_id = ?`,
    [eventId, user.id]
  );
  if (!owned) return c.json({ error: 'Event not found' }, 404);
  await execute(c.env.DB, 'UPDATE project_events SET acknowledged = 1 WHERE id = ?', [eventId]);
  return c.json({ success: true });
});
