import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '../../types';
import {
  api,
  signIn as apiSignIn,
  signUp as apiSignUp,
  signInWithGoogle as apiSignInWithGoogle,
  signOut as apiSignOut,
  getCurrentUser,
  type AuthUserProfile,
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

function parseUser(data: AuthUserProfile): { user: AuthUser; profile: Profile } {
  return {
    user: {
      id: data.id,
      email: data.email,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
      aud: 'authenticated',
      role: 'authenticated',
    },
    profile: {
      id: data.id,
      username: data.username ?? data.email.split('@')[0],
      display_name: data.display_name ?? data.name ?? undefined,
      avatar_url: data.avatar_url ?? data.image ?? undefined,
      current_level: data.current_level ?? 1,
      reputation_score: data.reputation_score ?? 0,
      career_title: data.career_title ?? 'Aspiring Developer',
      preferred_mentor_id: data.preferred_mentor_id ?? undefined,
      onboarding_completed: data.onboarding_completed ?? false,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    },
  };
}

// --- Thunks ---

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }) => {
    await apiSignIn(email, password);
    const profile = await getCurrentUser();
    return parseUser(profile);
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, username }: { email: string; password: string; username: string }) => {
    await apiSignUp(email, password, username);
    const profile = await getCurrentUser();
    return parseUser(profile);
  }
);

export const signInWithOAuth = createAsyncThunk(
  'auth/signInWithOAuth',
  async (_provider: 'google' | 'github' | 'linkedin') => {
    apiSignInWithGoogle();
    // Browser navigates away — thunk doesn't resolve
  }
);

/** Legacy hook — OAuth callbacks are now handled automatically by Better Auth redirect */
export const handleOAuthReturn = createAsyncThunk(
  'auth/handleOAuthReturn',
  async () => {
    const profile = await getCurrentUser();
    return parseUser(profile);
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await apiSignOut();
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  try {
    const profile = await getCurrentUser();
    return parseUser(profile);
  } catch (err) {
    if ((err as ApiError).status === 401) return null;
    throw err;
  }
});

export const fetchCurrentUser = checkAuth;

/** Demo sign-in: creates an anonymous demo account via Better Auth email/password */
export const demoSignIn = createAsyncThunk(
  'auth/demoSignIn',
  async (_profileId: string) => {
    const demoEmail = `demo-${Date.now()}@example.com`;
    const demoPassword = crypto.randomUUID();
    await apiSignUp(demoEmail, demoPassword, 'demo_user');
    const profile = await getCurrentUser();
    return parseUser(profile);
  }
);

export const updateOnboardingStatus = createAsyncThunk(
  'auth/updateOnboardingStatus',
  async (completed: boolean) => {
    return api.patch<Profile>('/profile/profile', { onboarding_completed: completed });
  }
);

export const updatePreferredMentor = createAsyncThunk(
  'auth/updatePreferredMentor',
  async (mentorId: string) => {
    return api.patch<Profile>('/profile/profile', { preferred_mentor_id: mentorId });
  }
);

// --- Slice ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.profile) state.profile = { ...state.profile, ...action.payload };
    },
  },
  extraReducers: (builder) => {
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

    builder
      .addCase(signInWithOAuth.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(signInWithOAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'OAuth sign in failed';
      });

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

    builder.addCase(signOut.fulfilled, (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
    });

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

    builder
      .addCase(updateOnboardingStatus.fulfilled, (state, action) => {
        if (state.profile) state.profile = action.payload;
      })
      .addCase(updateOnboardingStatus.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update onboarding status';
      });

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
