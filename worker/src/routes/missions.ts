import { Hono } from 'hono';
import type { AppEnv, AuthUser, Mission, MissionStage, UserMissionProgress } from '../types';
import { generateId, now, queryOne, query, parseJson } from '../lib/db';
import { isGraphSnapshot, repairLegacyGraph } from '../../../shared/game';
import type { GraphSnapshot } from '../../../shared/game';
import { evaluateStage, loadStageGame } from '../lib/game';

export const missionRoutes = new Hono<AppEnv>();

const MAX_CANVAS_NODES = 250;
const MAX_CANVAS_EDGES = 1_000;

type CanvasNodeInput = {
  id: string;
  data: Record<string, unknown>;
};


type MissionRequirementRow = {
  id: string;
  title: string;
  description: string;
  requirement_type: string;
  validation_config: string;
  initially_visible: number;
  priority: number;
  points: number;
  hint: string | null;
};

type ComponentRow = Record<string, unknown> & {
  concepts: string;
  use_cases: string;
  compatible_with: string;
};

type ValidationConfig = {
  required_components?: string[];
  min_instances?: number;
  source_types?: string[];
  target_types?: string[];
  max_monthly_cost?: number;
};

type CanvasEdgeInput = {
  id?: string;
  source: string;
  target: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCanvasNode(value: unknown): value is CanvasNodeInput {
  return isRecord(value)
    && typeof value.id === 'string'
    && value.id.length > 0
    && value.id.length <= 128
    && isRecord(value.data);
}

function isCanvasEdge(value: unknown): value is CanvasEdgeInput {
  return isRecord(value)
    && typeof value.source === 'string'
    && typeof value.target === 'string'
    && value.source.length > 0
    && value.target.length > 0
    && value.source.length <= 128
    && value.target.length <= 128;
}

function isValidDesignCommand(body: unknown): body is {
  stageId: string;
  nodes: CanvasNodeInput[];
  edges: CanvasEdgeInput[];
  idempotencyKey?: string;
  canvasState?: GraphSnapshot;
  revision?: number;
} {
  if (!isRecord(body)) return false;
  if (body.canvasState !== undefined) {
    if (!isGraphSnapshot(body.canvasState)) return false;
    body.nodes = body.canvasState.nodes;
    body.edges = body.canvasState.edges;
  }
  if (body.revision !== undefined && (typeof body.revision !== 'number' || !Number.isSafeInteger(body.revision) || body.revision < 0)) return false;
  return typeof body.stageId === 'string'
    && body.stageId.length > 0
    && body.stageId.length <= 128
    && Array.isArray(body.nodes)
    && body.nodes.length <= MAX_CANVAS_NODES
    && body.nodes.every(isCanvasNode)
    && Array.isArray(body.edges)
    && body.edges.length <= MAX_CANVAS_EDGES
    && body.edges.every(isCanvasEdge)
    && new Set(body.nodes.map(n => n.id)).size === body.nodes.length
    && body.edges.every(e => e.source !== e.target && (body.nodes as CanvasNodeInput[]).some(n => n.id === e.source) && (body.nodes as CanvasNodeInput[]).some(n => n.id === e.target));
}

type StageWithMission = MissionStage & {
  mission_title: string;
  mission_description: string | null;
  mission_crisis_description: string | null;
  mission_slug: string;
};

function toStageSummary(stage: MissionStage) {
  return {
    id: stage.id,
    mission_id: stage.mission_id,
    stage_number: stage.stage_number,
    title: stage.title,
    problem_description: stage.problem_description,
    required_components: parseJson(stage.required_components, []),
    validation_rules: parseJson(stage.validation_rules, {}),
    system_requirements: parseJson(stage.system_requirements, []),
    initial_system_state: parseJson(stage.initial_system_state, null),
  };
}

async function toStageResponse(db: D1Database, stage: StageWithMission) {
  const [requirements, stages] = await Promise.all([
    query<Record<string, unknown> & { validation_config: string }>(
      db,
      'SELECT * FROM mission_stage_requirements WHERE stage_id = ? ORDER BY unlock_order',
      [stage.id],
    ),
    query<MissionStage>(
      db,
      'SELECT * FROM mission_stages WHERE mission_id = ? ORDER BY stage_number',
      [stage.mission_id],
    ),
  ]);

  return {
    ...toStageSummary(stage),
    game: await loadStageGame(db, stage.id),
    mission: {
      id: stage.mission_id,
      slug: stage.mission_slug,
      title: stage.mission_title,
      description: stage.mission_description,
      crisis_description: stage.mission_crisis_description,
    },
    stages: stages.map(toStageSummary),
    requirements: requirements.map((requirement) => ({
      ...requirement,
      validation_config: parseJson(requirement.validation_config, {}),
    })),
  };
}


// Campaign read model is scoped to the player and never inferred from email text.
missionRoutes.get('/campaign/progress', async c => {
  const rows = await query<{
    id: string; title: string; slug: string; status: string | null; current_stage_id: string | null;
    stage_id: string; stage_number: number; stage_title: string; completed: number;
  }>(c.env.DB, `
    SELECT m.id,m.title,m.slug,p.status,p.current_stage_id,s.id AS stage_id,s.stage_number,s.title AS stage_title,
      CASE WHEN sc.id IS NULL THEN 0 ELSE 1 END AS completed
    FROM missions m JOIN mission_stages s ON s.mission_id=m.id
    LEFT JOIN user_mission_progress p ON p.mission_id=m.id AND p.user_id=?
    LEFT JOIN mission_stage_completions sc ON sc.stage_id=s.id AND sc.user_id=?
    ORDER BY m.id,s.stage_number
  `, [c.get('user').id,c.get('user').id]);
  return c.json(rows);
});

// ----------------------------------------------------------------
// GET /:slug
// Load a mission by slug with stages, requirements, and components.
// ----------------------------------------------------------------
missionRoutes.get('/:slug', async (c) => {
  const { slug } = c.req.param();
  const db = c.env.DB;

  // 1. Load mission
  const mission = await queryOne<Mission>(
    db,
    'SELECT * FROM missions WHERE slug = ?',
    [slug],
  );

  if (!mission) {
    return c.json({ error: 'Mission not found' }, 404);
  }

  // 2. Load stages
  const stages = await query<MissionStage>(
    db,
    'SELECT * FROM mission_stages WHERE mission_id = ? ORDER BY stage_number',
    [mission.id],
  );

  // 3. Load requirements for the first stage
  let requirements: Array<Omit<MissionRequirementRow, 'validation_config'> & { validation_config: ValidationConfig }> = [];
  if (stages.length > 0) {
    const firstStage = stages[0];
    const requirementRows = await query<MissionRequirementRow>(
      db,
      'SELECT * FROM mission_stage_requirements WHERE stage_id = ? ORDER BY unlock_order',
      [firstStage.id],
    );
    // Parse JSON on each requirement
    requirements = requirementRows.map((r) => ({
      ...r,
      validation_config: parseJson(r.validation_config, {}),
    }));
  }

  // 4. Load components
  const componentRows = await query<ComponentRow>(
    db,
    'SELECT * FROM components ORDER BY sort_order',
  );
  // Parse JSON columns on components
  const components = componentRows.map((comp) => ({
    ...comp,
    concepts: parseJson(comp.concepts, []),
    use_cases: parseJson(comp.use_cases, []),
    compatible_with: parseJson(comp.compatible_with, []),
  }));

  // 5. Parse JSON columns on stages
  const parsedStages = stages.map((s) => ({
    ...s,
    required_components: parseJson(s.required_components, []),
    validation_rules: parseJson(s.validation_rules, {}),
    system_requirements: parseJson(s.system_requirements, []),
  }));

  return c.json({
    id: mission.id,
    slug: mission.slug,
    title: mission.title,
    description: mission.description,
    crisis_description: mission.crisis_description,
    stages: parsedStages,
    requirements,
    components,
  });
});

// ----------------------------------------------------------------
// GET /first-stage/:missionId
// Load stage 1 for a mission given its ID — used when an email
// has a mission_id but no stage_id.
// ----------------------------------------------------------------
missionRoutes.get('/first-stage/:missionId', async (c) => {
  const { missionId } = c.req.param();
  const db = c.env.DB;

  const stage = await queryOne<StageWithMission>(
    db,
    `SELECT ms.*, m.title AS mission_title, m.description AS mission_description,
            m.crisis_description AS mission_crisis_description, m.slug AS mission_slug
     FROM mission_stages ms
     JOIN missions m ON m.id = ms.mission_id
     WHERE ms.mission_id = ?
     ORDER BY ms.stage_number ASC
     LIMIT 1`,
    [missionId],
  );

  if (!stage) {
    return c.json({ error: 'No stages found for mission' }, 404);
  }

  return c.json(await toStageResponse(db, stage));
});

// ----------------------------------------------------------------
// GET /stage/:stageId
// Load a specific mission stage by ID with its requirements.
// ----------------------------------------------------------------
missionRoutes.get('/stage/:stageId', async (c) => {
  const { stageId } = c.req.param();
  const db = c.env.DB;

  // Load stage joined with its parent mission
  const stage = await queryOne<StageWithMission>(
    db,
    `SELECT ms.*, m.title AS mission_title, m.description AS mission_description,
            m.crisis_description AS mission_crisis_description, m.slug AS mission_slug
     FROM mission_stages ms
     JOIN missions m ON m.id = ms.mission_id
     WHERE ms.id = ?`,
    [stageId],
  );

  if (!stage) {
    return c.json({ error: 'Stage not found' }, 404);
  }

  return c.json(await toStageResponse(db, stage));
});

// ----------------------------------------------------------------
// POST /start
// Start a mission from a contact email.
// Body: { newsArticleId, missionId, contactEmailData }
// ----------------------------------------------------------------
missionRoutes.post('/start', async (c) => {
  const user = c.get('user') as AuthUser;
  const db = c.env.DB;

  const body = await c.req.json<{
    newsArticleId: string;
    missionId: string;
    contactEmailData: {
      to: string;
      subject: string;
      body: string;
      hero?: unknown;
    };
  }>().catch(() => null);

  if (!body) {
    return c.json({ error: 'Invalid mission start command' }, 400);
  }

  const { newsArticleId, missionId, contactEmailData } = body;

  if (!newsArticleId || newsArticleId.length > 128 || !missionId || missionId.length > 128 || !contactEmailData) {
    return c.json({ error: 'Article, mission, and contact email are required' }, 400);
  }
  const recipient = contactEmailData.to?.trim();
  const subject = contactEmailData.subject?.trim();
  const message = contactEmailData.body?.trim();
  if (!recipient || recipient.length > 320 || !subject || subject.length > 200 || !message || message.length > 10_000) {
    return c.json({ error: 'Invalid contact email' }, 400);
  }

  const article = await queryOne<{ id: string }>(
    db,
    "SELECT id FROM news_articles WHERE id = ? AND mission_id = ? AND article_status = 'active'",
    [newsArticleId, missionId],
  );
  if (!article) return c.json({ error: 'Article does not belong to this mission' }, 409);

  // Check if user already has progress for this mission
  const existingProgress = await queryOne<{ id: string; status: string }>(
    db,
    'SELECT id, status FROM user_mission_progress WHERE user_id = ? AND mission_id = ?',
    [user.id, missionId],
  );

  let missionStarted = false;

  if (!existingProgress || existingProgress.status === 'locked' || existingProgress.status === 'available') {
    // Find the first stage (stage_number = 1)
    const firstStage = await queryOne<MissionStage>(
      db,
      'SELECT * FROM mission_stages WHERE mission_id = ? AND stage_number = 1',
      [missionId],
    );

    if (!firstStage) {
      return c.json({ error: 'Mission has no stages' }, 404);
    }

    const timestamp = now();
    const contactEmailId = generateId();
    const missionEmails = await query<{ id: string }>(
      db,
      `SELECT id FROM mission_emails WHERE mission_id = ? AND trigger_type = 'mission_start'`,
      [missionId],
    );
    const statements: D1PreparedStatement[] = [];

    statements.push(existingProgress
      ? db.prepare(
          `UPDATE user_mission_progress
           SET status = 'in_progress', current_stage_id = ?, stage_id = ?, started_at = ?, updated_at = ?
           WHERE id = ?`,
        ).bind(firstStage.id, firstStage.id, timestamp, timestamp, existingProgress.id)
      : db.prepare(
          `INSERT INTO user_mission_progress
            (id, user_id, mission_id, stage_id, status, current_stage_id, started_at, updated_at)
           VALUES (?, ?, ?, ?, 'in_progress', ?, ?, ?)`,
        ).bind(generateId(), user.id, missionId, firstStage.id, firstStage.id, timestamp, timestamp));

    statements.push(db.prepare(
      `INSERT INTO mission_emails
        (id, mission_id, stage_id, sender_name, sender_email, recipient_email, subject, body,
         status, priority, has_attachments, tags, category, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', 'normal', 0, '[]', 'sent', ?, ?)`,
    ).bind(
      contactEmailId,
      missionId,
      firstStage.id,
      user.name ?? user.email.split('@')[0],
      user.email,
      recipient,
      subject,
      message,
      timestamp,
      timestamp,
    ));
    statements.push(db.prepare(
      `INSERT INTO user_email_inbox (id, user_id, mission_email_id, status, delivered_at, read_at)
       VALUES (?, ?, ?, 'read', ?, ?)`,
    ).bind(generateId(), user.id, contactEmailId, timestamp, timestamp));
    for (const email of missionEmails) {
      statements.push(db.prepare(
        `INSERT OR IGNORE INTO user_email_inbox (id, user_id, mission_email_id, status, delivered_at)
         VALUES (?, ?, ?, 'unread', ?)`,
      ).bind(generateId(), user.id, email.id, timestamp));
    }
    statements.push(db.prepare(
      'UPDATE news_articles SET contact_count = contact_count + 1 WHERE id = ?',
    ).bind(newsArticleId));

    await db.batch(statements);
    missionStarted = true;
  }

  // Fetch mission_start emails for the response
  const firstStageEmails = await query<unknown>(
    db,
    `SELECT id, subject, preview, body, sender_name, sender_email, sender_avatar,
            priority, trigger_type, created_at
     FROM mission_emails
     WHERE mission_id = ? AND trigger_type = 'mission_start'
     ORDER BY created_at`,
    [missionId],
  );

  return c.json({
    success: true,
    missionStarted,
    firstStageEmails,
  });
});

// ----------------------------------------------------------------
// POST /validate
// Validate canvas requirements against a stage's requirements.
// Body: { stageId, nodes, edges, stageAttemptId? }
// ----------------------------------------------------------------
missionRoutes.post('/validate', async (c) => {
  const db = c.env.DB;

  const body: unknown = await c.req.json().catch(() => null);
  if (!isValidDesignCommand(body)) {
    return c.json({ error: 'Invalid validation command' }, 400);
  }

  const { stageId, nodes, edges } = body;

  const { results, summary } = await evaluateStageRequirements(db, stageId, nodes, edges, body.canvasState);

  return c.json({
    success: true,
    summary,
    requirements: results,
  });
});

// ----------------------------------------------------------------
// POST /complete-stage
// Complete a stage: re-validate server-side, advance the user's
// mission progress, award Impact (reputation_score), and deliver
// the next stage's brief emails (or mission_complete emails).
// Body: { stageId, nodes, edges }
// ----------------------------------------------------------------
missionRoutes.post('/complete-stage', async (c) => {
  const user = c.get('user') as AuthUser;
  const db = c.env.DB;

  const body: unknown = await c.req.json().catch(() => null);
  if (!isValidDesignCommand(body)) {
    return c.json({ error: 'Invalid stage completion command' }, 400);
  }
  const { stageId, nodes, edges, idempotencyKey } = body;

  if (
    !idempotencyKey
    || typeof idempotencyKey !== 'string'
    || idempotencyKey.length > 128
  ) {
    return c.json({ error: 'Invalid stage completion command' }, 400);
  }

  // 1. Load the stage being completed
  const stage = await queryOne<MissionStage>(
    db,
    'SELECT * FROM mission_stages WHERE id = ?',
    [stageId],
  );
  if (!stage) {
    return c.json({ error: 'Stage not found' }, 404);
  }

  // 2. Re-validate server-side — never trust a client-side "allCompleted"
  const { results, summary, graph: acceptedGraph } = await evaluateStageRequirements(db, stageId, nodes, edges, body.canvasState);
  if (!summary.allCompleted) {
    return c.json(
      {
        success: false,
        error: 'Requirements not met',
        summary,
        requirements: results,
      },
      409,
    );
  }

  type CompletionRecord = {
    stage_id: string;
    idempotency_key: string;
    points_earned: number;
    next_stage_id: string | null;
    mission_completed: number;
  };

  const priorCompletion = await queryOne<CompletionRecord>(
    db,
    'SELECT * FROM mission_stage_completions WHERE user_id = ? AND idempotency_key = ?',
    [user.id, idempotencyKey],
  );
  if (priorCompletion) {
    if (priorCompletion.stage_id !== stageId) {
      return c.json({ error: 'Idempotency key has already been used' }, 409);
    }
    const [updatedUser, priorNextStage] = await Promise.all([
      queryOne<{ reputation_score: number }>(db, 'SELECT reputation_score FROM user WHERE id = ?', [user.id]),
      priorCompletion.next_stage_id
        ? queryOne<{ stage_number: number }>(db, 'SELECT stage_number FROM mission_stages WHERE id = ?', [priorCompletion.next_stage_id])
        : Promise.resolve(null),
    ]);
    return c.json({
      success: true,
      stageCompleted: true,
      firstCompletion: false,
      missionCompleted: priorCompletion.mission_completed === 1,
      nextStageId: priorCompletion.next_stage_id,
      nextStageNumber: priorNextStage?.stage_number ?? null,
      pointsEarned: 0,
      impactTotal: updatedUser?.reputation_score ?? null,
      deliveredEmails: [],
      validation: { summary, requirements: results },
    });
  }

  // 3. The server owns progression: only the current unlocked stage can
  // complete, and a mission must have been started explicitly.
  const progress = await queryOne<UserMissionProgress>(
    db,
    'SELECT * FROM user_mission_progress WHERE user_id = ? AND mission_id = ?',
    [user.id, stage.mission_id],
  );

  if (!progress) {
    return c.json({ error: 'Mission has not been started' }, 409);
  }

  if (progress.status !== 'in_progress' || progress.current_stage_id !== stageId) {
    return c.json({ error: 'Stage is not currently unlocked' }, 409);
  }

  const timestamp = now();

  // 4. Find the next stage (if any)
  const nextStage = await queryOne<MissionStage>(
    db,
    'SELECT * FROM mission_stages WHERE mission_id = ? AND stage_number = ?',
    [stage.mission_id, stage.stage_number + 1],
  );
  const missionCompleted = !nextStage;

  const pointsEarned = summary.pointsEarned;
  type EmailPreview = {
    id: string;
    subject: string;
    preview: string | null;
    sender_name: string;
    sender_email: string;
    priority: string;
    trigger_type: string;
  };
  const triggerEmails = nextStage
    ? await query<EmailPreview>(
        db,
        `SELECT id, subject, preview, sender_name, sender_email, priority, trigger_type
         FROM mission_emails
         WHERE mission_id = ? AND stage_id = ? AND trigger_type = 'stage_complete'`,
        [stage.mission_id, nextStage.id],
      )
    : await query<EmailPreview>(
        db,
        `SELECT id, subject, preview, sender_name, sender_email, priority, trigger_type
         FROM mission_emails
         WHERE mission_id = ? AND trigger_type = 'mission_complete'`,
        [stage.mission_id],
      );

  const completionId = generateId();
  const completionExists = `EXISTS (
    SELECT 1 FROM mission_stage_completions WHERE id = ?
  )`;
  const statements: D1PreparedStatement[] = [
    db.prepare(
      `INSERT INTO mission_stage_completions
        (id, user_id, mission_id, stage_id, idempotency_key, points_earned, next_stage_id, mission_completed, completed_at, accepted_canvas, validation_result)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
       WHERE EXISTS (
         SELECT 1 FROM user_mission_progress
         WHERE id = ? AND status = 'in_progress' AND current_stage_id = ?
       ) AND COALESCE((SELECT revision FROM canvas_drafts WHERE user_id=? AND stage_id=?),0)=?`,
    ).bind(
      completionId,
      user.id,
      stage.mission_id,
      stageId,
      idempotencyKey,
      pointsEarned,
      nextStage?.id ?? null,
      missionCompleted ? 1 : 0,
      timestamp,
      JSON.stringify(acceptedGraph),
      JSON.stringify({ summary, requirements: results }),
      progress.id,
      stageId,
      user.id,
      stageId,
      body.revision ?? 0,
    ),
  ];

  if (pointsEarned > 0) {
    statements.push(db.prepare(
      `UPDATE user SET current_level = 1 + CAST((reputation_score + ?) / 250 AS INTEGER), reputation_score = reputation_score + ?
       WHERE id = ? AND ${completionExists}`,
    ).bind(pointsEarned, pointsEarned, user.id, completionId));
  }
  for (const email of triggerEmails) {
    statements.push(db.prepare(
      `INSERT OR IGNORE INTO user_email_inbox
        (id, user_id, mission_email_id, status, delivered_at)
       SELECT ?, ?, ?, 'unread', ? WHERE ${completionExists}`,
    ).bind(generateId(), user.id, email.id, timestamp, completionId));
  }
  // Persist the accepted graph and initialize the next stage in the same batch.
  statements.push(db.prepare(`
    INSERT INTO canvas_drafts (user_id,stage_id,canvas_state,revision,updated_at)
    SELECT ?,?,?,1,? WHERE ${completionExists}
    ON CONFLICT(user_id,stage_id) DO UPDATE SET canvas_state=excluded.canvas_state,
      revision=canvas_drafts.revision+1,updated_at=excluded.updated_at
  `).bind(user.id, stageId, JSON.stringify(acceptedGraph), timestamp, completionId));
  if (nextStage) statements.push(db.prepare(`
    INSERT INTO canvas_drafts (user_id,stage_id,canvas_state,revision,updated_at)
    SELECT ?,?,?,0,? WHERE ${completionExists}
    ON CONFLICT(user_id,stage_id) DO NOTHING
  `).bind(user.id, nextStage.id, JSON.stringify(acceptedGraph), timestamp, completionId));
  if (missionCompleted) {
    statements.push(db.prepare(
      `UPDATE news_articles
       SET completion_count = completion_count + 1
       WHERE mission_id = ? AND ${completionExists}`,
    ).bind(stage.mission_id, completionId));
    statements.push(db.prepare(
      `UPDATE user_mission_progress
       SET status = 'completed', completed_at = ?, updated_at = ?
       WHERE id = ? AND current_stage_id = ? AND ${completionExists}`,
    ).bind(timestamp, timestamp, progress.id, stageId, completionId));
  } else {
    statements.push(db.prepare(
      `UPDATE user_mission_progress
       SET current_stage_id = ?, stage_id = ?, status = 'in_progress', updated_at = ?
       WHERE id = ? AND current_stage_id = ? AND ${completionExists}`,
    ).bind(nextStage.id, nextStage.id, timestamp, progress.id, stageId, completionId));
  }

  try {
    const batchResults = await db.batch(statements);
    if (batchResults[0].meta.changes !== 1) {
      return c.json({ error: 'The design revision changed or the stage is no longer unlocked. Reload before completing.' }, 409);
    }
  } catch (error) {
    const concurrentCompletion = await queryOne<CompletionRecord>(
      db,
      'SELECT * FROM mission_stage_completions WHERE user_id = ? AND stage_id = ?',
      [user.id, stageId],
    );
    if (!concurrentCompletion) throw error;
    if (concurrentCompletion.idempotency_key !== idempotencyKey) {
      return c.json({ error: 'Stage has already been completed' }, 409);
    }
    const concurrentUser = await queryOne<{ reputation_score: number }>(
      db,
      'SELECT reputation_score FROM user WHERE id = ?',
      [user.id],
    );
    return c.json({
      success: true,
      stageCompleted: true,
      firstCompletion: false,
      missionCompleted: concurrentCompletion.mission_completed === 1,
      nextStageId: concurrentCompletion.next_stage_id,
      nextStageNumber: nextStage?.stage_number ?? null,
      pointsEarned: 0,
      impactTotal: concurrentUser?.reputation_score ?? null,
      deliveredEmails: [],
      validation: { summary, requirements: results },
    });
  }

  // 9. Return the user's updated Impact total
  const updatedUser = await queryOne<{ reputation_score: number }>(
    db,
    'SELECT reputation_score FROM user WHERE id = ?',
    [user.id],
  );

  return c.json({
    success: true,
    stageCompleted: true,
    firstCompletion: true,
    missionCompleted,
    nextStageId: nextStage?.id ?? null,
    nextStageNumber: nextStage?.stage_number ?? null,
    pointsEarned,
    impactTotal: updatedUser?.reputation_score ?? null,
    deliveredEmails: triggerEmails,
    validation: { summary, requirements: results },
  });
});

// ----------------------------------------------------------------
// GET /completion/:stageId
// Rehydrate a persisted results screen after refresh/deep linking.
// ----------------------------------------------------------------
missionRoutes.get('/completion/:stageId', async (c) => {
  const user = c.get('user') as AuthUser;
  const stageId = c.req.param('stageId');
  const db = c.env.DB;

  const completion = await queryOne<{
    points_earned: number;
    next_stage_id: string | null;
    mission_completed: number;
    mission_id: string;
    stage_title: string;
    mission_title: string;
    validation_result: string | null;
  }>(
    db,
    `SELECT msc.validation_result, msc.points_earned, msc.next_stage_id, msc.mission_completed, msc.mission_id,
            ms.title AS stage_title, m.title AS mission_title
     FROM mission_stage_completions msc
     JOIN mission_stages ms ON ms.id = msc.stage_id
     JOIN missions m ON m.id = msc.mission_id
     WHERE msc.user_id = ? AND msc.stage_id = ?`,
    [user.id, stageId],
  );
  if (!completion) return c.json({ error: 'Completion not found' }, 404);

  const [requirements, updatedUser, nextStage] = await Promise.all([
    query<Record<string, unknown> & { initially_visible: number; points: number }>(
      db,
      'SELECT * FROM mission_stage_requirements WHERE stage_id = ? ORDER BY unlock_order',
      [stageId],
    ),
    queryOne<{ reputation_score: number }>(db, 'SELECT reputation_score FROM user WHERE id = ?', [user.id]),
    completion.next_stage_id
      ? queryOne<{ stage_number: number }>(db, 'SELECT stage_number FROM mission_stages WHERE id = ?', [completion.next_stage_id])
      : Promise.resolve(null),
  ]);
  const triggerEmails = completion.next_stage_id
    ? await query<Record<string, unknown>>(
        db,
        `SELECT id, subject, preview, sender_name, sender_email, priority, trigger_type
         FROM mission_emails
         WHERE mission_id = ? AND stage_id = ? AND trigger_type = 'stage_complete'`,
        [completion.mission_id, completion.next_stage_id],
      )
    : await query<Record<string, unknown>>(
        db,
        `SELECT id, subject, preview, sender_name, sender_email, priority, trigger_type
         FROM mission_emails
         WHERE mission_id = ? AND trigger_type = 'mission_complete'`,
        [completion.mission_id],
      );
  const requirementResults = requirements.map((requirement) => ({
    ...requirement,
    completed: true,
    visible: requirement.initially_visible === 1,
    message: 'Requirement met',
  }));

  return c.json({
    completion: {
      success: true,
      stageCompleted: true,
      firstCompletion: true,
      missionCompleted: completion.mission_completed === 1,
      nextStageId: completion.next_stage_id,
      nextStageNumber: nextStage?.stage_number ?? null,
      pointsEarned: completion.points_earned,
      impactTotal: updatedUser?.reputation_score ?? null,
      deliveredEmails: triggerEmails,
      validation: parseJson(completion.validation_result, {
        summary: {
          totalRequirements: requirementResults.length,
          completedRequirements: requirementResults.length,
          pointsEarned: completion.points_earned,
          allCompleted: requirementResults.length > 0,
          completionPercentage: requirementResults.length > 0 ? 100 : 0,
        },
        requirements: requirementResults,
      }),
    },
    context: {
      emailId: null,
      stageTitle: completion.stage_title,
      missionTitle: completion.mission_title,
    },
  });
});

// Compatibility input adapter; the only evaluator lives in shared/game.ts.
async function evaluateStageRequirements(db: D1Database, stageId: string, nodes: CanvasNodeInput[], edges: CanvasEdgeInput[], canvasState?: GraphSnapshot) {
  const evaluated = await evaluateStage(db, stageId, canvasState ?? repairLegacyGraph({ nodes, edges }));
  return { ...evaluated, results: evaluated.requirements };
}
