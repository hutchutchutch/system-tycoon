import React, { useState } from 'react';
import { CrisisSystemDesignCanvas } from './CrisisSystemDesignCanvas';
import styles from './SystemDesignCanvasWrapper.module.css';

interface SystemDesignCanvasWrapperProps {
  onMissionComplete?: () => void;
}

export const SystemDesignCanvasWrapper: React.FC<SystemDesignCanvasWrapperProps> = ({ 
  onMissionComplete
}) => {
  const [loading, setLoading] = useState(true);
  const [currentMission, setCurrentMission] = useState('separate_concerns');

  React.useEffect(() => {
    // Simulate loading the broken system
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleMissionComplete = () => {
    // For now, just call the parent handler
    // In a full implementation, this would advance to the next mission
    onMissionComplete?.();
  };

  if (loading) {
    return (
      <div className={styles.systemDesignWrapper}>
        <div className={styles.systemDesignLoading}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Analyzing Alex's broken system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.systemDesignWrapper}>      
      <CrisisSystemDesignCanvas />
    </div>
  );
};