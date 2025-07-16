import React from 'react';
import { clsx } from 'clsx';
import { Icon } from '../Icon';
import type { EmailStatusProps, EmailStatusType } from './EmailStatus.types';
import type { IconName } from '../Icon/Icon.types';
import styles from './EmailStatus.module.css';

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
          icon: 'mail' as IconName,
          label: 'Unread',
        };
      case 'read':
        return {
          icon: 'mail' as IconName,
          label: 'Read',
        };
      case 'replied':
        return {
          icon: 'arrow-left' as IconName,
          label: 'Replied',
        };
      case 'forwarded':
        return {
          icon: 'arrow-right' as IconName,
          label: 'Forwarded',
        };
      case 'draft':
        return {
          icon: 'edit' as IconName,
          label: 'Draft',
        };
      default:
        return {
          icon: 'mail' as IconName,
          label: 'Email',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div 
      className={clsx(
        styles['email-status'],
        styles[`email-status--${status}`],
        styles[`email-status--${size}`],
        className
      )}
      aria-label={`Email ${status}`}
    >
      <Icon 
        name={config.icon} 
        size={size === 'sm' ? 'xs' : 'sm'} 
        className={styles['email-status__icon']}
      />
      {showLabel && (
        <span className={styles['email-status__label']}>{config.label}</span>
      )}
      <span className={styles['email-status__dot']} aria-hidden="true" />
    </div>
  );
};

export default EmailStatus; 