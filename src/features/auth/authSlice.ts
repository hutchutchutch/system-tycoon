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
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
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
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (error) throw error;
    
    return { user: session.user, profile };
  }
);

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
  },
});

export const { clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;