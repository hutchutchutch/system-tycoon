import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import styles from './AchievementToast.module.css';

export interface AchievementToastProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  title,
  description,
  icon = '🏆',
  onClose,
  duration = 5000,
  className
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  useEffect(() => {
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className={clsx(
      styles.toast,
      isExiting && styles['toast--exiting'],
      className
    )}>
      <div className={styles.border} />
      <div className={styles.content}>
        <div className={styles.icon}>
          {icon}
        </div>
        <div className={styles.text}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
      <button
        className={styles.close}
        onClick={handleClose}
        aria-label="Close"
      >
        <svg className={styles.closeIcon} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};