import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Toast.module.css';

export interface ToastProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onClose?: () => void;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  icon,
  duration = 5000,
  position = 'bottom-left',
  onClose,
  persistent = false,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, persistent]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'success': return '✓';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '💬';
    }
  };

  const positionVariants = {
    'top-left': { x: -300, y: 0 },
    'top-right': { x: 300, y: 0 },
    'bottom-left': { x: -300, y: 0 },
    'bottom-right': { x: 300, y: 0 }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${styles.toast} ${styles[`toast--${variant}`]} ${styles[`toast--${position}`]}`}
          initial={positionVariants[position]}
          animate={{ x: 0, y: 0 }}
          exit={positionVariants[position]}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className={styles.content}>
            <span className={styles.icon}>{getIcon()}</span>
            <p className={styles.message}>{message}</p>
          </div>
          
          {action && (
            <button
              className={styles.action}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
          
          {(persistent || onClose) && (
            <button
              className={styles.close}
              onClick={handleClose}
              aria-label="Close notification"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M13 1L1 13M1 1L13 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};