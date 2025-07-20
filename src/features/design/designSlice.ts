import { createSlice, current, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';
import type { ComponentData } from '../../components/molecules/ComponentCard/ComponentCard.types';

// Types for requirements validation
interface ValidationError {
  type: string;
  severity: 'error' | 'warning';
  message: string;
  nodeIds?: string[];
}

interface SystemRequirement {
  id: string;
  type?: string;
  priority?: string;
  description: string;
  validation_type?: string;
  required_nodes?: string[];
  min_nodes_of_type?: Record<string, number>;
  required_connection?: {
    from: string;
    to: string;
  };
  forbidden_nodes?: string[];
  target_value?: number;
  target_metric?: string;
}

interface RequirementValidationResult {
  id: string;
  description: string;
  completed: boolean;
  validationDetails?: any;
}

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
  validationErrors: ValidationError[];
  
  // Canvas viewport
  canvasViewport: {
    x: number;
    y: number;
    zoom: number;
  };

  // Requirements validation state
  systemRequirements: SystemRequirement[];
  requirementValidationResults: RequirementValidationResult[];
  allRequirementsMet: boolean;
  requirementProgress: {
    completed: number;
    total: number;
    percentage: number;
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

  // Requirements state
  systemRequirements: [],
  requirementValidationResults: [],
  allRequirementsMet: false,
  requirementProgress: {
    completed: 0,
    total: 0,
    percentage: 0,
  },
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
    addNode: (state, action: PayloadAction<{ 
      component: any; 
      position: { x: number; y: number };
      nodeType?: string;
      nodeData?: any;
    }>) => {
      const { component, position, nodeType, nodeData } = action.payload;
      
      // Use component.id if provided, otherwise generate unique node ID
      const nodeId = component.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
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
      
      // Determine node type - if nodeType is provided, use it, otherwise default to 'custom'
      const finalNodeType = nodeType || (normalizedComponent.category === 'stakeholder' ? 'user' : 'custom');
      
      const newNode = {
        id: nodeId,
        type: finalNodeType,
        position: { ...position },
        data: nodeData || {
          id: normalizedComponent.id,
          name: normalizedComponent.name,
          type: normalizedComponent.type,
          category: normalizedComponent.category,
          cost: normalizedComponent.cost,
          capacity: normalizedComponent.capacity,
          description: normalizedComponent.description,
          label: normalizedComponent.name,
          icon: normalizedComponent.icon,
          // Add userCount for user nodes
          ...(finalNodeType === 'user' ? { userCount: normalizedComponent.capacity } : {})
        },
      };
      
      // Push to nodes array (Immer will handle the immutability)
      (state.nodes as any).push(newNode);
      state.totalCost += normalizedComponent.cost;
      
      // Clear dragged component
      state.draggedComponent = null;
      state.isDragging = false;
      
      // Validate design and requirements
      designSlice.caseReducers.validateRequirements(state);
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
        designSlice.caseReducers.validateRequirements(state);
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
        
        designSlice.caseReducers.validateRequirements(state);
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
        // Find source and target nodes to check if they're broken
        const sourceNode = state.nodes.find(node => node.id === connection.source);
        const targetNode = state.nodes.find(node => node.id === connection.target);
        
        // Check if this is a crisis edge (connecting to/from broken system nodes)
        const sourceIsBroken = sourceNode?.data?.status === 'broken';
        const targetIsBroken = targetNode?.data?.status === 'broken';
        const isCrisisEdge = sourceIsBroken || targetIsBroken;
        
        const newEdge: Edge = {
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
          animated: isCrisisEdge,
          style: isCrisisEdge 
            ? { stroke: '#ef4444', strokeWidth: 3 } 
            : { stroke: '#475569', strokeWidth: 2 },
          className: isCrisisEdge ? 'crisis-edge' : undefined,
        };
        
        state.edges.push(newEdge);
        designSlice.caseReducers.validateRequirements(state);
        designSlice.caseReducers.validateDesign(state);
      }
    },
    
    deleteEdge: (state, action: PayloadAction<string>) => {
      const edgeId = action.payload;
      state.edges = state.edges.filter(e => e.id !== edgeId);
      designSlice.caseReducers.validateRequirements(state);
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
      
      // Reset requirements validation
      state.requirementValidationResults = [];
      state.allRequirementsMet = false;
      state.requirementProgress = {
        completed: 0,
        total: state.systemRequirements.length,
        percentage: 0,
      };
    },
    
    // Helper reducers
    recalculateTotalCost: (state) => {
      state.totalCost = state.nodes.reduce((sum, node) => {
        const nodeCost = (node.data as any)?.cost || 0;
        return sum + nodeCost;
      }, 0);
    },
    
    // Set system requirements (called when mission stage data loads)
    setSystemRequirements: (state, action: PayloadAction<SystemRequirement[]>) => {
      state.systemRequirements = action.payload;
      designSlice.caseReducers.validateRequirements(state);
    },

    // Validate all requirements against current canvas state
    validateRequirements: (state) => {
      const validationResults: RequirementValidationResult[] = [];
      
      state.systemRequirements.forEach(requirement => {
        let completed = false;
        let validationDetails: any = {};
        
        switch (requirement.validation_type) {
          case 'node_count':
            if (requirement.min_nodes_of_type) {
              const results = Object.entries(requirement.min_nodes_of_type).map(([category, minCount]) => {
                const nodeCount = state.nodes.filter(node => 
                  node.data.category === category || 
                  node.type === category ||
                  (category === 'compute' && ['web_server', 'app_server', 'server'].includes(node.type || ''))
                ).length;
                return { category, required: minCount, actual: nodeCount, met: nodeCount >= minCount };
              });
              completed = results.every(r => r.met);
              validationDetails = { nodeCountResults: results };
            }
            break;
            
          case 'edge_connection':
            if (requirement.required_connection) {
              const { from, to } = requirement.required_connection;
              const hasConnection = state.edges.some(edge => {
                const sourceNode = state.nodes.find(n => n.id === edge.source);
                const targetNode = state.nodes.find(n => n.id === edge.target);
                
                if (!sourceNode || !targetNode) return false;
                
                const sourceMatches = sourceNode.data.category === from || 
                                    sourceNode.type === from ||
                                    (from === 'compute' && ['web_server', 'app_server', 'server'].includes(sourceNode.type || ''));
                                    
                const targetMatches = targetNode.data.category === to || 
                                     targetNode.type === to ||
                                     (to === 'database' && ['database', 'mysql', 'postgres'].includes(targetNode.type || ''));
                
                return sourceMatches && targetMatches;
              });
              completed = hasConnection;
              validationDetails = { connectionRequired: requirement.required_connection, hasConnection };
            }
            break;
            
          case 'node_removal':
            if (requirement.required_nodes) {
              // For node_removal type, required_nodes contains forbidden node IDs
              const forbiddenNodesPresent = requirement.required_nodes.filter((forbiddenId: string) => 
                state.nodes.some(node => node.id === forbiddenId)
              );
              completed = forbiddenNodesPresent.length === 0;
              validationDetails = { forbiddenNodes: requirement.required_nodes, forbiddenNodesPresent };
            }
            break;
            
          default:
            completed = false;
        }
        
        validationResults.push({
          id: requirement.id,
          description: requirement.description,
          completed,
          validationDetails
        });
      });
      
      state.requirementValidationResults = validationResults;
      
      // Update progress metrics
      const completedCount = validationResults.filter(r => r.completed).length;
      const totalCount = validationResults.length;
      
      state.requirementProgress = {
        completed: completedCount,
        total: totalCount,
        percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0
      };
      
      state.allRequirementsMet = completedCount === totalCount && totalCount > 0;
      
      // Trigger design validation as well
      designSlice.caseReducers.validateDesign(state);
    },

    validateDesign: (state) => {
      const errors: ValidationError[] = [];
      
      // Basic validation - can be expanded
      if (state.nodes.length === 0) {
        errors.push({
          type: 'no_components',
          severity: 'warning',
          message: 'No components added'
        });
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
          errors.push({
            type: 'orphan_nodes',
            severity: 'warning',
            message: `${orphanNodes.length} component(s) are not connected`,
            nodeIds: orphanNodes.map(n => n.id)
          });
        }
      }
      
      state.validationErrors = errors;
      state.isValidDesign = errors.filter(e => e.severity === 'error').length === 0;
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
  setSystemRequirements,
  validateRequirements,
} = designSlice.actions;

export default designSlice.reducer;

// Basic selectors
export const selectNodes = (state: { design: DesignState }) => state.design.nodes;
export const selectEdges = (state: { design: DesignState }) => state.design.edges;
export const selectTotalCost = (state: { design: DesignState }) => state.design.totalCost;
export const selectIsValidDesign = (state: { design: DesignState }) => state.design.isValidDesign;
export const selectValidationErrors = (state: { design: DesignState }) => state.design.validationErrors;
export const selectDraggedComponent = (state: { design: DesignState }) => state.design.draggedComponent;
export const selectIsDragging = (state: { design: DesignState }) => state.design.isDragging;

// Requirements selectors
export const selectSystemRequirements = (state: { design: DesignState }) => state.design.systemRequirements;
export const selectRequirementValidationResults = (state: { design: DesignState }) => state.design.requirementValidationResults;
export const selectAllRequirementsMet = (state: { design: DesignState }) => state.design.allRequirementsMet;
export const selectRequirementProgress = (state: { design: DesignState }) => state.design.requirementProgress;

// Memoized selectors following Redux best practices
export const selectRequirementsStatus = createSelector(
  [selectRequirementValidationResults, selectRequirementProgress],
  (validationResults, progress) => ({
    requirements: validationResults,
    progress,
    allMet: validationResults.length > 0 && validationResults.every(req => req.completed),
    completedCount: progress.completed,
    totalCount: progress.total,
    percentage: progress.percentage
  })
);

export const selectCanvasValidation = createSelector(
  [selectNodes, selectEdges, selectIsValidDesign, selectValidationErrors, selectAllRequirementsMet],
  (nodes, edges, isValidDesign, validationErrors, allRequirementsMet) => ({
    isValidDesign,
    validationErrors,
    allRequirementsMet,
    canProceed: isValidDesign && allRequirementsMet,
    hasComponents: nodes.length > 0,
    hasConnections: edges.length > 0
  })
);

export const selectDesignMetrics = createSelector(
  [selectNodes, selectEdges, selectTotalCost],
  (nodes, edges, totalCost) => ({
    nodeCount: nodes.length,
    edgeCount: edges.length,
    totalCost,
    nodesByCategory: nodes.reduce((acc: Record<string, number>, node) => {
      const category = (node.data as any)?.category || 'unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {})
  })
); 