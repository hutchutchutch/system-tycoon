import React from 'react';
import { clsx } from 'clsx';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  /** Spinner diameter: sm=16px, md=24px, lg=48px */
  size?: 'sm' | 'md' | 'lg';
  /** Border color of the spinner arc */
  color?: 'primary' | 'white' | 'muted';
  className?: string;
}

/**
 * Spinner - Atom component for loading indicators.
 *
 * Purely presentational rotating border animation.
 * Uses design token colors from the foundation layer.
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
}) => {
  return (
    <span
      className={clsx(styles.spinner, styles[size], styles[color], className)}
      role="status"
      aria-label="Loading"
    />
  );
};
