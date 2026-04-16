import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/cloudflareApi';
import type { RootState } from '../index';

// Types
export interface CollaborationInvitation {
  id: string;
  sender_id: string;
  invited_id: string;
  mission_stage_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  updated_at: string;
  expires_at: string;
  // Populated fields from joins
  sender_profile?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  invited_profile?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  mission_stage?: {
    id: string;
    title: string;
    mission: {
      id: string;
      title: string;
    };
  };
}

export interface CollaborationState {
  // Invitations
  sentInvitations: CollaborationInvitation[];
  receivedInvitations: CollaborationInvitation[];

  // Loading states
  isLoading: boolean;
  isSendingInvitation: boolean;
  isUpdatingInvitation: boolean;

  // Error handling
  error: string | null;
  sendError: string | null;

  // UI state
  unreadInvitationsCount: number;
}

const initialState: CollaborationState = {
  sentInvitations: [],
  receivedInvitations: [],
  isLoading: false,
  isSendingInvitation: false,
  isUpdatingInvitation: false,
  error: null,
  sendError: null,
  unreadInvitationsCount: 0,
};

// Async thunks
export const sendCollaborationInvitation = createAsyncThunk(
  'collaboration/sendInvitation',
  async (params: {
    inviteeEmail: string;
    missionStageId: string;
    missionId: string;
  }, { rejectWithValue }) => {
    try {
      const result = await api.post<{ invitation: CollaborationInvitation }>('/collaboration/invitations', {
        inviteeUsername: params.inviteeEmail,
        missionStageId: params.missionStageId,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const loadCollaborationInvitations = createAsyncThunk(
  'collaboration/loadInvitations',
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.get<{
        sent: CollaborationInvitation[];
        received: CollaborationInvitation[];
      }>('/collaboration/invitations');

      return {
        sentInvitations: result.sent || [],
        receivedInvitations: result.received || [],
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load invitations');
    }
  }
);

export const updateInvitationStatus = createAsyncThunk(
  'collaboration/updateStatus',
  async (params: {
    invitationId: string;
    status: 'accepted' | 'declined';
  }, { rejectWithValue }) => {
    try {
      return await api.patch<CollaborationInvitation>(
        '/collaboration/invitations/' + params.invitationId,
        { status: params.status }
      );
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update invitation');
    }
  }
);

// Redux slice
const collaborationSlice = createSlice({
  name: 'collaboration',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.sendError = null;
    },

    markInvitationAsRead: (state, action: PayloadAction<string>) => {
      const invitationId = action.payload;
      const invitation = state.receivedInvitations.find(inv => inv.id === invitationId);
      if (invitation) {
        // This would typically update a separate read status
        // For now, we'll handle this through the email system
      }
    },

    removeInvitation: (state, action: PayloadAction<string>) => {
      const invitationId = action.payload;
      state.sentInvitations = state.sentInvitations.filter(inv => inv.id !== invitationId);
      state.receivedInvitations = state.receivedInvitations.filter(inv => inv.id !== invitationId);
    },
  },

  extraReducers: (builder) => {
    // Send invitation
    builder
      .addCase(sendCollaborationInvitation.pending, (state) => {
        state.isSendingInvitation = true;
        state.sendError = null;
      })
      .addCase(sendCollaborationInvitation.fulfilled, (state, action) => {
        state.isSendingInvitation = false;
        state.sentInvitations.unshift(action.payload.invitation);
      })
      .addCase(sendCollaborationInvitation.rejected, (state, action) => {
        state.isSendingInvitation = false;
        state.sendError = action.payload as string;
      });

    // Load invitations
    builder
      .addCase(loadCollaborationInvitations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCollaborationInvitations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sentInvitations = action.payload.sentInvitations;
        state.receivedInvitations = action.payload.receivedInvitations;
        state.unreadInvitationsCount = action.payload.receivedInvitations.filter(
          inv => inv.status === 'pending'
        ).length;
      })
      .addCase(loadCollaborationInvitations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update invitation status
    builder
      .addCase(updateInvitationStatus.pending, (state) => {
        state.isUpdatingInvitation = true;
      })
      .addCase(updateInvitationStatus.fulfilled, (state, action) => {
        state.isUpdatingInvitation = false;
        const updatedInvitation = action.payload;
        const index = state.receivedInvitations.findIndex(inv => inv.id === updatedInvitation.id);
        if (index !== -1) {
          state.receivedInvitations[index] = { ...state.receivedInvitations[index], ...updatedInvitation };
        }
        // Recalculate unread count
        state.unreadInvitationsCount = state.receivedInvitations.filter(
          inv => inv.status === 'pending'
        ).length;
      })
      .addCase(updateInvitationStatus.rejected, (state, action) => {
        state.isUpdatingInvitation = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  markInvitationAsRead,
  removeInvitation,
} = collaborationSlice.actions;

export default collaborationSlice.reducer;

// Selectors
export const selectSentInvitations = (state: RootState) => state.collaboration.sentInvitations;
export const selectReceivedInvitations = (state: RootState) => state.collaboration.receivedInvitations;
export const selectUnreadInvitationsCount = (state: RootState) => state.collaboration.unreadInvitationsCount;
export const selectIsSendingInvitation = (state: RootState) => state.collaboration.isSendingInvitation;
export const selectCollaborationError = (state: RootState) => state.collaboration.error;
export const selectSendError = (state: RootState) => state.collaboration.sendError;
