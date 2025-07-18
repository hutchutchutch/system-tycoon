import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../atoms/Button';
import type { MentorForUI } from '../../../../services/mentorService';
import styles from './MentorWisdomScreen.module.css';

export interface MentorWisdomScreenProps {
  mentor: MentorForUI;
  onComplete: () => void;
}

export const MentorWisdomScreen: React.FC<MentorWisdomScreenProps> = ({
  mentor,
  onComplete
}) => {
  // Split the mentor message into paragraphs for better display
  const wisdomParagraphs = mentor.message.split('\n\n').filter(p => p.trim().length > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Mentor Introduction */}
        <motion.div
          className={styles.mentorIntro}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.mentorAvatar}>
            <span className={styles.avatarEmoji}>{mentor.avatar}</span>
          </div>
          <h2 className={styles.mentorName}>{mentor.name}</h2>
          <p className={styles.mentorTitle}>{mentor.title}</p>
          <p className={styles.mentorCompany}>{mentor.company}</p>
        </motion.div>

        {/* Wisdom Message */}
        <motion.div
          className={styles.wisdomContent}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h3 
            className={styles.wisdomTitle}
            variants={paragraphVariants}
          >
            Words of Wisdom
          </motion.h3>
          
          {wisdomParagraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              className={styles.wisdomParagraph}
              variants={paragraphVariants}
            >
              {paragraph.trim()}
            </motion.p>
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.div
          className={styles.actionSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onComplete}
            className={styles.continueButton}
          >
            Begin Journey with {mentor.name}
          </Button>
          <p className={styles.actionHint}>
            {mentor.toastMessage}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}; 