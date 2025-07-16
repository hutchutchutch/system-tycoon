import React from 'react';
import { clsx } from 'clsx';
import { EmailStatus } from '../../atoms/EmailStatus';
import { Icon } from '../../atoms/Icon';
import { ContactAvatar } from '../ContactAvatar';
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

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = email.status === 'unread' ? 'read' : 'unread';
    onStatusChange?.(email.id, newStatus);
  };

  const formatTimestamp = (date: Date) => {
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
        return <Icon name="alert-circle" size="xs" className={clsx(styles.priority, styles['priority--high'])} />;
      case 'low':
        return <Icon name="chevron-down" size="xs" className={clsx(styles.priority, styles['priority--low'])} />;
      default:
        return null;
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
          [styles['emailCard--clickable']]: onClick
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
          <EmailStatus status={email.status} size={compact ? 'sm' : 'md'} />
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
            {email.hasAttachments && (
              <Icon name="link" size="xs" className={styles.attachment} />
            )}
            <span className={styles.timestamp}>
              {formatTimestamp(email.timestamp)}
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

        {email.tags && email.tags.length > 0 && (
          <div className={styles.tags}>
            {email.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
            {email.tags.length > 3 && (
              <span className={styles.tagMore}>
                +{email.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCard; 