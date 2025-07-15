import React from 'react';
import type { NotificationDotProps } from './NotificationDot.types';

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
      className={`
        notification-dot 
        notification-dot--${variant} 
        notification-dot--${size}
        ${hasCount ? 'notification-dot--with-count' : 'notification-dot--simple'}
        ${pulse ? 'notification-dot--pulse' : ''}
        ${className}
      `.trim()}
      role={hasCount ? 'status' : undefined}
      aria-label={hasCount ? `${count} notification${count === 1 ? '' : 's'}` : 'New notification'}
    >
      {hasCount && (
        <span className="notification-dot__count" aria-hidden="true">
          {displayCount}
        </span>
      )}
    </div>
  );
};

export default NotificationDot; 