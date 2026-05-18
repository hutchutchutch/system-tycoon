import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  GameState,
  Scenario,
  Resource,
  ScenarioProgress,
  Mentor,
  Requirement,
  ArchitectureSnapshot,
  PerformanceMetrics,
  ResourceState,
  SimulationPhase,
  ResourceSelection,
} from '../../types';
import { api } from '../../services/cloudflareApi';

interface GameSliceState extends GameState {
  scenarios: Scenario[];
  components: Resource[];
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
  // Resource Selection State
  selectedComponent: ResourceSelection | null;
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
    return api.get<Scenario[]>('/game/scenarios');
  }
);

export const fetchComponents = createAsyncThunk(
  'game/fetchComponents',
  async () => {
    return api.get<Resource[]>('/game/components');
  }
);

export const fetchUserProgress = createAsyncThunk(
  'game/fetchUserProgress',
  async () => {
    return api.get<ScenarioProgress[]>('/game/progress');
  }
);

export const startScenario = createAsyncThunk(
  'game/startScenario',
  async (scenarioId: string) => {
    return api.get<Scenario>('/game/scenarios/' + scenarioId);
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
    return api.post('/game/attempts', {
      scenarioId,
      architecture,
      questionsAsked,
      mentorId,
      componentsUsed,
      totalCost,
    });
  }
);

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
    updateComponentState: (state, action: PayloadAction<{ id: string; state: ResourceState }>) => {
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

    // Resource Selection Actions
    selectComponentForMode: (state, action: PayloadAction<{
      resourceType: string;
      mode: 'mentor';
      scenarioId: string;
    }>) => {
      const { resourceType, mode, scenarioId } = action.payload;
      state.selectedComponent = {
        resourceType,
        mode,
        scenarioId,
        requirements: [],      // loaded by component from API
        initialNodes: [],       // loaded by component from API
        selectedAt: Date.now(),
      };
    },

    clearComponentSelection: (state) => {
      state.selectedComponent = null;
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
          currentRequirements: (action.payload as any).base_requirements || action.payload.baseRequirements || [],
          budget: (action.payload as any).budget_limit || action.payload.budgetLimit,
          timeline: (action.payload as any).time_limit_seconds || action.payload.timeLimitSeconds,
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

export const selectComponentRequirements = (state: any) =>
  state.game.selectedComponent?.requirements || [];

export const selectComponentInitialNodes = (state: any) =>
  state.game.selectedComponent?.initialNodes || [];

export const selectSelectedResourceType = (state: any) =>
  state.game.selectedComponent?.resourceType;

// Legacy alias
export const selectSelectedComponentType = selectSelectedResourceType;

// Typed selectors
export const selectGameState = (state: { game: GameSliceState }) => state.game;
export const selectScenarios = (state: { game: GameSliceState }) => state.game.scenarios;
export const selectResources = (state: { game: GameSliceState }) => state.game.components;
// Legacy alias
export const selectComponents = selectResources;
export const selectProgress = (state: { game: GameSliceState }) => state.game.progress;
export const selectCurrentScreen = (state: { game: GameSliceState }) => state.game.currentScreen;
export const selectCurrentScenario = (state: { game: GameSliceState }) => state.game.currentScenario;
export const selectGameError = (state: { game: GameSliceState }) => state.game.error;
export const selectGameLoading = (state: { game: GameSliceState }) => state.game.isLoading;

export default gameSlice.reducer;
