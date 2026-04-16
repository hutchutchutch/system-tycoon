import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { MentorNotification } from '../../atoms/MentorNotification';
import type { RootState } from '../../../store';
import styles from './ProductTour.module.css';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for the element to highlight (optional)
  position: 'top' | 'bottom' | 'left' | 'right';
  autoHideDuration?: number; // Auto-hide after milliseconds (0 = manual)
}

interface ProductTourProps {
  isActive: boolean;
  onComplete: () => void;
  className?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Service as a Software! 🎉',
    content: "I'm your mentor — I'll show you around. You'll use your system design skills to help real people solve real problems.",
    position: 'bottom',
    autoHideDuration: 0
  },
  {
    id: 'missions',
    title: 'Real Stories, Real People 🌍',
    content: "Each card here is a real story — a doctor, a teacher, an activist, a small business owner — someone trying to do good in the world who needs help with their tech. Pick the one that speaks to you.",
    target: '.bento-card',
    position: 'top',
    autoHideDuration: 0
  },
  {
    id: 'contact',
    title: 'Reach Out 💬',
    content: "Hover any card to reveal a Contact button. Clicking it sends a message to the hero and opens their mission in your email.",
    target: '.bento-card',
    position: 'top',
    autoHideDuration: 0
  },
  {
    id: 'email',
    title: 'Stay Connected 📧',
    content: "Your email is where mission briefs arrive and conversations happen. Check it often — a red dot means something needs your attention.",
    target: '[class*="bookmark"]',
    position: 'bottom',
    autoHideDuration: 0
  },
  {
    id: 'complete',
    title: "You're Ready! 🎊",
    content: "Pick a mission that resonates with you and let's start making a difference.",
    position: 'bottom',
    autoHideDuration: 8000
  }
];

export const ProductTour: React.FC<ProductTourProps> = ({
  isActive,
  onComplete,
  className = ''
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  // Initialize tour
  useEffect(() => {
    if (isActive && isAuthenticated && user) {
      setIsVisible(true);
      setCurrentStepIndex(0);
    } else {
      setIsVisible(false);
    }
  }, [isActive, isAuthenticated, user]);

  // If the current step targets a DOM element that doesn't exist on this page,
  // auto-skip it after a short wait (keeps the tour from getting stuck).
  useEffect(() => {
    if (!isVisible) return;
    if (!currentStep?.target) return;

    const check = () => !!document.querySelector(currentStep.target!);
    if (check()) return;

    const timer = setTimeout(() => {
      if (!check()) {
        if (isLastStep) {
          handleCompleteTour();
        } else {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }
    }, 800);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, isVisible]);

  // Handle next step
  const handleNextStep = useCallback(() => {
    if (isLastStep) {
      handleCompleteTour();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [isLastStep]);

  // Handle tour completion
  const handleCompleteTour = useCallback(() => {
    setIsVisible(false);
    onComplete();
  }, [onComplete]);

  // Handle notification close
  const handleNotificationClose = useCallback(() => {
    // Last step with auto-hide: natural end of tour
    if (isLastStep && currentStep.autoHideDuration && currentStep.autoHideDuration > 0) {
      handleCompleteTour();
      return;
    }
    // Closing via the X button means "I'm done with the tour" → skip the rest
    handleCompleteTour();
  }, [isLastStep, currentStep, handleCompleteTour]);

  // Don't render if user is not authenticated or tour is not active
  if (!isAuthenticated || !user || !isVisible || !currentStep) {
    return null;
  }

  return (
    <div className={`${styles.productTour} ${className}`}>
      <MentorNotification
        key={currentStep.id}
        title={currentStep.title}
        message={currentStep.content}
        targetElement={currentStep.target}
        position={currentStep.position}
        showArrow={!!currentStep.target}
        autoHideDuration={currentStep.autoHideDuration}
        actionLabel={isLastStep ? 'Start Exploring' : 'Next'}
        onAction={handleNextStep}
        onClose={handleNotificationClose}
        currentStep={currentStepIndex}
        completedStep={currentStepIndex}
        totalSteps={TOUR_STEPS.length}
        onSkip={isLastStep ? undefined : handleCompleteTour}
        skipLabel="Skip Tour"
      />
    </div>
  );
};