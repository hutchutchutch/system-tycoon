import { createSlice, createSelector, current } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { applyNodeChanges, applyEdgeChanges, MarkerType } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import type { ComponentData } from '../../components/molecules/ComponentCard/ComponentCard.types';
import { emptyGraph, evaluateGraph, gameCost } from '../../../shared/game';
import type { GameRule, GraphData, GraphSnapshot, GraphNode, GraphEdge } from '../../../shared/game';

export interface DesignNodeData extends GraphData {
  component_id?: string;
  service_name?: string;
  type?: string;
  vendor_category?: string;
  base_cost?: number;
  capacity?: number;
  short_description?: string;
  icon_name?: string;
}
export type DesignNode = Node<DesignNodeData>;
type Frame = { nodes: GraphNode[]; edges: GraphEdge[] };
interface SystemRequirement {
  id: string; description: string; type?: string; validation_type?: string;
  required_nodes?: string[]; min_nodes_of_type?: Record<string, number>;
  required_connection?: { from: string; to: string }; target_value?: number;
}
interface DesignState {
  nodes: DesignNode[];
  edges: Edge[];
  rules: GameRule[];
  systemRequirements: SystemRequirement[];
  past: Frame[]; future: Frame[]; dragStart: Frame | null;
  revision: number;
  selectedNodeId: string | null;
  draggedComponent: ComponentData | null;
  isDragging: boolean;
  totalCost: number; isValidDesign: boolean;
  validationErrors: Array<{ type: string; severity: string; message: string; nodeIds?: string[] }>;
  requirementValidationResults: Array<{ id: string; description: string; completed: boolean; message?: string; nodeIds?: string[]; validationDetails?: unknown }>;
  requirementProgress: { completed: number; total: number; percentage: number };
  allRequirementsMet: boolean;
  canvasViewport: GraphSnapshot['viewport'];
}
const initialState: DesignState = {
  nodes: [], edges: [], rules: [], systemRequirements: [], past: [], future: [], dragStart: null, revision: 0,
  selectedNodeId: null, draggedComponent: null, isDragging: false, totalCost: 0, isValidDesign: true,
  validationErrors: [], requirementValidationResults: [], requirementProgress: { completed: 0, total: 0, percentage: 0 },
  allRequirementsMet: false, canvasViewport: emptyGraph().viewport,
};
function snapshot(state: DesignState): Frame {
  return { nodes: current(state.nodes).map(n => ({ id: n.id, type: n.type, data: n.data, position: n.position })),
    edges: current(state.edges).map(e => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })) };
}
function checkpoint(state: DesignState) {
  state.past.push(snapshot(state));
  if (state.past.length > 50) state.past.shift();
  state.future = [];
}
function refresh(state: DesignState) {
  const graph: GraphSnapshot = { version: 1, nodes: state.nodes, edges: state.edges, viewport: state.canvasViewport };
  const result = evaluateGraph(graph, state.rules);
  state.totalCost = gameCost(graph.nodes);
  state.requirementValidationResults = result.requirements.map(r => ({ ...r, description: r.title }));
  state.requirementProgress = { completed: result.summary.completedRequirements, total: result.summary.totalRequirements, percentage: result.summary.completionPercentage };
  state.allRequirementsMet = result.summary.allCompleted;
  const ids = new Set(state.nodes.map(n => n.id));
  state.edges = state.edges.filter(e => ids.has(e.source) && ids.has(e.target));
  state.isValidDesign = true;
  state.validationErrors = [];
}
const decorateEdge = (edge: Edge): Edge => ({ ...edge, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#64748b', strokeWidth: 2 } });

const designSlice = createSlice({
  name: 'design', initialState,
  reducers: {
    restoreGraph(state, action: PayloadAction<GraphSnapshot>) {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges.map(decorateEdge);
      state.canvasViewport = action.payload.viewport;
      state.past = []; state.future = []; state.dragStart = null; state.revision = 0;
      refresh(state);
    },
    setGameRules(state, action: PayloadAction<GameRule[]>) {
      state.rules = action.payload;
      state.systemRequirements = action.payload.map(r => ({ id: r.id, description: r.title }));
      refresh(state);
    },
    setDraggedComponent(state, action: PayloadAction<ComponentData | null>) {
      state.draggedComponent = action.payload; state.isDragging = action.payload !== null;
    },
    addNode: {
      prepare(payload: { component: DesignNodeData; position: { x: number; y: number }; nodeType?: string; nodeData?: DesignNodeData; instanceId?: string }) {
        return { payload: { ...payload, instanceId: payload.instanceId ?? crypto.randomUUID() } };
      },
      reducer(state, action: PayloadAction<{ component: DesignNodeData; position: { x: number; y: number }; nodeType?: string; nodeData?: DesignNodeData; instanceId: string }>) {
        if (state.nodes.length >= 250 || state.nodes.some(n => n.id === action.payload.instanceId)) return;
        checkpoint(state);
        const { component: c, nodeData, nodeType, position, instanceId } = action.payload;
        const data = nodeData ?? { ...c, componentId: c.componentId ?? c.id ?? c.component_id,
          name: c.name ?? c.service_name, label: c.label ?? c.name ?? c.service_name,
          category: c.category ?? c.vendor_category, cost: c.cost ?? c.base_cost ?? 0,
          icon: c.icon ?? c.icon_name ?? 'server', description: c.description ?? c.short_description };
        state.nodes.push({ id: instanceId, type: nodeType ?? (data.role === 'client' ? 'user' : 'custom'), position, data });
        state.draggedComponent = null; state.isDragging = false; state.revision++; refresh(state);
      },
    },
    updateNode(state, action: PayloadAction<{ id: string; data: Partial<DesignNodeData> }>) {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (!node) return;
      checkpoint(state); Object.assign(node.data, action.payload.data); state.revision++; refresh(state);
    },
    deleteNode(state, action: PayloadAction<string>) {
      checkpoint(state); state.nodes = state.nodes.filter(n => n.id !== action.payload);
      state.edges = state.edges.filter(e => e.source !== action.payload && e.target !== action.payload);
      state.selectedNodeId = null; state.revision++; refresh(state);
    },
    onNodesChange(state, action: PayloadAction<NodeChange[]>) {
      const structural = action.payload.some(c => c.type === 'remove' || c.type === 'add' || c.type === 'replace');
      const positions = action.payload.filter(c => c.type === 'position');
      if (structural) checkpoint(state);
      if (!structural && positions.some(c => c.dragging === undefined && c.position)) checkpoint(state);
      if (positions.some(c => c.dragging) && !state.dragStart) state.dragStart = snapshot(state);
      state.nodes = applyNodeChanges(action.payload, current(state.nodes));
      if (positions.some(c => c.dragging === false) && state.dragStart) {
        state.past.push(state.dragStart); state.past = state.past.slice(-50); state.future = []; state.dragStart = null;
      }
      if (structural || positions.length) { state.revision++; refresh(state); }
    },
    onEdgesChange(state, action: PayloadAction<EdgeChange[]>) {
      const changed = action.payload.some(c => c.type !== 'select');
      if (changed) checkpoint(state);
      state.edges = applyEdgeChanges(action.payload, current(state.edges));
      if (changed) { state.revision++; refresh(state); }
    },
    addEdge: {
      prepare(connection: Connection) { return { payload: { ...connection, id: crypto.randomUUID() } }; },
      reducer(state, action: PayloadAction<Connection & { id: string }>) {
      const c = action.payload;
      if (c.source === c.target || state.edges.length >= 1000 || !state.nodes.some(n => n.id === c.source)
        || !state.nodes.some(n => n.id === c.target) || state.edges.some(e => e.source === c.source && e.target === c.target)) return;
      checkpoint(state);
      state.edges.push(decorateEdge(c));
      state.revision++; refresh(state);
      },
    },
    reconnectEdge(state, action: PayloadAction<{ id: string; connection: Connection }>) {
      const { id, connection: c } = action.payload;
      if (c.source === c.target || !state.nodes.some(n => n.id === c.source) || !state.nodes.some(n => n.id === c.target)
        || !state.edges.some(e => e.id === id) || state.edges.some(e => e.id !== id && e.source === c.source && e.target === c.target)) return;
      checkpoint(state);
      state.edges = state.edges.map(e => e.id === id ? decorateEdge({ ...e, ...c }) : e);
      state.revision++; refresh(state);
    },
    deleteEdge(state, action: PayloadAction<string>) {
      checkpoint(state); state.edges = state.edges.filter(e => e.id !== action.payload); state.revision++; refresh(state);
    },
    undo(state) {
      const previous = state.past.pop(); if (!previous) return;
      state.future.push(snapshot(state)); state.nodes = previous.nodes; state.edges = previous.edges.map(decorateEdge); state.revision++; refresh(state);
    },
    redo(state) {
      const future = state.future.pop(); if (!future) return;
      state.past.push(snapshot(state)); state.nodes = future.nodes; state.edges = future.edges.map(decorateEdge); state.revision++; refresh(state);
    },
    selectNode(state, action: PayloadAction<string | null>) { state.selectedNodeId = action.payload; },
    updateViewport(state, action: PayloadAction<GraphSnapshot['viewport']>) {
      const { x, y, zoom } = action.payload;
      if (state.canvasViewport.x !== x || state.canvasViewport.y !== y || state.canvasViewport.zoom !== zoom) state.canvasViewport = action.payload;
    },
    clearDesign(state) { checkpoint(state); state.nodes = []; state.edges = []; state.revision++; refresh(state); },
    clearCanvas(state, action: PayloadAction<{ keepRequirements?: boolean }>) {
      const rules = action.payload?.keepRequirements ? current(state.rules) : [];
      Object.assign(state, initialState); state.rules = rules; refresh(state);
    },
    recalculateTotalCost(state) { refresh(state); },
    validateDesign(state) { refresh(state); },
    validateRequirements(state) { refresh(state); },
    setSystemRequirements(state, action: PayloadAction<SystemRequirement[]>) {
      state.systemRequirements = action.payload;
      state.rules = action.payload.map(r => ({ id: r.id, title: r.description, requirement_type: r.validation_type ?? '',
        validation_config: { required_components: r.required_nodes,
          min_instances: r.min_nodes_of_type ? Object.values(r.min_nodes_of_type)[0] : 1,
          source_types: r.required_connection ? [r.required_connection.from] : undefined,
          target_types: r.required_connection ? [r.required_connection.to] : undefined, max_monthly_cost: r.target_value } }));
      refresh(state);
    },
    updateRequirementValidationResults(state, action: PayloadAction<{
      revision?: number;
      requirements: Array<{ id: string; description: string; title?: string; completed: boolean; visible?: boolean; message?: string; nodeIds?: string[] }>;
      summary: { allCompleted: boolean; completedCount: number; totalCount: number; percentage: number };
    }>) {
      if (action.payload.revision !== undefined && action.payload.revision !== state.revision) return;
      state.requirementValidationResults = action.payload.requirements.filter(r => r.visible !== false).map(r => ({ ...r, description: r.title ?? r.description }));
      const s = action.payload.summary;
      state.requirementProgress = { completed: s.completedCount, total: s.totalCount, percentage: s.percentage };
      state.allRequirementsMet = s.allCompleted;
    },
  },
});
export const { restoreGraph, setGameRules, setDraggedComponent, addNode, updateNode, deleteNode, onNodesChange, onEdgesChange,
  addEdge, reconnectEdge, deleteEdge, undo, redo, selectNode, updateViewport, clearDesign, clearCanvas, recalculateTotalCost,
  validateDesign, validateRequirements, setSystemRequirements, updateRequirementValidationResults } = designSlice.actions;
export default designSlice.reducer;
type State = { design: DesignState };
export const selectNodes = (s: State) => s.design.nodes;
export const selectEdges = (s: State) => s.design.edges;
export const selectTotalCost = (s: State) => s.design.totalCost;
export const selectIsValidDesign = (s: State) => s.design.isValidDesign;
export const selectValidationErrors = (s: State) => s.design.validationErrors;
export const selectDraggedComponent = (s: State) => s.design.draggedComponent;
export const selectIsDragging = (s: State) => s.design.isDragging;
export const selectSystemRequirements = (s: State) => s.design.systemRequirements;
export const selectRequirementValidationResults = (s: State) => s.design.requirementValidationResults;
export const selectAllRequirementsMet = (s: State) => s.design.allRequirementsMet;
export const selectRequirementProgress = (s: State) => s.design.requirementProgress;
export const selectRequirementsStatus = createSelector([selectRequirementValidationResults, selectRequirementProgress],
  (requirements, progress) => ({ requirements, progress, allMet: progress.total > 0 && progress.completed === progress.total,
    completedCount: progress.completed, totalCount: progress.total, percentage: progress.percentage }));
export const selectCanvasValidation = createSelector([selectNodes, selectEdges, selectIsValidDesign, selectValidationErrors, selectAllRequirementsMet],
  (nodes, edges, isValidDesign, validationErrors, allRequirementsMet) => ({ isValidDesign, validationErrors, allRequirementsMet,
    canProceed: isValidDesign && allRequirementsMet, hasComponents: nodes.length > 0, hasConnections: edges.length > 0 }));
export const selectDesignMetrics = createSelector([selectNodes, selectEdges, selectTotalCost],
  (nodes, edges, totalCost) => ({ nodeCount: nodes.length, edgeCount: edges.length, totalCost,
    nodesByCategory: nodes.reduce((acc: Record<string, number>, n) => { const c = n.data.category ?? 'unknown'; acc[c] = (acc[c] ?? 0) + 1; return acc; }, {}) }));
