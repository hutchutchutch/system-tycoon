import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { isGraphSnapshot, repairLegacyGraph } from '../../../shared/game';
import { loadStageGame } from '../lib/game';
import { now, parseJson, query, queryOne } from '../lib/db';

export const canvasRoutes = new Hono<AppEnv>();

canvasRoutes.get('/user/all', async c => {
  const rows = await query<{ stage_id: string; canvas_state: string }>(c.env.DB,
    'SELECT stage_id,canvas_state FROM canvas_drafts WHERE user_id=?', [c.get('user').id]);
  return c.json(Object.fromEntries(rows.map(row => [row.stage_id, repairLegacyGraph(parseJson(row.canvas_state, null))])));
});

canvasRoutes.get('/:stageId', async c => {
  const stageId = c.req.param('stageId');
  const userId = c.get('user').id;
  const completed = await queryOne<{ accepted_canvas: string | null }>(c.env.DB,
    'SELECT accepted_canvas FROM mission_stage_completions WHERE user_id=? AND stage_id=?', [userId, stageId]);
  if (completed) return c.json({ canvasState: repairLegacyGraph(parseJson(completed.accepted_canvas, null)), revision: 0,
    readOnly: true, snapshotUnavailable: !completed.accepted_canvas, lastSaved: null });
  const progress = await queryOne<{ id: string }>(c.env.DB,
    "SELECT id FROM user_mission_progress WHERE user_id=? AND current_stage_id=? AND status='in_progress'", [userId, stageId]);
  if (!progress) return c.json({ canvasState: null, revision: 0, readOnly: true, lastSaved: null });
  const draft = await queryOne<{ canvas_state: string; revision: number; updated_at: string }>(c.env.DB,
    'SELECT canvas_state,revision,updated_at FROM canvas_drafts WHERE user_id=? AND stage_id=?', [userId, stageId]);
  const game = await loadStageGame(c.env.DB, stageId);
  return c.json({ canvasState: draft ? repairLegacyGraph(parseJson(draft.canvas_state, null)) : game?.initial,
    revision: draft?.revision ?? 0, lastSaved: draft?.updated_at ?? null, readOnly: false });
});

canvasRoutes.put('/', async c => {
  const body = await c.req.json<unknown>().catch(() => null);
  if (!body || typeof body !== 'object' || !('canvasState' in body) || !isGraphSnapshot(body.canvasState)
    || !('missionId' in body) || typeof body.missionId !== 'string' || !('stageId' in body) || typeof body.stageId !== 'string'
    || !('revision' in body) || typeof body.revision !== 'number' || !Number.isSafeInteger(body.revision) || body.revision < 0) {
    return c.json({ error: 'Invalid canvas snapshot or revision' }, 400);
  }
  const json = JSON.stringify(body.canvasState);
  if (json.length > 512_000) return c.json({ error: 'Canvas state is too large' }, 413);
  const timestamp = now();
  // Authorization and compare-and-swap happen in the write itself.
  const result = body.revision === 0
    ? await c.env.DB.prepare(`
      INSERT INTO canvas_drafts (user_id,stage_id,canvas_state,revision,updated_at)
      SELECT ?,?,?,1,? WHERE EXISTS (
        SELECT 1 FROM user_mission_progress WHERE user_id=? AND mission_id=? AND current_stage_id=? AND status='in_progress'
      )
      ON CONFLICT(user_id,stage_id) DO UPDATE SET canvas_state=excluded.canvas_state,
        revision=canvas_drafts.revision+1,updated_at=excluded.updated_at
      WHERE canvas_drafts.revision=0 RETURNING revision
    `).bind(c.get('user').id, body.stageId, json, timestamp, c.get('user').id, body.missionId, body.stageId).first<{ revision: number }>()
    : await c.env.DB.prepare(`
      UPDATE canvas_drafts SET canvas_state=?,revision=revision+1,updated_at=?
      WHERE user_id=? AND stage_id=? AND revision=? AND EXISTS (
        SELECT 1 FROM user_mission_progress WHERE user_id=? AND mission_id=? AND current_stage_id=? AND status='in_progress'
      ) RETURNING revision
    `).bind(json, timestamp, c.get('user').id, body.stageId, body.revision, c.get('user').id, body.missionId, body.stageId).first<{ revision: number }>();
  if (!result) return c.json({ error: 'Design changed elsewhere or this stage is no longer editable. Reload before saving.' }, 409);
  return c.json({ success: true, revision: result.revision, lastSaved: timestamp });
});

// Reset uses PUT with an empty versioned graph and a revision, just like any edit.
