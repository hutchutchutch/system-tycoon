import { canonicalizeGraph, emptyGraph, evaluateGraph, repairLegacyGraph } from '../../../shared/game';
import type { CatalogComponent, GameRule, GraphSnapshot, RuleConfig } from '../../../shared/game';
import { parseJson, query, queryOne } from './db';

export async function loadStageGame(db: D1Database, stageId: string) {
  const stage = await queryOne<{ id: string; mission_id: string; stage_number: number; initial_system_state: string | null }>(db,
    'SELECT id,mission_id,stage_number,initial_system_state FROM mission_stages WHERE id=?', [stageId]);
  if (!stage) return null;
  const [catalog, rows, stageRows, first] = await Promise.all([
    query<CatalogComponent>(db, 'SELECT id,name,category,cost,icon_name,short_description FROM components ORDER BY sort_order'),
    query<Omit<GameRule, 'validation_config'> & { validation_config: string; stage_id: string }>(db,
      `SELECT r.* FROM mission_stage_requirements r JOIN mission_stages s ON s.id=r.stage_id
       WHERE s.mission_id=? AND s.stage_number<=?
       AND (s.id=? OR r.requirement_type NOT IN ('cost_constraint','path_required','connected_system'))
       ORDER BY CASE WHEN s.id=? THEN 0 ELSE 1 END,s.stage_number,r.unlock_order`, [stage.mission_id, stage.stage_number, stageId, stageId]),
    query<{ required_components: string }>(db,
      'SELECT required_components FROM mission_stages WHERE mission_id=? AND stage_number<=? ORDER BY stage_number', [stage.mission_id, stage.stage_number]),
    queryOne<{ initial_system_state: string | null }>(db,
      'SELECT initial_system_state FROM mission_stages WHERE mission_id=? AND stage_number=1', [stage.mission_id]),
  ]);
  const allowed = new Set(stageRows.flatMap(row => parseJson<Array<string | { id: string }>>(row.required_components, [])
    .map(item => typeof item === 'string' ? item : item.id)));
  const initial = repairLegacyGraph(parseJson(first?.initial_system_state, null));
  initial.nodes = initial.nodes.map(n => ({ ...n, data: { ...n.data, status: 'broken', cost: 0 } }));
  initial.nodes.unshift({ id: 'clients', type: 'user', position: { x: 0, y: 250 },
    data: { role: 'client', category: 'stakeholder', label: 'Users', userCount: 200, cost: 0 } });
  initial.edges = [];
  const rules = rows.map(row => ({ ...row, title: row.stage_id === stageId ? row.title : `Keep: ${row.title}`,
    points: row.stage_id === stageId ? row.points : 0, validation_config: parseJson<RuleConfig>(row.validation_config, {}) }));
  return { ...stage, catalog: catalog.filter(c => allowed.has(c.id)), initial, rules };
}

export async function evaluateStage(db: D1Database, stageId: string, graph: GraphSnapshot) {
  const game = await loadStageGame(db, stageId);
  if (!game) return { graph: emptyGraph(), ...evaluateGraph(emptyGraph(), []) };
  const canonical = canonicalizeGraph(graph, game.catalog, game.initial);
  return { graph: canonical, ...evaluateGraph(canonical, game.rules) };
}
