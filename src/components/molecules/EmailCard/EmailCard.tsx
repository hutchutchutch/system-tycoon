import React from 'react';
import { EmailStatus } from '../../atoms/EmailStatus';
import { Icon } from '../../atoms/Icon';
import { ContactAvatar } from '../ContactAvatar';
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
        return <Icon name="alert-circle" size="xs" className="email-card__priority email-card__priority--high" />;
      case 'low':
        return <Icon name="chevron-down" size="xs" className="email-card__priority email-card__priority--low" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        email-card 
        ${selected ? 'email-card--selected' : ''}
        ${email.status === 'unread' ? 'email-card--unread' : 'email-card--read'}
        ${compact ? 'email-card--compact' : ''}
        ${onClick ? 'email-card--clickable' : ''}
        ${className}
      `.trim()}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Status indicator */}
      <div className="email-card__status">
        <button
          className="email-card__status-button"
          onClick={handleStatusToggle}
          aria-label={email.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
          tabIndex={-1}
        >
          <EmailStatus status={email.status} size={compact ? 'sm' : 'md'} />
        </button>
      </div>

      {/* Sender avatar */}
      <div className="email-card__avatar">
        <ContactAvatar
          name={email.sender.name}
          src={email.sender.avatar}
          size={compact ? 'sm' : 'md'}
        />
      </div>

      {/* Email content */}
      <div className="email-card__content">
        <div className="email-card__header">
          <div className="email-card__sender">
            <span className="email-card__sender-name">
              {email.sender.name}
            </span>
            {!compact && (
              <span className="email-card__sender-email">
                {email.sender.email}
              </span>
            )}
          </div>
          
          <div className="email-card__meta">
            {getPriorityIcon()}
            {email.hasAttachments && (
              <Icon name="link" size="xs" className="email-card__attachment" />
            )}
            <span className="email-card__timestamp">
              {formatTimestamp(email.timestamp)}
            </span>
          </div>
        </div>

        <div className="email-card__subject">
          {truncateText(email.subject, compact ? 40 : 60)}
        </div>

        {!compact && (
          <div className="email-card__preview">
            {truncateText(email.preview, 120)}
          </div>
        )}

        {email.tags && email.tags.length > 0 && (
          <div className="email-card__tags">
            {email.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="email-card__tag">
                {tag}
              </span>
            ))}
            {email.tags.length > 3 && (
              <span className="email-card__tag-more">
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