import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronRight } from 'lucide-react';
import type { MentorNotificationProps, HighlightOverlayProps } from './MentorNotification.types';
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
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [highlightBounds, setHighlightBounds] = useState<DOMRect | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

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
    onAction?.();
    handleClose();
  };

  const getPositionStyles = () => {
    if (!highlightBounds || !targetElement) {
      return {};
    }

    const notificationWidth = 320;
    const notificationHeight = 120; // Approximate height
    const offset = 16;

    switch (position) {
      case 'top':
        return {
          bottom: window.innerHeight - highlightBounds.top + offset,
          left: highlightBounds.left + (highlightBounds.width / 2) - (notificationWidth / 2),
        };
      case 'bottom':
        return {
          top: highlightBounds.bottom + offset,
          left: highlightBounds.left + (highlightBounds.width / 2) - (notificationWidth / 2),
        };
      case 'left':
        return {
          top: highlightBounds.top + (highlightBounds.height / 2) - (notificationHeight / 2),
          right: window.innerWidth - highlightBounds.left + offset,
        };
      case 'right':
        return {
          top: highlightBounds.top + (highlightBounds.height / 2) - (notificationHeight / 2),
          left: highlightBounds.right + offset,
        };
      default:
        return {};
    }
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
        style={targetElement ? getPositionStyles() : undefined}
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
      </div>
    </>
  );
};