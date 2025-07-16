import React from 'react';
import styles from './MeetingPhaseTemplate.module.css';

/**
 * MeetingPhaseTemplate
 * 
 * Purpose: Layout template for the requirements gathering phase
 * 
 * State Management:
 * - Pure presentational template
 * - All state passed via props from page component
 * - No local state or Redux connections
 * 
 * Props receive game state from pages that use this template
 */

interface MeetingPhaseTemplateProps {
  meetingData: any; // Will be properly typed when implementing
  onQuestionSelect: (questionId: string) => void;
  onProceedToMentorSelection: () => void;
  children?: React.ReactNode;
}

export const MeetingPhaseTemplate: React.FC<MeetingPhaseTemplateProps> = ({
  meetingData,
  onQuestionSelect,
  onProceedToMentorSelection,
  children
}) => {
  return (
    <div className={styles.meetingPhaseTemplate}>
      <header className={styles.header}>
        <h1>Requirements Gathering</h1>
        {/* Timer and other header content will be added */}
      </header>
      
      <main className={styles.content}>
        {children || (
          <div className={styles.placeholder}>
            Meeting room content will be rendered here
          </div>
        )}
      </main>
      
      <footer className={styles.footer}>
        <button onClick={onProceedToMentorSelection}>
          Proceed to Mentor Selection
        </button>
      </footer>
    </div>
  );
};