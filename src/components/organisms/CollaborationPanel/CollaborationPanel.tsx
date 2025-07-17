import React, { useState, useEffect } from 'react';
import { Users, Plus, Link2, X } from 'lucide-react';
import { realtimeCollaborationService, type DesignSession } from '../../../services/realtimeCollaboration';
import { Button } from '../../atoms/Button';
import { Modal } from '../../atoms/Modal';
import type { CollaborationPanelProps } from './CollaborationPanel.types';
import styles from './CollaborationPanel.module.css';

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  scenarioId,
  onSessionChange,
  currentSessionId
}) => {
  const [sessions, setSessions] = useState<DesignSession[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Load active sessions
  useEffect(() => {
    loadSessions();
  }, [scenarioId]);

  const loadSessions = async () => {
    try {
      const activeSessions = await realtimeCollaborationService.getActiveSessions(scenarioId);
      setSessions(activeSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionName.trim()) return;

    setIsLoading(true);
    try {
      const session = await realtimeCollaborationService.createSession(scenarioId, sessionName);
      await loadSessions();
      setIsCreateModalOpen(false);
      setSessionName('');
      onSessionChange(session.id);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      await realtimeCollaborationService.joinSession(sessionId);
      onSessionChange(sessionId);
    } catch (error) {
      console.error('Failed to join session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveSession = async () => {
    if (!currentSessionId) return;

    setIsLoading(true);
    try {
      await realtimeCollaborationService.leaveSession(currentSessionId);
      onSessionChange(null);
    } catch (error) {
      console.error('Failed to leave session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copySessionLink = (sessionId: string) => {
    const link = `${window.location.origin}/design/${scenarioId}?session=${sessionId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(sessionId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className={styles.collaborationPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Users size={16} />
          Collaboration Sessions
        </h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isLoading}
        >
          <Plus size={14} />
          New Session
        </Button>
      </div>

      {currentSessionId && (
        <div className={styles.currentSession}>
          <span className={styles.currentLabel}>Currently in session</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeaveSession}
            disabled={isLoading}
          >
            <X size={14} />
            Leave
          </Button>
        </div>
      )}

      <div className={styles.sessionsList}>
        {sessions.length === 0 ? (
          <p className={styles.emptyState}>No active sessions. Create one to start collaborating!</p>
        ) : (
          sessions.map(session => (
            <div
              key={session.id}
              className={`${styles.sessionItem} ${currentSessionId === session.id ? styles.active : ''}`}
            >
              <div className={styles.sessionInfo}>
                <h4 className={styles.sessionName}>{session.session_name}</h4>
                <span className={styles.sessionMeta}>
                  {session.design_session_participants?.length || 0} participants
                </span>
              </div>
              <div className={styles.sessionActions}>
                {currentSessionId !== session.id && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleJoinSession(session.id)}
                    disabled={isLoading}
                  >
                    Join
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copySessionLink(session.id)}
                  title="Copy session link"
                >
                  <Link2 size={14} />
                  {copiedLink === session.id ? 'Copied!' : 'Share'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div className={styles.createForm}>
          <h3 className={styles.modalTitle}>Create Collaboration Session</h3>
          <label className={styles.label}>
            Session Name
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name..."
              className={styles.input}
              autoFocus
            />
          </label>
          <div className={styles.formActions}>
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSession}
              disabled={!sessionName.trim() || isLoading}
            >
              Create Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 