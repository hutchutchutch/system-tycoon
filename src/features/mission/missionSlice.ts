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

interface MissionState {
  currentMission: Mission | null;
  completedMissions: string[];
  unlockedComponents: string[];
  crisisMetrics: {
    totalReportsSaved: number;
    totalDataLost: number;
    familiesHelped: number;
    systemUptime: number;
  };
}

const healthCrisisMission: Mission = {
  id: 'health_crisis',
  title: 'Community Health Crisis',
  description: 'Help Alex save the neighborhood by fixing the symptom reporting system',
  currentStepIndex: 0,
  completed: false,
  steps: [
    {
      id: 'separate_concerns',
      title: 'Desperate Plea',
      description: 'Alex\'s laptop is crashing from running both web server and database',
      objective: 'Separate the web server from the database',
      completed: false,
      unlocksComponents: ['web_server', 'database'],
    },
    {
      id: 'load_balancing',
      title: 'Media Attention',
      description: 'News coverage brings 1000+ families, overwhelming the single server',
      objective: 'Add a load balancer to distribute traffic',
      completed: false,
      unlocksComponents: ['load_balancer'],
    },
    {
      id: 'database_replication',
      title: 'Data Loss Crisis',
      description: 'Database crash loses critical symptom reports',
      objective: 'Implement database replication for resilience',
      completed: false,
      unlocksComponents: ['replica_db'],
    },
    // Additional steps would be added here
  ],
};

const initialState: MissionState = {
  currentMission: null,
  completedMissions: [],
  unlockedComponents: ['web_server', 'database'], // Start with basic components
  crisisMetrics: {
    totalReportsSaved: 0,
    totalDataLost: 0,
    familiesHelped: 0,
    systemUptime: 42,
  },
};

const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    startMission: (state, action: PayloadAction<string>) => {
      if (action.payload === 'health_crisis') {
        state.currentMission = {
          ...healthCrisisMission,
          startedAt: new Date().toISOString(),
        };
      }
    },

    completeStep: (state, action: PayloadAction<string>) => {
      if (!state.currentMission) return;

      const stepIndex = state.currentMission.steps.findIndex(
        (step) => step.id === action.payload
      );

      if (stepIndex !== -1) {
        state.currentMission.steps[stepIndex].completed = true;
        
        // Unlock components
        const unlockedComponents = state.currentMission.steps[stepIndex].unlocksComponents || [];
        state.unlockedComponents.push(...unlockedComponents);

        // Move to next step
        if (stepIndex === state.currentMission.currentStepIndex) {
          state.currentMission.currentStepIndex++;
        }

        // Check if mission is complete
        if (state.currentMission.steps.every((step) => step.completed)) {
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
      if (!state.unlockedComponents.includes(action.payload)) {
        state.unlockedComponents.push(action.payload);
      }
    },
  },
});

export const { startMission, completeStep, updateMetrics, unlockComponent } = missionSlice.actions;
export default missionSlice.reducer;