import React from 'react';
import type { LogoProps } from './Logo.types';

export const Logo: React.FC<LogoProps> = ({
  src = "http://hextaui.com/logo.svg",
  alt = "Logo",
  size = 'md',
  variant = 'circle',
  className = '',
  onClick,
}) => {
  const sizeStyles = {
    xs: { width: '24px', height: '24px' },
    sm: { width: '32px', height: '32px' },
    md: { width: '48px', height: '48px' },
    lg: { width: '64px', height: '64px' },
    xl: { width: '80px', height: '80px' },
  };

  const variantStyles = {
    circle: { borderRadius: '50%' },
    square: { borderRadius: '0' },
    rounded: { borderRadius: 'var(--radius-md)' },
  };

  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all var(--transition-fast)',
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  const imageStyles = {
    width: '60%',
    height: '60%',
    objectFit: 'contain' as const,
  };

  return (
    <div
      style={baseStyles}
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img
        src={src}
        alt={alt}
        style={imageStyles}
      />
    </div>
  );
}; 