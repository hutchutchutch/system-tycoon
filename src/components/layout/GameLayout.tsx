import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { GameHUD } from '../organisms/GameHUD';
import { MentorChat } from '../molecules/MentorChat';
import { useAppSelector } from '../../hooks/redux';
import styles from './GameLayout.module.css';

export const GameLayout: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const { currentDatabaseMission } = useAppSelector(state => state.mission);
  
  // Hide GameHUD on design pages since they have their own integrated HUD
  const shouldShowGameHUD = !location.pathname.startsWith('/design');
  
  // Check if we're on the initial experience page
  const isInitialExperience = location.pathname === '/game';
  
  // Determine mission context based on current route
  const getMissionContext = () => {
    const path = location.pathname;
    
    if (path === '/game') {
      return {
        missionStageId: 'initial-experience',
        missionTitle: 'Getting Started',
        problemDescription: 'Learn how to use the system and complete your first mission'
      };
    }
    
    if (path === '/browser/news') {
      return {
        missionStageId: 'todays-news',
        missionTitle: "Choose Mission",
        problemDescription: 'Review the latest crises and choose your mission'
      };
    }
    
    if (path === '/email') {
      return {
        missionStageId: 'email-client',
        missionTitle: 'Email Communication',
        problemDescription: 'Manage communications and coordinate responses'
      };
    }
    
    if (path.startsWith('/crisis-design/')) {
      const currentStage = currentDatabaseMission?.stages?.[currentDatabaseMission.currentStageIndex];
      return {
        missionStageId: currentStage?.id || params.emailId,
        missionTitle: currentStage?.title || currentDatabaseMission?.title || 'Crisis Response System',
        problemDescription: currentStage?.problem_description || 'Design a system to handle the current crisis'
      };
    }
    
    if (path.startsWith('/design/')) {
      return {
        missionStageId: params.scenarioId,
        missionTitle: 'System Design',
        problemDescription: 'Design a scalable system architecture'
      };
    }
    
    // Default context for other pages
    return {
      missionStageId: 'general-help',
      missionTitle: 'System Design Assistant',
      problemDescription: 'Get help with system design concepts and best practices'
    };
  };

  const missionContext = getMissionContext();

  return (
    <div className={styles.gameLayout}>
      {shouldShowGameHUD && <GameHUD />}
      <main className={shouldShowGameHUD ? styles.mainWithHUD : styles.mainNoHUD}>
        <Outlet />
      </main>
      
      {/* Global MentorChat - Always available in bottom left */}
      <MentorChat
        missionStageId={missionContext.missionStageId}
        missionTitle={missionContext.missionTitle}
        problemDescription={missionContext.problemDescription}
      />
    </div>
  );
};