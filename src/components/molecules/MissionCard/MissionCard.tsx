import React from 'react';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import styles from './MissionCard.module.css';

interface MissionCardProps {
  title: string;
  partner: string;
  location: string;
  difficulty: number;
  activePlayers: number;
  crisis: string;
  skills: string[];
  status: 'URGENT' | 'ACTIVE' | 'NEW';
}

const MissionCard: React.FC<MissionCardProps> = ({
  title,
  partner,
  location,
  difficulty,
  activePlayers,
  crisis,
  skills,
  status
}) => {
  const renderDifficultyStars = (count: number) => {
    return (
      <div className={styles.difficulty}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`${styles.star} ${i < count ? styles.starFilled : styles.starEmpty}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const statusVariant = status === 'URGENT' ? 'destructive' : status === 'NEW' ? 'success' : 'default';

  return (
    <Card className={styles.missionCard}>
      <div className={styles.header}>
        <Badge variant={statusVariant} size="sm">
          {status}
        </Badge>
        {renderDifficultyStars(difficulty)}
      </div>

      <h3 className={styles.title}>{title}</h3>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Partner:</span>
          <span className={styles.detailValue}>{partner}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Location:</span>
          <span className={styles.detailValue}>{location}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.userIcon}>👥</span>
          <span className={styles.detailValue}>{activePlayers} active players</span>
        </div>
      </div>

      <div className={styles.crisisSection}>
        <h4 className={styles.crisisLabel}>The Crisis:</h4>
        <p className={styles.crisisText}>{crisis}</p>
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsLabel}>Skills You'll Learn:</h4>
        <div className={styles.skillsList}>
          {skills.map(skill => (
            <Badge key={skill} variant="secondary" size="sm">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <Button variant="primary" size="md" className={styles.joinButton}>
        Join Mission →
      </Button>
    </Card>
  );
};

export default MissionCard;
export type { MissionCardProps };