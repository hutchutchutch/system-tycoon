import React, { useEffect } from 'react';
import { clsx } from 'clsx';

export interface AchievementToastProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClose: () => void;
  duration?: number;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  title,
  description,
  icon = '🏆',
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="achievement-toast">
      <div className="achievement-toast__border" />
      <div className="achievement-toast__content">
        <div className="achievement-toast__icon">
          {icon}
        </div>
        <div className="achievement-toast__text">
          <h4 className="achievement-toast__title">{title}</h4>
          <p className="achievement-toast__description">{description}</p>
        </div>
      </div>
      <button
        className="achievement-toast__close"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};