import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  selectAvailableEmails,
  selectUnreadCount,
  selectSelectedEmail,
  selectMissionProgress,
  selectNewEmailNotification,
  markEmailAsRead,
  clearEmailNotification,
  updateMissionProgress,
} from '../store/slices/emailSlice';
import {
  useGetUserEmailsQuery,
  useCompleteStageAndCheckEmailsMutation,
  useMarkEmailAsReadMutation,
  useGetMissionEmailsQuery,
} from '../store/api/emailApi';
import type { Email } from '../types/email.types';

export interface UseEmailProgressionReturn {
  // Email Data
  availableEmails: Email[];
  unreadCount: number;
  selectedEmail: Email | null;
  newEmailNotification: Email | null;
  
  // Mission Progress
  missionProgress: any; // Based on current mission
  
  // Actions
  markAsRead: (emailId: string) => void;
  clearNotification: () => void;
  completeStageAndCheckEmails: (stageData: StageCompletionData) => Promise<Email[]>;
  
  // Loading States
  isLoadingEmails: boolean;
  isCompletingStage: boolean;
  
  // Error States
  emailError: string | null;
}

export interface StageCompletionData {
  playerId: string;
  missionId: string;
  stageNumber: number;
  score: number;
  timeSpent: number;
  design?: any;
  metricsAchieved?: Record<string, number>;
}

/**
 * Hook for managing email progression in the game.
 * Handles automatic email delivery based on stage completion and mission progress.
 */
export const useEmailProgression = (
  playerId: string,
  currentMissionId?: string
): UseEmailProgressionReturn => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const availableEmails = useAppSelector(selectAvailableEmails);
  const unreadCount = useAppSelector(selectUnreadCount);
  const selectedEmail = useAppSelector(selectSelectedEmail);
  const newEmailNotification = useAppSelector(selectNewEmailNotification);
  const missionProgress = useAppSelector(selectMissionProgress(currentMissionId || ''));
  
  // API Hooks
  const {
    data: userEmailsData,
    isLoading: isLoadingEmails,
    error: emailsError,
  } = useGetUserEmailsQuery(playerId, {
    skip: !playerId,
  });
  
  const {
    data: missionEmails,
    isLoading: isLoadingMissionEmails,
  } = useGetMissionEmailsQuery(
    { missionId: currentMissionId || '', playerId },
    { skip: !currentMissionId || !playerId }
  );
  
  const [markEmailAsReadMutation] = useMarkEmailAsReadMutation();
  const [completeStageAndCheckEmailsMutation, { isLoading: isCompletingStage }] = 
    useCompleteStageAndCheckEmailsMutation();
  
  // Actions
  const markAsRead = useCallback(async (emailId: string) => {
    dispatch(markEmailAsRead(emailId));
    
    try {
      await markEmailAsReadMutation({ emailId, playerId });
    } catch (error) {
      console.error('Failed to mark email as read:', error);
    }
  }, [dispatch, markEmailAsReadMutation, playerId]);
  
  const clearNotification = useCallback(() => {
    dispatch(clearEmailNotification());
  }, [dispatch]);
  
  const completeStageAndCheckEmails = useCallback(async (
    stageData: StageCompletionData
  ): Promise<Email[]> => {
    try {
      const result = await completeStageAndCheckEmailsMutation({
        playerId: stageData.playerId,
        missionId: stageData.missionId,
        stageNumber: stageData.stageNumber,
        completionData: {
          score: stageData.score,
          timeSpent: stageData.timeSpent,
          design: stageData.design,
          metricsAchieved: stageData.metricsAchieved,
        },
      }).unwrap();
      
      if (result.newEmails && result.newEmails.length > 0) {
        // Update mission progress in Redux
        dispatch(updateMissionProgress({
          missionId: stageData.missionId,
          completedStage: stageData.stageNumber,
          newAvailableEmails: result.newEmails.map(email => email.id),
        }));
        
        return result.newEmails;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to complete stage and check emails:', error);
      return [];
    }
  }, [completeStageAndCheckEmailsMutation, dispatch]);
  
  // Effect to handle initial email loading
  useEffect(() => {
    if (userEmailsData) {
      // Redux state is already updated via RTK Query integration
      console.log(`Loaded ${userEmailsData.emails.length} emails for user ${playerId}`);
    }
  }, [userEmailsData, playerId]);
  
  return {
    // Email Data
    availableEmails,
    unreadCount,
    selectedEmail,
    newEmailNotification,
    
    // Mission Progress
    missionProgress,
    
    // Actions
    markAsRead,
    clearNotification,
    completeStageAndCheckEmails,
    
    // Loading States
    isLoadingEmails: isLoadingEmails || isLoadingMissionEmails,
    isCompletingStage,
    
    // Error States
    emailError: emailsError ? String(emailsError) : null,
  };
};

/**
 * Helper hook for triggering email checks after completing a stage
 */
export const useStageCompletion = (playerId: string, missionId: string) => {
  const { completeStageAndCheckEmails } = useEmailProgression(playerId, missionId);
  
  return useCallback(async (
    stageNumber: number,
    score: number,
    timeSpent: number,
    additionalData?: {
      design?: any;
      metricsAchieved?: Record<string, number>;
    }
  ) => {
    const newEmails = await completeStageAndCheckEmails({
      playerId,
      missionId,
      stageNumber,
      score,
      timeSpent,
      design: additionalData?.design,
      metricsAchieved: additionalData?.metricsAchieved,
    });
    
    if (newEmails.length > 0) {
      console.log(`Stage ${stageNumber} completed! ${newEmails.length} new emails received.`);
      
      // You could add a toast notification here
      // toast.success(`You have ${newEmails.length} new emails!`);
    }
    
    return newEmails;
  }, [completeStageAndCheckEmails, playerId, missionId]);
};

/**
 * Hook for checking if a specific email is accessible to the user
 */
export const useEmailAccessibility = (emailId: string, missionId: string) => {
  const missionProgress = useAppSelector(selectMissionProgress(missionId));
  const availableEmails = useAppSelector(selectAvailableEmails);
  
  const isAccessible = availableEmails.some(email => email.id === emailId);
  const hasBeenDelivered = missionProgress?.deliveredEmails.includes(emailId) || false;
  
  return {
    isAccessible,
    hasBeenDelivered,
    canView: isAccessible && hasBeenDelivered,
  };
}; 