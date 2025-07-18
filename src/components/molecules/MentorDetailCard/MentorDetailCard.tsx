import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import type { MentorForUI } from '../../../services/mentorService';
import styles from './MentorDetailCard.module.css';

export interface MentorDetailCardProps {
  mentor: MentorForUI;
  onSelectMentor: (mentor: MentorForUI) => void;
}

export const MentorDetailCard: React.FC<MentorDetailCardProps> = ({
  mentor,
  onSelectMentor
}) => {
  const handleSelect = () => {
    onSelectMentor(mentor);
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      key={mentor.id} // Key ensures re-animation when mentor changes
    >
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.avatarEmoji}>{mentor.avatar}</span>
        </div>
        <div className={styles.titleSection}>
          <h3 className={styles.name}>{mentor.name}</h3>
          <p className={styles.title}>{mentor.title}</p>
          <p className={styles.company}>{mentor.company}</p>
        </div>
      </div>

      {/* Expertise Tags */}
      <div className={styles.expertise}>
        {mentor.expertise.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="secondary" size="sm">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Contribution/Legacy */}
      <div className={styles.contribution}>
        <h4 className={styles.contributionTitle}>Key Contribution</h4>
        <p className={styles.contributionText}>{mentor.contribution}</p>
      </div>

      {/* Mentor's Message */}
      <div className={styles.message}>
        <h4 className={styles.messageTitle}>Mentor's Guidance</h4>
        <div className={styles.messageContent}>
          {mentor.message.split('\n\n').map((paragraph, index) => (
            <p key={index} className={styles.messageParagraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSelect}
          className={styles.selectButton}
        >
          Choose {mentor.name} as My Guide
        </Button>
      </div>
    </motion.div>
  );
}; 