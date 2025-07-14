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
} from '../../types';
import { supabase } from '../../services/supabase';

interface GameSliceState extends GameState {
  scenarios: Scenario[];
  components: Component[];
  progress: ScenarioProgress[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GameSliceState = {
  currentScreen: 'landing',
  scenarios: [],
  components: [],
  progress: [],
  isLoading: false,
  error: null,
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
  resetGameState,
} = gameSlice.actions;

export default gameSlice.reducer;