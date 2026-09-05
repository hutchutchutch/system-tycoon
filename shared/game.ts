/** Serializable game contracts and deterministic rules shared by browser and Worker. */
export interface GraphData extends Record<string, unknown> {
  id?: string;
  componentId?: string;
  category?: string;
  role?: string;
  label?: string;
  name?: string;
  description?: string;
  icon?: string;
  status?: string;
  cost?: number;
  userCount?: number;
}
export interface GraphNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: GraphData;
}
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}
export interface GraphSnapshot {
  version: 1;
  nodes: GraphNode[];
  edges: GraphEdge[];
  viewport: { x: number; y: number; zoom: number };
}
export interface CatalogComponent {
  id: string;
  name: string;
  category: string;
  cost: number;
  icon_name?: string;
  short_description?: string;
}
export interface RuleConfig {
  required_components?: string[];
  component_ids?: string[];
  source_types?: string[];
  target_types?: string[];
  source_components?: string[];
  target_components?: string[];
  min_instances?: number;
  max_instances?: number;
  max_monthly_cost?: number;
}
export interface GameRule {
  id: string;
  title: string;
  description?: string | null;
  requirement_type: string;
  validation_config: RuleConfig;
  points?: number;
  hint?: string | null;
  initially_visible?: number | boolean;
}
export const emptyGraph = (): GraphSnapshot => ({ version: 1, nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } });
export const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);
const identifier = (s: unknown): s is string => typeof s === 'string' && s.length > 0 && s.length <= 128;

/** Reject malformed new writes; use repairLegacyGraph only when reading old saves. */
export function isGraphSnapshot(value: unknown): value is GraphSnapshot {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.nodes) || !Array.isArray(value.edges)
    || value.nodes.length > 250 || value.edges.length > 1000 || !isRecord(value.viewport)) return false;
  const { x, y, zoom } = value.viewport;
  if (!finite(x) || !finite(y) || !finite(zoom) || zoom < 0.2 || zoom > 2.5) return false;
  const ids = new Set<string>();
  for (const node of value.nodes) {
    if (!isRecord(node) || !identifier(node.id) || ids.has(node.id) || !isRecord(node.data)
      || (node.type !== undefined && node.type !== 'custom' && node.type !== 'user')
      || !isRecord(node.position) || !finite(node.position.x) || !finite(node.position.y)) return false;
    for (const key of ['id', 'componentId', 'category', 'role', 'label', 'name', 'description', 'icon', 'status']) {
      if (node.data[key] !== undefined && typeof node.data[key] !== 'string') return false;
    }
    if (node.data.cost !== undefined && (!finite(node.data.cost) || node.data.cost < 0)) return false;
    if (node.data.userCount !== undefined && (!finite(node.data.userCount) || node.data.userCount < 0)) return false;
    ids.add(node.id);
  }
  const edgeIds = new Set<string>();
  const pairs = new Set<string>();
  for (const edge of value.edges) {
    if (!isRecord(edge) || !identifier(edge.id) || edgeIds.has(edge.id) || !identifier(edge.source)
      || !identifier(edge.target) || !ids.has(edge.source) || !ids.has(edge.target) || edge.source === edge.target) return false;
    const pair = JSON.stringify([edge.source, edge.target]);
    if (pairs.has(pair)) return false;
    for (const key of ['sourceHandle', 'targetHandle']) {
      if (edge[key] !== undefined && edge[key] !== null && typeof edge[key] !== 'string') return false;
    }
    pairs.add(pair);
    edgeIds.add(edge.id);
  }
  return true;
}

export function repairLegacyGraph(value: unknown): GraphSnapshot {
  if (isGraphSnapshot(value)) return value;
  const graph = emptyGraph();
  if (!isRecord(value)) return graph;
  const ids = new Set<string>();
  for (const [index, node] of (Array.isArray(value.nodes) ? value.nodes : []).entries()) {
    if (!isRecord(node) || !identifier(node.id) || ids.has(node.id) || !isRecord(node.data)) continue;
    const data: GraphData = {};
    for (const key of ['id', 'componentId', 'category', 'role', 'label', 'name', 'description', 'icon', 'status']) {
      if (typeof node.data[key] === 'string') data[key] = node.data[key];
    }
    if (finite(node.data.cost)) data.cost = Math.max(0, node.data.cost);
    if (finite(node.data.userCount)) data.userCount = Math.max(0, node.data.userCount);
    if (data.category === 'stakeholder') data.role = 'client';
    data.componentId ??= data.id;
    graph.nodes.push({ id: node.id, type: data.role === 'client' ? 'user' : 'custom', data,
      position: isRecord(node.position) && finite(node.position.x) && finite(node.position.y)
        ? { x: node.position.x, y: node.position.y } : { x: 350 + index * 180, y: 250 } });
    ids.add(node.id);
    if (graph.nodes.length === 250) break;
  }
  const pairs = new Set<string>();
  for (const edge of Array.isArray(value.edges) ? value.edges : []) {
    if (!isRecord(edge) || !identifier(edge.source) || !identifier(edge.target)
      || !ids.has(edge.source) || !ids.has(edge.target) || edge.source === edge.target) continue;
    const pair = JSON.stringify([edge.source, edge.target]);
    if (pairs.has(pair)) continue;
    pairs.add(pair);
    graph.edges.push({ id: `edge-${graph.edges.length}`, source: edge.source, target: edge.target,
      sourceHandle: `${edge.source}-output`, targetHandle: `${edge.target}-input` });
    if (graph.edges.length === 1000) break;
  }
  if (isRecord(value.viewport) && finite(value.viewport.x) && finite(value.viewport.y) && finite(value.viewport.zoom)) {
    graph.viewport = { x: value.viewport.x, y: value.viewport.y, zoom: Math.max(0.2, Math.min(2.5, value.viewport.zoom)) };
  }
  return graph;
}

export function createComponentNode(component: CatalogComponent, position: GraphNode['position'], id = crypto.randomUUID()): GraphNode {
  return { id, type: 'custom', position, data: { componentId: component.id, id: component.id,
    name: component.name, label: component.name, category: component.category, cost: component.cost,
    icon: component.icon_name ?? 'server', description: component.short_description, status: 'healthy' } };
}

export function canonicalizeGraph(graph: GraphSnapshot, catalog: CatalogComponent[], initial: GraphSnapshot): GraphSnapshot {
  const byId = new Map(catalog.map(c => [c.id, c]));
  const initialById = new Map(initial.nodes.map(n => [n.id, n]));
  const nodes = graph.nodes.flatMap(node => {
    const initialNode = initialById.get(node.id);
    // Broken scenario fixtures cannot be relabelled into working infrastructure.
    if (initialNode?.data.status === 'broken') return [{ ...node, data: { ...initialNode.data, cost: 0 } }];
    const component = byId.get(node.data.componentId ?? node.data.id ?? node.id);
    if (component) return [{ ...node, data: { ...node.data, componentId: component.id, id: component.id,
      category: component.category, role: undefined, cost: component.cost, status: 'healthy' } }];
    if (node.data.role === 'client' || node.data.category === 'stakeholder') {
      return [{ ...node, type: 'user', data: { label: node.data.label ?? 'Users', role: 'client', category: 'stakeholder', cost: 0, userCount: node.data.userCount ?? 200 } }];
    }
    return [];
  });
  const ids = new Set(nodes.map(n => n.id));
  return { ...graph, nodes, edges: graph.edges.filter(e => ids.has(e.source) && ids.has(e.target)) };
}

export const gameCost = (nodes: GraphNode[]): number => nodes.reduce((sum, n) => sum + (n.data.role === 'client' || n.data.category === 'stakeholder' || n.data.status === 'broken' ? 0 : n.data.cost ?? 0), 0);
export const playerLevel = (impact: number): number => 1 + Math.floor(Math.max(0, impact) / 250);

export function evaluateGraph(graph: GraphSnapshot, rules: GameRule[]) {
  const healthy = graph.nodes.filter(n => n.data.status !== 'broken');
  const matches = (node: GraphNode, types: string[] = [], components: string[] = []) => components.length
    ? components.includes(node.data.componentId ?? node.data.id ?? '')
    : types.some(type => type === 'families' || type === 'stakeholder' || type === 'client'
      ? node.data.role === 'client' || node.data.category === 'stakeholder' : node.data.category === type);
  const results = rules.map(rule => {
    const c = rule.validation_config;
    const componentIds = c.component_ids ?? [];
    const categories = c.required_components ?? [];
    const counts = (componentIds.length ? componentIds : categories).map(key => healthy.filter(n =>
      componentIds.length ? matches(n, [], [key]) : matches(n, [key])).length);
    const hasNodes = counts.length > 0 && counts.every(count => count >= (c.min_instances ?? 1) && count <= (c.max_instances ?? Infinity));
    const sources = healthy.filter(n => matches(n, c.source_types, c.source_components));
    const targets = new Set(healthy.filter(n => matches(n, c.target_types, c.target_components)).map(n => n.id));
    const healthyIds = new Set(healthy.map(n => n.id));
    const adjacency = new Map<string, string[]>();
    for (const edge of graph.edges) {
      if (healthyIds.has(edge.source) && healthyIds.has(edge.target)) adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), edge.target]);
    }
    const pathExists = sources.some(source => {
      const pending = [...(adjacency.get(source.id) ?? [])];
      const visited = new Set([source.id]);
      while (pending.length) {
        const id = pending.shift()!;
        if (visited.has(id)) continue;
        if (targets.has(id)) return true;
        visited.add(id);
        pending.push(...(adjacency.get(id) ?? []));
      }
      return false;
    });
    const directExists = sources.some(source => (adjacency.get(source.id) ?? []).some(id => targets.has(id)));
    let completed = false;
    switch (rule.requirement_type) {
      case 'component_required': case 'node_count': case 'node_categories': completed = hasNodes; break;
      case 'connection_required': case 'edge_connection': completed = directExists; break;
      case 'path_required': completed = pathExists; break;
      case 'fanout_required': completed = sources.some(source => new Set((adjacency.get(source.id) ?? []).filter(id => targets.has(id))).size >= (c.min_instances ?? 2)); break;
      case 'connected_system': {
        const visited = new Set<string>();
        const pending = healthy.filter(n => n.data.role === 'client').slice(0, 1).map(n => n.id);
        const neighbors = new Map<string, string[]>();
        for (const edge of graph.edges) if (healthyIds.has(edge.source) && healthyIds.has(edge.target)) {
          neighbors.set(edge.source, [...(neighbors.get(edge.source) ?? []), edge.target]);
          neighbors.set(edge.target, [...(neighbors.get(edge.target) ?? []), edge.source]);
        }
        while (pending.length) {
          const id = pending.pop()!;
          if (visited.has(id)) continue;
          visited.add(id); pending.push(...(neighbors.get(id) ?? []));
        }
        completed = healthy.length > 1 && visited.size === healthy.length;
        break;
      }
      case 'node_and_connection': completed = hasNodes && directExists; break;
      case 'cost_constraint': completed = c.max_monthly_cost !== undefined && gameCost(graph.nodes) <= c.max_monthly_cost; break;
      case 'remove_broken': completed = !graph.nodes.some(n => n.data.status === 'broken'); break;
    }
    const implicated = completed ? [] : [...new Set([...sources.map(n => n.id), ...targets,
      ...graph.nodes.filter(n => n.data.status === 'broken').map(n => n.id)])];
    return { id: rule.id, title: rule.title, description: rule.description ?? rule.title,
      type: rule.requirement_type, completed, visible: rule.initially_visible !== 0 && rule.initially_visible !== false,
      points: rule.points ?? 0, message: completed ? 'Requirement met' : rule.hint ?? `Check: ${rule.title}`,
      hint: rule.hint ?? undefined, nodeIds: implicated, validationDetails: { nodeIds: implicated } };
  });
  const completedRequirements = results.filter(r => r.completed).length;
  return { requirements: results, summary: { totalRequirements: results.length, completedRequirements,
    allCompleted: results.length > 0 && completedRequirements === results.length,
    completionPercentage: results.length ? Math.round(completedRequirements / results.length * 100) : 0,
    pointsEarned: results.filter(r => r.completed).reduce((sum, r) => sum + r.points, 0) } };
}
