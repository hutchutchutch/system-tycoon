// Debug version of CrisisSystemDesignCanvas with enhanced logging
// This file helps diagnose canvas population issues

export const debugLog = (context: string, data: any) => {
  const timestamp = new Date().toISOString();
  console.log(`🔍 [${timestamp}] [CrisisCanvas] ${context}:`, data);
};

export const CANVAS_DEBUG = {
  // Email ID tracking
  logEmailNavigation: (emailId: string) => {
    debugLog('EMAIL_NAVIGATION', { 
      emailId, 
      url: window.location.href,
      timestamp: Date.now() 
    });
  },

  // Mission stage loading
  logMissionStageLoad: (emailId: string, stageData: any, error?: any) => {
    debugLog('MISSION_STAGE_LOAD', {
      emailId,
      success: !!stageData && !error,
      stageId: stageData?.id,
      stageTitle: stageData?.title,
      missionId: stageData?.mission?.id,
      missionTitle: stageData?.mission?.title,
      error: error?.message
    });
  },

  // Canvas initialization
  logCanvasInit: (stageId: string, reason: string, skipped: boolean = false) => {
    debugLog('CANVAS_INIT', {
      stageId,
      reason,
      skipped,
      existingNodes: false, // Will be updated
      savedStateAvailable: false // Will be updated
    });
  },

  // Initial system state loading
  logInitialSystemLoad: (stageId: string, nodeCount: number, edgeCount: number) => {
    debugLog('INITIAL_SYSTEM_LOAD', {
      stageId,
      nodeCount,
      edgeCount,
      timestamp: Date.now()
    });
  },

  // Canvas state persistence
  logCanvasSave: (stageId: string, nodeCount: number, edgeCount: number, success: boolean) => {
    debugLog('CANVAS_SAVE', {
      stageId,
      nodeCount,
      edgeCount,
      success,
      timestamp: Date.now()
    });
  },

  // Contamination detection
  logContamination: (detected: boolean, details?: any) => {
    debugLog('CONTAMINATION_CHECK', {
      detected,
      details,
      action: detected ? 'CLEARING_STATE' : 'NONE'
    });
  },

  // Redux state changes
  logReduxState: (action: string, state: any) => {
    debugLog('REDUX_STATE', {
      action,
      nodeCount: state.nodes?.length || 0,
      edgeCount: state.edges?.length || 0,
      requirements: state.requirements?.length || 0
    });
  },

  // Complete flow trace
  traceEmailToCanvas: (emailId: string) => {
    const trace = {
      emailId,
      startTime: Date.now(),
      steps: [] as any[]
    };

    // Store in session storage for debugging
    sessionStorage.setItem('canvas_debug_trace', JSON.stringify(trace));
    
    return {
      addStep: (step: string, data: any) => {
        trace.steps.push({
          step,
          data,
          timestamp: Date.now() - trace.startTime
        });
        sessionStorage.setItem('canvas_debug_trace', JSON.stringify(trace));
      },
      complete: () => {
        debugLog('COMPLETE_TRACE', trace);
      }
    };
  }
};

// Export debug flags that can be toggled
export const DEBUG_FLAGS = {
  SKIP_CONTAMINATION_CHECK: false,
  FORCE_INITIAL_LOAD: false,
  LOG_ALL_STATE_CHANGES: true,
  DISABLE_AUTO_SAVE: false
};