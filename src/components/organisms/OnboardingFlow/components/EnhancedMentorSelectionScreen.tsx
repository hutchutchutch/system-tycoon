import React from 'react';
import { motion } from 'framer-motion';
import { MentorSelectionCard } from '../../../molecules/MentorSelectionCard';
import { mentors } from '../../../../types/mentor.types';
import type { Mentor } from '../../../../types/mentor.types';
import styles from './EnhancedMentorSelectionScreen.module.css';

export interface EnhancedMentorSelectionScreenProps {
  onMentorSelected: (mentor: Mentor) => void;
}

export const EnhancedMentorSelectionScreen: React.FC<EnhancedMentorSelectionScreenProps> = ({
  onMentorSelected
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={styles.title}>Choose Your Guide For What Comes Next</h2>
          <p className={styles.subtitle}>
            Each of these legends transformed how we build software. 
            Now they'll help you transform lives.
          </p>
        </motion.div>

        {/* Mentor Grid */}
        <motion.div
          className={styles.mentorGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mentors.map((mentor) => (
            <motion.div key={mentor.id} variants={itemVariants}>
              <MentorSelectionCard
                mentor={mentor}
                onClick={onMentorSelected}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}; 