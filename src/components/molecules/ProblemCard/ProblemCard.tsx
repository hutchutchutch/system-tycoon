import React from 'react';
import { AlertTriangle, Clock, Users, ArrowRight } from 'lucide-react';
import { Card } from '../../atoms/Card';
import { Button } from '../../atoms/Button';
import styles from './ProblemCard.module.css';

export interface ProblemCardProps {
  title: string;
  problem: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  affectedCount?: number;
  timeframe?: string;
  onStartDesign?: () => void;
  onNext?: () => void;
  className?: string;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  title,
  problem,
  urgency = 'high',
  affectedCount,
  timeframe,
  onStartDesign,
  onNext,
  className
}) => {
  const getUrgencyIcon = () => {
    switch (urgency) {
      case 'critical':
        return <AlertTriangle className={styles.urgencyIcon} data-urgency="critical" />;
      case 'high':
        return <AlertTriangle className={styles.urgencyIcon} data-urgency="high" />;
      case 'medium':
        return <Clock className={styles.urgencyIcon} data-urgency="medium" />;
      default:
        return <Clock className={styles.urgencyIcon} data-urgency="low" />;
    }
  };

  return (
    <Card className={`${styles.problemCard} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.urgencyBadge} data-urgency={urgency}>
          {getUrgencyIcon()}
          <span className={styles.urgencyText}>
            {urgency === 'critical' ? 'CRITICAL' : urgency.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.problem}>{problem}</p>
        
        <div className={styles.metadata}>
          {affectedCount && (
            <div className={styles.metaItem}>
              <Users size={16} />
              <span>{affectedCount.toLocaleString()} affected</span>
            </div>
          )}
          {timeframe && (
            <div className={styles.metaItem}>
              <Clock size={16} />
              <span>{timeframe}</span>
            </div>
          )}
        </div>
      </div>
      
      {(onStartDesign || onNext) && (
        <div className={styles.actions}>
          {onStartDesign && (
            <Button
              variant="primary"
              size="md"
              className={styles.actionButton}
              onClick={onStartDesign}
            >
              Start System Design
            </Button>
          )}
          {onNext && (
            <Button
              variant="secondary"
              size="md"
              className={styles.actionButton}
              onClick={onNext}
            >
              Next
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}; 