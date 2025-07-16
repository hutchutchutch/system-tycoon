import React from 'react';
import { clsx } from 'clsx';
import type { ButtonProps } from './Button.types';
import styles from './Button.module.css';

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
  // Map size prop values to CSS module classes
  const sizeClass = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md';
  
  const classes = clsx(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${sizeClass}`],
    {
      [styles['button--loading']]: loading,
      [styles['button--full-width']]: fullWidth,
      [styles['button--icon-only']]: !children && icon,
    },
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && !loading && (
        <span className={styles.button__icon}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className={styles.button__icon}>{icon}</span>
      )}
    </button>
  );
};