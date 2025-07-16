import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './CountdownTimer.module.css';

interface CountdownTimerProps {
  seconds: number;
  label: string;
  icon: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds, label, icon }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;
  
  // Determine timer state based on time left
  const isCritical = timeLeft < 60; // Less than 1 minute
  const isWarning = timeLeft < 300 && !isCritical; // Less than 5 minutes
  
  return (
    <div className={clsx(
      styles.timer,
      isCritical && styles['timer--critical'],
      isWarning && styles['timer--warning']
    )}>
      <div className={styles.timerDisplay}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.time}>
          {String(hours).padStart(2, '0')}:
          {String(minutes).padStart(2, '0')}:
          {String(secs).padStart(2, '0')}
        </span>
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
};