import React from 'react';
import { Icon } from '../Icon';
import type { EmailStatusProps, EmailStatusType } from './EmailStatus.types';

export const EmailStatus: React.FC<EmailStatusProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const getStatusConfig = (status: EmailStatusType) => {
    switch (status) {
      case 'unread':
        return {
          icon: 'mail' as const,
          label: 'Unread',
          className: 'email-status--unread',
        };
      case 'read':
        return {
          icon: 'mail' as const,
          label: 'Read',
          className: 'email-status--read',
        };
      case 'replied':
        return {
          icon: 'arrow-left' as const,
          label: 'Replied',
          className: 'email-status--replied',
        };
      case 'forwarded':
        return {
          icon: 'arrow-right' as const,
          label: 'Forwarded',
          className: 'email-status--forwarded',
        };
      case 'draft':
        return {
          icon: 'edit' as const,
          label: 'Draft',
          className: 'email-status--draft',
        };
      default:
        return {
          icon: 'mail' as const,
          label: 'Email',
          className: 'email-status--default',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`email-status email-status--${size} ${config.className} ${className}`}>
      <Icon name={config.icon} size={size === 'lg' ? 'md' : 'sm'} />
      {showLabel && (
        <span className="email-status__label">{config.label}</span>
      )}
      {status === 'unread' && (
        <div className="email-status__unread-dot" />
      )}
    </div>
  );
};

export default EmailStatus; 