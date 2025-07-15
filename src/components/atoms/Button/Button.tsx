import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'icon-only';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

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