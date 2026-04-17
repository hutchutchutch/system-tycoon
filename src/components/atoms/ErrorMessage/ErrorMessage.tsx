import React from 'react';
import { clsx } from 'clsx';
import { AlertCircle, X } from 'lucide-react';
import styles from './ErrorMessage.module.css';

export interface ErrorMessageProps {
  /** The error text to display */
  message: string;
  className?: string;
  /** If provided, renders a dismiss (X) button */
  onDismiss?: () => void;
}

/**
 * ErrorMessage - Atom component for inline error alerts.
 *
 * Renders a red-tinted alert box with an AlertCircle icon
 * and an optional dismiss button.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className,
  onDismiss,
}) => {
  return (
    <div className={clsx(styles.container, className)} role="alert">
      <span className={styles.icon}>
        <AlertCircle size={16} />
      </span>
      <span className={styles.text}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
