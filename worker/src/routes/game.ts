import { Hono } from 'hono';
import type { Env } from '../types';
import { generateId, now, query, queryOne, execute, parseJson, toJson } from '../lib/db';

export const gameRoutes = new Hono<{ Bindings: Env }>();

// GET /game/scenarios - List all scenarios
gameRoutes.get('/scenarios', async (c) => {
  const scenarios = await query(
    c.env.DB,
    'SELECT * FROM scenarios ORDER BY level ASC'
  );

  return c.json(scenarios.map((s: any) => ({
    ...s,
    base_requirements: parseJson(s.base_requirements, []),
    available_questions: parseJson(s.available_questions, {}),
    available_components: parseJson(s.available_components, []),
    available_mentors: parseJson(s.available_mentors, []),
    success_criteria: parseJson(s.success_criteria, {}),
  })));
});

// GET /game/scenarios/:id - Get a specific scenario
gameRoutes.get('/scenarios/:id', async (c) => {
  const scenario = await queryOne(
    c.env.DB,
    'SELECT * FROM scenarios WHERE id = ?',
    [c.req.param('id')]
  );

  if (!scenario) {
    return c.json({ error: 'Scenario not found' }, 404);
  }

  const s = scenario as any;
  return c.json({
    ...s,
    base_requirements: parseJson(s.base_requirements, []),
    available_questions: parseJson(s.available_questions, {}),
    available_components: parseJson(s.available_components, []),
    available_mentors: parseJson(s.available_mentors, []),
    success_criteria: parseJson(s.success_criteria, {}),
  });
});

// GET /game/components - List all game components
gameRoutes.get('/components', async (c) => {
  const components = await query(
    c.env.DB,
    'SELECT * FROM components ORDER BY sort_order ASC'
  );

  return c.json(components.map((comp: any) => ({
    ...comp,
    concepts: parseJson(comp.concepts, []),
    use_cases: parseJson(comp.use_cases, []),
    compatible_with: parseJson(comp.compatible_with, []),
  })));
});

// GET /game/progress - Get current user's scenario progress
gameRoutes.get('/progress', async (c) => {
  const user = c.get('user') as any;
  const progress = await query(
    c.env.DB,
    'SELECT * FROM scenario_progress WHERE user_id = ?',
    [user.id]
  );
  return c.json(progress);
});

// POST /game/attempts - Submit a design attempt
gameRoutes.post('/attempts', async (c) => {
  const user = c.get('user') as any;
  const body = await c.req.json();
  const id = generateId();
  const timestamp = now();

  await execute(c.env.DB, `
    INSERT INTO scenario_attempts (id, user_id, scenario_id, architecture_snapshot, questions_asked, mentor_selected, components_used, total_cost, performance_metrics, final_score, requirements_met, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    user.id,
    body.scenarioId,
    toJson(body.architecture || {}),
    toJson(body.questionsAsked || []),
    body.mentorId || null,
    toJson(body.componentsUsed || []),
    body.totalCost || 0,
    toJson(body.performanceMetrics || {}),
    body.finalScore || 0,
    toJson(body.requirementsMet || []),
    timestamp,
  ]);

  const attempt = await queryOne(c.env.DB, 'SELECT * FROM scenario_attempts WHERE id = ?', [id]);
  return c.json(attempt, 201);
});

// GET /game/stats - Get current user's stats
gameRoutes.get('/stats', async (c) => {
  const user = c.get('user') as any;
  const stats = await queryOne(
    c.env.DB,
    'SELECT * FROM user_stats WHERE user_id = ?',
    [user.id]
  );

  if (!stats) {
    return c.json({
      user_id: user.id,
      total_projects_completed: 0,
      total_components_used: 0,
      average_score: 0,
      best_score: 0,
      total_time_played: 0,
    });
  }

  return c.json(stats);
});

// GET /game/achievements - List all achievements
gameRoutes.get('/achievements', async (c) => {
  const achievements = await query(
    c.env.DB,
    'SELECT * FROM achievements ORDER BY created_at ASC'
  );

  return c.json(achievements.map((a: any) => ({
    ...a,
    criteria: parseJson(a.criteria, {}),
  })));
});

// GET /game/achievements/user - Get current user's achievements
gameRoutes.get('/achievements/user', async (c) => {
  const user = c.get('user') as any;
  const userAchievements = await query(
    c.env.DB,
    'SELECT * FROM user_achievements WHERE user_id = ?',
    [user.id]
  );
  return c.json(userAchievements);
});

// GET /game/mastery - Get current user's component mastery
gameRoutes.get('/mastery', async (c) => {
  const user = c.get('user') as any;
  const mastery = await query(
    c.env.DB,
    'SELECT * FROM component_mastery WHERE user_id = ?',
    [user.id]
  );
  return c.json(mastery);
});

// POST /game/mastery - Update component mastery
gameRoutes.post('/mastery', async (c) => {
  const user = c.get('user') as any;
  const { componentId, success } = await c.req.json();
  const timestamp = now();

  // Check if exists
  const existing = await queryOne<any>(
    c.env.DB,
    'SELECT * FROM component_mastery WHERE user_id = ? AND component_id = ?',
    [user.id, componentId]
  );

  if (existing) {
    const timesUsed = existing.times_used + 1;
    const successfulUses = success ? existing.successful_uses + 1 : existing.successful_uses;

    let masteryLevel = 'novice';
    if (successfulUses >= 20) masteryLevel = 'gold';
    else if (successfulUses >= 10) masteryLevel = 'silver';
    else if (successfulUses >= 5) masteryLevel = 'bronze';

    await execute(c.env.DB, `
      UPDATE component_mastery
      SET times_used = ?, successful_uses = ?, mastery_level = ?, last_used_at = ?
      WHERE user_id = ? AND component_id = ?
    `, [timesUsed, successfulUses, masteryLevel, timestamp, user.id, componentId]);
  } else {
    await execute(c.env.DB, `
      INSERT INTO component_mastery (id, user_id, component_id, mastery_level, times_used, successful_uses, last_used_at, unlocked_at)
      VALUES (?, ?, ?, 'novice', 1, ?, ?, ?)
    `, [generateId(), user.id, componentId, success ? 1 : 0, timestamp, timestamp]);
  }

  const updated = await queryOne(
    c.env.DB,
    'SELECT * FROM component_mastery WHERE user_id = ? AND component_id = ?',
    [user.id, componentId]
  );

  return c.json(updated);
});
