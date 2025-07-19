import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { updateOnboardingStatus, updatePreferredMentor } from '../features/auth/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import { 
  OpeningImpactScreen, 
  TransformationStoryScreen, 
  EnhancedMentorSelectionScreen, 
  MentorWisdomScreen 
} from '../components/organisms/OnboardingScreens';
import type { MentorForUI } from '../services/mentorService';

type OnboardingStep = 'opening' | 'transformation' | 'mentor-selection' | 'mentor-wisdom';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('opening');
  const [selectedMentor, setSelectedMentor] = useState<MentorForUI | null>(null);

  // Ensure dark mode for onboarding
  useEffect(() => {
    if (theme !== 'dark') {
      setTheme('dark');
    }
  }, [theme, setTheme]);

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

  const handleMentorSelected = async (mentor: MentorForUI) => {
    setSelectedMentor(mentor);
    
    try {
      // Save the mentor ID to the user's profile
      await dispatch(updatePreferredMentor(mentor.id));
      
      // Mark onboarding as completed in the database
      await dispatch(updateOnboardingStatus(true));
      
      // Navigate to the game since user is already authenticated
      navigate('/game');
    } catch (error) {
      console.error('Error saving mentor selection:', error);
      // Still navigate even if there's an error saving mentor preference
      await dispatch(updateOnboardingStatus(true));
      navigate('/game');
    }
  };

  const handleComplete = async () => {
    // Mark onboarding as completed in the database
    await dispatch(updateOnboardingStatus(true));
    
    // Navigate to the game since user is already authenticated
    navigate('/game');
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
      backgroundColor: '#000000',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Grid background overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.3,
        backgroundImage: `radial-gradient(circle at center, rgba(55, 65, 81, 0.8) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        backgroundPosition: 'center center',
        pointerEvents: 'none'
      }} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: [0.23, 0.86, 0.39, 0.96] }}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 