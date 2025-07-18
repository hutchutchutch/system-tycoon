import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MentorChat } from '../../molecules/MentorChat/MentorChat';
import { mentorChatService } from '../../../services/mentorChatService';
import type { RootState } from '../../../store';
import styles from './ProductTour.module.css';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  mentorMessage: string;
}

interface ProductTourProps {
  isActive: boolean;
  onComplete: () => void;
  className?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to System Tycoon!',
    content: 'Let me show you around this powerful interface. We\'ll explore each component that will help you solve real-world problems.',
    target: '', // No specific target for welcome
    position: 'top',
    mentorMessage: 'Hey there! Welcome to System Tycoon! 🎉 I\'m excited to show you around this interface. You\'re about to discover how to use your system design skills to help real people solve critical problems. Ready for the tour?'
  },
  {
    id: 'gamehud',
    title: 'Your Command Center',
    content: 'This is your GameHUD - your command center showing your profile, level, reputation points, and system status. The theme toggle on the right lets you switch between light and dark modes.',
    target: '[class*="hud"]',
    position: 'bottom',
    mentorMessage: 'This is your GameHUD at the top! 📊 Here you can see your current level, reputation points, and career title. Notice the theme toggle on the right? Try clicking it to switch between light and dark modes. This is your command center - it shows your progress as you help more communities!'
  },
  {
    id: 'browser',
    title: 'Your Workspace',
    content: 'This browser window is your main workspace. Just like a real browser, you can open multiple tabs, navigate between different tools, and manage your workflow efficiently.',
    target: '[class*="browserWindow"]',
    position: 'top',
    mentorMessage: 'This browser interface is where all the magic happens! 🌐 Think of it as your digital workspace. You can open multiple tabs - news articles, emails, system design tools. It feels familiar because it works just like the browser you use every day!'
  },
  {
    id: 'bentocard',
    title: 'Discover Real Stories',
    content: 'These are real stories from communities that need technical help. Hover over any card to see more details and find the "Contact" button to reach out and offer your expertise.',
    target: '.bento-card',
    position: 'top',
    mentorMessage: 'These cards show real people with real problems! 📰 Each story represents someone who needs your system design skills. Hover over a card and you\'ll see a "Contact" button appear. That\'s your gateway to making a real difference in someone\'s life!'
  },
  {
    id: 'email',
    title: 'Stay Connected',
    content: 'This Email bookmark is your communication hub. Click it to access your inbox, read mission briefs, and coordinate with the communities you\'re helping.',
    target: '[class*="bookmark"]',
    position: 'bottom',
    mentorMessage: 'See that Email button in the bookmarks? 📧 That\'s your lifeline to the communities you\'re helping! Click it to access important mission briefings, updates from the field, and coordination messages. When there\'s a red notification dot, you know someone needs your immediate attention!'
  }
];

export const ProductTour: React.FC<ProductTourProps> = ({
  isActive,
  onComplete,
  className = ''
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [tourSessionId] = useState(() => `tour-${Date.now()}`);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  // Initialize tour
  useEffect(() => {
    if (isActive && isAuthenticated && user) {
      setIsVisible(true);
      setCurrentStepIndex(0);
      
      // Send initial welcome message through mentor chat
      setTimeout(() => {
        sendTourMessage(TOUR_STEPS[0].mentorMessage);
      }, 500);
    } else {
      setIsVisible(false);
    }
  }, [isActive, isAuthenticated, user]);

  // Update highlight and send message when step changes
  useEffect(() => {
    if (!isVisible || !currentStep) return;

    // Update highlight
    if (currentStep.target) {
      const element = document.querySelector(currentStep.target);
      if (element) {
        setHighlightedElement(element);
      }
    } else {
      setHighlightedElement(null);
    }

    // Send mentor message for the current step (except for the first step which is sent on init)
    if (currentStepIndex > 0) {
      setTimeout(() => {
        sendTourMessage(currentStep.mentorMessage);
      }, 300);
    }
  }, [currentStepIndex, isVisible, currentStep]);

  // Send tour message through mentor chat service
  const sendTourMessage = useCallback(async (message: string) => {
    if (!user) return;
    
    try {
      // Create a tour session for the mentor chat
      const session = {
        userId: user.id,
        mentorId: 'linda-wu', // Default tour mentor
        conversationSessionId: tourSessionId,
        missionStageId: 'product-tour',
        missionTitle: 'System Tycoon Product Tour',
        problemDescription: 'Learning the interface'
      };

      // Simulate mentor response for tour
      await mentorChatService.sendMessage(session, message);
    } catch (error) {
      console.error('Failed to send tour message:', error);
    }
  }, [user, tourSessionId]);

  // Handle next step
  const handleNextStep = useCallback(() => {
    if (isLastStep) {
      handleCompleteTour();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [isLastStep]);

  // Handle previous step
  const handlePreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  // Handle tour completion
  const handleCompleteTour = useCallback(async () => {
    // Send completion message
    await sendTourMessage("Congratulations! 🎊 You've completed the tour and you're ready to start helping communities with your system design skills. Click on a news story to begin your first mission!");
    
    setTimeout(() => {
      setIsVisible(false);
      setHighlightedElement(null);
      onComplete();
    }, 1000);
  }, [onComplete, sendTourMessage]);

  // Handle skip tour
  const handleSkipTour = useCallback(() => {
    setIsVisible(false);
    setHighlightedElement(null);
    onComplete();
  }, [onComplete]);

  // Get highlight styles for the target element
  const getHighlightStyles = useCallback(() => {
    if (!highlightedElement) return {};

    const rect = highlightedElement.getBoundingClientRect();
    const padding = 8; // Padding around the highlighted element

    return {
      top: rect.top - padding + window.scrollY,
      left: rect.left - padding + window.scrollX,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    };
  }, [highlightedElement]);

  // Don't render if user is not authenticated or tour is not active
  if (!isAuthenticated || !user || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className={styles.overlay}
        style={{ zIndex: 99998 }}
      >
        {/* Highlight cutout */}
        {highlightedElement && (
          <div 
            className={styles.highlight}
            style={getHighlightStyles()}
          />
        )}
      </div>

      {/* Tour Controls */}
      <div className={styles.tourControls}>
        <div className={styles.stepIndicator}>
          Step {currentStepIndex + 1} of {TOUR_STEPS.length}
        </div>
        
        <div className={styles.stepTitle}>
          {currentStep.title}
        </div>
        
        <div className={styles.stepContent}>
          {currentStep.content}
        </div>
        
        <div className={styles.controlButtons}>
          <button 
            onClick={handleSkipTour}
            className={styles.skipButton}
          >
            Skip Tour
          </button>
          
          {currentStepIndex > 0 && (
            <button 
              onClick={handlePreviousStep}
              className={styles.prevButton}
            >
              Previous
            </button>
          )}
          
          <button 
            onClick={handleNextStep}
            className={styles.nextButton}
          >
            {isLastStep ? 'Finish Tour' : 'Next'}
          </button>
        </div>
      </div>

      {/* Regular MentorChat for Tour */}
      <div className={styles.tourMentorChat}>
        <MentorChat
          missionStageId="product-tour"
          missionTitle="System Tycoon Tour"
          problemDescription="Learning how to use the System Tycoon interface"
        />
      </div>
    </>
  );
}; 