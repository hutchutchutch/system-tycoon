import { describe, expect, it } from 'vitest';
import reducer, { addNode, addEdge, deleteNode, deleteEdge, reconnectEdge, undo, redo, restoreGraph, setGameRules, updateNode, onNodesChange } from './designSlice';
import { emptyGraph, isGraphSnapshot, canonicalizeGraph, evaluateGraph, repairLegacyGraph } from '../../../shared/game';
import type { GameRule, GraphSnapshot } from '../../../shared/game';

const server = { id: 'web_server', category: 'compute', name: 'Web Server', cost: 50 };
const pair = { source: 'a', target: 'b', sourceHandle: 'a-output', targetHandle: 'b-input' };
const rule: GameRule = { id: 'replicas', title: 'Two web servers', requirement_type: 'component_required', validation_config: { component_ids: ['web_server'], min_instances: 2 } };
function twoNodes() {
  let state = reducer(undefined, addNode({ component: server, position: { x: 0, y: 0 }, instanceId: 'a' }));
  state = reducer(state, addNode({ component: server, position: { x: 300, y: 0 }, instanceId: 'b' }));
  return reducer(state, setGameRules([rule]));
}
describe('graph editor invariants', () => {
  it('gives duplicate components unique instance identities and counts their canonical costs', () => {
    const first = addNode({ component: server, position: { x: 0, y: 0 } });
    const second = addNode({ component: server, position: { x: 0, y: 0 } });
    expect(first.payload.instanceId).not.toBe(second.payload.instanceId);
    let state = twoNodes();
    expect(state.totalCost).toBe(100);
    expect(state.allRequirementsMet).toBe(true);
    state = reducer(state, deleteNode('a'));
    expect(state.allRequirementsMet).toBe(false);
    expect(state.totalCost).toBe(50);
  });
  it('rejects self, dangling, and duplicate directed edges; supports undo/redo and reconnect', () => {
    let state = reducer(twoNodes(), addEdge(pair));
    const edgeId = state.edges[0].id;
    state = reducer(state, addEdge(pair));
    state = reducer(state, addEdge({ ...pair, target: 'a' }));
    state = reducer(state, addEdge({ ...pair, target: 'missing' }));
    expect(state.edges).toHaveLength(1);
    state = reducer(state, reconnectEdge({ id: edgeId, connection: { ...pair, source: 'b', target: 'a' } }));
    expect(state.edges[0].target).toBe('a');
    state = reducer(state, undo());
    expect(state.edges[0].target).toBe('b');
    state = reducer(state, redo());
    expect(state.edges[0].target).toBe('a');
    state = reducer(state, deleteNode('a'));
    expect(state.edges).toHaveLength(0);
    state = reducer(state, undo());
    expect(state.nodes).toHaveLength(2);
    expect(state.edges).toHaveLength(1);
    expect(reducer(state, deleteEdge(edgeId)).edges).toHaveLength(0);
  });
  it('groups a drag into one undo step and also records keyboard movement', () => {
    let state = twoNodes();
    const depth = state.past.length;
    state = reducer(state, onNodesChange([{ id: 'a', type: 'position', position: { x: 10, y: 0 }, dragging: true }]));
    state = reducer(state, onNodesChange([{ id: 'a', type: 'position', position: { x: 20, y: 0 }, dragging: false }]));
    expect(state.past).toHaveLength(depth + 1);
    state = reducer(state, undo());
    expect(state.nodes[0].position.x).toBe(0);
    state = reducer(state, onNodesChange([{ id: 'a', type: 'position', position: { x: 5, y: 0 } }]));
    state = reducer(state, undo());
    expect(state.nodes[0].position.x).toBe(0);
  });
  it('uses stable client roles even after renaming, and follows directed multi-hop paths', () => {
    const graph = emptyGraph();
    graph.nodes = [{ id: 'families', type: 'user', position: { x: 0, y: 0 }, data: { role: 'client', label: 'Renamed', cost: 0 } },
      { id: 'api', position: { x: 200, y: 0 }, data: { componentId: 'web_server' } },
      { id: 'db', position: { x: 400, y: 0 }, data: { componentId: 'database' } }];
    graph.edges = [{ id: '1', source: 'families', target: 'api' }, { id: '2', source: 'api', target: 'db' }];
    const pathRule: GameRule = { id: 'path', title: 'Request path', requirement_type: 'path_required', validation_config: { source_types: ['client'], target_components: ['database'] } };
    let state = reducer(undefined, restoreGraph(graph));
    state = reducer(state, setGameRules([pathRule]));
    state = reducer(state, updateNode({ id: 'families', data: { label: 'Someone else' } }));
    expect(state.allRequirementsMet).toBe(true);
    expect(evaluateGraph({ ...graph, edges: graph.edges.slice(1) }, [pathRule]).summary.allCompleted).toBe(false);
    expect(evaluateGraph(graph, [{ ...pathRule, requirement_type: 'unknown' }]).summary.allCompleted).toBe(false);
  });
  it('canonicalizes forged costs and roles without collapsing repeated instances', () => {
    const state = twoNodes();
    const graph: GraphSnapshot = { ...emptyGraph(), nodes: state.nodes.map(n => ({ ...n, data: { ...n.data, cost: 0, role: 'client', category: 'security' } })) };
    const canonical = canonicalizeGraph(graph, [server], emptyGraph());
    expect(canonical.nodes).toHaveLength(2);
    expect(canonical.nodes.every(n => n.data.cost === 50 && n.data.category === 'compute' && !n.data.role)).toBe(true);
  });
  it('strictly validates new snapshots and repairs legacy duplicate/dangling records only on reads', () => {
    const state = twoNodes();
    const valid = { ...emptyGraph(), nodes: state.nodes };
    expect(isGraphSnapshot(valid)).toBe(true);
    expect(isGraphSnapshot({ ...valid, nodes: [...valid.nodes, valid.nodes[0]] })).toBe(false);
    expect(isGraphSnapshot({ ...valid, viewport: { x: 0, y: 0, zoom: Infinity } })).toBe(false);
    expect(isGraphSnapshot({ ...valid, edges: [{ id: 'bad', source: 'a', target: 'missing' }] })).toBe(false);
    const legacy = { nodes: [{ id: 'old', data: { category: 'stakeholder', label: 'Families' } }, { id: 'old', data: {} }],
      edges: [{ source: 'old', target: 'missing' }] };
    const repaired = repairLegacyGraph(legacy);
    expect(isGraphSnapshot(repaired)).toBe(true);
    expect(repaired.nodes).toHaveLength(1);
    expect(repaired.nodes[0].data.role).toBe('client');
    expect(repaired.edges).toEqual([]);
  });
});
