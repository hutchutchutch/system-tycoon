import React, { useState, useEffect } from 'react';
import { Modal } from '../../atoms/Modal/Modal';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { sendCollaborationInvitation, clearError, selectIsSendingInvitation, selectSendError } from '../../../store/slices/collaborationSlice';
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
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Redux state
  const isSending = useAppSelector(selectIsSendingInvitation);
  const sendError = useAppSelector(selectSendError);

  // Clear errors when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
      setSuccess(false);
    }
  }, [isOpen, dispatch]);

  const handleInvite = async () => {
    if (!username.trim()) return;
    
    try {
      const result = await dispatch(sendCollaborationInvitation({
        inviteeEmail: username.trim(),
        missionStageId: stageId,
        missionId: missionId
      })).unwrap();
      
      // Success - show success state
      setSuccess(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setUsername('');
      }, 2000);
      
    } catch (error) {
      // Error handling is managed by Redux state
      console.error('Failed to send invitation:', error);
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
                value={username}
                onChange={setUsername}
                disabled={isSending}
              />
              {sendError && <p className={styles.error}>{sendError}</p>}
            </div>
            
            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleInvite}
                disabled={!username || isSending}
              >
                {isSending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}; 