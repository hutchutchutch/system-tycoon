import { Hono } from 'hono';
import type { Env, AuthUser, Mission, MissionStage } from '../types';
import { generateId, now, queryOne, query, execute, parseJson, toJson } from '../lib/db';

export const missionRoutes = new Hono<{ Bindings: Env }>();

// ----------------------------------------------------------------
// GET /:slug
// Load a mission by slug with stages, requirements, and components.
// ----------------------------------------------------------------
missionRoutes.get('/:slug', async (c) => {
  const user = c.get('user') as AuthUser;
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
  let requirements: any[] = [];
  if (stages.length > 0) {
    const firstStage = stages[0];
    requirements = await query<any>(
      db,
      'SELECT * FROM mission_stage_requirements WHERE stage_id = ? ORDER BY unlock_order',
      [firstStage.id],
    );
    // Parse JSON on each requirement
    requirements = requirements.map((r) => ({
      ...r,
      validation_config: parseJson(r.validation_config, {}),
    }));
  }

  // 4. Load components
  let components = await query<any>(
    db,
    'SELECT * FROM components ORDER BY sort_order',
  );
  // Parse JSON columns on components
  components = components.map((comp) => ({
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

  const stage = await queryOne<MissionStage & { mission_title: string; mission_description: string | null; mission_crisis_description: string | null; mission_slug: string }>(
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

  const requirements = await query<any>(
    db,
    'SELECT * FROM mission_stage_requirements WHERE stage_id = ? ORDER BY unlock_order',
    [stage.id],
  );

  return c.json({
    id: stage.id,
    mission_id: stage.mission_id,
    stage_number: stage.stage_number,
    title: stage.title,
    problem_description: stage.problem_description,
    required_components: parseJson(stage.required_components, []),
    validation_rules: parseJson(stage.validation_rules, {}),
    system_requirements: parseJson(stage.system_requirements, []),
    initial_system_state: parseJson(stage.initial_system_state, null),
    mission: {
      slug: stage.mission_slug,
      title: stage.mission_title,
      description: stage.mission_description,
      crisis_description: stage.mission_crisis_description,
    },
    requirements: requirements.map((r) => ({ ...r, validation_config: parseJson(r.validation_config, {}) })),
  });
});

// ----------------------------------------------------------------
// GET /stage/:stageId
// Load a specific mission stage by ID with its requirements.
// ----------------------------------------------------------------
missionRoutes.get('/stage/:stageId', async (c) => {
  const user = c.get('user') as AuthUser;
  const { stageId } = c.req.param();
  const db = c.env.DB;

  // Load stage joined with its parent mission
  const stage = await queryOne<MissionStage & { mission_title: string; mission_description: string | null; mission_crisis_description: string | null; mission_slug: string }>(
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

  // Load requirements for this stage
  let requirements = await query<any>(
    db,
    'SELECT * FROM mission_stage_requirements WHERE stage_id = ? ORDER BY unlock_order',
    [stageId],
  );
  requirements = requirements.map((r) => ({
    ...r,
    validation_config: parseJson(r.validation_config, {}),
  }));

  return c.json({
    id: stage.id,
    mission_id: stage.mission_id,
    stage_number: stage.stage_number,
    title: stage.title,
    problem_description: stage.problem_description,
    required_components: parseJson(stage.required_components, []),
    validation_rules: parseJson(stage.validation_rules, {}),
    system_requirements: parseJson(stage.system_requirements, []),
    initial_system_state: parseJson(stage.initial_system_state, null),
    mission: {
      slug: stage.mission_slug,
      title: stage.mission_title,
      description: stage.mission_description,
      crisis_description: stage.mission_crisis_description,
    },
    requirements,
  });
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
      hero: any;
    };
  }>();

  const { newsArticleId, missionId, contactEmailData } = body;

  // Check if user already has progress for this mission
  const existingProgress = await queryOne<any>(
    db,
    'SELECT id, status FROM user_mission_progress WHERE user_id = ? AND mission_id = ?',
    [user.id, missionId],
  );

  let missionStarted = false;
  let firstStageId: string | null = null;

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

    firstStageId = firstStage.id;
    const timestamp = now();

    if (existingProgress) {
      // Update existing record
      await execute(
        db,
        `UPDATE user_mission_progress
         SET status = 'in_progress', current_stage_id = ?, stage_id = ?, started_at = ?, updated_at = ?
         WHERE id = ?`,
        [firstStageId, firstStageId, timestamp, timestamp, existingProgress.id],
      );
    } else {
      // Create new progress entry
      await execute(
        db,
        `INSERT INTO user_mission_progress (id, user_id, mission_id, stage_id, status, current_stage_id, started_at, updated_at)
         VALUES (?, ?, ?, ?, 'in_progress', ?, ?, ?)`,
        [generateId(), user.id, missionId, firstStageId, firstStageId, timestamp, timestamp],
      );
    }

    missionStarted = true;

    // Deliver mission_start emails to user's inbox
    if (firstStageId) {
      const missionEmails = await query<any>(
        db,
        `SELECT id FROM mission_emails WHERE mission_id = ? AND trigger_type = 'mission_start'`,
        [missionId],
      );

      for (const email of missionEmails) {
        await execute(
          db,
          `INSERT OR IGNORE INTO user_email_inbox (id, user_id, mission_email_id, status, delivered_at)
           VALUES (?, ?, ?, 'unread', ?)`,
          [generateId(), user.id, email.id, now()],
        );
      }
    }
  }

  // Fetch mission_start emails for the response
  const firstStageEmails = await query<any>(
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
  const user = c.get('user') as AuthUser;
  const db = c.env.DB;

  const body = await c.req.json<{
    stageId: string;
    nodes: any[];
    edges: any[];
    stageAttemptId?: string;
  }>();

  const { stageId, nodes, edges } = body;

  // Load requirements for this stage
  const dbRequirements = await query<any>(
    db,
    'SELECT * FROM mission_stage_requirements WHERE stage_id = ? ORDER BY unlock_order',
    [stageId],
  );

  const results = dbRequirements.map((req) => {
    const config = parseJson(req.validation_config, {} as any);
    const completed = evaluateRequirement(req.requirement_type, config, nodes, edges);
    return {
      id: req.id,
      title: req.title,
      description: req.description,
      type: req.requirement_type,
      completed,
      visible: req.initially_visible === 1,
      priority: req.priority,
      points: req.points,
      message: completed ? 'Requirement met' : (req.hint || 'Not yet completed'),
      hint: req.hint,
    };
  });

  const completedCount = results.filter((r) => r.completed).length;
  const pointsEarned = results
    .filter((r) => r.completed)
    .reduce((sum, r) => sum + (r.points || 0), 0);

  return c.json({
    success: true,
    summary: {
      totalRequirements: results.length,
      completedRequirements: completedCount,
      pointsEarned,
      allCompleted: completedCount === results.length,
      completionPercentage: results.length > 0
        ? Math.round((completedCount / results.length) * 100)
        : 0,
    },
    requirements: results,
  });
});

// ----------------------------------------------------------------
// Validation helpers
// ----------------------------------------------------------------

function evaluateRequirement(
  type: string,
  config: any,
  nodes: any[],
  edges: any[],
): boolean {
  switch (type) {
    case 'node_categories': {
      const requiredCategories: string[] = config.required_components || [];
      const minInstances: number = config.min_instances || 1;
      if (minInstances && nodes.length < minInstances) return false;
      return requiredCategories.every((cat) =>
        nodes.some((n) => n.data?.category === cat),
      );
    }

    case 'node_count': {
      const requiredComponents: string[] = config.required_components || [];
      const minInstances: number = config.min_instances || 1;
      return requiredComponents.every((cat) => {
        const count = nodes.filter((n) => n.data?.category === cat).length;
        return count >= minInstances;
      });
    }

    case 'node_and_connection': {
      const requiredComps: string[] = config.required_components || [];
      const hasNodes = requiredComps.every((cat) =>
        nodes.some((n) => n.data?.category === cat),
      );
      if (!hasNodes) return false;

      const sourceTypes: string[] = config.source_types || [];
      const targetTypes: string[] = config.target_types || [];
      if (sourceTypes.length === 0 && targetTypes.length === 0) return true;

      return edges.some((e) => {
        const src = nodes.find((n) => n.id === e.source);
        const tgt = nodes.find((n) => n.id === e.target);
        return (
          (sourceTypes.includes(src?.data?.category) && targetTypes.includes(tgt?.data?.category)) ||
          (sourceTypes.includes(tgt?.data?.category) && targetTypes.includes(src?.data?.category))
        );
      });
    }

    case 'edge_connection': {
      const sourceTypes: string[] = config.source_types || [];
      const targetTypes: string[] = config.target_types || [];
      return edges.some((e) => {
        const src = nodes.find((n) => n.id === e.source);
        const tgt = nodes.find((n) => n.id === e.target);
        // Handle special label-based nodes like 'families'
        const srcCat = src?.data?.label === 'Families' ? 'families' : src?.data?.category;
        const tgtCat = tgt?.data?.label === 'Families' ? 'families' : tgt?.data?.category;
        return (
          (sourceTypes.includes(srcCat) && targetTypes.includes(tgtCat)) ||
          (sourceTypes.includes(tgtCat) && targetTypes.includes(srcCat))
        );
      });
    }

    case 'component_required': {
      const requiredComponents: string[] = config.required_components || [];
      const minInstances: number = config.min_instances || 1;
      return requiredComponents.every((cat) => {
        const count = nodes.filter((n) => n.data?.category === cat).length;
        return count >= minInstances;
      });
    }

    case 'connection_required': {
      const sourceTypes: string[] = config.source_types || [];
      const targetTypes: string[] = config.target_types || [];
      return edges.some((e) => {
        const src = nodes.find((n) => n.id === e.source);
        const tgt = nodes.find((n) => n.id === e.target);
        const srcCat = src?.data?.label === 'Families' ? 'families' : src?.data?.category;
        const tgtCat = tgt?.data?.label === 'Families' ? 'families' : tgt?.data?.category;
        return (
          (sourceTypes.includes(srcCat) && targetTypes.includes(tgtCat)) ||
          (sourceTypes.includes(tgtCat) && targetTypes.includes(srcCat))
        );
      });
    }

    case 'cost_constraint': {
      const maxCost: number = config.max_monthly_cost || 500;
      const totalCost = nodes.reduce((sum, n) => sum + (n.data?.cost || 50), 0);
      return totalCost <= maxCost;
    }

    default:
      return false;
  }
}
