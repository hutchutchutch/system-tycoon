import React from 'react';
import { clsx } from 'clsx';
import styles from './DesignPhaseTemplate.module.css';

export interface DesignPhaseTemplateProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  canvas?: React.ReactNode;
  metrics?: React.ReactNode;
  mentor?: React.ReactNode;
  className?: string;
}

/**
 * DesignPhaseTemplate - Template for the system design phase
 * 
 * Redux State Usage:
 * - Pure presentational template
 * - All components passed as props from page component
 * - No direct Redux connections
 */
export const DesignPhaseTemplate: React.FC<DesignPhaseTemplateProps> = ({
  header,
  sidebar,
  canvas,
  metrics,
  mentor,
  className,
}) => {
  return (
    <div className={clsx(styles['design-phase-template'], className)}>
      {/* Header with timer and phase info */}
      {header && (
        <header className={styles['design-phase-template__header']}>
          {header}
        </header>
      )}

      {/* Main workspace */}
      <div className={styles['design-phase-template__workspace']}>
        {/* Component drawer */}
        {sidebar && (
          <aside className={styles['design-phase-template__sidebar']}>
            {sidebar}
          </aside>
        )}

        {/* Canvas area */}
        <main className={styles['design-phase-template__canvas']}>
          {canvas || (
            <div className={styles['design-phase-template__placeholder']}>
              Drag components here to design your system
            </div>
          )}
        </main>

        {/* Metrics panel */}
        {metrics && (
          <aside className={styles['design-phase-template__metrics']}>
            {metrics}
          </aside>
        )}
      </div>

      {/* Mentor */}
      {mentor && (
        <div className={styles['design-phase-template__mentor']}>
          {mentor}
        </div>
      )}
    </div>
  );
};