import { Hono } from 'hono';
import type { AppEnv, Env, AuthUser, UserMissionProgress } from '../types';
import { generateId, now, queryOne, query, execute, parseJson, toJson } from '../lib/db';

export const canvasRoutes = new Hono<AppEnv>();

/**
 * GET /:stageId
 * Load canvas state for the current user and stage.
 */
canvasRoutes.get('/:stageId', async (c) => {
  const user = c.get('user') as AuthUser;
  const stageId = c.req.param('stageId');

  const progress = await queryOne<UserMissionProgress>(
    c.env.DB,
    'SELECT canvas_state, updated_at FROM user_mission_progress WHERE user_id = ? AND stage_id = ?',
    [user.id, stageId]
  );

  return c.json({
    canvasState: progress ? parseJson(progress.canvas_state, null) : null,
    lastSaved: progress?.updated_at ?? null,
  });
});

/**
 * PUT /canvas
 * Save (upsert) canvas state for a mission stage.
 */
canvasRoutes.put('/', async (c) => {
  const user = c.get('user') as AuthUser;
  const body = await c.req.json<{
    missionId: string;
    stageId: string;
    canvasState: unknown;
  }>();

  const { missionId, stageId, canvasState } = body;
  const canvasJson = toJson(canvasState);
  const timestamp = now();

  const existing = await queryOne<UserMissionProgress>(
    c.env.DB,
    'SELECT id FROM user_mission_progress WHERE user_id = ? AND stage_id = ?',
    [user.id, stageId]
  );

  if (existing) {
    await execute(
      c.env.DB,
      'UPDATE user_mission_progress SET canvas_state = ?, updated_at = ? WHERE id = ?',
      [canvasJson, timestamp, existing.id]
    );
  } else {
    const id = generateId();
    await execute(
      c.env.DB,
      `INSERT INTO user_mission_progress (id, user_id, mission_id, stage_id, status, canvas_state, started_at, updated_at)
       VALUES (?, ?, ?, ?, 'in_progress', ?, ?, ?)`,
      [id, user.id, missionId, stageId, canvasJson, timestamp, timestamp]
    );
  }

  return c.json({ success: true, lastSaved: timestamp });
});

/**
 * DELETE /:stageId
 * Clear canvas state for a stage (reset to empty object).
 */
canvasRoutes.delete('/:stageId', async (c) => {
  const user = c.get('user') as AuthUser;
  const stageId = c.req.param('stageId');
  const timestamp = now();

  await execute(
    c.env.DB,
    "UPDATE user_mission_progress SET canvas_state = '{}', updated_at = ? WHERE user_id = ? AND stage_id = ?",
    [timestamp, user.id, stageId]
  );

  return c.json({ success: true });
});

/**
 * GET /user/all
 * Get all saved canvas states for the current user.
 */
canvasRoutes.get('/user/all', async (c) => {
  const user = c.get('user') as AuthUser;

  const rows = await query<UserMissionProgress>(
    c.env.DB,
    'SELECT stage_id, canvas_state FROM user_mission_progress WHERE user_id = ? AND canvas_state IS NOT NULL',
    [user.id]
  );

  const canvasMap: Record<string, unknown> = {};
  for (const row of rows) {
    canvasMap[row.stage_id] = parseJson(row.canvas_state, null);
  }

  return c.json(canvasMap);
});
