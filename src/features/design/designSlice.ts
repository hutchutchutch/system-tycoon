import { createSlice, current } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';
import type { ComponentData } from '../../components/molecules/ComponentCard/ComponentCard.types';

interface DesignState {
  // React Flow state
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  // Drag and drop state
  draggedComponent: ComponentData | null;
  isDragging: boolean;
  
  // Design metrics
  totalCost: number;
  isValidDesign: boolean;
  validationErrors: string[];
  
  // Canvas viewport
  canvasViewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

const initialState: DesignState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  
  draggedComponent: null,
  isDragging: false,
  
  totalCost: 0,
  isValidDesign: false,
  validationErrors: [],
  
  canvasViewport: { x: 0, y: 0, zoom: 1 },
};

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    // Drag and Drop
    setDraggedComponent: (state, action: PayloadAction<ComponentData | null>) => {
      state.draggedComponent = action.payload;
      state.isDragging = action.payload !== null;
    },
    
    // Node Management
    addNode: (state, action: PayloadAction<{ component: any; position: { x: number; y: number } }>) => {
      const { component, position } = action.payload;
      
      // Generate unique node ID
      const nodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Handle different component data structures
      const normalizedComponent = {
        id: component.id || component.component_id,
        name: component.name || component.service_name,
        type: component.type || component.category,
        category: component.category || component.vendor_category,
        cost: component.cost || component.base_cost || 50,
        capacity: component.capacity || 1000,
        description: component.description || component.short_description,
        icon: component.icon || component.icon_name || 'server'
      };
      
      const newNode = {
        id: nodeId,
        type: 'custom' as const,
        position: { ...position },
        data: {
          id: normalizedComponent.id,
          name: normalizedComponent.name,
          type: normalizedComponent.type,
          category: normalizedComponent.category,
          cost: normalizedComponent.cost,
          capacity: normalizedComponent.capacity,
          description: normalizedComponent.description,
          label: normalizedComponent.name,
          icon: normalizedComponent.icon,
        },
      };
      
      // Push to nodes array (Immer will handle the immutability)
      (state.nodes as any).push(newNode);
      state.totalCost += normalizedComponent.cost;
      
      // Clear dragged component
      state.draggedComponent = null;
      state.isDragging = false;
      
      // Validate design
      designSlice.caseReducers.validateDesign(state);
    },
    
    updateNode: (state, action: PayloadAction<{ id: string; data: Partial<any> }>) => {
      const { id, data } = action.payload;
      const nodeIndex = state.nodes.findIndex(n => n.id === id);
      
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex] = {
          ...state.nodes[nodeIndex],
          data: { ...state.nodes[nodeIndex].data, ...data },
        };
        
        designSlice.caseReducers.recalculateTotalCost(state);
        designSlice.caseReducers.validateDesign(state);
      }
    },
    
    deleteNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      const nodeIndex = state.nodes.findIndex(n => n.id === nodeId);
      
      if (nodeIndex !== -1) {
        const deletedNode = state.nodes[nodeIndex];
        const nodeCost = (deletedNode.data as any)?.cost || 0;
        state.totalCost -= nodeCost;
        
        // Remove node
        state.nodes.splice(nodeIndex, 1);
        
        // Remove connected edges
        state.edges = state.edges.filter(
          edge => edge.source !== nodeId && edge.target !== nodeId
        );
        
        // Clear selection if deleted node was selected
        if (state.selectedNodeId === nodeId) {
          state.selectedNodeId = null;
        }
        
        designSlice.caseReducers.validateDesign(state);
      }
    },
    
    // React Flow handlers
    onNodesChange: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, current(state.nodes));
    },
    
    onEdgesChange: (state, action: PayloadAction<EdgeChange[]>) => {
      state.edges = applyEdgeChanges(action.payload, current(state.edges));
    },
    
    // Edge Management
    addEdge: (state, action: PayloadAction<Connection>) => {
      const connection = action.payload;
      
      console.log('[Redux] Adding edge:', {
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle
      });
      
      // Check if edge already exists
      const exists = state.edges.some(edge => 
        (edge.source === connection.source && edge.target === connection.target) ||
        (edge.source === connection.target && edge.target === connection.source)
      );
      
      if (!exists && connection.source && connection.target) {
        const newEdge: Edge = {
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
          animated: true,
          style: { stroke: '#475569', strokeWidth: 2 },
        };
        
        state.edges.push(newEdge);
        designSlice.caseReducers.validateDesign(state);
      }
    },
    
    deleteEdge: (state, action: PayloadAction<string>) => {
      const edgeId = action.payload;
      state.edges = state.edges.filter(e => e.id !== edgeId);
      designSlice.caseReducers.validateDesign(state);
    },
    
    // Selection Management
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    
    // Canvas Management
    updateViewport: (state, action: PayloadAction<{ x: number; y: number; zoom: number }>) => {
      state.canvasViewport = action.payload;
    },
    
    // Clear Design
    clearDesign: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNodeId = null;
      state.totalCost = 0;
      state.isValidDesign = false;
      state.validationErrors = [];
    },
    
    // Helper reducers
    recalculateTotalCost: (state) => {
      state.totalCost = state.nodes.reduce((sum, node) => {
        const nodeCost = (node.data as any)?.cost || 0;
        return sum + nodeCost;
      }, 0);
    },
    
    validateDesign: (state) => {
      const errors: string[] = [];
      
      // Basic validation - can be expanded
      if (state.nodes.length === 0) {
        errors.push('No components added');
      }
      
      // Check for orphan nodes (nodes without connections)
      if (state.nodes.length > 1) {
        const connectedNodes = new Set<string>();
        state.edges.forEach(edge => {
          connectedNodes.add(edge.source);
          connectedNodes.add(edge.target);
        });
        
        const orphanNodes = state.nodes.filter(node => !connectedNodes.has(node.id));
        if (orphanNodes.length > 0) {
          errors.push(`${orphanNodes.length} component(s) are not connected`);
        }
      }
      
      state.validationErrors = errors;
      state.isValidDesign = errors.length === 0;
    },
  },
});

export const {
  setDraggedComponent,
  addNode,
  updateNode,
  deleteNode,
  onNodesChange,
  onEdgesChange,
  addEdge,
  deleteEdge,
  selectNode,
  updateViewport,
  clearDesign,
  recalculateTotalCost,
  validateDesign,
} = designSlice.actions;

export default designSlice.reducer;

// Selectors
export const selectNodes = (state: { design: DesignState }) => state.design.nodes;
export const selectEdges = (state: { design: DesignState }) => state.design.edges;
export const selectTotalCost = (state: { design: DesignState }) => state.design.totalCost;
export const selectIsValidDesign = (state: { design: DesignState }) => state.design.isValidDesign;
export const selectValidationErrors = (state: { design: DesignState }) => state.design.validationErrors;
export const selectDraggedComponent = (state: { design: DesignState }) => state.design.draggedComponent;
export const selectIsDragging = (state: { design: DesignState }) => state.design.isDragging; 