import React from 'react';
import clsx from 'clsx';
import { CheckCircle, Circle, Play, ClipboardList } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { useAppSelector } from '../../../hooks/redux';
import { selectRequirementsStatus, selectCanvasValidation } from '../../../features/design/designSlice';
import styles from './Requirements.module.css';

interface RequirementsProps {
  onTestSystem: () => void;
  className?: string;
}

export const Requirements: React.FC<RequirementsProps> = ({ 
  onTestSystem, 
  className = '' 
}) => {
  // Connect to Redux store using memoized selectors (Redux best practice)
  const requirementsStatus = useAppSelector(selectRequirementsStatus);
  const canvasValidation = useAppSelector(selectCanvasValidation);

  const { requirements, progress, allMet } = requirementsStatus;
  const { canProceed } = canvasValidation;

  return (
    <div className={clsx(styles.requirements, className)}>
      <div className={styles.requirements__header}>
        <h3 className={styles.requirements__title}>
          <ClipboardList size={20} />
          Requirements
        </h3>
        <div className={styles.requirements__counter}>
          {progress.completed}/{progress.total}
        </div>
      </div>
      
      <div className={styles.requirements__progress}>
        <div className={styles.progressBar}>
          <div 
            className={clsx(
              styles.progressBar__fill,
              allMet && styles['progressBar__fill--complete']
            )}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
      
      <div className={styles.requirements__list}>
        {requirements.map((requirement) => (
          <div 
            key={requirement.id} 
            className={clsx(
              styles.requirement,
              requirement.completed && styles['requirement--completed']
            )}
          >
            <div className={styles.requirement__icon}>
              {requirement.completed ? (
                <CheckCircle size={20} />
              ) : (
                <Circle size={20} />
              )}
            </div>
            <div className={styles.requirement__content}>
              <p className={styles.requirement__description}>
                {requirement.description}
              </p>
            </div>
          </div>
        ))}
        
        {requirements.length === 0 && (
          <div className={styles.requirement}>
            <div className={styles.requirement__icon}>
              <Circle size={20} />
            </div>
            <div className={styles.requirement__content}>
              <p className={styles.requirement__description}>
                Loading requirements...
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.requirements__actions}>
        <Button 
          variant="primary"
          size="md"
          onClick={onTestSystem}
          disabled={!canProceed}
          className={styles.testSystemButton}
        >
          <Play size={16} />
          Test System
        </Button>
      </div>
    </div>
  );
}; 