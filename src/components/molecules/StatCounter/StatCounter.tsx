import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Badge } from '../../atoms/Badge';
import styles from './StatCounter.module.css';

interface StatCounterProps {
  icon: string;
  value: number;
  label: string;
  prefix?: string;
  increment?: boolean;
  size?: 'small' | 'default' | 'large';
  className?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  icon,
  value,
  label,
  prefix = '',
  increment = false,
  size = 'default',
  className
}) => {
  const [displayValue, setDisplayValue] = useState(increment ? value - 10 : value);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (increment) {
      const timer = setInterval(() => {
        setDisplayValue(prev => prev + 1);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [increment]);

  useEffect(() => {
    // Animate from 0 to value on mount
    const duration = 2000;
    const start = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const current = Math.floor(start + (displayValue - start) * easeOutQuart);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className={clsx(
      styles.container,
      size !== 'default' && styles[`container--${size}`],
      className
    )}>
      <div className={styles.icon}>{icon}</div>
      <div className={clsx(
        styles.value,
        isAnimating && styles['value--animated']
      )}>
        {prefix}{displayValue.toLocaleString()}
        {increment && <span className={styles.incrementBadge}>↑</span>}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};