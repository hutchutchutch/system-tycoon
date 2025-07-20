import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { updateMissionProgress, showNewEmailNotification, addEmail } from '../slices/emailSlice';
import { emailApi } from '../api/emailApi';
import type { Email } from '../../types/email.types';

/**
 * Simplified middleware that handles automatic email progression when stages are completed.
 * This ensures users only see emails they've earned through gameplay.
 */
export const emailProgressionMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: any) => {
  const result = next(action);
  
  // Simple action type checking for stage completion
  const actionType = action?.type || '';
  
  if (actionType.includes('completeStage') || actionType.includes('completePhase')) {
    // Handle stage completion asynchronously
    setTimeout(() => handleStageCompletion(store, action.payload), 100);
  }
  
  if (actionType.includes('startMission') || actionType.includes('startSession')) {
    // Handle mission start asynchronously
    setTimeout(() => handleMissionStart(store, action.payload), 100);
  }
  
  return result;
};

/**
 * Handle stage completion and check for new emails
 */
async function handleStageCompletion(store: any, payload: any) {
  try {
    const { dispatch } = store;
    const _state = store.getState() as RootState; // TODO: Use state if needed
    
    // Simple payload extraction
    const playerId = payload?.playerId || 'default-player';
    const missionId = payload?.missionId || payload?.levelId || 'current-mission';
    const stageNumber = payload?.stageNumber || 1;
    
    // Call the API to check for new emails
    const result = await dispatch(
      emailApi.endpoints.completeStageAndCheckEmails.initiate({
        playerId,
        missionId,
        stageNumber,
        completionData: {
          score: payload?.score || 0,
          timeSpent: payload?.timeSpent || 0,
          design: payload?.design,
          metricsAchieved: payload?.metrics,
        },
      })
    );
    
    if (result.data?.newEmails?.length > 0) {
      const { newEmails } = result.data;
      
      // Update mission progress
      dispatch(updateMissionProgress({
        missionId,
        completedStage: stageNumber,
        newAvailableEmails: newEmails.map((email: Email) => email.id),
      }));
      
      // Add new emails to state
      newEmails.forEach((email: Email) => {
        dispatch(addEmail(email));
        
        // Show notification for urgent emails
        if (email.isUrgent || email.priority === 'high') {
          dispatch(showNewEmailNotification(email));
        }
      });
      
      console.log(`Stage ${stageNumber} completed. ${newEmails.length} new emails delivered.`);
    }
  } catch (error) {
    console.error('Error checking email progression:', error);
  }
}

/**
 * Handle mission start and deliver initial email
 */
async function handleMissionStart(store: any, payload: any) {
  try {
    const { dispatch } = store;
    
    const playerId = payload?.playerId || 'default-player';
    const missionId = payload?.missionId || payload?.levelId || 'current-mission';
    
    // Check for initial mission emails
    const result = await dispatch(
      emailApi.endpoints.checkEmailProgression.initiate({
        playerId,
        missionId,
        stageNumber: 0, // Mission start
        completionData: {
          score: 0,
          timeSpent: 0,
        },
      })
    );
    
    if (result.data?.newEmails?.length > 0) {
      const { newEmails } = result.data;
      
      // Add initial emails
      newEmails.forEach((email: Email) => {
        dispatch(addEmail(email));
      });
      
      // Show notification for urgent initial email
      const urgentEmail = newEmails.find((email: Email) => email.isUrgent);
      if (urgentEmail) {
        dispatch(showNewEmailNotification(urgentEmail));
      }
      
      console.log(`Mission ${missionId} started. ${newEmails.length} initial emails delivered.`);
    }
  } catch (error) {
    console.error('Error handling mission start emails:', error);
  }
} 