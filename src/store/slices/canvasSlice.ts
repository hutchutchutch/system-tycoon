import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge } from '@xyflow/react';

interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

// Simplified interfaces to avoid WritableDraft issues with React Flow types
interface SerializableNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: any;
  width?: number;
  height?: number;
  selected?: boolean;
  dragging?: boolean;
}

interface SerializableEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  data?: any;
  selected?: boolean;
}

interface CanvasState {
  // Active canvas states by stage ID
  canvasStates: Record<string, {
    nodes: SerializableNode[];
    edges: SerializableEdge[];
    viewport: CanvasViewport;
    lastSaved: string;
    isDirty: boolean;
  }>;
  
  // Current active canvas
  activeStageId: string | null;
  
  // Auto-save settings
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // milliseconds
  lastAutoSave: string | null;
  
  // Persistence status
  savingStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string | null;
}

const initialState: CanvasState = {
  canvasStates: {},
  activeStageId: null,
  autoSaveEnabled: true,
  autoSaveInterval: 2000, // 2 seconds
  lastAutoSave: null,
  savingStatus: 'idle',
  saveError: null,
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    // Canvas State Management
    setActiveCanvas: (state, action: PayloadAction<{ stageId: string }>) => {
      const { stageId } = action.payload;
      state.activeStageId = stageId;
      
      // Initialize canvas state if it doesn't exist
      if (!state.canvasStates[stageId]) {
        state.canvasStates[stageId] = {
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 0.6 },
          lastSaved: new Date().toISOString(),
          isDirty: false,
        };
      }
    },
    
    // Node Management
    updateCanvasNodes: (state, action: PayloadAction<{ stageId: string; nodes: SerializableNode[] }>) => {
      const { stageId, nodes } = action.payload;
      
      if (state.canvasStates[stageId]) {
        state.canvasStates[stageId].nodes = nodes;
        state.canvasStates[stageId].isDirty = true;
      }
    },
    
    // Edge Management
    updateCanvasEdges: (state, action: PayloadAction<{ stageId: string; edges: SerializableEdge[] }>) => {
      const { stageId, edges } = action.payload;
      
      if (state.canvasStates[stageId]) {
        state.canvasStates[stageId].edges = edges;
        state.canvasStates[stageId].isDirty = true;
      }
    },
    
    // Viewport Management
    updateCanvasViewport: (state, action: PayloadAction<{ stageId: string; viewport: CanvasViewport }>) => {
      const { stageId, viewport } = action.payload;
      
      if (state.canvasStates[stageId]) {
        state.canvasStates[stageId].viewport = viewport;
        state.canvasStates[stageId].isDirty = true;
      }
    },
    
    // Bulk Canvas State Update
    updateCanvasState: (state, action: PayloadAction<{
      stageId: string;
      nodes?: SerializableNode[];
      edges?: SerializableEdge[];
      viewport?: CanvasViewport;
    }>) => {
      const { stageId, nodes, edges, viewport } = action.payload;
      
      if (!state.canvasStates[stageId]) {
        state.canvasStates[stageId] = {
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 0.6 },
          lastSaved: new Date().toISOString(),
          isDirty: false,
        };
      }
      
      const canvasState = state.canvasStates[stageId];
      
      if (nodes) {
        canvasState.nodes = nodes;
        canvasState.isDirty = true;
      }
      
      if (edges) {
        canvasState.edges = edges;
        canvasState.isDirty = true;
      }
      
      if (viewport) {
        canvasState.viewport = viewport;
        canvasState.isDirty = true;
      }
    },
    
    // Load Canvas State from Server
    loadCanvasState: (state, action: PayloadAction<{
      stageId: string;
      nodes: SerializableNode[];
      edges: SerializableEdge[];
      viewport?: CanvasViewport;
    }>) => {
      const { stageId, nodes, edges, viewport } = action.payload;
      
      state.canvasStates[stageId] = {
        nodes,
        edges,
        viewport: viewport || { x: 0, y: 0, zoom: 0.6 },
        lastSaved: new Date().toISOString(),
        isDirty: false,
      };
    },
    
    // Save Status Management
    setSavingStatus: (state, action: PayloadAction<'idle' | 'saving' | 'saved' | 'error'>) => {
      state.savingStatus = action.payload;
    },
    
    setSaveError: (state, action: PayloadAction<string | null>) => {
      state.saveError = action.payload;
    },
    
    markCanvasSaved: (state, action: PayloadAction<string>) => {
      const stageId = action.payload;
      if (state.canvasStates[stageId]) {
        state.canvasStates[stageId].isDirty = false;
        state.canvasStates[stageId].lastSaved = new Date().toISOString();
      }
      state.lastAutoSave = new Date().toISOString();
      state.savingStatus = 'saved';
    },
    
    // Auto-save Settings
    setAutoSaveEnabled: (state, action: PayloadAction<boolean>) => {
      state.autoSaveEnabled = action.payload;
    },
    
    setAutoSaveInterval: (state, action: PayloadAction<number>) => {
      state.autoSaveInterval = action.payload;
    },
    
    // Clear Canvas State
    clearCanvasState: (state, action: PayloadAction<string>) => {
      const stageId = action.payload;
      delete state.canvasStates[stageId];
    },
    
    // Reset all canvas states (for logout, etc.)
    resetCanvasStates: () => initialState,
  },
});

export const {
  setActiveCanvas,
  updateCanvasNodes,
  updateCanvasEdges,
  updateCanvasViewport,
  updateCanvasState,
  loadCanvasState,
  setSavingStatus,
  setSaveError,
  markCanvasSaved,
  setAutoSaveEnabled,
  setAutoSaveInterval,
  clearCanvasState,
  resetCanvasStates,
} = canvasSlice.actions;

export default canvasSlice.reducer;

// Type exports
export type { SerializableNode, SerializableEdge, CanvasViewport };

// Utility functions to convert between React Flow types and serializable types
export const serializeNode = (node: Node): SerializableNode => ({
  id: node.id,
  type: node.type,
  position: node.position,
  data: node.data,
  width: node.width,
  height: node.height,
  selected: node.selected,
  dragging: node.dragging,
});

export const serializeEdge = (edge: Edge): SerializableEdge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  sourceHandle: edge.sourceHandle,
  targetHandle: edge.targetHandle,
  type: edge.type,
  data: edge.data,
  selected: edge.selected,
});

export const deserializeNode = (node: SerializableNode): Node => ({
  ...node,
  position: node.position,
  data: node.data || {},
});

export const deserializeEdge = (edge: SerializableEdge): Edge => ({
  ...edge,
  data: edge.data || {},
});

// Selectors
export const selectCanvasState = (stageId: string) => (state: { canvas: CanvasState }) =>
  state.canvas.canvasStates[stageId];

export const selectActiveCanvasState = (state: { canvas: CanvasState }) => {
  const { activeStageId, canvasStates } = state.canvas;
  return activeStageId ? canvasStates[activeStageId] : null;
};

export const selectCanvasNodes = (stageId: string) => (state: { canvas: CanvasState }) =>
  state.canvas.canvasStates[stageId]?.nodes || [];

export const selectCanvasEdges = (stageId: string) => (state: { canvas: CanvasState }) =>
  state.canvas.canvasStates[stageId]?.edges || [];

export const selectCanvasViewport = (stageId: string) => (state: { canvas: CanvasState }) =>
  state.canvas.canvasStates[stageId]?.viewport || { x: 0, y: 0, zoom: 0.6 };

export const selectIsCanvasDirty = (stageId: string) => (state: { canvas: CanvasState }) =>
  state.canvas.canvasStates[stageId]?.isDirty || false;

export const selectSavingStatus = (state: { canvas: CanvasState }) =>
  state.canvas.savingStatus;

export const selectCanvasSaveError = (state: { canvas: CanvasState }) =>
  state.canvas.saveError; 