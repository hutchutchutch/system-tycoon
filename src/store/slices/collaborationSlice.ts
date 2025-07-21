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
    try {
      const state = getState() as RootState;
      const senderId = state.auth.user?.id;
      const senderProfile = state.auth.profile;

      if (!senderId || !senderProfile) {
        throw new Error('User not authenticated');
      }

      // Find the recipient by email/username (case-insensitive)
      const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', params.inviteeEmail);
      
      // Handle the array response from ilike
      const recipient = recipientData?.[0];
      const finalError = recipientError || (!recipient && !recipientError ? new Error('Not found') : null);

      if (finalError || !recipient) {
        // Check if any users exist in the database
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (!count || count === 0) {
          throw new Error('No users found in the database. Make sure users have completed profile setup.');
        } else {
          throw new Error(`User "${params.inviteeEmail}" not found. Please check the username (case-insensitive search in profiles.username field).`);
        }
      }

      // Prevent self-invitation
      if (recipient.id === senderId) {
        throw new Error('You cannot invite yourself to collaborate.');
      }

      // Check for existing invitation
      const { data: existingInvitation } = await supabase
        .from('collaboration_invitations')
        .select('id, status')
        .eq('sender_id', senderId)
        .eq('invited_id', recipient.id)
        .eq('mission_stage_id', params.missionStageId)
        .single();

      if (existingInvitation) {
        if (existingInvitation.status === 'pending') {
          throw new Error('You have already sent an invitation to this user for this mission.');
        }
      }

      // Get mission stage details for the invitation
      const { data: stageData, error: stageError } = await supabase
        .from('mission_stages')
        .select(`
          id,
          title,
          mission:missions!inner(
            id,
            title
          )
        `)
        .eq('id', params.missionStageId)
        .single();

      if (stageError || !stageData) {
        throw new Error('Mission stage not found');
      }

      // Create the collaboration invitation
      const { data: invitation, error: invitationError } = await supabase
        .from('collaboration_invitations')
        .insert({
          sender_id: senderId,
          invited_id: recipient.id,
          mission_stage_id: params.missionStageId,
          status: 'pending'
        })
        .select()
        .single();

      if (invitationError) {
        throw invitationError;
      }

      // Create email for sender (Sent folder)
      const { error: senderEmailError } = await supabase
        .from('mission_emails')
        .insert({
          mission_id: params.missionId,
          stage_id: params.missionStageId,
          recipient_id: senderId, // Sender sees this in their Sent folder
          subject: `Collaboration Invitation Sent to ${recipient.username}`,
          preview: `You invited ${recipient.username} to collaborate on ${(stageData.mission as any)?.[0]?.title || 'Unknown Mission'}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563EB;">Collaboration Invitation Sent</h2>
              <p>You have successfully sent a collaboration invitation to <strong>${recipient.username}</strong>.</p>
              
              <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <h3 style="margin: 0 0 8px 0; color: #374151;">Mission Details:</h3>
                <p style="margin: 4px 0;"><strong>Mission:</strong> ${(stageData.mission as any)?.[0]?.title || 'Unknown Mission'}</p>
                <p style="margin: 4px 0;"><strong>Stage:</strong> ${stageData.title}</p>
              </div>
              
              <p>They will receive an invitation in their inbox and can choose to accept or decline.</p>
              <p style="color: #6B7280; font-size: 14px;">
                This invitation will expire in 7 days if not responded to.
              </p>
            </div>
          `,
          sender_name: 'System',
          sender_email: 'system@system-tycoon.com',
          sender_avatar: '/system-avatar.png',
          content: `Collaboration invitation sent to ${recipient.username}`,
          category: 'collaboration',
          priority: 'normal',
          is_read: true, // Sender's copy is marked as read
          personalization_tokens: {
            type: 'collaboration_sent',
            invitation_id: invitation.id,
            recipient_username: recipient.username,
            mission_title: (stageData.mission as any)?.[0]?.title || 'Unknown Mission',
            stage_title: stageData.title
          }
        });

      if (senderEmailError) {
        console.error('Failed to create sender email:', senderEmailError);
      }

      // Create email for recipient (Inbox)
      const { error: recipientEmailError } = await supabase
        .from('mission_emails')
        .insert({
          mission_id: params.missionId,
          stage_id: params.missionStageId,
          recipient_id: recipient.id,
          subject: `${senderProfile.username} invited you to collaborate!`,
          preview: `Join ${senderProfile.username} to work together on ${(stageData.mission as any)?.[0]?.title || 'Unknown Mission'}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563EB;">You're Invited to Collaborate!</h2>
              <p>Hi ${recipient.username}!</p>
              <p><strong>${senderProfile.username}</strong> has invited you to collaborate on their system design mission.</p>
              
              <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <h3 style="margin: 0 0 8px 0; color: #374151;">Mission Details:</h3>
                <p style="margin: 4px 0;"><strong>Mission:</strong> ${(stageData.mission as any)?.[0]?.title || 'Unknown Mission'}</p>
                <p style="margin: 4px 0;"><strong>Stage:</strong> ${stageData.title}</p>
                <p style="margin: 4px 0;"><strong>Invited by:</strong> ${senderProfile.username}</p>
              </div>
              
              <div style="margin: 20px 0; text-align: center;">
                <a href="/game/crisis-design/${params.missionStageId}?invitation=${invitation.id}" 
                   style="background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                  Accept Invitation & Join Mission
                </a>
              </div>
              
              <p>You'll be able to see each other's cursor movements and component additions in real-time as you work together to solve the crisis!</p>
              
              <div style="margin-top: 20px; padding: 12px; background: #FEF3C7; border-radius: 8px;">
                <p style="margin: 0; color: #92400E; font-size: 14px;">
                  <strong>Note:</strong> This invitation will expire in 7 days. You can accept or decline at any time.
                </p>
              </div>
            </div>
          `,
          sender_name: senderProfile.username,
          sender_email: `${senderProfile.username}@system-tycoon.com`,
          sender_avatar: senderProfile.avatar_url || '/default-avatar.png',
          content: `Collaboration invitation from ${senderProfile.username}`,
          category: 'collaboration',
          priority: 'high',
          is_read: false, // Recipient's copy is unread
          personalization_tokens: {
            type: 'collaboration_invitation',
            invitation_id: invitation.id,
            sender_id: senderId,
            sender_username: senderProfile.username,
            mission_title: (stageData.mission as any)?.[0]?.title || 'Unknown Mission',
            stage_title: stageData.title
          }
        });

      if (recipientEmailError) {
        console.error('Failed to create recipient email:', recipientEmailError);
      }

      return {
        invitation: {
          ...invitation,
          sender_profile: {
            id: senderProfile.id!,
            username: senderProfile.username!,
            avatar_url: senderProfile.avatar_url
          },
          invited_profile: recipient,
          mission_stage: stageData
        }
      };
    } catch (error) {
      console.error('Failed to send collaboration invitation:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to send invitation');
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