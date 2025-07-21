import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { checkAuth } from '../../features/auth/authSlice';
import { MentorChat } from '../molecules/MentorChat';

export const RootLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  // Get current mission context if available
  const currentMission = useAppSelector(state => state.mission.currentDatabaseMission || state.mission.currentMission);
  const currentStageIndex = useAppSelector(state => state.mission.currentDatabaseMission?.currentStageIndex || 0);
  
  // Handle both Mission (with steps) and DatabaseMission (with stages)
  const missionContext = (() => {
    if (!currentMission) {
      return {
        missionStageId: '',
        missionTitle: '',
        problemDescription: ''
      };
    }
    
    // Check if it's a DatabaseMission (has stages)
    if ('stages' in currentMission && currentMission.stages) {
      const currentStage = currentMission.stages[currentStageIndex];
      return {
        missionStageId: currentStage?.id || '',
        missionTitle: currentMission.title || '',
        problemDescription: currentStage?.problem_description || ''
      };
    }
    
    // Otherwise it's a Mission (has steps)
    if ('steps' in currentMission && currentMission.steps) {
      const currentStep = currentMission.steps[currentMission.currentStepIndex || 0];
      return {
        missionStageId: currentStep?.id || '',
        missionTitle: currentMission.title || '',
        problemDescription: currentStep?.description || ''
      };
    }
    
    // Fallback
    return {
      missionStageId: '',
      missionTitle: currentMission.title || '',
      problemDescription: ''
    };
  })();

  useEffect(() => {
    // Check for existing session on mount
    dispatch(checkAuth());
  }, [dispatch]);

  // Determine if we should show MentorChat
  // Don't show on landing, auth, onboarding, or mentor selection pages
  const excludedPaths = ['/', '/auth', '/onboarding'];
  const isExcludedPath = excludedPaths.includes(location.pathname) || 
                         location.pathname.startsWith('/mentor/');
  
  const showMentorChat = isAuthenticated && !isExcludedPath;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-neutral-50)' }}>
      <Outlet />
      
      {/* Global MentorChat - Always available when authenticated */}
      {showMentorChat && (
        <MentorChat
          missionStageId={missionContext.missionStageId}
          missionTitle={missionContext.missionTitle}
          problemDescription={missionContext.problemDescription}
        />
      )}
    </div>
  );
};