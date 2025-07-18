import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../atoms/Button';
import type { Mentor } from '../../../../types/mentor.types';
import { MentorService, type MentorData } from '../../../../services/mentorService';
import styles from './MentorWisdomScreen.module.css';

export interface MentorWisdomScreenProps {
  mentor: Mentor;
  onComplete: () => void;
}

export const MentorWisdomScreen: React.FC<MentorWisdomScreenProps> = ({
  mentor,
  onComplete
}) => {
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [wisdomParagraphs, setWisdomParagraphs] = useState<string[]>([]);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const data = await MentorService.getMentorById(mentor.id);
        
        if (data) {
          setMentorData(data);
          const wisdomMessage = MentorService.generateWisdomMessage(data);
          setWisdomParagraphs(wisdomMessage);
        } else {
          // Fallback to basic message using mentor props
          setWisdomParagraphs([
            `${mentor.message || 'Welcome to your journey as a systems engineer.'}`,
            '',
            'Your journey as a developer isn\'t just about writing code - it\'s about solving problems that matter.',
            '',
            'Each mission will challenge you to think differently, build better, and create solutions that truly impact lives.',
            '',
            'The skills you develop here will prepare you for a career where technology serves humanity.'
          ]);
        }
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        // Use fallback message on error
        setWisdomParagraphs([
          `${mentor.message || 'Welcome to your journey as a systems engineer.'}`,
          '',
          'Your journey as a developer isn\'t just about writing code - it\'s about solving problems that matter.',
          '',
          'Each mission will challenge you to think differently, build better, and create solutions that truly impact lives.',
          '',
          'The skills you develop here will prepare you for a career where technology serves humanity.'
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [mentor.id, mentor.message]);

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Mentor Header */}
        <motion.div
          className={styles.mentorHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.mentorAvatar}>
            <span className={styles.mentorEmoji}>{mentor.avatar}</span>
          </div>
          <div className={styles.mentorInfo}>
            <h2 className={styles.mentorName}>
              {mentorData?.name || mentor.name}
            </h2>
            <p className={styles.mentorTitle}>
              {mentorData?.title || `${mentor.title} - ${mentor.company}`}
            </p>
            {mentorData?.tagline && (
              <p className={styles.mentorTagline}>"{mentorData.tagline}"</p>
            )}
          </div>
        </motion.div>

        <div className={styles.divider} />

        {/* Wisdom Message */}
        <motion.div
          className={styles.messageContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>Loading mentor wisdom...</p>
            </div>
          ) : (
          <div className={styles.messageContent}>
            {wisdomParagraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className={styles.messageParagraph}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className={styles.ctaContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
                     <Button
             variant="primary"
             size="lg"
             onClick={onComplete}
             className={styles.ctaButton}
           >
            Show Me Today's Heroes →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}; 