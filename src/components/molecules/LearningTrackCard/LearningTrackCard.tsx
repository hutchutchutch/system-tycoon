import React from 'react';
import clsx from 'clsx';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { SkillTree } from '../SkillTree';
import styles from './LearningTrackCard.module.css';

interface Module {
  name: string;
  completed?: boolean;
  inProgress?: boolean;
  locked?: boolean;
}

interface LearningTrackCardProps {
  title: string;
  partner: string;
  modules: Module[];
  certification: string;
  careerPath: string;
}

export const LearningTrackCard: React.FC<LearningTrackCardProps> = ({
  title,
  partner,
  modules,
  certification,
  careerPath
}) => {
  const completedCount = modules.filter(m => m.completed).length;
  const progressPercent = (completedCount / modules.length) * 100;
  
  return (
    <Card className={styles.card}>
      <div className={styles.content}>
        <Badge variant="outline" className={styles.partnerBadge}>
          {partner}
        </Badge>
        
        <h3 className={styles.title}>{title}</h3>
        
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
        <SkillTree modules={modules} />
        
        <div className={styles.infoSections}>
          <div className={clsx(styles.infoBox, styles['infoBox--certification'])}>
            <p className={clsx(styles.infoLabel, styles['infoLabel--certification'])}>
              Certification:
            </p>
            <p className={clsx(styles.infoText, styles['infoText--certification'])}>
              {certification}
            </p>
          </div>
          
          <div className={clsx(styles.infoBox, styles['infoBox--careerPath'])}>
            <p className={clsx(styles.infoLabel, styles['infoLabel--careerPath'])}>
              Career Path:
            </p>
            <p className={clsx(styles.infoText, styles['infoText--careerPath'])}>
              {careerPath}
            </p>
          </div>
        </div>
      </div>
      
      <Button variant="primary" className={`${styles.continueButton} w-full`}>
        Continue Learning →
      </Button>
    </Card>
  );
};