import React from 'react';
import { clsx } from 'clsx';
import type { NotificationDotProps } from './NotificationDot.types';
import styles from './NotificationDot.module.css';

export const NotificationDot: React.FC<NotificationDotProps> = ({
  count = 0,
  max = 99,
  variant = 'primary',
  size = 'md',
  showWhenZero = false,
  pulse = false,
  className = '',
}) => {
  // Don't render if count is 0 and showWhenZero is false
  if (count === 0 && !showWhenZero) {
    return null;
  }

  const getDisplayCount = () => {
    if (count === 0) return '';
    if (count > max) return `${max}+`;
    return count.toString();
  };

  const displayCount = getDisplayCount();
  const hasCount = displayCount.length > 0;

  return (
    <div
      className={clsx(
        styles['notification-dot'],
        styles[`notification-dot--${variant}`],
        styles[`notification-dot--${size}`],
        {
          [styles['notification-dot--with-count']]: hasCount,
          [styles['notification-dot--pulse']]: pulse,
        },
        className
      )}
      role={hasCount ? 'status' : undefined}
      aria-label={hasCount ? `${count} notification${count === 1 ? '' : 's'}` : 'New notification'}
    >
      {hasCount && (
        <span className={styles['notification-dot__count']} aria-hidden="true">
          {displayCount}
        </span>
      )}
    </div>
  );
};

export default NotificationDot; 