import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { MentorSelectionCard } from '../../molecules/MentorSelectionCard';
import type { Mentor } from '../../../types/mentor.types';
import { mentors } from '../../../types/mentor.types';
import styles from './MentorSelectionModal.module.css';

export interface MentorSelectionModalProps {
  isOpen: boolean;
  onComplete: (mentor: Mentor) => void;
}

export const MentorSelectionModal: React.FC<MentorSelectionModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowMessage(true);
  };

  const handleContinue = () => {
    if (selectedMentor) {
      onComplete(selectedMentor);
    }
  };

  const handleBack = () => {
    setShowMessage(false);
    setSelectedMentor(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      size="large"
      closeOnOverlayClick={false}
      showCloseButton={false}
    >
      <div className={styles.modal}>
        <AnimatePresence mode="wait">
          {!showMessage ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.selectionView}
            >
              <div className={styles.header}>
                <h2 className={styles.title}>Choose Your Mentor</h2>
                <p className={styles.subtitle}>
                  Select a mentor to guide you through your consulting journey. 
                  Each brings unique wisdom and perspective to help you succeed.
                </p>
              </div>

              <div className={styles.mentorGrid}>
                {mentors.map((mentor) => (
                  <MentorSelectionCard
                    key={mentor.id}
                    mentor={mentor}
                    onClick={handleMentorSelect}
                    isSelected={selectedMentor?.id === mentor.id}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={styles.messageView}
            >
              <div className={styles.messageHeader}>
                <div className={styles.mentorInfo}>
                  <span className={styles.mentorAvatar}>
                    {selectedMentor?.avatar}
                  </span>
                  <div>
                    <h3 className={styles.mentorName}>{selectedMentor?.name}</h3>
                    <p className={styles.mentorTitle}>
                      {selectedMentor?.title} at {selectedMentor?.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.messageContent}>
                <div className={styles.messageText}>
                  {selectedMentor?.message.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={styles.messageParagraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className={styles.messageActions}>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className={styles.backButton}
                >
                  Choose Different Mentor
                </Button>
                <Button
                  variant="primary"
                  onClick={handleContinue}
                  className={styles.continueButton}
                >
                  Show Me Today's Heroes
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};