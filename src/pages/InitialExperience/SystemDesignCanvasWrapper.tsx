import React, { useState } from 'react';
import { CrisisSystemDesignCanvas } from './CrisisSystemDesignCanvas';
import './SystemDesignCanvasWrapper.css';

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
      <div className="system-design-wrapper">
        <div className="system-design-loading">
          <div className="system-design-loading__spinner"></div>
          <p>Analyzing Alex's broken system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="system-design-wrapper">      
      <CrisisSystemDesignCanvas
        missionId={currentMission}
        onMissionComplete={handleMissionComplete}
      />
    </div>
  );
};