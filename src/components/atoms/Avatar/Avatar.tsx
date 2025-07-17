import React, { useState } from 'react';
import type { AvatarProps } from './Avatar.types';

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  onClick,
  clickable = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name?: string) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
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

  const sizeStyles = {
    xs: { width: '20px', height: '20px', fontSize: '10px' },
    sm: { width: '24px', height: '24px', fontSize: '11px' },
    md: { width: '32px', height: '32px', fontSize: '14px' },
    lg: { width: '40px', height: '40px', fontSize: '16px' },
    xl: { width: '48px', height: '48px', fontSize: '18px' },
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface-tertiary)',
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-medium)',
    border: '2px solid var(--color-border-primary)',
    cursor: (clickable || onClick) ? 'pointer' : 'default',
    transition: 'all var(--transition-fast)',
    ...sizeStyles[size],
  };

  const shouldShowImage = src && !imageError;

  return (
    <div
      style={baseStyles}
      onClick={handleClick}
      className={className}
      role={clickable || onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt || name}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}; 