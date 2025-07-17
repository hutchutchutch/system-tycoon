import React from 'react';
import { Users } from 'lucide-react';
import type { ParticipantsListProps } from './ParticipantsList.types';
import styles from './ParticipantsList.module.css';

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  const participantList = Object.values(participants);
  
  if (participantList.length === 0) {
    return (
      <div className={styles.participantsList}>
        <h3 className={styles.title}>
          <Users size={16} />
          Collaborators
        </h3>
        <p className={styles.emptyState}>No other users online</p>
      </div>
    );
  }

  return (
    <div className={styles.participantsList}>
      <h3 className={styles.title}>
        <span className={styles.statusIndicator}></span>
        Collaborators ({participantList.length})
      </h3>
      
      <div className={styles.participantGrid}>
        {participantList.map(participant => (
          <div key={participant.id} className={styles.participant}>
            {/* Avatar */}
            <div 
              className={styles.avatar}
              style={{ backgroundColor: participant.color }}
            >
              {participant.avatar_url ? (
                <img 
                  src={participant.avatar_url} 
                  alt={participant.name}
                  className={styles.avatarImage}
                />
              ) : (
                <span className={styles.avatarInitials}>
                  {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* User info */}
            <div className={styles.userInfo}>
              <p className={styles.userName}>
                {participant.name}
              </p>
              <div className={styles.status}>
                <div className={`${styles.statusDot} ${styles[`status--${participant.status}`]}`}></div>
                <span className={styles.statusText}>
                  {participant.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 