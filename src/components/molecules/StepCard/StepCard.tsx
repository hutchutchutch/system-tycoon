import React from 'react';
import clsx from 'clsx';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import styles from './StepCard.module.css';

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
  number: number;
  className?: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  example,
  number,
  className
}) => {
  return (
    <Card className={clsx(styles.card, className)}>
      <Badge 
        variant="primary" 
        className={styles.stepNumber}
      >
        {number}
      </Badge>
      
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      
      <div className={styles.exampleBox}>
        <p className={styles.exampleText}>
          <span className={styles.exampleLabel}>Example:</span> {example}
        </p>
      </div>
    </Card>
  );
};