import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { MeetingPhaseTemplate } from '../../templates/MeetingPhaseTemplate';
import { MeetingRoom } from '../../organisms/MeetingRoom';
import styles from './MeetingPage.module.css';

/**
 * MeetingPage
 * 
 * Purpose: Requirements gathering phase page component
 * 
 * State Management:
 * - Connects to Redux meeting slice for questions and dialogue
 * - Manages phase transitions through game slice
 * - Handles question selection and dialogue updates
 * - Passes formatted data to template and organisms
 * 
 * Redux connections:
 * - Reads: meeting.availableQuestions, meeting.selectedQuestions, meeting.dialogueHistory
 * - Writes: selectQuestion, addDialogueEntry, transitionPhase
 */

export const MeetingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const meetingState = useAppSelector(state => state.meeting);
  const gameState = useAppSelector(state => state.game);
  
  const handleQuestionSelect = (questionId: string) => {
    // Dispatch action to select question
    console.log('Question selected:', questionId);
    // dispatch(selectQuestion(questionId));
  };
  
  const handleProceedToMentorSelection = () => {
    // Transition to next phase
    console.log('Proceeding to mentor selection');
    // dispatch(transitionPhase('mentor-selection'));
  };
  
  const meetingData = {
    teamMembers: meetingState.teamMembers || [],
    availableQuestions: meetingState.availableQuestions || [],
    selectedQuestions: meetingState.selectedQuestions || [],
    maxQuestions: meetingState.maxQuestions || 3,
    questionsRemaining: meetingState.questionsRemaining || 3,
    dialogueHistory: meetingState.dialogueHistory || [],
  };
  
  return (
    <MeetingPhaseTemplate
      meetingData={meetingData}
      onQuestionSelect={handleQuestionSelect}
      onProceedToMentorSelection={handleProceedToMentorSelection}
    >
      {/* MeetingRoom organism will be rendered here when complete */}
      <div className={styles.meetingContent}>
        <p>Meeting room implementation will go here</p>
      </div>
    </MeetingPhaseTemplate>
  );
};