import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChooseMissionWrapper } from './ChooseMissionWrapper';
import { MissionInitializer } from '../../components/mission/MissionInitializer';
import styles from './InitialExperience.module.css';

const InitialExperienceContent: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className={`${styles.initialExperience} ${styles['initialExperience--browser']}`}>
              {/* Render Choose Mission directly - no more BrowserWindow */}
              <ChooseMissionWrapper />
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