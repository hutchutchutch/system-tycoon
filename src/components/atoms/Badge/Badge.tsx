import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'premium';
  size?: 'small' | 'medium';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  className,
  children,
  ...props
}) => {
  const classes = clsx(
    'badge',
    `badge--${variant}`,
    size === 'small' && 'text-xs py-0.5 px-1.5',
    className
  );

  return (
    <span className={classes} {...props}>
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  );
};