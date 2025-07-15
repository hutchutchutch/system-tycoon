import React from 'react';
import { clsx } from 'clsx';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

/**
 * Progress - Atom component for progress indicators
 * 
 * Redux State Usage:
 * - Displays state.game.player.experience progress
 * - Shows state.game.player.health/maxHealth
 * - Indicates state.battle.turnTimer countdown
 * - Tracks state.game.questProgress percentage
 * - Shows state.ui.loadingProgress for async operations
 */
export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const classes = clsx(
    'progress',
    `progress--${size}`,
    variant !== 'primary' && `progress--${variant}`,
    className
  );

  return (
    <div className={classes} {...props}>
      <div
        className="progress__bar"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
      {showLabel && (
        <span className="sr-only">
          {label || `${percentage.toFixed(0)}%`}
        </span>
      )}
    </div>
  );
};