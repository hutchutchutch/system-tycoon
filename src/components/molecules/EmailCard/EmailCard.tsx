import React from 'react';
import { clsx } from 'clsx';
import { EmailStatus } from '../../atoms/EmailStatus';
import { Icon } from '../../atoms/Icon';
import { ContactAvatar } from '../ContactAvatar/ContactAvatar';
import { formatRelativeTime } from '../../../utils/dateUtils';
import { mapEmailStatus, getPriorityIconInfo, getMissionTagText } from '../../../utils/emailUtils';
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
    onStatusChange?.(email.id, mapEmailStatus(newStatus));
  };

  const priorityInfo = getPriorityIconInfo(email.priority);

  // Check if this is a mission email
  const isMissionEmail = Boolean(email.missionId);

  // Get mission stage text for the tag
  const missionTagText = getMissionTagText(email.missionId, email.triggerType, email.stageNumber);

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
            {priorityInfo && (
              <Icon
                name={priorityInfo.iconName as any}
                size="xs"
                className={clsx(styles.priority, styles[`priority--${priorityInfo.severity}`])}
              />
            )}
            {email.attachments && email.attachments.length > 0 && (
              <Icon name="link" size="xs" className={styles.attachment} />
            )}
            <span className={styles.timestamp}>
              {formatRelativeTime(email.sentAt)}
            </span>
          </div>
        </div>

        {/* Tags section - now includes mission tag */}
        {(isMissionEmail || (email.tags && email.tags.length > 0)) && (
          <div className={styles.tags}>
            {/* Mission tag - always first and most prominent */}
            {isMissionEmail && missionTagText && (
              <span className={clsx(styles.tag, styles.missionTag)}>
                <Icon name="star" size="xs" className={styles.missionIcon} />
                {missionTagText}
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
