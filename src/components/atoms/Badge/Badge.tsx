import React from 'react';
import { clsx } from 'clsx';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

/**
 * Badge - Atom component for status indicators and labels
 * 
 * Redux State Usage:
 * - Often displays values from state.game.player.level
 * - Shows achievement counts from state.game.achievements
 * - Indicates component rarity from state.game.inventory[].rarity
 * - Displays notification counts from state.ui.notifications.length
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  className,
  children,
  ...props
}) => {
  const classes = clsx(
    styles.badge,
    styles[variant],
    styles[size],
    className
  );

  return (
    <span className={classes} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};