import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { startMission } from '../../features/mission/missionSlice';

interface MissionInitializerProps {
  children: React.ReactNode;
}

export const MissionInitializer: React.FC<MissionInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const currentMission = useAppSelector((state) => state.mission.currentMission);
  const completedMissions = useAppSelector((state) => state.mission.completedMissions);

  useEffect(() => {
    // Check if user needs to start the health crisis mission
    if (!currentMission && !completedMissions.includes('health_crisis')) {
      // Start the health crisis mission for new users
      dispatch(startMission('health_crisis'));
    }
  }, [dispatch, currentMission, completedMissions]);

  return <>{children}</>;
};