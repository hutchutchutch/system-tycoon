import React from 'react';
import clsx from 'clsx';
import { CheckCircle, Circle, Play } from 'lucide-react';
import styles from './Requirements.module.css';

interface Requirement {
  id: string;
  description: string;
  completed: boolean;
}

interface RequirementsProps {
  requirements: Requirement[];
  onRunTest: () => void;
  className?: string;
}

export const Requirements: React.FC<RequirementsProps> = ({ 
  requirements, 
  onRunTest, 
  className = '' 
}) => {
  const completedCount = requirements.filter(req => req.completed).length;
  const allCompleted = completedCount === requirements.length;

  return (
    <div className={clsx(styles.requirements, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>Requirements</h3>
        <div className={styles.progress}>
          {completedCount}/{requirements.length}
        </div>
      </div>
      
      <div className={styles.list}>
        {requirements.map((requirement) => (
          <div 
            key={requirement.id} 
            className={clsx(
              styles.item,
              requirement.completed && styles['item--completed']
            )}
          >
            <div className={styles.icon}>
              {requirement.completed ? (
                <CheckCircle className={styles.check} />
              ) : (
                <Circle className={styles.circle} />
              )}
            </div>
            <span className={styles.text}>{requirement.description}</span>
          </div>
        ))}
      </div>
      
      <button 
        className={clsx(
          styles.testButton,
          allCompleted && styles['testButton--ready']
        )}
        onClick={onRunTest}
        disabled={!allCompleted}
      >
        <Play className={styles.testButtonIcon} />
        Run Test
      </button>
    </div>
  );
}; 