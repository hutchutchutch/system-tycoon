import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  setActiveCanvas,
  updateCanvasState,
  loadCanvasState,
  selectCanvasState,
  selectCanvasNodes,
  selectCanvasEdges,
  selectCanvasViewport,
  selectIsCanvasDirty,
  selectSavingStatus,
  selectCanvasSaveError,
  serializeNode,
  serializeEdge,
  deserializeNode,
  deserializeEdge,
  type SerializableNode,
  type SerializableEdge,
  type CanvasViewport,
} from '../store/slices/canvasSlice';
import { useLoadCanvasStateQuery, useSaveCanvasStateMutation } from '../store/api/canvasApi';
import { skipToken } from '@reduxjs/toolkit/query';
import type { Node, Edge } from '@xyflow/react';

interface UseCanvasStateProps {
  stageId: string;
  userId?: string;
  missionId?: string;
}

/**
 * Custom hook for managing canvas state with Redux and Supabase persistence
 * 
 * Provides a clean interface for:
 * - Loading/saving canvas state
 * - Managing nodes, edges, and viewport
 * - Auto-save functionality
 * - Loading and error states
 */
export const useCanvasState = ({ stageId, userId, missionId }: UseCanvasStateProps) => {
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const canvasState = useAppSelector(state => selectCanvasState(stageId)(state));
  const nodes = useAppSelector(state => selectCanvasNodes(stageId)(state));
  const edges = useAppSelector(state => selectCanvasEdges(stageId)(state));
  const viewport = useAppSelector(state => selectCanvasViewport(stageId)(state));
  const isDirty = useAppSelector(state => selectIsCanvasDirty(stageId)(state));
  const savingStatus = useAppSelector(selectSavingStatus);
  const saveError = useAppSelector(selectCanvasSaveError);
  
  // RTK Query hooks
  const {
    data: savedCanvasData,
    isLoading: isLoadingCanvas,
    error: canvasLoadError,
    refetch: refetchCanvasState,
  } = useLoadCanvasStateQuery(
    userId ? { userId, stageId } : skipToken
  );
  
  const [saveCanvasStateMutation, { isLoading: isSaving }] = useSaveCanvasStateMutation();
  
  // Initialize canvas for this stage
  const initializeCanvas = useCallback(() => {
    dispatch(setActiveCanvas({ stageId }));
    
    // Load saved state if available
    if (savedCanvasData?.canvasState) {
      dispatch(loadCanvasState({
        stageId,
        nodes: savedCanvasData.canvasState.nodes,
        edges: savedCanvasData.canvasState.edges,
        viewport: savedCanvasData.canvasState.viewport,
      }));
    }
  }, [dispatch, stageId, savedCanvasData]);
  
  // Update nodes in Redux state
  const updateNodes = useCallback((reactFlowNodes: Node[]) => {
    const serializableNodes = reactFlowNodes.map(serializeNode);
    dispatch(updateCanvasState({
      stageId,
      nodes: serializableNodes,
    }));
  }, [dispatch, stageId]);
  
  // Update edges in Redux state
  const updateEdges = useCallback((reactFlowEdges: Edge[]) => {
    const serializableEdges = reactFlowEdges.map(serializeEdge);
    dispatch(updateCanvasState({
      stageId,
      edges: serializableEdges,
    }));
  }, [dispatch, stageId]);
  
  // Update viewport in Redux state
  const updateViewport = useCallback((newViewport: CanvasViewport) => {
    dispatch(updateCanvasState({
      stageId,
      viewport: newViewport,
    }));
  }, [dispatch, stageId]);
  
  // Manual save function
  const saveCanvas = useCallback(async () => {
    if (!userId || !missionId || !canvasState) {
      throw new Error('Cannot save: missing required data');
    }
    
    try {
      await saveCanvasStateMutation({
        userId,
        missionId,
        stageId,
        canvasState: {
          nodes: canvasState.nodes,
          edges: canvasState.edges,
          viewport: canvasState.viewport,
          timestamp: new Date().toISOString(),
        },
      }).unwrap();
      
      return true;
    } catch (error) {
      console.error('Failed to save canvas state:', error);
      throw error;
    }
  }, [userId, missionId, stageId, canvasState, saveCanvasStateMutation]);
  
  // Convert serializable nodes/edges back to React Flow format
  const reactFlowNodes: Node[] = nodes.map(deserializeNode);
  const reactFlowEdges: Edge[] = edges.map(deserializeEdge);
  
  return {
    // State
    canvasState,
    nodes: reactFlowNodes,
    edges: reactFlowEdges,
    viewport,
    isDirty,
    
    // Loading states
    isLoadingCanvas,
    isSaving: isSaving || savingStatus === 'saving',
    savingStatus,
    
    // Errors
    loadError: canvasLoadError,
    saveError,
    
    // Actions
    initializeCanvas,
    updateNodes,
    updateEdges,
    updateViewport,
    saveCanvas,
    refetchCanvasState,
    
    // Utility
    hasUnsavedChanges: isDirty,
    lastSaved: canvasState?.lastSaved,
  };
}; 