import React from 'react';
import { clsx } from 'clsx';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  showLabel = false,
  label,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const classes = clsx(
    'progress',
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