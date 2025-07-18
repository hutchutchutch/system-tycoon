import React from 'react';
import { clsx } from 'clsx';
import { EmailStatus } from '../../atoms/EmailStatus';
import type { EmailStatusType } from '../../atoms/EmailStatus';
import { Icon } from '../../atoms/Icon';
import { ContactAvatar } from '../ContactAvatar/ContactAvatar';
import styles from './EmailCard.module.css';
import type { EmailCardProps } from './EmailCard.types';

export const EmailCard: React.FC<EmailCardProps> = ({
  email,
  selected = false,
  onClick,
  onStatusChange,
  compact = false,
  className = '',
}) => {
  const handleClick = () => {
    onClick?.(email);
  };

  // Map Email status to EmailStatusType for the EmailStatus component
  const mapEmailStatus = (status: string): EmailStatusType => {
    switch (status) {
      case 'unread':
        return 'unread';
      case 'read':
        return 'read';
      case 'archived':
        return 'draft'; // Map archived to draft for display purposes
      case 'deleted':
        return 'draft'; // Map deleted to draft for display purposes
      default:
        return 'read';
    }
  };

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = email.status === 'unread' ? 'read' : 'unread';
    onStatusChange?.(email.id, mapEmailStatus(newStatus));
  };

  const formatTimestamp = (dateInput: string | Date) => {
    // Handle different input types and invalid dates
    let date: Date;
    
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      return 'Just now'; // Fallback for invalid input
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Just now'; // Fallback for invalid dates
    }
    
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      // Show actual date for older emails
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getPriorityIcon = () => {
    switch (email.priority) {
      case 'high':
      case 'urgent':
        return <Icon name="alert-circle" size="xs" className={clsx(styles.priority, styles['priority--high'])} />;
      case 'low':
        return <Icon name="chevron-down" size="xs" className={clsx(styles.priority, styles['priority--low'])} />;
      default:
        return null;
    }
  };

  // Check if this is a mission email
  const isMissionEmail = Boolean(email.missionId);
  
  // Get mission stage text for the tag
  const getMissionTagText = () => {
    if (!isMissionEmail) return null;
    
    if (email.triggerType === 'mission_start') {
      return 'MISSION START';
    } else if (email.triggerType === 'stage_complete' && email.stageNumber) {
      return `STAGE ${email.stageNumber}`;
    } else if (email.triggerType === 'performance_based') {
      return 'MISSION CRITICAL';
    } else {
      return 'MISSION';
    }
  };

  return (
    <div
      className={clsx(
        styles.emailCard,
        {
          [styles['emailCard--selected']]: selected,
          [styles['emailCard--unread']]: email.status === 'unread',
          [styles['emailCard--read']]: email.status === 'read',
          [styles['emailCard--compact']]: compact,
          [styles['emailCard--clickable']]: onClick,
          [styles['emailCard--mission']]: isMissionEmail
        },
        className
      )}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Status indicator */}
      <div className={styles.status}>
        <button
          className={styles.statusButton}
          onClick={handleStatusToggle}
          aria-label={email.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
          tabIndex={-1}
        >
          <EmailStatus status={mapEmailStatus(email.status)} size={compact ? 'sm' : 'md'} />
        </button>
      </div>

      {/* Sender avatar */}
      <div className={styles.avatar}>
        <ContactAvatar
          name={email.sender.name}
          src={email.sender.avatar}
          size={compact ? 'sm' : 'md'}
        />
      </div>

      {/* Email content - NEW 2-ROW LAYOUT */}
      <div className={styles.content}>
        {/* Row 1: Sender Name */}
        <div className={styles.senderRow}>
          <span className={styles.senderName}>
            {email.sender.name}
          </span>
        </div>

        {/* Row 2: Subject (bold) + Body (truncated) + Timestamp */}
        <div className={styles.contentRow}>
          <div className={styles.contentText}>
            <span className={styles.subject}>
              {email.subject}
            </span>
            <span className={styles.bodyText}>
              {email.body || email.preview}
            </span>
          </div>
          
          <div className={styles.meta}>
            {getPriorityIcon()}
            {email.attachments && email.attachments.length > 0 && (
              <Icon name="link" size="xs" className={styles.attachment} />
            )}
            <span className={styles.timestamp}>
              {formatTimestamp(email.sentAt)}
            </span>
          </div>
        </div>

        {/* Tags section - now includes mission tag */}
        {(isMissionEmail || (email.tags && email.tags.length > 0)) && (
          <div className={styles.tags}>
            {/* Mission tag - always first and most prominent */}
            {isMissionEmail && (
              <span className={clsx(styles.tag, styles.missionTag)}>
                <Icon name="star" size="xs" className={styles.missionIcon} />
                {getMissionTagText()}
              </span>
            )}
            
            {/* Regular tags */}
            {email.tags && email.tags.length > 0 && (
              <>
                {email.tags.slice(0, isMissionEmail ? 2 : 3).map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
                {email.tags.length > (isMissionEmail ? 2 : 3) && (
                  <span className={styles.tagMore}>
                    +{email.tags.length - (isMissionEmail ? 2 : 3)}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCard; 