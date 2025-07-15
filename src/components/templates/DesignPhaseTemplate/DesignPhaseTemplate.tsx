import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';

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
      <div className="design-phase-template">
        {header && (
          <header className="design-phase-template__header">
            {header}
          </header>
        )}
        
        <div className="design-phase-template__workspace">
          {sidebar && (
            <aside className="design-phase-template__sidebar">
              {sidebar}
            </aside>
          )}
          
          <main className="design-phase-template__canvas">
            {canvas || (
              <div className="design-phase-template__placeholder">
                Design canvas will be rendered here
              </div>
            )}
          </main>
          
          {metrics && (
            <aside className="design-phase-template__metrics">
              {metrics}
            </aside>
          )}
        </div>
        
        {mentor && (
          <div className="design-phase-template__mentor">
            {mentor}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
};