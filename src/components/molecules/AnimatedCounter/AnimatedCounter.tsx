import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './AnimatedCounter.module.css';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  size?: 'small' | 'default' | 'large' | 'xlarge';
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
  pulse?: boolean;
  glow?: boolean;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2000,
  size = 'default',
  variant = 'default',
  pulse = false,
  glow = false,
  className
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString());
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return (
    <span className={clsx(
      styles.counter,
      size !== 'default' && styles[`counter--${size}`],
      variant !== 'default' && styles[`counter--${variant}`],
      pulse && styles['counter--pulse'],
      glow && styles['counter--glow'],
      className
    )}>
      {count.toLocaleString()}
    </span>
  );
};