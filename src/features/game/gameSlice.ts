import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  GameState, 
  Scenario, 
  Component, 
  ScenarioProgress, 
  Mentor,
  Requirement,
  ArchitectureSnapshot,
  PerformanceMetrics,
  ComponentState,
  SimulationPhase,
  ComponentSelection,
  ComponentRequirement,
  InitialNode,
  CollaborationSettings,
} from '../../types';
import { supabase } from '../../services/supabase';

interface GameSliceState extends GameState {
  scenarios: Scenario[];
  components: Component[];
  progress: ScenarioProgress[];
  isLoading: boolean;
  error: string | null;
  // Add camera viewport state for Phaser scene tracking
  careerMapViewport: {
    scrollX: number;
    scrollY: number;
    zoom: number;
    worldWidth: number;
    worldHeight: number;
    viewportWidth: number;
    viewportHeight: number;
  };
  careerMapData: {
    scenarios: any[];
    progress: any[];
    lastUpdate: number;
  };
  // Component Selection State
  selectedComponent: ComponentSelection | null;
}

const initialState: GameSliceState = {
  currentScreen: 'landing',
  scenarios: [],
  components: [],
  progress: [],
  isLoading: false,
  error: null,
  careerMapViewport: {
    scrollX: 0,
    scrollY: 0,
    zoom: 1,
    worldWidth: 2000,
    worldHeight: 1500,
    viewportWidth: 800,
    viewportHeight: 600,
  },
  careerMapData: {
    scenarios: [],
    progress: [],
    lastUpdate: 0,
  },
  selectedComponent: null,
};

// Async thunks
export const fetchScenarios = createAsyncThunk(
  'game/fetchScenarios',
  async () => {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .order('level', { ascending: true });
    
    if (error) throw error;
    return data;
  }
);

export const fetchComponents = createAsyncThunk(
  'game/fetchComponents',
  async () => {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('min_level', { ascending: true });
    
    if (error) throw error;
    return data;
  }
);

export const fetchUserProgress = createAsyncThunk(
  'game/fetchUserProgress',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('scenario_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
);

export const startScenario = createAsyncThunk(
  'game/startScenario',
  async (scenarioId: string) => {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const submitDesign = createAsyncThunk(
  'game/submitDesign',
  async ({ 
    scenarioId, 
    architecture, 
    questionsAsked,
    mentorId,
    componentsUsed,
    totalCost,
  }: {
    scenarioId: string;
    architecture: ArchitectureSnapshot;
    questionsAsked: string[];
    mentorId?: string;
    componentsUsed: string[];
    totalCost: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Create scenario attempt
    const { data, error } = await supabase
      .from('scenario_attempts')
      .insert({
        user_id: user.id,
        scenario_id: scenarioId,
        architecture_snapshot: architecture,
        questions_asked: questionsAsked,
        mentor_selected: mentorId,
        components_used: componentsUsed,
        total_cost: totalCost,
        performance_metrics: {}, // Will be updated during simulation
        final_score: 0, // Will be calculated after simulation
        requirements_met: [],
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

// Helper function to get component-specific data
const getComponentData = (componentType: string) => {
  const componentConfigs: Record<string, {
    requirements: ComponentRequirement[];
    initialNodes: InitialNode[];
    collaborationSettings: CollaborationSettings;
  }> = {
    api: {
      requirements: [
        {
          id: 'api-latency',
          type: 'performance',
          description: 'API response time should be under 200ms',
          target: 200,
          unit: 'ms',
          priority: 'critical',
        },
        {
          id: 'api-throughput',
          type: 'scalability',
          description: 'Handle at least 1000 requests per second',
          target: 1000,
          unit: 'req/s',
          priority: 'high',
        },
        {
          id: 'api-security',
          type: 'security',
          description: 'Implement authentication and rate limiting',
          target: 100,
          unit: '%',
          priority: 'critical',
        },
      ],
      initialNodes: [
        {
          id: 'api-gateway',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'API Gateway',
            componentType: 'api-gateway',
            cost: 25,
            capacity: 5000,
            description: 'Manage API requests',
            category: 'networking',
          },
          style: { background: '#4f46e5', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 4,
        allowedRoles: ['architect', 'engineer'],
        consensusRequired: true,
        timeLimit: 1800, // 30 minutes
        allowRealTimeEditing: true,
      },
    },
    cache: {
      requirements: [
        {
          id: 'cache-hit-rate',
          type: 'performance',
          description: 'Achieve 90% cache hit rate',
          target: 90,
          unit: '%',
          priority: 'high',
        },
        {
          id: 'cache-capacity',
          type: 'scalability',
          description: 'Handle 10GB of cached data',
          target: 10,
          unit: 'GB',
          priority: 'medium',
        },
      ],
      initialNodes: [
        {
          id: 'redis-cache',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Redis Cache',
            componentType: 'cache',
            cost: 30,
            capacity: 10000,
            description: 'Speed up data access',
            category: 'storage',
          },
          style: { background: '#dc2626', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 3,
        allowedRoles: ['architect', 'engineer'],
        consensusRequired: false,
        timeLimit: 1200, // 20 minutes
        allowRealTimeEditing: true,
      },
    },
    compute: {
      requirements: [
        {
          id: 'compute-utilization',
          type: 'performance',
          description: 'Maintain CPU utilization under 80%',
          target: 80,
          unit: '%',
          priority: 'high',
        },
        {
          id: 'compute-auto-scaling',
          type: 'scalability',
          description: 'Auto-scale based on demand',
          target: 100,
          unit: '%',
          priority: 'critical',
        },
      ],
      initialNodes: [
        {
          id: 'compute-instance',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Compute Instance',
            componentType: 'compute',
            cost: 80,
            capacity: 800,
            description: 'General computation',
            category: 'compute',
          },
          style: { background: '#059669', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 4,
        allowedRoles: ['architect', 'engineer', 'reviewer'],
        consensusRequired: true,
        timeLimit: 2400, // 40 minutes
        allowRealTimeEditing: true,
      },
    },
    database: {
      requirements: [
        {
          id: 'db-availability',
          type: 'reliability',
          description: 'Maintain 99.9% uptime',
          target: 99.9,
          unit: '%',
          priority: 'critical',
        },
        {
          id: 'db-backup',
          type: 'reliability',
          description: 'Automated backups every 6 hours',
          target: 6,
          unit: 'hours',
          priority: 'high',
        },
      ],
      initialNodes: [
        {
          id: 'primary-database',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Primary Database',
            componentType: 'database',
            cost: 100,
            capacity: 500,
            description: 'Store and retrieve data',
            category: 'storage',
          },
          style: { background: '#dc2626', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 3,
        allowedRoles: ['architect', 'engineer'],
        consensusRequired: true,
        timeLimit: 2100, // 35 minutes
        allowRealTimeEditing: false, // More careful editing for databases
      },
    },
    load_balancer: {
      requirements: [
        {
          id: 'lb-distribution',
          type: 'performance',
          description: 'Evenly distribute traffic across instances',
          target: 95,
          unit: '%',
          priority: 'critical',
        },
        {
          id: 'lb-health-checks',
          type: 'reliability',
          description: 'Detect unhealthy instances within 30 seconds',
          target: 30,
          unit: 'seconds',
          priority: 'high',
        },
      ],
      initialNodes: [
        {
          id: 'application-lb',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Load Balancer',
            componentType: 'load_balancer',
            cost: 75,
            capacity: 2000,
            description: 'Distribute traffic',
            category: 'networking',
          },
          style: { background: '#4f46e5', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 3,
        allowedRoles: ['architect', 'engineer'],
        consensusRequired: false,
        timeLimit: 1500, // 25 minutes
        allowRealTimeEditing: true,
      },
    },
  };

  return componentConfigs[componentType] || componentConfigs.api; // fallback to api
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentScreen: (state, action: PayloadAction<GameState['currentScreen']>) => {
      state.currentScreen = action.payload;
    },
    setCurrentScenario: (state, action: PayloadAction<Scenario>) => {
      state.currentScenario = action.payload;
    },
    selectMentor: (state, action: PayloadAction<Mentor>) => {
      state.selectedMentor = action.payload;
    },
    updateMeetingPhase: (state, action: PayloadAction<Partial<GameState['meetingPhase']>>) => {
      state.meetingPhase = {
        ...state.meetingPhase,
        ...action.payload,
      } as GameState['meetingPhase'];
    },
    addRequirement: (state, action: PayloadAction<Requirement>) => {
      if (state.meetingPhase) {
        state.meetingPhase.currentRequirements.push(action.payload);
      }
    },
    askQuestion: (state, action: PayloadAction<string>) => {
      if (state.meetingPhase) {
        state.meetingPhase.questionsAsked.push(action.payload);
        state.meetingPhase.questionsRemaining -= 1;
      }
    },
    updateDesignPhase: (state, action: PayloadAction<Partial<GameState['designPhase']>>) => {
      state.designPhase = {
        ...state.designPhase,
        ...action.payload,
      } as GameState['designPhase'];
    },
    updateArchitecture: (state, action: PayloadAction<ArchitectureSnapshot>) => {
      if (state.designPhase) {
        state.designPhase.architecture = action.payload;
      }
    },
    updateSimulationPhase: (state, action: PayloadAction<Partial<GameState['simulationPhase']>>) => {
      state.simulationPhase = {
        ...state.simulationPhase,
        ...action.payload,
      } as GameState['simulationPhase'];
    },
    updateComponentState: (state, action: PayloadAction<{ id: string; state: ComponentState }>) => {
      if (state.simulationPhase) {
        state.simulationPhase.componentStates[action.payload.id] = action.payload.state;
      }
    },
    updatePerformanceMetrics: (state, action: PayloadAction<PerformanceMetrics>) => {
      if (state.simulationPhase) {
        state.simulationPhase.metrics = action.payload;
      }
    },
    setSimulationPhase: (state, action: PayloadAction<SimulationPhase>) => {
      if (state.simulationPhase) {
        state.simulationPhase.currentPhase = action.payload;
      }
    },
    updateCareerMapViewport: (state, action: PayloadAction<{
      scrollX: number;
      scrollY: number;
      zoom: number;
      worldWidth: number;
      worldHeight: number;
      viewportWidth: number;
      viewportHeight: number;
    }>) => {
      state.careerMapViewport = action.payload;
    },
    
    updateCareerMapData: (state, action: PayloadAction<{ scenarios: any[]; progress: any[] }>) => {
      state.careerMapData = {
        scenarios: action.payload.scenarios,
        progress: action.payload.progress,
        lastUpdate: Date.now(),
      };
    },
    
    // Component Selection Actions
    selectComponentForMode: (state, action: PayloadAction<{
      componentType: string;
      mode: 'mentor' | 'collaboration';
      scenarioId: string;
    }>) => {
      const { componentType, mode, scenarioId } = action.payload;
      
      // Define component-specific requirements and initial nodes
      const componentData = getComponentData(componentType);
      
      state.selectedComponent = {
        componentType,
        mode,
        scenarioId,
        requirements: componentData.requirements,
        initialNodes: componentData.initialNodes,
        collaborationSettings: mode === 'collaboration' ? componentData.collaborationSettings : undefined,
        selectedAt: Date.now(),
      };
    },
    
    clearComponentSelection: (state) => {
      state.selectedComponent = null;
    },
    
    updateCollaborationSettings: (state, action: PayloadAction<Partial<CollaborationSettings>>) => {
      if (state.selectedComponent && state.selectedComponent.mode === 'collaboration') {
        state.selectedComponent.collaborationSettings = {
          ...state.selectedComponent.collaborationSettings!,
          ...action.payload,
        };
      }
    },
    
    resetGameState: (state) => {
      state.currentScenario = undefined;
      state.meetingPhase = undefined;
      state.designPhase = undefined;
      state.simulationPhase = undefined;
      state.selectedMentor = undefined;
    },
  },
  extraReducers: (builder) => {
    // Fetch scenarios
    builder
      .addCase(fetchScenarios.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScenarios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scenarios = action.payload;
      })
      .addCase(fetchScenarios.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch scenarios';
      });
    
    // Fetch components
    builder
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.components = action.payload;
      });
    
    // Fetch user progress
    builder
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
      });
    
    // Start scenario
    builder
      .addCase(startScenario.fulfilled, (state, action) => {
        state.currentScenario = action.payload;
        state.currentScreen = 'meeting';
        state.meetingPhase = {
          questionsRemaining: 3,
          questionsAsked: [],
          currentRequirements: action.payload.base_requirements || [],
          budget: action.payload.budget_limit,
          timeline: action.payload.time_limit_seconds,
        };
      });
  },
});

export const {
  setCurrentScreen,
  setCurrentScenario,
  selectMentor,
  updateMeetingPhase,
  addRequirement,
  askQuestion,
  updateDesignPhase,
  updateArchitecture,
  updateSimulationPhase,
  updateComponentState,
  updatePerformanceMetrics,
  setSimulationPhase,
  updateCareerMapViewport,
  updateCareerMapData,
  selectComponentForMode,
  clearComponentSelection,
  updateCollaborationSettings,
  resetGameState,
} = gameSlice.actions;

// Selectors for camera viewport state
export const selectCareerMapViewport = (state: any) => state.game.careerMapViewport;

export const selectCareerMapData = (state: any) => state.game.careerMapData;

export const selectIsAssetOnLeftSide = (worldX: number) => (state: any) => {
  const viewport = state.game.careerMapViewport;
  const screenX = worldX - viewport.scrollX;
  const viewportCenterX = viewport.viewportWidth / 2;
  return screenX < viewportCenterX;
};

// Component Selection Selectors
export const selectSelectedComponent = (state: any) => state.game.selectedComponent;

export const selectIsCollaborationMode = (state: any) => 
  state.game.selectedComponent?.mode === 'collaboration';

export const selectComponentRequirements = (state: any) => 
  state.game.selectedComponent?.requirements || [];

export const selectComponentInitialNodes = (state: any) => 
  state.game.selectedComponent?.initialNodes || [];

export const selectCollaborationSettings = (state: any) => 
  state.game.selectedComponent?.collaborationSettings;

export const selectSelectedComponentType = (state: any) => 
  state.game.selectedComponent?.componentType;

export default gameSlice.reducer;