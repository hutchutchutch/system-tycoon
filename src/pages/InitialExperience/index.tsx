import React from 'react';
import { ChooseMissionWrapper } from './ChooseMissionWrapper';
import styles from './InitialExperience.module.css';

export const InitialExperience: React.FC = () => {
  return (
    <div className={`${styles.initialExperience} ${styles['initialExperience--browser']}`}>
      {/* Render Choose Mission directly - no more BrowserWindow */}
      <ChooseMissionWrapper />
    </div>
  );
};
