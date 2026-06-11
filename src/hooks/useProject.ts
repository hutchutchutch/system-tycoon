import { useEffect, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  // Selectors
  selectProjects,
  selectProjectsLoading,
  selectProjectsError,
  selectActiveProjectId,
  selectActiveProject,
  selectProjectById,
  selectMetrics,
  selectProjectMetrics,
  selectEvents,
  selectUnacknowledgedEvents,
  selectDiscoveryContext,
  selectTotalRevenue,
  selectCompletedProjects,
  selectFailedProjects,
  selectIsSimulating,
  selectSimulationSpeed,
  selectProjectsList,
  selectActiveProjects,
  selectCriticalEvents,
  selectRecentEvents,
  
  // Actions
  setActiveProject,
  setDiscoveryContext,
  updateProject,
  updateMetrics,
  addEvent,
  markEventAcknowledged,
  clearEvents,
  setDesignState,
  setIsSimulating,
  setSimulationSpeed,
  
  // Async Thunks
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProjectStatus,
  saveDesignState,
  deployProject,
  completeProject,
  abandonProject,
  acknowledgeEvent,
} from '../features/project/projectSlice';
import { projectService } from '../services/projectService';
import type {
  ActiveProject,
  ProjectStatus,
  ProjectMetrics,
  ProjectEvent,
  MissionDiscoveryContext,
} from '../types/social';

// =============================================
// Main useProject Hook
// Provides access to all project state and actions
// =============================================
export function useProject() {
  const dispatch = useAppDispatch();
  
  // State selectors
  const projects = useAppSelector(selectProjectsList);
  const projectsMap = useAppSelector(selectProjects);
  const isLoading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);
  const activeProjectId = useAppSelector(selectActiveProjectId);
  const activeProject = useAppSelector(selectActiveProject);
  const allMetrics = useAppSelector(selectMetrics);
  const events = useAppSelector(selectEvents);
  const unacknowledgedEvents = useAppSelector(selectUnacknowledgedEvents);
  const discoveryContext = useAppSelector(selectDiscoveryContext);
  const totalRevenue = useAppSelector(selectTotalRevenue);
  const completedCount = useAppSelector(selectCompletedProjects);
  const failedCount = useAppSelector(selectFailedProjects);
  const isSimulating = useAppSelector(selectIsSimulating);
  const simulationSpeed = useAppSelector(selectSimulationSpeed);
  const activeProjects = useAppSelector(selectActiveProjects);
  const criticalEvents = useAppSelector(selectCriticalEvents);
  const recentEvents = useAppSelector(selectRecentEvents);
  
  // Actions
  const loadProjects = useCallback(() => {
    return dispatch(fetchProjects());
  }, [dispatch]);
  
  const loadProject = useCallback((projectId: string) => {
    return dispatch(fetchProjectById(projectId));
  }, [dispatch]);
  
  const selectProject = useCallback((projectId: string | null) => {
    dispatch(setActiveProject(projectId));
  }, [dispatch]);
  
  const startProject = useCallback(
    (missionId: string, npcId: string, conversationId: string) => {
      return dispatch(createProject({ missionId, npcId, conversationId }));
    },
    [dispatch]
  );
  
  const changeStatus = useCallback(
    (projectId: string, status: ProjectStatus) => {
      return dispatch(updateProjectStatus({ projectId, status }));
    },
    [dispatch]
  );
  
  const saveDesign = useCallback(
    (projectId: string, nodes: any[], edges: any[]) => {
      return dispatch(saveDesignState({ projectId, nodes, edges }));
    },
    [dispatch]
  );
  
  const updateDesignLocally = useCallback(
    (projectId: string, nodes: any[], edges: any[]) => {
      dispatch(setDesignState({ projectId, nodes, edges }));
    },
    [dispatch]
  );
  
  const deploy = useCallback(
    (projectId: string) => {
      return dispatch(deployProject(projectId));
    },
    [dispatch]
  );
  
  const complete = useCallback(
    (projectId: string) => {
      return dispatch(completeProject(projectId));
    },
    [dispatch]
  );
  
  const abandon = useCallback(
    (projectId: string) => {
      return dispatch(abandonProject(projectId));
    },
    [dispatch]
  );
  
  const ackEvent = useCallback(
    (eventId: string) => {
      return dispatch(acknowledgeEvent(eventId));
    },
    [dispatch]
  );
  
  const ackEventLocally = useCallback(
    (eventId: string) => {
      dispatch(markEventAcknowledged(eventId));
    },
    [dispatch]
  );
  
  const clearAllEvents = useCallback(() => {
    dispatch(clearEvents());
  }, [dispatch]);
  
  const setContext = useCallback(
    (context: MissionDiscoveryContext | null) => {
      dispatch(setDiscoveryContext(context));
    },
    [dispatch]
  );
  
  const setSimulating = useCallback(
    (simulating: boolean) => {
      dispatch(setIsSimulating(simulating));
    },
    [dispatch]
  );
  
  const setSpeed = useCallback(
    (speed: number) => {
      dispatch(setSimulationSpeed(speed));
    },
    [dispatch]
  );
  
  // Get project by ID helper
  const getProject = useCallback(
    (projectId: string) => projectsMap[projectId],
    [projectsMap]
  );
  
  // Get metrics for a project
  const getMetrics = useCallback(
    (projectId: string) => allMetrics[projectId],
    [allMetrics]
  );
  
  return {
    // State
    projects,
    projectsMap,
    isLoading,
    error,
    activeProjectId,
    activeProject,
    allMetrics,
    events,
    unacknowledgedEvents,
    discoveryContext,
    totalRevenue,
    completedCount,
    failedCount,
    isSimulating,
    simulationSpeed,
    activeProjects,
    criticalEvents,
    recentEvents,
    
    // Actions
    loadProjects,
    loadProject,
    selectProject,
    startProject,
    changeStatus,
    saveDesign,
    updateDesignLocally,
    deploy,
    complete,
    abandon,
    ackEvent,
    ackEventLocally,
    clearAllEvents,
    setContext,
    setSimulating,
    setSpeed,
    
    // Helpers
    getProject,
    getMetrics,
  };
}

// =============================================
// useProjectRealtime Hook
// Sets up realtime subscriptions for a specific project
// =============================================
export function useProjectRealtime(projectId: string | null) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (!projectId) return;
    
    // Subscribe to project updates
    const unsubscribe = projectService.subscribeToProject(projectId, {
      onProjectUpdate: (project) => {
        dispatch(updateProject(project));
      },
      onMetricsUpdate: (metrics) => {
        dispatch(updateMetrics(metrics));
      },
      onNewEvent: (event) => {
        dispatch(addEvent(event));
      },
    });
    
    return () => {
      unsubscribe();
    };
  }, [projectId, dispatch]);
}

// =============================================
// useActiveProjectRealtime Hook
// Auto-subscribes to the currently active project
// =============================================
export function useActiveProjectRealtime() {
  const activeProjectId = useAppSelector(selectActiveProjectId);
  useProjectRealtime(activeProjectId);
}

// =============================================
// useProjectMetrics Hook
// Returns metrics for a specific project with auto-refresh
// =============================================
export function useProjectMetrics(projectId: string | null) {
  const metrics = useAppSelector(
    projectId ? selectProjectMetrics(projectId) : () => null
  );
  
  // Realtime subscription is handled by useProjectRealtime
  // This hook just provides convenient access to metrics
  
  const formattedMetrics = useMemo(() => {
    if (!metrics) return null;
    
    return {
      ...metrics,
      // Formatted values for display
      errorRatePercent: (metrics.error_rate * 100).toFixed(2) + '%',
      uptimePercent: metrics.uptime_percentage.toFixed(2) + '%',
      latencyFormatted: metrics.latency_p99 + 'ms',
      revenueFormatted: '$' + metrics.revenue_earned.toLocaleString(),
      rpsFormatted: metrics.current_rps.toLocaleString() + ' RPS',
      
      // Status indicators
      isHealthy: metrics.error_rate < 0.01 && metrics.uptime_percentage > 99,
      isWarning: metrics.error_rate >= 0.01 && metrics.error_rate < 0.05,
      isCritical: metrics.error_rate >= 0.05 || metrics.uptime_percentage < 95,
    };
  }, [metrics]);
  
  return formattedMetrics;
}

// =============================================
// useProjectEvents Hook
// Returns and manages events for a specific project
// =============================================
export function useProjectEvents(projectId?: string) {
  const dispatch = useAppDispatch();
  const allEvents = useAppSelector(selectEvents);
  const unacknowledgedCount = useAppSelector(selectUnacknowledgedEvents);
  
  // Filter events for specific project if provided
  const events = useMemo(() => {
    if (!projectId) return allEvents;
    return allEvents.filter(e => e.project_id === projectId);
  }, [allEvents, projectId]);
  
  const acknowledge = useCallback(
    (eventId: string) => {
      dispatch(acknowledgeEvent(eventId));
    },
    [dispatch]
  );
  
  const acknowledgeAll = useCallback(async () => {
    if (projectId) {
      await projectService.acknowledgeAllEvents(projectId);
      // Events will be updated via realtime subscription
    }
  }, [projectId]);
  
  // Group events by severity
  const groupedEvents = useMemo(() => ({
    critical: events.filter(e => e.severity === 'critical'),
    warning: events.filter(e => e.severity === 'warning'),
    info: events.filter(e => e.severity === 'info'),
    success: events.filter(e => e.severity === 'success'),
  }), [events]);
  
  return {
    events,
    unacknowledgedCount,
    groupedEvents,
    acknowledge,
    acknowledgeAll,
  };
}

// =============================================
// useProjectDiscovery Hook
// Handles the flow from feed post to project creation
// =============================================
export function useProjectDiscovery() {
  const dispatch = useAppDispatch();
  const discoveryContext = useAppSelector(selectDiscoveryContext);
  
  const startDiscovery = useCallback(
    (context: MissionDiscoveryContext) => {
      dispatch(setDiscoveryContext(context));
    },
    [dispatch]
  );
  
  const clearDiscovery = useCallback(() => {
    dispatch(setDiscoveryContext(null));
  }, [dispatch]);
  
  const createFromDiscovery = useCallback(
    async (conversationId: string) => {
      if (!discoveryContext?.mission_id || !discoveryContext?.npc_id) {
        throw new Error('Discovery context is incomplete');
      }
      
      const result = await dispatch(
        createProject({
          missionId: discoveryContext.mission_id,
          npcId: discoveryContext.npc_id,
          conversationId,
        })
      ).unwrap();
      
      // Clear context after successful creation
      dispatch(setDiscoveryContext(null));
      
      return result;
    },
    [dispatch, discoveryContext]
  );
  
  return {
    discoveryContext,
    hasActiveDiscovery: !!discoveryContext,
    startDiscovery,
    clearDiscovery,
    createFromDiscovery,
  };
}

// =============================================
// useSimulation Hook
// Controls the project simulation state
// =============================================
export function useSimulation() {
  const dispatch = useAppDispatch();
  const isSimulating = useAppSelector(selectIsSimulating);
  const speed = useAppSelector(selectSimulationSpeed);
  const activeProject = useAppSelector(selectActiveProject);
  
  const start = useCallback(() => {
    dispatch(setIsSimulating(true));
  }, [dispatch]);
  
  const pause = useCallback(() => {
    dispatch(setIsSimulating(false));
  }, [dispatch]);
  
  const toggle = useCallback(() => {
    dispatch(setIsSimulating(!isSimulating));
  }, [dispatch, isSimulating]);
  
  const setSpeed = useCallback(
    (newSpeed: number) => {
      dispatch(setSimulationSpeed(newSpeed));
    },
    [dispatch]
  );
  
  const cycleSpeed = useCallback(() => {
    const speeds = [1, 2, 5];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    dispatch(setSimulationSpeed(speeds[nextIndex]));
  }, [dispatch, speed]);
  
  return {
    isSimulating,
    speed,
    canSimulate: activeProject?.status === 'deployed',
    start,
    pause,
    toggle,
    setSpeed,
    cycleSpeed,
  };
}

// =============================================
// useProjectStats Hook
// Returns aggregated project statistics
// =============================================
export function useProjectStats() {
  const totalRevenue = useAppSelector(selectTotalRevenue);
  const completedCount = useAppSelector(selectCompletedProjects);
  const failedCount = useAppSelector(selectFailedProjects);
  const activeProjects = useAppSelector(selectActiveProjects);
  const projects = useAppSelector(selectProjectsList);
  
  return useMemo(() => {
    const totalProjects = projects.length;
    const activeCount = activeProjects.length;
    const successRate = totalProjects > 0 
      ? ((completedCount / (completedCount + failedCount)) * 100).toFixed(1)
      : '0';
    
    return {
      totalRevenue,
      totalRevenueFormatted: '$' + totalRevenue.toLocaleString(),
      completedCount,
      failedCount,
      activeCount,
      totalProjects,
      successRate: successRate + '%',
    };
  }, [totalRevenue, completedCount, failedCount, activeProjects, projects]);
}

export default useProject;
