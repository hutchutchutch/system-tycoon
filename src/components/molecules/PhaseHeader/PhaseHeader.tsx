import React from 'react';
import { clsx } from 'clsx';
import styles from './PhaseHeader.module.css';

export interface PhaseHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'career-map' | 'game-phase';
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({
  title,
  subtitle,
  rightContent,
  className,
  variant = 'default',
}) => {
  const variantMap = {
    'default': styles['phaseHeader--default'],
    'career-map': styles['phaseHeader--careerMap'],
    'game-phase': styles['phaseHeader--gamePhase'],
  };

  return (
    <header className={clsx(
      styles.phaseHeader,
      variantMap[variant],
      className
    )}>
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
        </div>
        
        {rightContent && (
          <div className={styles.rightSection}>
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}; 