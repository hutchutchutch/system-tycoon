import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
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
  const [positionStyles, setPositionStyles] = useState<React.CSSProperties>({});
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
    if (!targetElement) return;

    const element = document.querySelector(targetElement);
    if (!element) return;

    const updateBounds = () => setHighlightBounds(element.getBoundingClientRect());

    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);

    element.classList.add(styles.highlightedElement);

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
      element.classList.remove(styles.highlightedElement);
    };
  }, [targetElement]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
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

  // Recalculate the notification card position whenever bounds, position, or the
  // rendered card height changes.  useLayoutEffect fires after DOM paint so
  // notificationRef.current.offsetHeight reflects the real height.
  useLayoutEffect(() => {
    if (!highlightBounds || !targetElement) {
      setPositionStyles({});
      return;
    }

    const notificationWidth = 320;
    const notificationHeight = notificationRef.current?.offsetHeight || 220;
    const offset = 16;
    const margin = 16;

    let top: number;
    let left: number;

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
      default:
        top = highlightBounds.top + highlightBounds.height / 2 - notificationHeight / 2;
        left = highlightBounds.right + offset;
        break;
    }

    // Clamp so the card stays fully within the viewport
    const maxLeft = window.innerWidth - notificationWidth - margin;
    const maxTop = window.innerHeight - notificationHeight - margin;
    top = Math.max(margin, Math.min(top, maxTop));
    left = Math.max(margin, Math.min(left, maxLeft));

    setPositionStyles({ top, left });
  }, [highlightBounds, targetElement, position]);

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
        className={`${styles.notification} ${styles[`notification--${position}`]} ${isVisible ? styles.visible : styles.hidden} ${className}`}
        style={Object.keys(positionStyles).length > 0 ? positionStyles : undefined}
      >
        {showArrow && targetElement && (
          <div className={`${styles.arrow} ${styles[`arrow--${position}`]}`} />
        )}

        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Dismiss"
        >
          <X size={14} />
          <span className={styles.closeLabel}>Skip</span>
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