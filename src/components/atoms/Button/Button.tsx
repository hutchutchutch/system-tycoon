import React from 'react';
import { clsx } from 'clsx';
import { ButtonProps } from './Button.types';

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