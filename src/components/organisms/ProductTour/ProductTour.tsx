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
    content: 'I\'m your mentor! I\'ll guide you through this powerful interface where you\'ll use your system design skills to help real communities.',
    position: 'bottom',
    autoHideDuration: 0 // Manual advance
  },
  {
    id: 'gamehud',
    title: 'Your Command Center 📊',
    content: 'This shows your profile, level, reputation points, and system status. Try the theme toggle on the right!',
    target: '[class*="hud"]',
    position: 'bottom',
    autoHideDuration: 0
  },
  {
    id: 'browser',
    title: 'Your Digital Workspace 🌐',
    content: 'Just like a real browser, you can open multiple tabs, navigate between tools, and manage your workflow efficiently.',
    target: '[class*="browserWindow"]',
    position: 'top',
    autoHideDuration: 0
  },
  {
    id: 'bentocard',
    title: 'Real Stories, Real Impact 📰',
    content: 'These cards show communities that need your help. Hover over any card to see the "Contact" button and start making a difference!',
    target: '.bento-card',
    position: 'top',
    autoHideDuration: 0
  },
  {
    id: 'email',
    title: 'Stay Connected 📧',
    content: 'Click the Email bookmark to access mission briefs and coordinate with communities. A red dot means urgent attention needed!',
    target: '[class*="bookmark"]',
    position: 'bottom',
    autoHideDuration: 0
  },
  {
    id: 'complete',
    title: 'You\'re Ready! 🎊',
    content: 'You\'ve completed the tour! Click on any news story to begin your first mission and start helping communities.',
    position: 'bottom',
    autoHideDuration: 8000 // Auto-hide after 8 seconds
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
    // If it's the last step with auto-hide, complete the tour
    if (isLastStep && currentStep.autoHideDuration && currentStep.autoHideDuration > 0) {
      handleCompleteTour();
    } else {
      // Otherwise, advance to next step
      handleNextStep();
    }
  }, [isLastStep, currentStep, handleCompleteTour, handleNextStep]);

  // Don't render if user is not authenticated or tour is not active
  if (!isAuthenticated || !user || !isVisible || !currentStep) {
    return null;
  }

  return (
    <div className={`${styles.productTour} ${className}`}>
      <MentorNotification
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