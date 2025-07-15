import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, Profile } from '../../types';
import { supabase } from '../../services/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Fetch profile - using 'id' column instead of 'user_id'
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) throw profileError;
    
    return { user: data.user, profile };
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, username }: { email: string; password: string; username: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Create profile record in profiles table - database defaults will handle most fields
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          username: username,
        }])
        .select()
        .single();
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw here as the user was created successfully
      }
      
      return { user: data.user, profile };
    }
    
    return { user: data.user };
  }
);

export const signInWithOAuth = createAsyncThunk(
  'auth/signInWithOAuth',
  async (provider: 'google' | 'github' | 'linkedin') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return null;
    }
    
    return { user, profile };
  }
);

export const demoSignIn = createAsyncThunk(
  'auth/demoSignIn',
  async (profileId: string) => {
    // Create a mock user for demo purposes
    const mockUser = {
      id: profileId,
      email: 'demo@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
    };
    
    // Create a mock profile based on the expected structure
    const mockProfile = {
      id: profileId,
      username: 'hutchenbach',
      display_name: undefined,
      avatar_url: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_level: 1,
      reputation_points: 0,
      career_title: 'Aspiring Developer',
      preferred_mentor_id: undefined,
    };
    
    return { user: mockUser, profile: mockProfile };
  }
);

// Slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Sign in with email
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as any;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign in';
      });
    
    // Sign up with email
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as any;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign up';
      });
    
    // OAuth sign in
    builder
      .addCase(signInWithOAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithOAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'OAuth sign in failed';
      });
    
    // Sign out
    builder
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
      });
    
    // Check auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user as any;
          state.profile = action.payload.profile;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
    
    // Demo sign in
    builder
      .addCase(demoSignIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(demoSignIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as any;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(demoSignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Demo sign in failed';
      });
  },
});

export const { clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;