import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import styles from './CrisisAlert.module.css';

export interface CrisisAlertProps {
  className?: string;
  message?: string;
  delay?: number;
}

export const CrisisAlert: React.FC<CrisisAlertProps> = ({ 
  className,
  message = 'URGENT: Flood response system needed in Bangladesh - 2,847 families awaiting help',
  delay = 3000
}) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Slide down after delay
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleJoinMission = () => {
    navigate('/auth/signin');
  };
  
  return (
    <div className={clsx(
      styles.alert,
      visible && styles['alert--visible'],
      className
    )}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.icon}>⚠️</span>
          <span className={styles.message}>{message}</span>
        </div>
        <Button 
          variant="outline" 
          size="small" 
          className={styles.joinButton}
          onClick={handleJoinMission}
        >
          Join Mission →
        </Button>
      </div>
    </div>
  );
};

export default CrisisAlert;