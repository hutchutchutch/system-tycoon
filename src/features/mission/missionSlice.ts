import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MissionStep {
  id: string;
  title: string;
  description: string;
  objective: string;
  completed: boolean;
  unlocksComponents?: string[];
  metrics?: {
    reportsSaved: number;
    dataLost: number;
    systemHealth: 'critical' | 'degraded' | 'healthy';
  };
}

// Database mission stage interface
export interface DatabaseMissionStage {
  id: string;
  stage_number: number;
  title: string;
  problem_description: string;
  completed?: boolean;
}

// Keep the old Mission interface exported for any external references,
// but it is no longer used as the primary model.
export interface Mission {
  id: string;
  title: string;
  description: string;
  steps: MissionStep[];
  currentStepIndex: number;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

// DatabaseMission is the primary mission model (comes from the API)
export interface DatabaseMission {
  id: string;
  title: string;
  description: string;
  slug: string;
  stages: DatabaseMissionStage[];
  currentStageIndex: number;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

interface MissionState {
  currentMission: DatabaseMission | null;
  completedMissions: string[];
  unlockedResources: string[];
  crisisMetrics: {
    totalReportsSaved: number;
    totalDataLost: number;
    familiesHelped: number;
    systemUptime: number;
  };
  timerTestTriggered: boolean;
}

const initialState: MissionState = {
  currentMission: null,
  completedMissions: [],
  unlockedResources: ['web_server', 'database'], // Start with basic components
  crisisMetrics: {
    totalReportsSaved: 0,
    totalDataLost: 0,
    familiesHelped: 0,
    systemUptime: 42,
  },
  timerTestTriggered: false,
};

const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    setCurrentMission: (state, action: PayloadAction<{
      id: string;
      title: string;
      description: string;
      slug: string;
      stages: DatabaseMissionStage[];
      currentStageIndex?: number;
    }>) => {
      const { id, title, description, slug, stages, currentStageIndex = 0 } = action.payload;
      state.currentMission = {
        id,
        title,
        description,
        slug,
        stages: stages.map(stage => ({
          ...stage,
          completed: stage.completed ?? stage.stage_number < currentStageIndex + 1
        })),
        currentStageIndex,
        completed: false,
        startedAt: new Date().toISOString(),
      };
    },

    // Complete a mission stage by id
    completeStage: (state, action: PayloadAction<string>) => {
      if (!state.currentMission) return;

      const stageIndex = state.currentMission.stages.findIndex(
        (stage) => stage.id === action.payload
      );

      if (stageIndex !== -1) {
        state.currentMission.stages[stageIndex].completed = true;

        // Move to next stage
        if (stageIndex === state.currentMission.currentStageIndex) {
          state.currentMission.currentStageIndex++;
        }

        // Check if mission is complete
        if (state.currentMission.stages.every((stage) => stage.completed)) {
          state.currentMission.completed = true;
          state.currentMission.completedAt = new Date().toISOString();
          state.completedMissions.push(state.currentMission.id);
        }
      }
    },

    completeStep: (state, action: PayloadAction<string>) => {
      // completeStep now delegates to the same logic as completeStage
      // since the old Mission model with steps has been removed.
      // This keeps the action available for any code that still dispatches it.
      if (!state.currentMission) return;

      const stageIndex = state.currentMission.stages.findIndex(
        (stage) => stage.id === action.payload
      );

      if (stageIndex !== -1) {
        state.currentMission.stages[stageIndex].completed = true;

        if (stageIndex === state.currentMission.currentStageIndex) {
          state.currentMission.currentStageIndex++;
        }

        if (state.currentMission.stages.every((stage) => stage.completed)) {
          state.currentMission.completed = true;
          state.currentMission.completedAt = new Date().toISOString();
          state.completedMissions.push(state.currentMission.id);
        }
      }
    },

    updateMetrics: (state, action: PayloadAction<Partial<typeof initialState.crisisMetrics>>) => {
      state.crisisMetrics = {
        ...state.crisisMetrics,
        ...action.payload,
      };
    },

    unlockComponent: (state, action: PayloadAction<string>) => {
      if (!state.unlockedResources.includes(action.payload)) {
        state.unlockedResources.push(action.payload);
      }
    },

    // Clear mission when leaving the canvas
    clearCurrentMission: (state) => {
      state.currentMission = null;
    },

    // Trigger test system action from timer
    triggerTestSystem: (state) => {
      state.timerTestTriggered = true;
      console.log('Test system triggered from timer');
    },

    // Reset timer test trigger
    resetTimerTestTrigger: (state) => {
      state.timerTestTriggered = false;
    },
  },
});

// Primary exports (new names)
export const {
  setCurrentMission,
  completeStage,
  completeStep,
  updateMetrics,
  unlockComponent,
  clearCurrentMission,
  triggerTestSystem,
  resetTimerTestTrigger
} = missionSlice.actions;

// Backwards-compatible aliases so existing imports don't break
export const setDatabaseMission = setCurrentMission;
export const completeDatabaseStage = completeStage;
export const clearDatabaseMission = clearCurrentMission;

// Selectors
export const selectCurrentMission = (state: { mission: MissionState }) => state.mission.currentMission;
export const selectCompletedMissions = (state: { mission: MissionState }) => state.mission.completedMissions;
export const selectCrisisMetrics = (state: { mission: MissionState }) => state.mission.crisisMetrics;
export const selectUnlockedResources = (state: { mission: MissionState }) => state.mission.unlockedResources;
// Legacy alias
export const selectUnlockedComponents = selectUnlockedResources;

// Backwards-compatible alias: code that reads state.mission.currentDatabaseMission
// will need to be updated to state.mission.currentMission (same field now).

export default missionSlice.reducer;
