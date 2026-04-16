import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '../../types';
import {
  api,
  isAuthenticated,
  signIn as apiSignIn,
  signUp as apiSignUp,
  signInWithGoogle as apiSignInWithGoogle,
  signOut as apiSignOut,
  handleOAuthCallback,
  setToken,
  type AuthResponse,
  type ApiError,
} from '../../services/cloudflareApi';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  aud: 'authenticated';
  role: 'authenticated';
}

interface AuthState {
  user: AuthUser | null;
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

function parseAuthUser(data: AuthResponse['user']): { user: AuthUser; profile: Profile } {
  return {
    user: {
      id: data.id,
      email: data.email,
      created_at: data.created_at,
      updated_at: data.updated_at,
      aud: 'authenticated',
      role: 'authenticated',
    },
    profile: {
      id: data.id,
      username: data.username,
      display_name: data.display_name ?? undefined,
      avatar_url: data.avatar_url ?? undefined,
      current_level: data.current_level,
      reputation_score: data.reputation_score,
      career_title: data.career_title ?? undefined,
      preferred_mentor_id: data.preferred_mentor_id ?? undefined,
      onboarding_completed: data.onboarding_completed,
      created_at: data.created_at,
      updated_at: data.updated_at,
    },
  };
}

// --- Thunks ---

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }) => {
    const res = await apiSignIn(email, password);
    return parseAuthUser(res.user);
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, username }: { email: string; password: string; username: string }) => {
    const res = await apiSignUp(email, password, username);
    return parseAuthUser(res.user);
  }
);

export const signInWithOAuth = createAsyncThunk(
  'auth/signInWithOAuth',
  async (_provider: 'google' | 'github' | 'linkedin') => {
    apiSignInWithGoogle();
    // This redirects — thunk won't resolve
  }
);

/**
 * Handle the OAuth callback redirect.
 * Called from the /auth/callback route to extract the token from the URL hash.
 */
export const handleOAuthReturn = createAsyncThunk(
  'auth/handleOAuthReturn',
  async () => {
    const token = handleOAuthCallback();
    if (!token) {
      throw new Error('No token found in callback URL');
    }
    // Token is already stored by handleOAuthCallback — fetch profile
    const data = await api.get<AuthResponse['user']>('/auth/me');
    return parseAuthUser(data);
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    apiSignOut();
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    if (!isAuthenticated()) {
      return null;
    }
    try {
      const data = await api.get<AuthResponse['user']>('/auth/me');
      return parseAuthUser(data);
    } catch (err: unknown) {
      if ((err as ApiError).status === 401) {
        return null;
      }
      throw err;
    }
  }
);

export const demoSignIn = createAsyncThunk(
  'auth/demoSignIn',
  async (profileId: string) => {
    const res = await api.get<{ token: string; user: AuthResponse['user'] }>(`/auth/demo?profileId=${encodeURIComponent(profileId)}`);
    setToken(res.token);
    return parseAuthUser(res.user);
  }
);

export const updateOnboardingStatus = createAsyncThunk(
  'auth/updateOnboardingStatus',
  async (completed: boolean) => {
    return api.patch<Profile>('/auth/profile', { onboarding_completed: completed });
  }
);

export const updatePreferredMentor = createAsyncThunk(
  'auth/updatePreferredMentor',
  async (mentorId: string) => {
    return api.patch<Profile>('/auth/profile', { preferred_mentor_id: mentorId });
  }
);

// Keep this alias for code that imports fetchCurrentUser
export const fetchCurrentUser = checkAuth;

// --- Slice ---

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
    // Sign in
    builder
      .addCase(signInWithEmail.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign in';
        state.isAuthenticated = false;
      });

    // Sign up
    builder
      .addCase(signUpWithEmail.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign up';
        state.isAuthenticated = false;
      });

    // OAuth
    builder
      .addCase(signInWithOAuth.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(signInWithOAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'OAuth sign in failed';
      });

    // OAuth callback
    builder
      .addCase(handleOAuthReturn.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(handleOAuthReturn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(handleOAuthReturn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'OAuth callback failed';
      });

    // Sign out
    builder.addCase(signOut.fulfilled, (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
    });

    // Check auth
    builder
      .addCase(checkAuth.pending, (state) => { state.isLoading = true; })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
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
      .addCase(demoSignIn.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(demoSignIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(demoSignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Demo sign in failed';
      });

    // Update onboarding
    builder
      .addCase(updateOnboardingStatus.fulfilled, (state, action) => {
        if (state.profile) state.profile = action.payload;
      })
      .addCase(updateOnboardingStatus.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update onboarding status';
      });

    // Update mentor
    builder
      .addCase(updatePreferredMentor.fulfilled, (state, action) => {
        if (state.profile) state.profile = action.payload;
      })
      .addCase(updatePreferredMentor.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update preferred mentor';
      });
  },
});

export const { clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
