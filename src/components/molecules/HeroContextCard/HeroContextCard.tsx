import React from 'react';
import { Card } from '../../atoms/Card';
import type { NewsHero } from '../../../types/news.types';
import styles from './HeroContextCard.module.css';

export interface HeroContextCardProps {
  hero: NewsHero;
  className?: string;
}

export const HeroContextCard: React.FC<HeroContextCardProps> = ({
  hero,
  className = ''
}) => {
  return (
    <div data-theme="light">
      <Card className={`${styles.heroContextCard} ${className}`}>
        <div className={styles.header}>
          <div className={styles.heroInfo}>
            <img 
              src={hero.avatar} 
              alt={hero.name}
              className={styles.heroAvatar}
            />
            <div className={styles.heroDetails}>
              <h3 className={styles.heroName}>{hero.name}</h3>
              <p className={styles.heroTitle}>{hero.title} at {hero.organization}</p>
            </div>
          </div>
          <div 
            className={styles.urgencyBadge}
            data-urgency={hero.urgency}
          >
            {hero.urgency.toUpperCase()} PRIORITY
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Technical Challenge</h4>
            <p className={styles.sectionContent}>{hero.technicalProblem}</p>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Skills Needed</h4>
            <div className={styles.skillsList}>
              {hero.skillsNeeded.map((skill, index) => (
                <span key={index} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Impact</h4>
            <p className={styles.impactText}>
              💡 This could help {hero.impact.people.toLocaleString()} {hero.impact.metric}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}; 