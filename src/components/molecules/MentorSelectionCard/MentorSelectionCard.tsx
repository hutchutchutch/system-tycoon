import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import type { MentorForUI } from '../../../services/mentorService';
import styles from './MentorSelectionCard.module.css';

export interface MentorSelectionCardProps {
  mentor: MentorForUI;
  onClick: (mentor: MentorForUI) => void;
  isSelected?: boolean;
}

export const MentorSelectionCard: React.FC<MentorSelectionCardProps> = ({
  mentor,
  onClick,
  isSelected = false
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`${styles.card} ${isSelected ? styles.selected : ''}`}
        onClick={() => onClick(mentor)}
      >
        <div className={styles.avatar}>
          <span className={styles.avatarEmoji}>{mentor.avatar}</span>
        </div>
        
        <h3 className={styles.name}>{mentor.name}</h3>
        
        <div className={styles.info}>
          <p className={styles.title}>{mentor.title}</p>
          <p className={styles.company}>{mentor.company}</p>
        </div>
        
        <p className={styles.contribution}>{mentor.contribution}</p>
        
        <div className={styles.expertise}>
          <Badge variant="secondary" size="sm">
            {mentor.expertise[0]}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
};