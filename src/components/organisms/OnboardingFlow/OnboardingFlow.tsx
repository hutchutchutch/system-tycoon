import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../atoms/Modal';
import { OpeningImpactScreen } from './components/OpeningImpactScreen';
import { TransformationStoryScreen } from './components/TransformationStoryScreen';
import { EnhancedMentorSelectionScreen } from './components/EnhancedMentorSelectionScreen';
import { MentorWisdomScreen } from './components/MentorWisdomScreen';
import type { Mentor } from '../../../types/mentor.types';
import styles from './OnboardingFlow.module.css';

export interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

type OnboardingStep = 'opening' | 'transformation' | 'mentor-selection' | 'mentor-wisdom';

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('opening');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const transformationStories = [
    {
      id: 'connectivity',
      icon: '💬',
      headline: 'A grandmother in rural Kenya...',
      body: 'Distance became irrelevant when video calls connected her to family across continents. Technology collapsed geography.'
    },
    {
      id: 'beginning',
      icon: '🌱',
      headline: 'But this is just the beginning...',
      body: 'Every breakthrough creates new possibilities. The next revolution in human connection is waiting to be built.'
    },
    {
      id: 'next-chapter',
      icon: '🚀',
      headline: 'Your code writes the next chapter',
      body: 'The tools that will solve tomorrow\'s crises don\'t exist yet. They\'re waiting for someone like you to build them.'
    }
  ];

  const handleContinue = () => {
    if (currentStep === 'opening') {
      setCurrentStep('transformation');
    }
  };

  const handleStoryComplete = () => {
    setCurrentStep('mentor-selection');
  };

  const handleMentorSelected = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setCurrentStep('mentor-wisdom');
  };

  const handleComplete = () => {
    onClose();
    navigate('/auth');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'opening':
        return (
          <OpeningImpactScreen
            onContinue={handleContinue}
          />
        );
      
      case 'transformation':
        return (
          <TransformationStoryScreen
            stories={transformationStories}
            onComplete={handleStoryComplete}
          />
        );
      
      case 'mentor-selection':
        return (
          <EnhancedMentorSelectionScreen
            onMentorSelected={handleMentorSelected}
          />
        );
      
      case 'mentor-wisdom':
        return (
          <MentorWisdomScreen
            mentor={selectedMentor!}
            onComplete={handleComplete}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      size="fullscreen"
      closeOnOverlayClick={false}
      showCloseButton={false}
      className={styles.onboardingModal}
    >
      <div className={styles.onboardingContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 0.86, 0.39, 0.96] }}
            className={styles.stepContainer}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  );
}; 