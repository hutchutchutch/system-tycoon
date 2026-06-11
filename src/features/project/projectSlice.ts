import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ActiveProject,
  ProjectStatus,
  ProjectMetrics,
  ProjectEvent,
  MissionDiscoveryContext,
} from '../../types/social';
import { projectService } from '../../services/projectService';

// =============================================
// State Interface
// =============================================
interface ProjectState {
  // Active projects (player's current projects)
  projects: Record<string, ActiveProject>;
  projectsLoading: boolean;
  projectsError: string | null;
  
  // Currently selected/focused project
  activeProjectId: string | null;
  
  // Project metrics (real-time simulation data)
  metrics: Record<string, ProjectMetrics>;
  
  // Project events (alerts, milestones, etc.)
  events: ProjectEvent[];
  unacknowledgedEvents: number;
  
  // Discovery context (how player found the project)
  discoveryContext: MissionDiscoveryContext | null;
  
  // Aggregated stats
  totalRevenue: number;
  completedProjects: number;
  failedProjects: number;
  
  // UI state
  isSimulating: boolean;
  simulationSpeed: number; // 1x, 2x, 5x
}

const initialState: ProjectState = {
  projects: {},
  projectsLoading: false,
  projectsError: null,
  
  activeProjectId: null,
  
  metrics: {},
  
  events: [],
  unacknowledgedEvents: 0,
  
  discoveryContext: null,
  
  totalRevenue: 0,
  completedProjects: 0,
  failedProjects: 0,
  
  isSimulating: false,
  simulationSpeed: 1,
};

// =============================================
// Async Thunks
// =============================================

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const projects = await projectService.getProjects();
      return projects;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'project/fetchProjectById',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const project = await projectService.getProjectById(projectId);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (
    { missionId, npcId, conversationId }: { missionId: string; npcId: string; conversationId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { project: ProjectState };
      const project = await projectService.createProject(missionId, npcId, conversationId);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create project');
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'project/updateProjectStatus',
  async ({ projectId, status }: { projectId: string; status: ProjectStatus }, { rejectWithValue }) => {
    try {
      await projectService.updateProjectStatus(projectId, status);
      return { projectId, status };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update project status');
    }
  }
);

export const saveDesignState = createAsyncThunk(
  'project/saveDesignState',
  async (
    { projectId, nodes, edges }: { projectId: string; nodes: any[]; edges: any[] },
    { rejectWithValue }
  ) => {
    try {
      await projectService.saveDesignState(projectId, nodes, edges);
      return { projectId, designState: { nodes, edges } };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save design');
    }
  }
);

export const deployProject = createAsyncThunk(
  'project/deployProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const result = await projectService.deployProject(projectId);
      return { projectId, ...result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to deploy project');
    }
  }
);

export const completeProject = createAsyncThunk(
  'project/completeProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const result = await projectService.completeProject(projectId);
      return { projectId, ...result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete project');
    }
  }
);

export const abandonProject = createAsyncThunk(
  'project/abandonProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      await projectService.abandonProject(projectId);
      return projectId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to abandon project');
    }
  }
);

export const acknowledgeEvent = createAsyncThunk(
  'project/acknowledgeEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      await projectService.acknowledgeEvent(eventId);
      return eventId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to acknowledge event');
    }
  }
);

// =============================================
// Slice
// =============================================
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // Set active project
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
    
    // Set discovery context (when player clicks on a feed post)
    setDiscoveryContext: (state, action: PayloadAction<MissionDiscoveryContext | null>) => {
      state.discoveryContext = action.payload;
    },
    
    // Update project in state
    updateProject: (state, action: PayloadAction<ActiveProject>) => {
      state.projects[action.payload.id] = action.payload;
    },
    
    // Update metrics (from realtime subscription)
    updateMetrics: (state, action: PayloadAction<ProjectMetrics>) => {
      const { project_id } = action.payload;
      const prevMetrics = state.metrics[project_id];
      state.metrics[project_id] = action.payload;
      
      // Track revenue delta
      if (prevMetrics) {
        state.totalRevenue += action.payload.revenue_delta || 0;
      }
    },
    
    // Add event (from realtime subscription)
    addEvent: (state, action: PayloadAction<ProjectEvent>) => {
      state.events.unshift(action.payload);
      if (!action.payload.acknowledged) {
        state.unacknowledgedEvents += 1;
      }
      // Keep last 100 events
      if (state.events.length > 100) {
        state.events.pop();
      }
    },
    
    // Mark event as acknowledged locally
    markEventAcknowledged: (state, action: PayloadAction<string>) => {
      const event = state.events.find(e => e.id === action.payload);
      if (event && !event.acknowledged) {
        event.acknowledged = true;
        state.unacknowledgedEvents = Math.max(0, state.unacknowledgedEvents - 1);
      }
    },
    
    // Clear all events
    clearEvents: (state) => {
      state.events = [];
      state.unacknowledgedEvents = 0;
    },
    
    // Update design state locally (before saving)
    setDesignState: (state, action: PayloadAction<{ projectId: string; nodes: any[]; edges: any[] }>) => {
      const project = state.projects[action.payload.projectId];
      if (project) {
        project.design_state = {
          nodes: action.payload.nodes,
          edges: action.payload.edges,
        };
      }
    },
    
    // Simulation controls
    setIsSimulating: (state, action: PayloadAction<boolean>) => {
      state.isSimulating = action.payload;
    },
    
    setSimulationSpeed: (state, action: PayloadAction<number>) => {
      state.simulationSpeed = action.payload;
    },
    
    // Increment stats
    incrementCompletedProjects: (state) => {
      state.completedProjects += 1;
    },
    
    incrementFailedProjects: (state) => {
      state.failedProjects += 1;
    },
    
    // Reset state
    resetProjectState: () => initialState,
  },
  
  extraReducers: (builder) => {
    // Fetch Projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.projectsLoading = true;
        state.projectsError = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projectsLoading = false;
        action.payload.forEach(project => {
          state.projects[project.id] = project;
        });
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.projectsLoading = false;
        state.projectsError = action.payload as string;
      });
    
    // Fetch Project by ID
    builder
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        if (action.payload) {
          state.projects[action.payload.id] = action.payload;
        }
      });
    
    // Create Project
    builder
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects[action.payload.id] = action.payload;
        state.activeProjectId = action.payload.id;
        state.discoveryContext = null; // Clear context after project created
      });
    
    // Update Project Status
    builder
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        const { projectId, status } = action.payload;
        const project = state.projects[projectId];
        if (project) {
          project.status = status;
          
          // Update stats based on status
          if (status === 'completed') {
            state.completedProjects += 1;
            project.completed_at = new Date().toISOString();
          } else if (status === 'failed') {
            state.failedProjects += 1;
          }
        }
      });
    
    // Save Design State
    builder
      .addCase(saveDesignState.fulfilled, (state, action) => {
        const { projectId, designState } = action.payload;
        const project = state.projects[projectId];
        if (project) {
          project.design_state = designState;
        }
      });
    
    // Deploy Project
    builder
      .addCase(deployProject.fulfilled, (state, action) => {
        const { projectId } = action.payload;
        const project = state.projects[projectId];
        if (project) {
          project.status = 'deployed';
        }
        state.isSimulating = true;
      });
    
    // Complete Project
    builder
      .addCase(completeProject.fulfilled, (state, action) => {
        const { projectId, score, revenue } = action.payload;
        const project = state.projects[projectId];
        if (project) {
          project.status = 'completed';
          project.score = score;
          project.revenue_earned = revenue;
          project.completed_at = new Date().toISOString();
        }
        state.completedProjects += 1;
        state.totalRevenue += revenue;
        state.isSimulating = false;
      });
    
    // Abandon Project
    builder
      .addCase(abandonProject.fulfilled, (state, action) => {
        const projectId = action.payload;
        const project = state.projects[projectId];
        if (project) {
          project.status = 'abandoned';
        }
        if (state.activeProjectId === projectId) {
          state.activeProjectId = null;
        }
        state.isSimulating = false;
      });
    
    // Acknowledge Event
    builder
      .addCase(acknowledgeEvent.fulfilled, (state, action) => {
        const eventId = action.payload;
        const event = state.events.find(e => e.id === eventId);
        if (event && !event.acknowledged) {
          event.acknowledged = true;
          state.unacknowledgedEvents = Math.max(0, state.unacknowledgedEvents - 1);
        }
      });
  },
});

export const {
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
} = projectSlice.actions;

export default projectSlice.reducer;

// =============================================
// Selectors
// =============================================
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export const selectProjects = (state: RootState) => state.project.projects;
export const selectProjectsLoading = (state: RootState) => state.project.projectsLoading;
export const selectProjectsError = (state: RootState) => state.project.projectsError;

export const selectActiveProjectId = (state: RootState) => state.project.activeProjectId;
export const selectActiveProject = (state: RootState) => {
  const id = state.project.activeProjectId;
  return id ? state.project.projects[id] : null;
};

export const selectProjectById = (projectId: string) => (state: RootState) => 
  state.project.projects[projectId];

export const selectMetrics = (state: RootState) => state.project.metrics;
export const selectProjectMetrics = (projectId: string) => (state: RootState) => 
  state.project.metrics[projectId];

export const selectEvents = (state: RootState) => state.project.events;
export const selectUnacknowledgedEvents = (state: RootState) => state.project.unacknowledgedEvents;

export const selectDiscoveryContext = (state: RootState) => state.project.discoveryContext;

export const selectTotalRevenue = (state: RootState) => state.project.totalRevenue;
export const selectCompletedProjects = (state: RootState) => state.project.completedProjects;
export const selectFailedProjects = (state: RootState) => state.project.failedProjects;

export const selectIsSimulating = (state: RootState) => state.project.isSimulating;
export const selectSimulationSpeed = (state: RootState) => state.project.simulationSpeed;

// Derived selectors
export const selectProjectsList = createSelector(
  selectProjects,
  (projects) => Object.values(projects)
);

export const selectActiveProjects = createSelector(
  selectProjectsList,
  (projects) => projects.filter(p => 
    ['designing', 'simulating', 'deployed'].includes(p.status)
  )
);

export const selectCompletedProjectsList = createSelector(
  selectProjectsList,
  (projects) => projects.filter(p => p.status === 'completed')
);

export const selectProjectsByStatus = (status: ProjectStatus) => createSelector(
  selectProjectsList,
  (projects) => projects.filter(p => p.status === status)
);

export const selectCriticalEvents = createSelector(
  selectEvents,
  (events) => events.filter(e => e.severity === 'critical' && !e.acknowledged)
);

export const selectRecentEvents = createSelector(
  selectEvents,
  (events) => events.slice(0, 10)
);
