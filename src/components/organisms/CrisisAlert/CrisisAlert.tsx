import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../atoms/Button';
import styles from './CrisisAlert.module.css';

interface CrisisAlertProps {
  message?: string;
  delay?: number;
}

const CrisisAlert: React.FC<CrisisAlertProps> = ({ 
  message = 'Flood response system needed in Bangladesh - 2,847 families awaiting help',
  delay = 3000
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show alert after delay
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleDismiss = () => {
    setVisible(false);
  };

  const handleJoinMission = () => {
    // Scroll to mission section
    const missionSection = document.getElementById('mission-showcase');
    missionSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.alertContainer}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <div className={styles.alertContent}>
            <div className={styles.alertMessage}>
              <AlertTriangle className={styles.alertIcon} />
              <span className={styles.alertBadge}>URGENT</span>
              <span className={styles.alertText}>{message}</span>
            </div>
            <div className={styles.alertActions}>
              <Button 
                variant="primary" 
                size="small"
                onClick={handleJoinMission}
                className={styles.joinButton}
              >
                Join Mission →
              </Button>
              <button 
                className={styles.dismissButton}
                onClick={handleDismiss}
                aria-label="Dismiss alert"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CrisisAlert;