import React, { useState, useEffect } from 'react';
import { MentorSelectionModal } from '../../organisms/MentorSelectionModal';
import { Toast } from '../../atoms/Toast';
import type { Mentor } from '../../../types/mentor.types';
import styles from './OnboardingFlow.module.css';

export interface OnboardingFlowProps {
  onComplete: (mentor: Mentor) => void;
  children: React.ReactNode;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  children
}) => {
  const [showMentorModal, setShowMentorModal] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleMentorSelection = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowMentorModal(false);
    
    // Show mentor toast after a brief delay
    setTimeout(() => {
      setShowToast(true);
    }, 1000);
    
    onComplete(mentor);
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  return (
    <div className={styles.onboardingFlow}>
      <MentorSelectionModal
        isOpen={showMentorModal}
        onComplete={handleMentorSelection}
      />
      
      {children}
      
      {selectedMentor && showToast && (
        <Toast
          message={selectedMentor.toastMessage}
          icon="💬"
          duration={7000}
          position="bottom-left"
          onClose={handleToastClose}
          action={{
            label: 'Got it',
            onClick: handleToastClose
          }}
        />
      )}
    </div>
  );
};