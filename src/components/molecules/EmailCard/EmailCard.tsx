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

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
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

      {/* Email content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.sender}>
            <span className={styles.senderName}>
              {email.sender.name}
            </span>
            {!compact && (
              <span className={styles.senderEmail}>
                {email.sender.email}
              </span>
            )}
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

        <div className={styles.subject}>
          {truncateText(email.subject, compact ? 40 : 60)}
        </div>

        {!compact && (
          <div className={styles.preview}>
            {truncateText(email.preview, 120)}
          </div>
        )}

        {/* Tags section - now includes mission tag */}
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
      </div>
    </div>
  );
};

export default EmailCard; 