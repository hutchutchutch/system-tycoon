import React, { useState } from 'react';
import { Modal } from '../../atoms/Modal/Modal';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { supabase } from '../../../services/supabase';
import { useAppSelector } from '../../../hooks/redux';
import { realtimeCollaborationService } from '../../../services/realtimeCollaboration';
import styles from './InviteCollaboratorModal.module.css';

interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageId: string;
  missionId: string;
  currentDesignSessionId?: string;
}

export const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({
  isOpen,
  onClose,
  stageId,
  missionId,
  currentDesignSessionId
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const user = useAppSelector(state => state.auth.user);
  const profile = useAppSelector(state => state.auth.profile);

  const handleInvite = async () => {
    if (!inviteEmail || !user || !profile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let sessionId = currentDesignSessionId;
      
      // Create design session if one doesn't exist
      if (!sessionId) {
        const session = await realtimeCollaborationService.createSession(
          stageId,
          `${profile.username}'s Design Session`
        );
        sessionId = session.id;
      }
      
      // Get the recipient's profile by email
      const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', inviteEmail)
        .single();
      
      if (recipientError || !recipientData) {
        throw new Error('User not found. Please check the username.');
      }
      
      // Create invitation email
      const { error: emailError } = await supabase
        .from('mission_emails')
        .insert({
          mission_id: missionId,
          stage_id: stageId,
          subject: `${profile.username} invited you to collaborate!`,
          preview: `Join ${profile.username} to work together on the system design`,
          body: `
            <p>Hi there!</p>
            <p>${profile.username} has invited you to collaborate on their system design for the current mission.</p>
            <p>Click the button below to join their design session and work together in real-time!</p>
            <div style="margin: 20px 0;">
              <a href="/game/crisis/${stageId}?session=${sessionId}" 
                 style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                Open System Builder
              </a>
            </div>
            <p>You'll be able to see each other's cursor movements and component additions in real-time.</p>
          `,
          sender_name: profile.username,
          sender_email: `${profile.username}@system-tycoon.com`,
          sender_avatar: profile.avatar_url || '/default-avatar.png',
          content: `Join collaborative design session: /game/crisis/${stageId}?session=${sessionId}`,
          category: 'collaboration',
          priority: 'high',
          // Custom field to indicate this is a collaboration invite
          personalization_tokens: {
            type: 'collaboration_invite',
            session_id: sessionId,
            stage_id: stageId,
            inviter_id: user.id,
            inviter_name: profile.username
          }
        });
      
      if (emailError) {
        throw emailError;
      }
      
      // Send real-time notification to the recipient
      await supabase
        .from('collaboration_logs')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          action_type: 'invite_sent',
          action_data: {
            recipient_id: recipientData.id,
            recipient_username: recipientData.username
          }
        });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setInviteEmail('');
      }, 2000);
      
    } catch (err) {
      console.error('Failed to send invitation:', err);
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={styles.inviteModal}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Invite Collaborator</h2>
        {success ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <p>Invitation sent successfully!</p>
          </div>
        ) : (
          <>
            <p className={styles.description}>
              Invite another user to collaborate on your system design in real-time.
              They'll be able to see your cursor and add components alongside you.
            </p>
            
            <div className={styles.inputGroup}>
              <label htmlFor="invite-email">Username</label>
              <Input
                id="invite-email"
                type="text"
                placeholder="Enter username"
                value={inviteEmail}
                onChange={setInviteEmail}
                disabled={isLoading}
              />
              {error && <p className={styles.error}>{error}</p>}
            </div>
            
            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleInvite}
                disabled={!inviteEmail || isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}; 