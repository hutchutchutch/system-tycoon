import React, { useState } from 'react';
import { clsx } from 'clsx';
import styles from './ContactAvatar.module.css';
import type { ContactAvatarProps } from './ContactAvatar.types';

export const ContactAvatar: React.FC<ContactAvatarProps> = ({
  name,
  src,
  size = 'md',
  status,
  showStatus = false,
  alt,
  onClick,
  clickable = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    if (clickable || onClick) {
      onClick?.();
    }
  };

  const shouldShowImage = src && !imageError;
  const initials = getInitials(name);

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'var(--color-green-500)';
      case 'away':
        return 'var(--color-orange-500)';
      case 'busy':
        return 'var(--color-red-500)';
      case 'offline':
      default:
        return 'var(--color-gray-400)';
    }
  };

  return (
    <div
      className={clsx(
        styles.contactAvatar,
        styles[`contactAvatar--${size}`],
        {
          [styles['contactAvatar--clickable']]: clickable || onClick
        },
        className
      )}
      onClick={handleClick}
      role={clickable || onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      aria-label={alt || `${name}'s avatar`}
    >
      <div className={styles.image}>
        {shouldShowImage ? (
          <img
            src={src}
            alt={alt || `${name}'s avatar`}
            className={styles.img}
            onError={handleImageError}
          />
        ) : (
          <div className={styles.initials}>
            {initials}
          </div>
        )}
      </div>

      {showStatus && status && (
        <div 
          className={styles.status}
          style={{ backgroundColor: getStatusColor() }}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default ContactAvatar; 