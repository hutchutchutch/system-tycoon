import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Hono } from 'hono';
import { convertV4MiniflareOptions, Miniflare } from 'miniflare';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { playableDesign, journeys } from './gameplay-fixtures';
import { loadStageGame } from '../src/lib/game';
import { evaluateGraph, emptyGraph } from '../../shared/game';
import type { GraphSnapshot } from '../../shared/game';
import { emailRoutes } from '../src/routes/emails';
import { canvasRoutes } from '../src/routes/canvas';
import { authRoutes } from '../src/routes/auth';
import { mentorRoutes } from '../src/routes/mentors';
import { missionRoutes } from '../src/routes/missions';
import { app as workerApp } from '../src/index';
import type { AppEnv, AuthUser, Env, Profile } from '../src/types';

const users = {
  alice: {
    id: 'test-user-alice',
    email: 'alice@example.com',
    name: 'Alice',
  },
  bob: {
    id: 'test-user-bob',
    email: 'bob@example.com',
    name: 'Bob',
  },
} satisfies Record<string, AuthUser>;

let mf: Miniflare;
let db: D1Database;
let app: Hono<AppEnv>;

function profileFor(user: AuthUser): Profile {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.email,
    emailVerified: 1,
    image: null,
    username: user.name?.toLowerCase() ?? null,
    display_name: user.name ?? null,
    avatar_url: null,
    current_level: 1,
    reputation_score: 0,
    career_title: null,
    preferred_mentor_id: null,
    onboarding_completed: 1,
    createdAt: '2026-09-03T00:00:00.000Z',
    updatedAt: '2026-09-03T00:00:00.000Z',
  };
}

function request(path: string, init?: RequestInit, user: AuthUser = users.alice) {
  const headers = new Headers(init?.headers);
  headers.set('x-test-user', user.id);
  return app.request(path, { ...init, headers }, { DB: db, OPENAI_API_KEY: 'test-key' } as Env);
}

async function jsonRequest(path: string, body: unknown, user: AuthUser = users.alice) {
  return request(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }, user);
}

async function putJson(path: string, body: unknown, user: AuthUser = users.alice) {
  return request(path, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }, user);
}

async function applyMigrations() {
  const migrationsDirectory = fileURLToPath(new URL('../migrations/', import.meta.url));
  const names = [
    '0001_initial_schema.sql',
    '0002_seed_data.sql',
    '0004_better_auth_schema.sql',
    '0005_user_stats_fk.sql',
    '0006_fix_all_profile_fks.sql',
    '0007_seed_full_content.sql',
    '0008_seed_remaining_missions.sql',
    '0009_add_initial_system_state.sql',
    '0010_fix_start_email_stage_ids.sql',
    '0011_social_npc_project_schema.sql',
    '0012_enrich_missions.sql',
    '0013_seed_npcs_and_posts.sql',
    '0014_fix_stage_complete_email_ids.sql',
    '0015_mvp_progress_integrity.sql',
    '0016_mvp_data_normalization.sql',
    '0017_gameplay_integrity.sql',
  ];

  for (const name of names) {
    const source = await readFile(`${migrationsDirectory}${name}`, 'utf8');
    let sql = '';
    let insideComment = false;
    let insideString = false;
    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      const next = source[index + 1];
      if (insideComment) {
        if (character === '\n') {
          insideComment = false;
          sql += character;
        }
        continue;
      }
      if (!insideString && character === '-' && next === '-') {
        insideComment = true;
        index += 1;
        continue;
      }
      if (character === "'" && insideString && next === "'") {
        sql += "''";
        index += 1;
        continue;
      }
      if (character === "'") insideString = !insideString;
      sql += character;
    }
    let statement = '';
    let inStatementString = false;
    const statements: string[] = [];
    for (let index = 0; index < sql.length; index += 1) {
      const character = sql[index];
      const next = sql[index + 1];
      if (character === "'" && inStatementString && next === "'") {
        statement += "''";
        index += 1;
        continue;
      }
      if (character === "'") inStatementString = !inStatementString;
      if (character === ';' && !inStatementString) {
        if (statement.trim()) statements.push(statement.trim());
        statement = '';
      } else {
        statement += character;
      }
    }
    if (statement.trim()) statements.push(statement.trim());
    for (const [statementIndex, migrationStatement] of statements.entries()) {
      try {
        await db.prepare(migrationStatement).run();
      } catch (error) {
        throw new Error(`Migration ${name}, statement ${statementIndex + 1} failed: ${migrationStatement.slice(0, 160)}`, { cause: error });
      }
    }
  }
}

async function insertUser(user: AuthUser) {
  const timestamp = '2026-09-03T00:00:00.000Z';
  await db.prepare(
    `INSERT INTO user
      (id, name, email, emailVerified, username, display_name, current_level,
       reputation_score, onboarding_completed, createdAt, updatedAt)
     VALUES (?, ?, ?, 1, ?, ?, 1, 0, 1, ?, ?)`,
  ).bind(
    user.id,
    user.name,
    user.email,
    user.name?.toLowerCase(),
    user.name,
    timestamp,
    timestamp,
  ).run();
}

async function designThatSatisfies(stageId: string) {
  const stage = await db.prepare('SELECT m.slug, ms.stage_number FROM mission_stages ms JOIN missions m ON m.id=ms.mission_id WHERE ms.id=?')
    .bind(stageId).first<{ slug: string; stage_number: number }>();
  const game = await loadStageGame(db, stageId);
  const canvasState = playableDesign(stage!.slug, stage!.stage_number, game!.catalog);
  return { nodes: canvasState.nodes, edges: canvasState.edges, canvasState };
}

beforeAll(async () => {
  mf = new Miniflare(convertV4MiniflareOptions({
    modules: true,
    script: 'export default { fetch() { return new Response("ok") } }',
    compatibilityDate: '2026-09-03',
    d1Databases: { DB: 'mvp-test-db' },
  }));
  db = await mf.getD1Database('DB') as D1Database;
  await applyMigrations();

  app = new Hono<AppEnv>();
  app.use('*', async (c, next) => {
    const user = Object.values(users).find((candidate) => candidate.id === c.req.header('x-test-user')) ?? users.alice;
    c.set('user', user);
    c.set('profile', profileFor(user));
    await next();
  });
  app.route('/emails', emailRoutes);
  app.route('/canvas', canvasRoutes);
  app.route('/profile', authRoutes);
  app.route('/mentors', mentorRoutes);
  app.route('/missions', missionRoutes);
});

beforeEach(async () => {
  await db.batch([
    db.prepare('DELETE FROM mentor_chat_messages'),
    db.prepare('DELETE FROM user_email_inbox'),
    db.prepare('DELETE FROM mission_stage_completions'),
    db.prepare('DELETE FROM canvas_drafts'),
    db.prepare('DELETE FROM user_mission_progress'),
    db.prepare("DELETE FROM mission_emails WHERE category = 'sent' AND sender_email IN (?, ?)").bind(users.alice.email, users.bob.email),
    db.prepare("DELETE FROM user WHERE id LIKE 'test-user-%'"),
    db.prepare("UPDATE mission_emails SET status = 'unread'"),
    db.prepare("UPDATE news_articles SET article_status = 'active', completion_count = 0"),
  ]);
  await insertUser(users.alice);
  await insertUser(users.bob);
});

afterAll(async () => {
  vi.unstubAllGlobals();
  await mf.dispose();
});

describe('MVP HTTP seams', () => {
  it('rejects later-stage regressions, isolated components, and a load balancer with only one replica', async () => {
    const stage = await db.prepare("SELECT ms.id FROM mission_stages ms JOIN missions m ON m.id=ms.mission_id WHERE m.slug='health-tracker-crisis' AND ms.stage_number=3").first<{ id: string }>();
    const { canvasState } = await designThatSatisfies(stage!.id);
    for (const removed of ['backup-instance', 'web-replica']) {
      const graph = { ...canvasState, nodes: canvasState.nodes.filter(n => n.id !== removed), edges: canvasState.edges.filter(e => e.source !== removed && e.target !== removed) };
      const result = await (await jsonRequest('/missions/validate', { stageId: stage!.id, canvasState: graph })).json<{ summary: { allCompleted: boolean } }>();
      expect(result.summary.allCompleted, removed).toBe(false);
    }
    const isolated = { ...canvasState, edges: canvasState.edges.filter(e => e.source !== 'backup-instance' && e.target !== 'backup-instance') };
    const game = (await loadStageGame(db, stage!.id))!;
    const result = evaluateGraph(isolated, game.rules);
    expect(result.requirements.find(r => r.type === 'connected_system')?.completed).toBe(false);
  });

  it('coaches non-UUID stages with canonical graph checks and the most recent conversation history', async () => {
    const mentor = await db.prepare('SELECT id FROM mentors LIMIT 1').first<{ id: string }>();
    const article = await db.prepare("SELECT na.id,na.mission_id FROM news_articles na JOIN missions m ON m.id=na.mission_id WHERE m.slug='school-district-crisis'").first<{ id: string; mission_id: string }>();
    await jsonRequest('/missions/start', { newsArticleId: article!.id, missionId: article!.mission_id,
      contactEmailData: { to: 'client@example.com', subject: 'Coaching', body: 'Ready.' } });
    const stageId = 'stage-m2-001';
    const { canvasState } = await designThatSatisfies(stageId);
    const command = { mentorId: mentor!.id, missionStageId: stageId, canvasState, conversationSessionId: 'school-coaching', messageContent: 'What should I improve?', senderType: 'user' };
    expect((await jsonRequest('/mentors/chat', command, users.bob)).status).toBe(403);
    expect((await jsonRequest('/mentors/chat', { ...command, canvasState: { bad: true } })).status).toBe(400);
    await db.batch(Array.from({ length: 30 }, (_, index) => db.prepare(`INSERT INTO mentor_chat_messages
      (id,user_id,mentor_id,conversation_session_id,message_content,sender_type,mission_stage_id,created_at)
      VALUES (?,?,?,?,?,'user',?,?)`).bind(`history-${index}`, users.alice.id, mentor!.id, command.conversationSessionId, `message-${index}`, stageId, `2026-09-05T00:00:${String(index).padStart(2, '0')}Z`)));
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ output: [{ content: [{ type: 'output_text', text: 'Check your worker path.' }] }] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    try {
      expect((await jsonRequest('/mentors/chat', command)).status).toBe(201);
      const call = (fetchMock.mock.calls as unknown as Array<[string, RequestInit]>)[0];
      const prompt = JSON.parse(call[1].body as string) as { instructions: string; input: Array<{ content: string }> };
      expect(prompt.instructions).toContain('web_server-instance');
      expect(prompt.instructions).toContain('"passed":true');
      expect(prompt.input.map(m => m.content)).toContain('message-29');
      expect(prompt.input.map(m => m.content)).not.toContain('message-0');
    } finally { vi.unstubAllGlobals(); }
  });

  it('plays all 25 stages with realistic canvas actions, shared checks, snapshots, and inheritance', async () => {
    let count = 0;
    for (const slug of Object.keys(journeys)) {
      const article = await db.prepare('SELECT na.id, na.mission_id FROM news_articles na JOIN missions m ON m.id=na.mission_id WHERE m.slug=? LIMIT 1')
        .bind(slug).first<{ id: string; mission_id: string }>();
      expect(article, slug).not.toBeNull();
      expect((await jsonRequest('/missions/start', { newsArticleId: article!.id, missionId: article!.mission_id,
        contactEmailData: { to: 'client@example.com', subject: slug, body: 'Ready to help.' } })).status).toBe(200);
      const stages = await db.prepare('SELECT id, stage_number FROM mission_stages WHERE mission_id=? ORDER BY stage_number')
        .bind(article!.mission_id).all<{ id: string; stage_number: number }>();
      for (const stage of stages.results) {
        const game = (await loadStageGame(db, stage.id))!;
        const initial = await (await request(`/canvas/${stage.id}`)).json<{ canvasState: GraphSnapshot; revision: number }>();
        const graph = playableDesign(slug, stage.stage_number, game.catalog, initial.canvasState);
        const browserResult = evaluateGraph(graph, game.rules);
        const checked = await jsonRequest('/missions/validate', { stageId: stage.id, canvasState: graph });
        const serverResult = await checked.json();
        expect(serverResult, `${slug} ${stage.stage_number}`).toMatchObject(browserResult);
        expect(browserResult.summary.allCompleted, JSON.stringify(browserResult.requirements.filter(r => !r.completed))).toBe(true);
        const saved = await putJson('/canvas', { missionId: article!.mission_id, stageId: stage.id, canvasState: graph, revision: initial.revision });
        expect(saved.status).toBe(200);
        const revision = (await saved.json<{ revision: number }>()).revision;
        const completed = await jsonRequest('/missions/complete-stage', { stageId: stage.id, canvasState: graph, revision, idempotencyKey: `journey-${stage.id}` });
        expect(completed.status, await completed.clone().text()).toBe(200);
        const result = await completed.json<{ nextStageId: string | null }>();
        const accepted = await (await request(`/canvas/${stage.id}`)).json<{ canvasState: GraphSnapshot; readOnly: boolean }>();
        expect(accepted.readOnly).toBe(true);
        expect(accepted.canvasState.nodes.map(n => n.id)).toEqual(graph.nodes.map(n => n.id));
        expect(accepted.canvasState.viewport).toEqual(graph.viewport);
        expect((await putJson('/canvas', { missionId: article!.mission_id, stageId: stage.id, canvasState: emptyGraph(), revision })).status).toBe(409);
        if (result.nextStageId) {
          const next = await (await request(`/canvas/${result.nextStageId}`)).json<{ canvasState: GraphSnapshot; readOnly: boolean }>();
          expect(next.readOnly).toBe(false);
          expect(next.canvasState).toEqual(accepted.canvasState);
        }
        count++;
      }
    }
    expect(count).toBe(25);
    const user = await db.prepare('SELECT reputation_score, current_level FROM user WHERE id=?').bind(users.alice.id).first();
    expect(user).toEqual({ reputation_score: 1260, current_level: 6 });
    const campaign = await (await request('/missions/campaign/progress')).json<Array<{ completed: number }>>();
    expect(campaign.filter(s => s.completed)).toHaveLength(25);
  });

  it('rejects stale writes and completions, but saves an intentionally empty design', async () => {
    const article = await db.prepare("SELECT na.id, na.mission_id FROM news_articles na JOIN missions m ON m.id=na.mission_id WHERE m.slug='health-tracker-crisis'")
      .first<{ id: string; mission_id: string }>();
    await jsonRequest('/missions/start', { newsArticleId: article!.id, missionId: article!.mission_id,
      contactEmailData: { to: 'client@example.com', subject: 'Revision test', body: 'Ready.' } });
    const stage = await db.prepare('SELECT id FROM mission_stages WHERE mission_id=? AND stage_number=1').bind(article!.mission_id).first<{ id: string }>();
    const { canvasState } = await designThatSatisfies(stage!.id);
    const command = { missionId: article!.mission_id, stageId: stage!.id, revision: 0, canvasState };
    expect((await putJson('/canvas', command)).status).toBe(200);
    expect((await putJson('/canvas', command)).status).toBe(409);
    expect((await jsonRequest('/missions/complete-stage', { ...command, idempotencyKey: 'stale-completion' })).status).toBe(409);
    expect((await putJson('/canvas', { ...command, revision: 1, canvasState: emptyGraph() })).status).toBe(200);
    expect(await (await request(`/canvas/${stage!.id}`)).json()).toMatchObject({ canvasState: emptyGraph(), revision: 2 });
    const duplicates = { ...canvasState, nodes: [...canvasState.nodes, canvasState.nodes[0]] };
    expect((await putJson('/canvas', { ...command, revision: 2, canvasState: duplicates })).status).toBe(400);
    expect((await jsonRequest('/missions/validate', { stageId: stage!.id, canvasState: duplicates })).status).toBe(400);
    const reversed = { ...canvasState, edges: canvasState.edges.map(e => ({ ...e, source: e.target, target: e.source })) };
    expect(await (await jsonRequest('/missions/validate', { stageId: stage!.id, canvasState: reversed })).json()).toMatchObject({ summary: { allCompleted: false } });
    const game = (await loadStageGame(db, stage!.id))!;
    expect(await (await jsonRequest('/missions/validate', { stageId: stage!.id, canvasState: game.initial })).json()).toMatchObject({ summary: { allCompleted: false } });
  });

  it('enforces Better Auth on protected API routes', async () => {
    const response = await workerApp.request('/api/emails', undefined, {
      DB: db,
      JWT_SECRET: 'test-secret-that-is-long-enough-for-better-auth',
      BETTER_AUTH_URL: 'http://localhost:8787',
      ENVIRONMENT: 'development',
      GOOGLE_CLIENT_ID: 'test-client',
      GOOGLE_CLIENT_SECRET: 'test-secret',
    } as Env);
    expect(response.status).toBe(401);
  });

  it('validates profile updates and canonical mentor IDs', async () => {
    const badUsername = await request('/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: '<script>' }),
    });
    expect(badUsername.status).toBe(400);

    const badMentor = await request('/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ preferred_mentor_id: 'not-a-mentor' }),
    });
    expect(badMentor.status).toBe(400);
  });

  it('ships playable seed content for every active mission', async () => {
    const broken = await db.prepare(
      `SELECT na.id, na.mission_id
       FROM news_articles na
       LEFT JOIN missions m ON m.id = na.mission_id
       WHERE na.article_status = 'active'
         AND (na.mission_id IS NULL OR m.id IS NULL)`,
    ).all();
    expect(broken.results).toEqual([]);

    const unsupportedRequirements = await db.prepare(
      `SELECT id, requirement_type FROM mission_stage_requirements
       WHERE requirement_type NOT IN (
         'node_categories', 'node_count', 'node_and_connection', 'edge_connection',
         'component_required', 'connection_required', 'cost_constraint', 'path_required', 'remove_broken', 'connected_system', 'fanout_required'
       )`,
    ).all();
    expect(unsupportedRequirements.results).toEqual([]);

    const missions = await db.prepare(
      `SELECT DISTINCT mission_id FROM news_articles
       WHERE article_status = 'active' AND mission_id IS NOT NULL`,
    ).all<{ mission_id: string }>();
    for (const { mission_id } of missions.results) {
      const stages = await db.prepare(
        `SELECT ms.stage_number, COUNT(msr.id) AS requirement_count
         FROM mission_stages ms
         LEFT JOIN mission_stage_requirements msr ON msr.stage_id = ms.id
         WHERE ms.mission_id = ?
         GROUP BY ms.id, ms.stage_number
         ORDER BY ms.stage_number`,
      ).bind(mission_id).all<{ stage_number: number; requirement_count: number }>();
      expect(stages.results.map((stage) => stage.stage_number)).toEqual(
        Array.from({ length: stages.results.length }, (_, index) => index + 1),
      );
      expect(stages.results.length).toBeGreaterThan(0);
      expect(stages.results.every((stage) => stage.requirement_count > 0)).toBe(true);

      const lifecycleEmails = await db.prepare(
        `SELECT trigger_type, COUNT(*) AS count FROM mission_emails
         WHERE mission_id = ? AND trigger_type IN ('mission_start', 'mission_complete')
         GROUP BY trigger_type`,
      ).bind(mission_id).all<{ trigger_type: string; count: number }>();
      expect(
        Object.fromEntries(lifecycleEmails.results.map((row) => [row.trigger_type, row.count])),
        `mission ${mission_id} must include lifecycle emails`,
      ).toMatchObject({
        mission_start: 1,
        mission_complete: 1,
      });
    }
  });

  it('returns one complete stage contract with its mission and ordered stages', async () => {
    const stage = await db.prepare(
      'SELECT id, mission_id FROM mission_stages ORDER BY stage_number LIMIT 1',
    ).first<{ id: string; mission_id: string }>();

    const response = await request(`/missions/stage/${stage!.id}`);
    const body = await response.json<{
      mission_id: string;
      stage_number: number;
      mission: { id: string };
      stages: Array<{ id: string; stage_number: number }>;
    }>();

    expect(response.status).toBe(200);
    expect(body.mission_id).toBe(stage!.mission_id);
    expect(body.stage_number).toBe(1);
    expect(body.mission.id).toBe(stage!.mission_id);
    expect(body.stages.map((item) => item.stage_number)).toEqual([1, 2, 3, 4, 5]);
  });

  it('keeps email visibility and read state scoped to the inbox owner', async () => {
    const email = await db.prepare(
      "SELECT id FROM mission_emails WHERE trigger_type = 'mission_start' LIMIT 1",
    ).first<{ id: string }>();
    await db.prepare(
      `INSERT INTO user_email_inbox (id, user_id, mission_email_id, status, delivered_at)
       VALUES (?, ?, ?, 'unread', ?)`,
    ).bind('alice-inbox-email', users.alice.id, email!.id, '2026-09-03T00:00:00.000Z').run();

    expect((await request(`/emails/${email!.id}`, undefined, users.bob)).status).toBe(404);

    const marked = await request(`/emails/${email!.id}/read`, { method: 'PATCH' }, users.alice);
    expect(marked.status).toBe(200);

    const canonical = await db.prepare('SELECT status FROM mission_emails WHERE id = ?')
      .bind(email!.id).first<{ status: string }>();
    const inbox = await db.prepare(
      'SELECT status, read_at FROM user_email_inbox WHERE user_id = ? AND mission_email_id = ?',
    ).bind(users.alice.id, email!.id).first<{ status: string; read_at: string | null }>();
    expect(canonical?.status).toBe('unread');
    expect(inbox?.status).toBe('read');
    expect(inbox?.read_at).not.toBeNull();
  });

  it('validates composed email input and creates the email plus inbox entry atomically', async () => {
    const invalid = await jsonRequest('/emails', { to: '', subject: '', body: '', status: 'sent' });
    expect(invalid.status).toBe(400);

    const createdResponse = await jsonRequest('/emails', {
      to: 'recipient@example.com',
      subject: 'Hello',
      body: 'A plain-text message.',
      status: 'sent',
    });
    expect(createdResponse.status).toBe(201);
    const created = await createdResponse.json<{ id: string }>();
    expect((await request(`/emails/${created.id}`)).status).toBe(200);
    expect((await request(`/emails/${created.id}`, undefined, users.bob)).status).toBe(404);
  });

  it('rejects completion of a stage that is not the current unlocked stage', async () => {
    const mission = await db.prepare(
      `SELECT m.id FROM missions m
       WHERE (SELECT COUNT(*) FROM mission_stages ms WHERE ms.mission_id = m.id) >= 2
       ORDER BY m.id LIMIT 1`,
    ).first<{ id: string }>();
    const stages = await db.prepare(
      'SELECT id, stage_number FROM mission_stages WHERE mission_id = ? ORDER BY stage_number LIMIT 2',
    ).bind(mission!.id).all<{ id: string; stage_number: number }>();
    const article = await db.prepare(
      'SELECT id FROM news_articles WHERE mission_id = ? LIMIT 1',
    ).bind(mission!.id).first<{ id: string }>();

    const started = await jsonRequest('/missions/start', {
      newsArticleId: article!.id,
      missionId: mission!.id,
      contactEmailData: { to: 'client@example.com', subject: 'I can help', body: 'Let us begin', hero: {} },
    });
    expect(started.status).toBe(200);

    const stageTwo = stages.results[1];
    const design = await designThatSatisfies(stageTwo.id);
    const response = await jsonRequest('/missions/complete-stage', {
      stageId: stageTwo.id,
      ...design,
      idempotencyKey: 'skip-stage-attempt',
    });

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({ error: 'Stage is not currently unlocked' });
  });

  it('rejects malformed and fabricated canvas designs', async () => {
    const stage = await db.prepare(
      'SELECT id FROM mission_stages ORDER BY stage_number LIMIT 1',
    ).first<{ id: string }>();

    const malformed = await jsonRequest('/missions/validate', { stageId: stage!.id, nodes: 'not-an-array', edges: [] });
    expect(malformed.status).toBe(400);

    const fabricated = await jsonRequest('/missions/validate', {
      stageId: stage!.id,
      nodes: [
        { id: 'fake-compute', data: { id: 'does-not-exist', category: 'compute', cost: 0 } },
        { id: 'fake-db', data: { id: 'also-fake', category: 'database', cost: 0 } },
      ],
      edges: [{ id: 'fake-edge', source: 'fake-compute', target: 'fake-db' }],
    });
    expect(fabricated.status).toBe(200);
    await expect(fabricated.json()).resolves.toMatchObject({
      summary: { allCompleted: false },
    });
  });

  it('never treats a stage with no requirements as completed', async () => {
    const missionId = 'empty-requirements-mission';
    const stageId = 'empty-requirements-stage';
    await db.batch([
      db.prepare('INSERT INTO missions (id, slug, title) VALUES (?, ?, ?)').bind(missionId, missionId, 'Empty mission'),
      db.prepare('INSERT INTO mission_stages (id, mission_id, stage_number, title) VALUES (?, ?, 1, ?)').bind(stageId, missionId, 'Empty stage'),
    ]);
    const response = await jsonRequest('/missions/validate', { stageId, nodes: [], edges: [] });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      summary: { totalRequirements: 0, allCompleted: false, completionPercentage: 0 },
    });
  });

  it('persists canvas state only for the owner and current mission stage', async () => {
    const article = await db.prepare(
      `SELECT id, mission_id FROM news_articles
       WHERE article_status = 'active' AND mission_id IS NOT NULL LIMIT 1`,
    ).first<{ id: string; mission_id: string }>();
    await jsonRequest('/missions/start', {
      newsArticleId: article!.id,
      missionId: article!.mission_id,
      contactEmailData: { to: 'client@example.com', subject: 'Canvas test', body: 'Starting.' },
    });
    const stage = await db.prepare(
      'SELECT current_stage_id FROM user_mission_progress WHERE user_id = ? AND mission_id = ?',
    ).bind(users.alice.id, article!.mission_id).first<{ current_stage_id: string }>();
    const state = { version: 1, nodes: [{ id: 'one', position: { x: 0, y: 0 }, data: { id: 'web_server', category: 'compute' } }], edges: [], viewport: { x: 1, y: 2, zoom: 1 } };

    expect((await putJson('/canvas', { missionId: article!.mission_id, stageId: stage!.current_stage_id, canvasState: state, revision: 0 })).status).toBe(200);
    await expect((await request(`/canvas/${stage!.current_stage_id}`)).json()).resolves.toMatchObject({ canvasState: state, revision: 1 });
    await expect((await request(`/canvas/${stage!.current_stage_id}`, undefined, users.bob)).json()).resolves.toMatchObject({ canvasState: null });
    await expect((await request('/canvas/user/all')).json()).resolves.toMatchObject({
      [stage!.current_stage_id]: state,
    });
    await expect((await request('/canvas/user/all', undefined, users.bob)).json()).resolves.toEqual({});

    const wrongMission = await putJson('/canvas', { missionId: 'not-the-mission', stageId: stage!.current_stage_id, canvasState: state, revision: 0 });
    expect(wrongMission.status).toBe(409);
  });

  it('starts a mission and sends the contact email as one idempotent command', async () => {
    const article = await db.prepare(
      `SELECT id, mission_id FROM news_articles
       WHERE article_status = 'active' AND mission_id IS NOT NULL LIMIT 1`,
    ).first<{ id: string; mission_id: string }>();
    const command = {
      newsArticleId: article!.id,
      missionId: article!.mission_id,
      contactEmailData: {
        to: 'client@example.com',
        subject: 'MVP audit contact',
        body: 'I can help with this system.',
      },
    };

    const firstResponse = await jsonRequest('/missions/start', command);
    expect(firstResponse.status).toBe(200);
    await expect(firstResponse.json()).resolves.toMatchObject({ missionStarted: true });

    const retryResponse = await jsonRequest('/missions/start', command);
    expect(retryResponse.status).toBe(200);
    await expect(retryResponse.json()).resolves.toMatchObject({ missionStarted: false });

    const progress = await db.prepare(
      'SELECT COUNT(*) AS count FROM user_mission_progress WHERE user_id = ? AND mission_id = ?',
    ).bind(users.alice.id, article!.mission_id).first<{ count: number }>();
    const contactEmails = await db.prepare(
      `SELECT COUNT(*) AS count FROM mission_emails
       WHERE sender_email = ? AND subject = ? AND category = 'sent'`,
    ).bind(users.alice.email, command.contactEmailData.subject).first<{ count: number }>();
    expect(progress?.count).toBe(1);
    expect(contactEmails?.count).toBe(1);
  });

  it('completes the current stage once when the command is retried', async () => {
    const article = await db.prepare(
      `SELECT id, mission_id FROM news_articles
       WHERE article_status = 'active' AND mission_id IS NOT NULL LIMIT 1`,
    ).first<{ id: string; mission_id: string }>();
    await jsonRequest('/missions/start', {
      newsArticleId: article!.id,
      missionId: article!.mission_id,
      contactEmailData: { to: 'client@example.com', subject: 'Completion retry', body: 'Starting now.' },
    });
    const stage = await db.prepare(
      'SELECT id FROM mission_stages WHERE mission_id = ? AND stage_number = 1',
    ).bind(article!.mission_id).first<{ id: string }>();
    const design = await designThatSatisfies(stage!.id);
    const command = {
      stageId: stage!.id,
      ...design,
      idempotencyKey: 'complete-stage-retry-key',
    };

    const firstResponse = await jsonRequest('/missions/complete-stage', command);
    const first = await firstResponse.json<{
      firstCompletion: boolean;
      pointsEarned: number;
      impactTotal: number;
      nextStageId: string;
    }>();
    expect(firstResponse.status).toBe(200);
    expect(first.firstCompletion).toBe(true);
    expect(first.pointsEarned).toBeGreaterThan(0);

    const retryResponse = await jsonRequest('/missions/complete-stage', command);
    const retry = await retryResponse.json<{
      firstCompletion: boolean;
      pointsEarned: number;
      impactTotal: number;
      nextStageId: string;
    }>();
    expect(retryResponse.status).toBe(200);
    expect(retry).toMatchObject({
      firstCompletion: false,
      pointsEarned: 0,
      impactTotal: first.impactTotal,
      nextStageId: first.nextStageId,
    });

    const progress = await db.prepare(
      'SELECT current_stage_id FROM user_mission_progress WHERE user_id = ? AND mission_id = ?',
    ).bind(users.alice.id, article!.mission_id).first<{ current_stage_id: string }>();
    const reputation = await db.prepare('SELECT reputation_score FROM user WHERE id = ?')
      .bind(users.alice.id).first<{ reputation_score: number }>();
    expect(progress?.current_stage_id).toBe(first.nextStageId);
    expect(reputation?.reputation_score).toBe(first.impactTotal);

    const persisted = await request(`/missions/completion/${stage!.id}`);
    expect(persisted.status).toBe(200);
    await expect(persisted.json()).resolves.toMatchObject({
      completion: {
        firstCompletion: true,
        pointsEarned: first.pointsEarned,
        nextStageId: first.nextStageId,
      },
      context: { missionTitle: expect.any(String), stageTitle: expect.any(String) },
    });
  });

  it('keeps a mission visible to other players after one player finishes it', async () => {
    const article = await db.prepare(
      `SELECT na.id, na.mission_id FROM news_articles na
       JOIN missions m ON m.id = na.mission_id
       WHERE na.article_status = 'active'
       ORDER BY (SELECT COUNT(*) FROM mission_stages ms WHERE ms.mission_id = m.id), na.id
       LIMIT 1`,
    ).first<{ id: string; mission_id: string }>();
    await jsonRequest('/missions/start', {
      newsArticleId: article!.id,
      missionId: article!.mission_id,
      contactEmailData: { to: 'client@example.com', subject: 'Finish mission', body: 'Starting.' },
    });
    const stages = await db.prepare(
      'SELECT id FROM mission_stages WHERE mission_id = ? ORDER BY stage_number',
    ).bind(article!.mission_id).all<{ id: string }>();
    for (const [index, stage] of stages.results.entries()) {
      const design = await designThatSatisfies(stage.id);
      const completed = await jsonRequest('/missions/complete-stage', {
        stageId: stage.id,
        ...design,
        idempotencyKey: `finish-${article!.mission_id}-${index}`,
      });
      expect(completed.status).toBe(200);
    }
    const status = await db.prepare('SELECT article_status, completion_count FROM news_articles WHERE id = ?')
      .bind(article!.id).first<{ article_status: string; completion_count: number }>();
    expect(status).toEqual({ article_status: 'active', completion_count: 1 });
  });

  it('returns and persists a mentor response for the authenticated user', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      output: [{
        type: 'message',
        content: [{ type: 'output_text', text: 'Start by identifying the load-bearing path.' }],
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })));
    const mentor = await db.prepare('SELECT id FROM mentors LIMIT 1').first<{ id: string }>();

    const response = await jsonRequest('/mentors/chat', {
      mentorId: mentor!.id,
      conversationSessionId: 'session-owned-by-alice',
      messageContent: 'What should I inspect first?',
      senderType: 'user',
    });
    const body = await response.json<{ response: string }>();

    expect(response.status).toBe(201);
    expect(body.response).toBe('Start by identifying the load-bearing path.');

    const history = await request('/mentors/chat/session-owned-by-alice');
    const messages = await history.json<Array<{ sender: string; content: string }>>();
    expect(messages.map(({ sender, content }) => ({ sender, content }))).toEqual([
      { sender: 'user', content: 'What should I inspect first?' },
      { sender: 'mentor', content: 'Start by identifying the load-bearing path.' },
    ]);
    const bobHistory = await request('/mentors/chat/session-owned-by-alice', undefined, users.bob);
    expect(bobHistory.status).toBe(200);
    await expect(bobHistory.json()).resolves.toEqual([]);
  });
});
