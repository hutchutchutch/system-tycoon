import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import styles from './DesignPhaseTemplate.module.css';

/**
 * DesignPhaseTemplate
 * 
 * Purpose: Layout template for the system design phase
 * 
 * State Management:
 * - Pure presentational template
 * - ReactFlowProvider for canvas context
 * - All design state passed from page component
 * - No direct Redux connections
 */

interface DesignPhaseTemplateProps {
  sidebar?: React.ReactNode;
  canvas?: React.ReactNode;
  metrics?: React.ReactNode;
  mentor?: React.ReactNode;
  header?: React.ReactNode;
}

export const DesignPhaseTemplate: React.FC<DesignPhaseTemplateProps> = ({
  sidebar,
  canvas,
  metrics,
  mentor,
  header
}) => {
  return (
    <ReactFlowProvider>
      <div className={styles.template}>
        {header && (
          <header className={styles.header}>
            {header}
          </header>
        )}
        
        <div className={styles.workspace}>
          {sidebar && (
            <aside className={styles.sidebar}>
              {sidebar}
            </aside>
          )}
          
          <main className={styles.canvas}>
            {canvas || (
              <div className={styles.placeholder}>
                Design canvas will be rendered here
              </div>
            )}
          </main>
          
          {metrics && (
            <aside className={styles.metrics}>
              {metrics}
            </aside>
          )}
        </div>
        
        {mentor && (
          <div className={styles.mentor}>
            {mentor}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
};