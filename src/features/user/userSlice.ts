import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserStats, Achievement, UserAchievement, ComponentMastery } from '../../types';
import { supabase } from '../../services/supabase';

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
  async (userId: string) => {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const fetchAchievements = createAsyncThunk(
  'user/fetchAchievements',
  async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
);

export const fetchUserAchievements = createAsyncThunk(
  'user/fetchUserAchievements',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
);

export const fetchComponentMastery = createAsyncThunk(
  'user/fetchComponentMastery',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('component_mastery')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
);

export const updateComponentMastery = createAsyncThunk(
  'user/updateComponentMastery',
  async ({ userId, componentId, success }: {
    userId: string;
    componentId: string;
    success: boolean;
  }) => {
    // First, try to get existing mastery
    const { data: existing } = await supabase
      .from('component_mastery')
      .select('*')
      .eq('user_id', userId)
      .eq('component_id', componentId)
      .single();
    
    if (existing) {
      // Update existing mastery
      const timesUsed = existing.times_used + 1;
      const successfulUses = success ? existing.successful_uses + 1 : existing.successful_uses;
      
      // Calculate new mastery level
      let masteryLevel: ComponentMastery['masteryLevel'] = 'novice';
      if (successfulUses >= 20) masteryLevel = 'gold';
      else if (successfulUses >= 10) masteryLevel = 'silver';
      else if (successfulUses >= 5) masteryLevel = 'bronze';
      
      const { data, error } = await supabase
        .from('component_mastery')
        .update({
          times_used: timesUsed,
          successful_uses: successfulUses,
          mastery_level: masteryLevel,
          last_used_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('component_id', componentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new mastery record
      const { data, error } = await supabase
        .from('component_mastery')
        .insert({
          user_id: userId,
          component_id: componentId,
          mastery_level: 'novice',
          times_used: 1,
          successful_uses: success ? 1 : 0,
          last_used_at: new Date().toISOString(),
          unlocked_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
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
          m => m.componentId === action.payload.component_id
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