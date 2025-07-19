import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TodaysNewsWrapper } from './TodaysNewsWrapper';
import { MissionInitializer } from '../../components/mission/MissionInitializer';
import styles from './InitialExperience.module.css';

const InitialExperienceContent: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className={`${styles.initialExperience} ${styles['initialExperience--browser']}`}>
      {/* Render Today's News directly - no more BrowserWindow */}
      <TodaysNewsWrapper />
    </div>
  );
};

export const InitialExperience: React.FC = () => {
  return (
    <MissionInitializer>
      <InitialExperienceContent />
    </MissionInitializer>
  );
};