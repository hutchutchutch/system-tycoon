import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
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
  }, { getState, rejectWithValue }) => {
    const startTime = Date.now();
    
    try {
      console.log('🚀 [CollaborationSlice] Starting invitation process...');
      console.log('📍 [CollaborationSlice] Parameters:', {
        inviteeEmail: params.inviteeEmail,
        missionStageId: params.missionStageId,
        missionId: params.missionId
      });

      const state = getState() as RootState;
      const senderId = state.auth.user?.id;
      const senderProfile = state.auth.profile;

      console.log('👤 [CollaborationSlice] Sender info:', {
        senderId,
        senderUsername: senderProfile?.username,
        hasProfile: !!senderProfile
      });

      if (!senderId || !senderProfile) {
        console.error('❌ [CollaborationSlice] User not authenticated');
        throw new Error('User not authenticated. Please log in to send invitations.');
      }

      // Step 1: Find the recipient by username (simple and fast)
      console.log('🔍 [CollaborationSlice] Step 1: Searching for user:', params.inviteeEmail);
      const userSearchStart = Date.now();
      
      const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', params.inviteeEmail)
        .limit(1)
        .single();
      
      const userSearchEnd = Date.now();
      console.log(`⏱️ [CollaborationSlice] User search took: ${userSearchEnd - userSearchStart}ms`);
      console.log('🔍 [CollaborationSlice] Search results:', { 
        recipientData, 
        recipientError,
        hasRecipient: !!recipientData
      });

      if (recipientError || !recipientData) {
        console.error('❌ [CollaborationSlice] User not found:', {
          error: recipientError,
          searchTerm: params.inviteeEmail
        });
        
        // Quick availability check
        const { data: availableUsers } = await supabase
          .from('profiles')
          .select('username')
          .limit(5);
          
        const usernames = availableUsers?.map(u => u.username).join(', ') || 'None';
        throw new Error(`User "${params.inviteeEmail}" not found. Please check the username (case-insensitive search in profiles.username field). Available users: ${usernames}`);
      }

      // Step 2: Prevent self-invitation
      if (recipientData.id === senderId) {
        console.log('❌ [CollaborationSlice] Self-invitation attempt');
        throw new Error('You cannot invite yourself to collaborate.');
      }

      // Step 3: Create the collaboration invitation (core operation)
      console.log('💾 [CollaborationSlice] Step 3: Creating collaboration invitation...');
      const inviteCreateStart = Date.now();
      
      const { data: invitation, error: invitationError } = await supabase
        .from('collaboration_invitations')
        .insert({
          sender_id: senderId,
          invited_id: recipientData.id,
          mission_stage_id: params.missionStageId,
          status: 'pending'
        })
        .select('*')
        .single();

      const inviteCreateEnd = Date.now();
      console.log(`⏱️ [CollaborationSlice] Invitation creation took: ${inviteCreateEnd - inviteCreateStart}ms`);
      console.log('💾 [CollaborationSlice] Invitation creation result:', {
        invitation,
        invitationError,
        hasInvitation: !!invitation
      });

      if (invitationError) {
        console.error('❌ [CollaborationSlice] Failed to create invitation:', invitationError);
        
        // Enhanced error handling for common database constraints
        if (invitationError.code === '23505') { // Unique constraint violation
          throw new Error('You have already sent an invitation to this user for this mission stage.');
        }
        
        if (invitationError.code === '23503') { // Foreign key constraint violation
          if (invitationError.message.includes('mission_stage_id')) {
            // Get valid stages for debugging
            const { data: validStages } = await supabase
              .from('mission_stages')
              .select('id, title')
              .eq('mission_id', params.missionId)
              .limit(5);
            
            const stageList = validStages?.map(s => `${s.title} (${s.id})`).join(', ') || 'None found';
            throw new Error(`Mission stage not found. The stage ID "${params.missionStageId}" does not exist for mission "${params.missionId}". Valid stages: ${stageList}`);
          }
          
          if (invitationError.message.includes('invited_id')) {
            throw new Error('The invited user does not exist in the system.');
          }
          
          if (invitationError.message.includes('sender_id')) {
            throw new Error('Invalid sender - please log out and log back in.');
          }
        }
        
        throw new Error(`Failed to create invitation: ${invitationError.message}`);
      }

      const totalTime = Date.now() - startTime;
      console.log(`🎉 [CollaborationSlice] Invitation process completed successfully in ${totalTime}ms!`);

      return {
        invitation: {
          ...invitation,
          sender_profile: {
            id: senderProfile.id!,
            username: senderProfile.username!,
            avatar_url: senderProfile.avatar_url
          },
          invited_profile: recipientData
        }
      };
    } catch (error) {
      const totalTime = Date.now() - startTime;
      console.error(`❌ [CollaborationSlice] Failed to send collaboration invitation (${totalTime}ms):`, error);
      
      // Enhanced error reporting
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ [CollaborationSlice] Error details:', {
        message: errorMessage,
        params,
        senderId: (getState() as RootState).auth.user?.id,
        timestamp: new Date().toISOString()
      });
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const loadCollaborationInvitations = createAsyncThunk(
  'collaboration/loadInvitations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Load sent invitations
      const { data: sentInvitations, error: sentError } = await supabase
        .from('collaboration_invitations')
        .select(`
          *,
          invited_profile:profiles!collaboration_invitations_invited_id_fkey(
            id,
            username,
            avatar_url
          ),
          mission_stage:mission_stages(
            id,
            title,
            mission:missions(
              id,
              title
            )
          )
        `)
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;

      // Load received invitations
      const { data: receivedInvitations, error: receivedError } = await supabase
        .from('collaboration_invitations')
        .select(`
          *,
          sender_profile:profiles!collaboration_invitations_sender_id_fkey(
            id,
            username,
            avatar_url
          ),
          mission_stage:mission_stages(
            id,
            title,
            mission:missions(
              id,
              title
            )
          )
        `)
        .eq('invited_id', userId)
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;

      return {
        sentInvitations: sentInvitations || [],
        receivedInvitations: receivedInvitations || []
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
      const { data, error } = await supabase
        .from('collaboration_invitations')
        .update({ status: params.status })
        .eq('id', params.invitationId)
        .select()
        .single();

      if (error) throw error;

      return data;
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