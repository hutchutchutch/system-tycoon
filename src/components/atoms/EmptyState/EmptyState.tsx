import React from 'react';
import { clsx } from 'clsx';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  /** Optional icon rendered above the title */
  icon?: React.ReactNode;
  /** Primary heading text */
  title: string;
  /** Optional supporting copy below the title */
  description?: string;
  /** Optional call-to-action button */
  action?: { label: string; onClick: () => void };
  className?: string;
}

/**
 * EmptyState - Atom component for empty / zero-state placeholders.
 *
 * Centered layout with icon, title, description, and an optional
 * action button. Purely presentational -- no business logic.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && (
        <button
          type="button"
          className={styles.actionButton}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
