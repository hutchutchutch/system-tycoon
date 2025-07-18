import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { OpeningImpactScreen } from '../components/organisms/OnboardingFlow/components/OpeningImpactScreen';
import { TransformationStoryScreen } from '../components/organisms/OnboardingFlow/components/TransformationStoryScreen';
import { EnhancedMentorSelectionScreen } from '../components/organisms/OnboardingFlow/components/EnhancedMentorSelectionScreen';
import { MentorWisdomScreen } from '../components/organisms/OnboardingFlow/components/MentorWisdomScreen';
import type { MentorForUI } from '../services/mentorService';

type OnboardingStep = 'opening' | 'transformation' | 'mentor-selection' | 'mentor-wisdom';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('opening');
  const [selectedMentor, setSelectedMentor] = useState<MentorForUI | null>(null);

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

  const handleMentorSelected = (mentor: MentorForUI) => {
    setSelectedMentor(mentor);
    // Skip the mentor-wisdom screen since details are shown in the selection screen
    navigate('/auth');
  };

  const handleComplete = () => {
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
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'var(--color-surface-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: [0.23, 0.86, 0.39, 0.96] }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 