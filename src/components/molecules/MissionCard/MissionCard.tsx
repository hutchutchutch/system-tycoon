import React from 'react';
import clsx from 'clsx';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Users, Star } from 'lucide-react';
import styles from './MissionCard.module.css';

interface MissionCardProps {
  title: string;
  partner: string;
  location: string;
  difficulty: number;
  activePlayers: number;
  crisis: string;
  skills: string[];
  status: string;
}

const DifficultyStars: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className={styles.difficultyStars}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={clsx(
            styles.star,
            i < count ? styles['star--filled'] : styles['star--empty']
          )}
        />
      ))}
    </div>
  );
};

export const MissionCard: React.FC<MissionCardProps> = ({ 
  title, 
  partner, 
  location, 
  difficulty, 
  activePlayers, 
  crisis, 
  skills, 
  status 
}) => {
  return (
    <Card className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Badge variant={status === 'URGENT' ? 'destructive' : 'default'}>
            {status}
          </Badge>
          <DifficultyStars count={difficulty} />
        </div>
        
        <h3 className={styles.title}>{title}</h3>
        
        <div className={styles.info}>
          <p className={styles.infoItem}>Partner: {partner}</p>
          <p className={styles.infoItem}>Location: {location}</p>
          <p className={clsx(styles.infoItem, styles.playerCount)}>
            <Users className={styles.playerIcon} />
            {activePlayers} active players
          </p>
        </div>
        
        <div className={styles.crisisSection}>
          <h4 className={styles.sectionTitle}>The Crisis:</h4>
          <p className={styles.crisisText}>{crisis}</p>
        </div>
        
        <div className={styles.skillsSection}>
          <h4 className={styles.sectionTitle}>Skills You'll Learn:</h4>
          <div className={styles.skillsList}>
            {skills.map(skill => (
              <Badge key={skill} variant="outline" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button variant="primary" fullWidth className={styles.joinButton}>
          Join Mission →
        </Button>
      </div>
    </Card>
  );
};