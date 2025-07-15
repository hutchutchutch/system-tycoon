import React from 'react';
import { clsx } from 'clsx';
import type { ButtonProps } from './Button.types';

/**
 * Button Component
 * 
 * Purpose: Primary interactive element for user actions throughout the game
 * 
 * State Management:
 * - Stateless component - all behavior controlled via props
 * - No local state or Redux connections
 * - Parent components handle onClick events and loading states
 * 
 * @example
 * <Button variant="primary" onClick={handleAction}>Start Game</Button>
 */

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const classes = clsx(
    'btn',
    `btn--${variant}`,
    size !== 'medium' && `btn--${size}`,
    loading && 'btn--loading',
    fullWidth && 'w-full',
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && !loading && (
        <span className="btn__icon">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="btn__icon">{icon}</span>
      )}
    </button>
  );
};