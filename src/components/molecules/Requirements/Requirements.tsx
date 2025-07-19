import React from 'react';
import clsx from 'clsx';
import { CheckCircle, Circle, Play, ClipboardList } from 'lucide-react';
import { Button } from '../../atoms/Button';
import styles from './Requirements.module.css';

interface Requirement {
  id: string;
  description: string;
  completed: boolean;
}

interface RequirementsProps {
  requirements: Requirement[];
  onTestSystem: () => void;
  className?: string;
}

export const Requirements: React.FC<RequirementsProps> = ({ 
  requirements, 
  onTestSystem, 
  className = '' 
}) => {
  const completedCount = requirements.filter(req => req.completed).length;
  const allCompleted = completedCount === requirements.length;
  const progressPercentage = (completedCount / requirements.length) * 100;

  return (
    <div className={clsx(styles.requirements, className)}>
      <div className={styles.requirements__header}>
        <h3 className={styles.requirements__title}>
          <ClipboardList size={20} />
          Requirements
        </h3>
        <div className={styles.requirements__counter}>
          {completedCount}/{requirements.length}
        </div>
      </div>
      
      <div className={styles.requirements__progress}>
        <div className={styles.progressBar}>
          <div 
            className={clsx(
              styles.progressBar__fill,
              allCompleted && styles['progressBar__fill--complete']
            )}
            style={{ width: `${progressPercentage}%` }}
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
      </div>
      
      <div className={styles.requirements__actions}>
        <Button 
          variant="primary"
          size="md"
          onClick={onTestSystem}
          disabled={!allCompleted}
          className={styles.testSystemButton}
        >
          <Play size={16} />
          Test System
        </Button>
      </div>
    </div>
  );
}; 