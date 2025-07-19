import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import {
  updateCanvasNodes,
  updateCanvasEdges,
  updateCanvasViewport,
  updateCanvasState,
  setSavingStatus,
  setSaveError,
  markCanvasSaved,
} from '../slices/canvasSlice';
import { canvasApi } from '../api/canvasApi';

// Extend Window interface for our custom properties
declare global {
  interface Window {
    __canvasVisibilityListenerAdded?: boolean;
  }
}

// Auto-save timeout management
let autoSaveTimeouts: Record<string, NodeJS.Timeout> = {};

export const canvasMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Auto-save canvas state when it changes
  if (
    updateCanvasNodes.match(action) ||
    updateCanvasEdges.match(action) ||
    updateCanvasViewport.match(action) ||
    updateCanvasState.match(action)
  ) {
    const { canvas, auth } = state;
    
    if (!canvas.autoSaveEnabled || !canvas.activeStageId || !auth?.user?.id) {
      return result;
    }

    const stageId = canvas.activeStageId;
    const canvasState = canvas.canvasStates[stageId];
    
    if (!canvasState || !canvasState.isDirty) {
      return result;
    }

    // Clear existing timeout for this stage
    if (autoSaveTimeouts[stageId]) {
      clearTimeout(autoSaveTimeouts[stageId]);
    }

    // Set new auto-save timeout
    autoSaveTimeouts[stageId] = setTimeout(async () => {
      try {
        store.dispatch(setSavingStatus('saving'));
        
        // Get current canvas state
        const currentState = store.getState();
        const currentCanvasState = currentState.canvas.canvasStates[stageId];
        
        if (!currentCanvasState || !currentState.auth?.user?.id) {
          return;
        }

        // Prepare canvas state data for saving
        const canvasStateData = {
          nodes: currentCanvasState.nodes,
          edges: currentCanvasState.edges,
          viewport: currentCanvasState.viewport,
          timestamp: new Date().toISOString(),
        };

        // Get mission ID from current state
        const missionId = currentState.mission?.databaseMission?.id || 'default';

        // Save to server via RTK Query (using dispatch directly)
        const saveAction = canvasApi.endpoints.saveCanvasState.initiate({
          userId: currentState.auth.user.id,
          missionId,
          stageId,
          canvasState: canvasStateData,
        });

        try {
          await store.dispatch(saveAction).unwrap();
          // Mark as saved in Redux state
          store.dispatch(markCanvasSaved(stageId));
          console.log(`Auto-saved canvas state for stage: ${stageId}`);
        } catch (saveError) {
          throw saveError;
        }
        
      } catch (error) {
        console.error('Failed to auto-save canvas state:', error);
        store.dispatch(setSavingStatus('error'));
        store.dispatch(setSaveError(error instanceof Error ? error.message : 'Failed to save'));
      }
    }, canvas.autoSaveInterval);
  }

  // Handle page visibility changes for immediate saving
  if (typeof window !== 'undefined') {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is being hidden, save immediately
        const currentState = store.getState();
        const { canvas, auth } = currentState;
        
        if (canvas.activeStageId && auth?.user?.id) {
          const canvasState = canvas.canvasStates[canvas.activeStageId];
          
          if (canvasState?.isDirty) {
            // Cancel auto-save timeout and save immediately
            if (autoSaveTimeouts[canvas.activeStageId]) {
              clearTimeout(autoSaveTimeouts[canvas.activeStageId]);
            }
            
            // Prepare save data for keepalive request
            const saveData = {
              userId: auth.user.id,
              missionId: currentState.mission?.databaseMission?.id || 'default',
              stageId: canvas.activeStageId,
              canvasState: {
                nodes: canvasState.nodes,
                edges: canvasState.edges,
                viewport: canvasState.viewport,
                timestamp: new Date().toISOString(),
              },
            };
            
            // Use fetch with keepalive for better reliability on page unload
            fetch(`${process.env.REACT_APP_API_URL}/canvas/save`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`,
              },
              body: JSON.stringify(saveData),
              keepalive: true,
            }).catch(console.error);
          }
        }
      }
    };

    // Add visibility change listener only once
    if (!window.__canvasVisibilityListenerAdded) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.__canvasVisibilityListenerAdded = true;
    }
  }

  return result;
};

// Cleanup function for auto-save timeouts
export const cleanupCanvasMiddleware = () => {
  Object.values(autoSaveTimeouts).forEach(timeout => clearTimeout(timeout));
  autoSaveTimeouts = {};
  
  if (typeof window !== 'undefined') {
    window.__canvasVisibilityListenerAdded = false;
  }
};

// Helper function to manually trigger save
export const triggerCanvasSave = (stageId: string) => {
  return async (dispatch: any, getState: () => RootState) => {
    const state = getState();
    const { canvas, auth } = state;
    
    if (!auth?.user?.id || !canvas.canvasStates[stageId]) {
      throw new Error('Cannot save: missing user or canvas state');
    }

    const canvasState = canvas.canvasStates[stageId];
    
    try {
      dispatch(setSavingStatus('saving'));
      
      const saveAction = canvasApi.endpoints.saveCanvasState.initiate({
        userId: auth.user.id,
        missionId: state.mission?.databaseMission?.id || 'default',
        stageId,
        canvasState: {
          nodes: canvasState.nodes,
          edges: canvasState.edges,
          viewport: canvasState.viewport,
          timestamp: new Date().toISOString(),
        },
      });

      await dispatch(saveAction).unwrap();
      dispatch(markCanvasSaved(stageId));
      return true;
    } catch (error) {
      dispatch(setSavingStatus('error'));
      dispatch(setSaveError(error instanceof Error ? error.message : 'Failed to save'));
      throw error;
    }
  };
}; 