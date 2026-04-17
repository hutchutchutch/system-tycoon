import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserStats, Achievement, UserAchievement, ComponentMastery } from '../../types';
import { api } from '../../services/cloudflareApi';

interface UserSliceState {
  stats: UserStats | null;
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  componentMastery: ComponentMastery[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserSliceState = {
  stats: null,
  achievements: [],
  userAchievements: [],
  componentMastery: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async () => {
    return api.get<UserStats>('/game/stats');
  }
);

export const fetchAchievements = createAsyncThunk(
  'user/fetchAchievements',
  async () => {
    return api.get<Achievement[]>('/game/achievements');
  }
);

export const fetchUserAchievements = createAsyncThunk(
  'user/fetchUserAchievements',
  async () => {
    return api.get<UserAchievement[]>('/game/achievements/user');
  }
);

export const fetchComponentMastery = createAsyncThunk(
  'user/fetchComponentMastery',
  async () => {
    return api.get<ComponentMastery[]>('/game/mastery');
  }
);

export const updateComponentMastery = createAsyncThunk(
  'user/updateComponentMastery',
  async ({ componentId, success }: {
    componentId: string;
    success: boolean;
  }) => {
    return api.post<ComponentMastery>('/game/mastery', { componentId, success });
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addAchievement: (state, action: PayloadAction<UserAchievement>) => {
      state.userAchievements.push(action.payload);
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch user stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user stats';
      });

    // Fetch achievements
    builder
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload;
      });

    // Fetch user achievements
    builder
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.userAchievements = action.payload;
      });

    // Fetch component mastery
    builder
      .addCase(fetchComponentMastery.fulfilled, (state, action) => {
        state.componentMastery = action.payload;
      });

    // Update component mastery
    builder
      .addCase(updateComponentMastery.fulfilled, (state, action) => {
        const index = state.componentMastery.findIndex(
          m => m.componentId === ((action.payload as any).component_id || (action.payload as any).componentId)
        );

        if (index >= 0) {
          state.componentMastery[index] = action.payload as any;
        } else {
          state.componentMastery.push(action.payload as any);
        }
      });
  },
});

export const { addAchievement, updateStats } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectUserStats = (state: { user: UserSliceState }) => state.user.stats;
export const selectAchievements = (state: { user: UserSliceState }) => state.user.achievements;
export const selectUserAchievements = (state: { user: UserSliceState }) => state.user.userAchievements;
export const selectComponentMastery = (state: { user: UserSliceState }) => state.user.componentMastery;
export const selectUserLoading = (state: { user: UserSliceState }) => state.user.isLoading;
export const selectUserError = (state: { user: UserSliceState }) => state.user.error;
