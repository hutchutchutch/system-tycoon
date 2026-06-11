// Project Feature Exports
export { default as projectReducer } from './projectSlice';

export {
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
  incrementCompletedProjects,
  incrementFailedProjects,
  resetProjectState,
  
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
  selectCompletedProjectsList,
  selectProjectsByStatus,
  selectCriticalEvents,
  selectRecentEvents,
} from './projectSlice';
