import { emptyGraph } from '../../shared/game';
import type { CatalogComponent, GraphSnapshot } from '../../shared/game';
import reducer, { addNode, addEdge, restoreGraph, deleteNode } from '../../src/features/design/designSlice';

// Hand-authored player journeys, independent of database validation rules.
// Each stage extends the preceding architecture with a small number of purposeful edges.
type Step = { add?: string[]; connect?: string[] };
const base: Step = { add: ['web_server', 'database'], connect: ['clients>web_server', 'web_server>database'] };
export const journeys: Record<string, Step[]> = {
  'health-tracker-crisis': [base,
    { add: ['backup'], connect: ['database>backup'] },
    { add: ['load_balancer', 'cache'], connect: ['clients>load_balancer', 'load_balancer>web_server', 'web_server>cache', 'cache>database'] },
    { add: ['auth_service', 'firewall', 'logging'], connect: ['web_server>auth_service', 'firewall>web_server', 'logging>database'] },
    { add: ['cdn', 'api_gateway', 'monitoring'], connect: ['cdn>web_server', 'api_gateway>web_server', 'monitoring>web_server'] }],
  'school-district-crisis': [
    { add: ['web_server', 'app_server', 'database'], connect: ['clients>web_server', 'web_server>app_server', 'app_server>database', 'web_server>database'] },
    { add: ['cache', 'worker', 'load_balancer'], connect: ['web_server>cache', 'worker>database', 'load_balancer>web_server'] },
    {}, { add: ['monitoring'], connect: ['monitoring>web_server'] }, { add: ['cdn'], connect: ['cdn>web_server'] }],
  'environmental-monitoring': [
    { add: ['web_server', 'worker', 'database'], connect: ['clients>web_server', 'web_server>database', 'web_server>worker', 'worker>database'] },
    { add: ['app_server', 'cache'], connect: ['web_server>app_server', 'app_server>cache', 'app_server>database'] },
    { add: ['object_storage', 'backup'], connect: ['database>object_storage', 'database>backup'] },
    { add: ['api_gateway'], connect: ['api_gateway>app_server'] },
    { add: ['logging', 'auth_service', 'firewall'], connect: ['logging>database', 'auth_service>app_server', 'firewall>web_server'] }],
  'inventory-crisis': [base,
    { add: ['app_server', 'cache'], connect: ['web_server>app_server', 'app_server>database', 'web_server>cache'] },
    { add: ['worker', 'monitoring'], connect: ['worker>database', 'monitoring>worker'] },
    { add: ['load_balancer'], connect: ['load_balancer>web_server'] },
    { add: ['api_gateway', 'auth_service'], connect: ['api_gateway>app_server', 'auth_service>app_server'] }],
  'community-center-upgrade': [base,
    { add: ['app_server', 'cache'], connect: ['web_server>app_server', 'app_server>database', 'app_server>cache'] },
    { add: ['worker'], connect: ['worker>app_server'] },
    { add: ['monitoring'], connect: ['monitoring>database'] },
    { add: ['api_gateway', 'auth_service', 'load_balancer'], connect: ['api_gateway>app_server', 'load_balancer>web_server', 'auth_service>app_server'] }],
};

export function playableDesign(slug: string, stageNumber: number, catalog: CatalogComponent[], inherited?: GraphSnapshot): GraphSnapshot {
  const initial = emptyGraph();
  initial.nodes.push({ id: 'clients', type: 'user', position: { x: 20, y: 150 },
    data: { role: 'client', category: 'stakeholder', label: 'People using this service', cost: 0 } });
  let state = reducer(undefined, restoreGraph(inherited ?? initial));
  for (const node of state.nodes.filter(n => n.data.status === 'broken')) state = reducer(state, deleteNode(node.id));
  for (const step of journeys[slug].slice(inherited ? stageNumber - 1 : 0, stageNumber)) {
    for (const id of step.add ?? []) {
      const component = catalog.find(c => c.id === id);
      if (!component) throw new Error(`Missing or locked component ${id} in ${slug} stage ${stageNumber}`);
      state = reducer(state, addNode({ component: { ...component, componentId: component.id }, instanceId: `${id}-instance`,
        position: { x: 300 * (1 + state.nodes.length % 3), y: 160 * Math.floor(state.nodes.length / 3) } }));
    }
    for (const pair of step.connect ?? []) {
      const [from, to] = pair.split('>');
      const source = from === 'clients' ? from : `${from}-instance`;
      const target = `${to}-instance`;
      state = reducer(state, addEdge({ source, target, sourceHandle: `${source}-output`, targetHandle: `${target}-input` }));
    }
  }
  const replicaStage: Record<string, number> = { 'health-tracker-crisis': 3, 'school-district-crisis': 5, 'inventory-crisis': 4, 'community-center-upgrade': 5 };
  if (stageNumber >= (replicaStage[slug] ?? Infinity) && !state.nodes.some(n => n.id === 'web-replica')) {
    const web = catalog.find(c => c.id === 'web_server')!;
    state = reducer(state, addNode({ component: { ...web, componentId: web.id }, instanceId: 'web-replica', position: { x: 600, y: 600 } }));
    state = reducer(state, addEdge({ source: 'load_balancer-instance', target: 'web-replica', sourceHandle: 'load_balancer-instance-output', targetHandle: 'web-replica-input' }));
    state = reducer(state, addEdge({ source: 'web-replica', target: 'database-instance', sourceHandle: 'web-replica-output', targetHandle: 'database-instance-input' }));
  }
  return { version: 1, nodes: state.nodes, edges: state.edges, viewport: state.canvasViewport };
}
