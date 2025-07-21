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
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  // Redux state
  const isSending = useAppSelector(selectIsSendingInvitation);
  const sendError = useAppSelector(selectSendError);

  // Enhanced debugging function
  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔍 [${timestamp}] ${message}`);
    setDebugInfo(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Clear errors and debug info when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
      setSuccess(false);
      setDebugInfo([]);
      addDebugInfo('Modal opened - ready for collaboration invitation');
    }
  }, [isOpen, dispatch]);

  const handleInvite = async () => {
    if (!username.trim()) {
      addDebugInfo('❌ Username is empty');
      return;
    }
    
    addDebugInfo(`🚀 Starting invitation process for username: "${username.trim()}"`);
    addDebugInfo(`📍 Mission ID: ${missionId}`);
    addDebugInfo(`📍 Stage ID: ${stageId}`);
    addDebugInfo(`📍 Design Session ID: ${currentDesignSessionId || 'None'}`);
    
    try {
      addDebugInfo('💫 Dispatching sendCollaborationInvitation...');
      
      const result = await dispatch(sendCollaborationInvitation({
        inviteeEmail: username.trim(),
        missionStageId: stageId,
        missionId: missionId
      })).unwrap();
      
      addDebugInfo('✅ Invitation sent successfully!');
      addDebugInfo(`📧 Invitation ID: ${result?.invitation?.id || 'Unknown'}`);
      
      // Success - show success state
      setSuccess(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setUsername('');
        setDebugInfo([]);
      }, 2000);
      
    } catch (error) {
      addDebugInfo(`❌ Invitation failed: ${error}`);
      addDebugInfo(`🔍 Error type: ${typeof error}`);
      addDebugInfo(`🔍 Error details: ${JSON.stringify(error, null, 2)}`);
      
      // Log additional debugging info
      if (error instanceof Error) {
        addDebugInfo(`🔍 Error name: ${error.name}`);
        addDebugInfo(`🔍 Error message: ${error.message}`);
        addDebugInfo(`🔍 Error stack: ${error.stack?.substring(0, 200)}...`);
      }
      
      console.error('🚨 Complete error object:', error);
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
                placeholder="Enter username (e.g., John, Ash, Heather)"
                value={username}
                onChange={setUsername}
                disabled={isSending}
              />
              {sendError && (
                <div className={styles.errorContainer}>
                  <p className={styles.error}>{sendError}</p>
                  
                  {/* Enhanced debugging info */}
                  {debugInfo.length > 0 && (
                    <details className={styles.debugDetails}>
                      <summary>🔧 Debug Information (Click to expand)</summary>
                      <div className={styles.debugLog}>
                        {debugInfo.map((info, index) => (
                          <div key={index} className={styles.debugLine}>
                            {info}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
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
            
            {/* Debug info when not in error state */}
            {!sendError && debugInfo.length > 0 && (
              <details className={styles.debugDetails}>
                <summary>🔧 Debug Log</summary>
                <div className={styles.debugLog}>
                  {debugInfo.map((info, index) => (
                    <div key={index} className={styles.debugLine}>
                      {info}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}; 