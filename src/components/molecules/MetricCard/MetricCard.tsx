import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import styles from './MetricCard.module.css';
import type { MetricCardProps } from './MetricCard.types';

export const MetricCard: React.FC<MetricCardProps> = ({
  data,
  onHover,
  className,
}) => {
  // Local state for animation
  const [displayValue, setDisplayValue] = useState(data.value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(data.value);

  // Animate value changes
  useEffect(() => {
    if (prevValueRef.current !== data.value) {
      setIsAnimating(true);
      
      // Animate from old value to new value
      const startValue = prevValueRef.current;
      const endValue = data.value;
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          prevValueRef.current = endValue;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [data.value]);

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <Icon name="trending-up" size="sm" />;
      case 'down':
        return <Icon name="trending-down" size="sm" />;
      default:
        return <Icon name="minus" size="sm" />;
    }
  };

  const progressPercentage = data.target 
    ? Math.min((data.value / data.target) * 100, 100)
    : 0;

  return (
    <div
      className={clsx(
        styles.metricCard,
        styles[`metricCard--${data.status || 'normal'}`],
        {
          [styles['metricCard--animating']]: isAnimating,
        },
        className
      )}
      onMouseEnter={() => onHover?.(data)}
    >
      <div className={styles.header}>
        <span className={styles.label}>{data.label}</span>
        {data.trend && (
          <div className={clsx(styles.trend, styles[`trend--${data.trend}`])}>
            {getTrendIcon()}
            {data.trendValue && (
              <span className={styles.trendValue}>
                {data.trendValue > 0 ? '+' : ''}{data.trendValue}%
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.value}>
        <span className={styles.number}>
          {displayValue.toFixed(1)}
        </span>
        <span className={styles.unit}>{data.unit}</span>
      </div>
      
      {data.target && (
        <div className={styles.progress}>
          <div 
            className={styles.progressBar}
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={data.value}
            aria-valuemin={0}
            aria-valuemax={data.target}
          />
        </div>
      )}
    </div>
  );
};