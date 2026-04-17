import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { MentorNotificationProps, HighlightOverlayProps } from './MentorNotification.types';
import type { RootState } from '../../../store';
import { api } from '../../../services/cloudflareApi';
import styles from './MentorNotification.module.css';

// Highlight overlay component that creates a spotlight effect on target elements
const HighlightOverlay: React.FC<HighlightOverlayProps> = ({
  targetSelector,
  onClick,
  padding = 8
}) => {
  const [bounds, setBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    const element = document.querySelector(targetSelector);
    if (!element) return;

    const updateBounds = () => {
      const rect = element.getBoundingClientRect();
      setBounds(rect);
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds);

    // Observe for DOM changes
    const observer = new MutationObserver(updateBounds);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
      observer.disconnect();
    };
  }, [targetSelector]);

  if (!bounds) return null;

  return (
    <div
      className={styles.highlightOverlay}
      onClick={onClick}
    >
      <div
        className={styles.highlightCutout}
        style={{
          top: bounds.top - padding,
          left: bounds.left - padding,
          width: bounds.width + (padding * 2),
          height: bounds.height + (padding * 2),
        }}
      />
    </div>
  );
};

// Function to save notification as system message to database
const saveNotificationAsSystemMessage = async (
  _userId: string,
  mentorId: string,
  conversationSessionId: string,
  message: string,
  missionStageId?: string
) => {
  try {
    await api.post('/mentors/chat', {
      mentorId,
      conversationSessionId,
      messageContent: message,
      senderType: 'system',
      missionStageId,
    });
  } catch (error) {
    console.error('Error saving notification:', error);
  }
};

export const MentorNotification: React.FC<MentorNotificationProps> = ({
  title,
  message,
  onClose,
  onAction,
  actionLabel = 'Got it',
  targetElement,
  position = 'bottom',
  showArrow = true,
  autoHideDuration = 0,
  className = '',
  // New props for multi-step flow
  onShowRequirements,
  onShowComponentDrawer,
  onHideRequirements,
  onHideComponentDrawer,
  missionStageId,
  conversationSessionId,
  currentStep,
  totalSteps,
  completedStep,
  onSkip,
  skipLabel = 'Skip Tour'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [highlightBounds, setHighlightBounds] = useState<DOMRect | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const hasBeenSavedRef = useRef(false);

  // Get current user and profile from Redux store
  const { user, profile } = useSelector((state: RootState) => state.auth);

  // Use preferred mentor from profile, fallback to 'linda-wu'
  const selectedMentorId = profile?.preferred_mentor_id || 'linda-wu';

  // Save notification as system message when component mounts (only once)
  useEffect(() => {
    if (user && conversationSessionId && !hasBeenSavedRef.current) {
      const fullMessage = `${title}\n\n${message}`;
      console.log('💾 MentorNotification: Saving system message to database:', {
        userId: user.id,
        mentorId: selectedMentorId,
        conversationSessionId,
        message: fullMessage,
        missionStageId
      });

      saveNotificationAsSystemMessage(
        user.id,
        selectedMentorId,
        conversationSessionId,
        fullMessage,
        missionStageId
      );
      hasBeenSavedRef.current = true;
    }
  }, [user, selectedMentorId, conversationSessionId, title, message, missionStageId]);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHideDuration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration]);

  useEffect(() => {
    if (targetElement) {
      const element = document.querySelector(targetElement);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightBounds(rect);

        // Add highlight class to the element
        element.classList.add(styles.highlightedElement);

        return () => {
          element.classList.remove(styles.highlightedElement);
        };
      }
    }
  }, [targetElement]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  };

  const handleAction = () => {
    // Multi-step flow actions don't close the notification — parent controls it.
    if (actionLabel === 'What do I need to do?') {
      onShowRequirements?.();
      onAction?.();
      return;
    }
    if (actionLabel === 'How do I do this?') {
      onShowComponentDrawer?.();
      onAction?.();
      return;
    }
    if (actionLabel === 'Got it!') {
      onAction?.();
      handleClose();
      return;
    }

    // Default "Next"/"Continue" behavior: just fire onAction. The parent is
    // responsible for advancing/unmounting — we do NOT call handleClose here,
    // otherwise its delayed onClose() fires and the parent double-advances.
    onAction?.();
  };

  const getPositionStyles = (): React.CSSProperties => {
    if (!highlightBounds || !targetElement) {
      return {};
    }

    const notificationWidth = 320;
    const notificationHeight = 160;
    const offset = 16;
    const margin = 16; // keep notification this far from viewport edges

    let top: number | undefined;
    let left: number | undefined;

    switch (position) {
      case 'top':
        top = highlightBounds.top - notificationHeight - offset;
        left = highlightBounds.left + highlightBounds.width / 2 - notificationWidth / 2;
        break;
      case 'bottom':
        top = highlightBounds.bottom + offset;
        left = highlightBounds.left + highlightBounds.width / 2 - notificationWidth / 2;
        break;
      case 'left':
        top = highlightBounds.top + highlightBounds.height / 2 - notificationHeight / 2;
        left = highlightBounds.left - notificationWidth - offset;
        break;
      case 'right':
        top = highlightBounds.top + highlightBounds.height / 2 - notificationHeight / 2;
        left = highlightBounds.right + offset;
        break;
    }

    // Clamp to viewport so the card is always visible
    const maxLeft = window.innerWidth - notificationWidth - margin;
    const maxTop = window.innerHeight - notificationHeight - margin;
    if (top !== undefined) top = Math.max(margin, Math.min(top, maxTop));
    if (left !== undefined) left = Math.max(margin, Math.min(left, maxLeft));

    return { top, left };
  };

  return (
    <>
      {targetElement && (
        <HighlightOverlay
          targetSelector={targetElement}
          onClick={handleClose}
        />
      )}
      <div
        ref={notificationRef}
        className={`${styles.notification} ${styles[`notification--${position}`]} ${isVisible ? styles.visible : ''} ${className}`}
        style={targetElement && highlightBounds ? getPositionStyles() : undefined}
      >
        {showArrow && targetElement && (
          <div className={`${styles.arrow} ${styles[`arrow--${position}`]}`} />
        )}

        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>

          {(totalSteps || onAction) && (
            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                {totalSteps && totalSteps > 1 && (
                  <div className={styles.progressSteps}>
                    {Array.from({ length: totalSteps }).map((_, index) => (
                      <span
                        key={index}
                        className={`${styles.progressStep} ${
                          index === currentStep ? styles.progressStepActive : ''
                        } ${
                          completedStep !== undefined && index < completedStep
                            ? styles.progressStepCompleted
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                )}
                {onSkip && (
                  <button
                    type="button"
                    onClick={onSkip}
                    className={styles.skipButton}
                    aria-label={skipLabel}
                  >
                    {skipLabel}
                  </button>
                )}
              </div>

              {(onAction || actionLabel) && (
                <button
                  onClick={handleAction}
                  className={styles.actionButton}
                >
                  {actionLabel}
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};