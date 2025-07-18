import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../atoms/Button';
import styles from './TransformationStoryScreen.module.css';

export interface TransformationStory {
  id: string;
  icon: string;
  headline: string;
  body: string;
}

export interface TransformationStoryScreenProps {
  stories: TransformationStory[];
  onComplete: () => void;
}

export const TransformationStoryScreen: React.FC<TransformationStoryScreenProps> = ({
  stories,
  onComplete
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStory = stories[currentStoryIndex];
  const isLastStory = currentStoryIndex === stories.length - 1;

  const handleNext = () => {
    if (isLastStory) {
      onComplete();
    } else {
      setCurrentStoryIndex(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStory.id}
          className={styles.storyContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] }}
        >
          {/* Large Icon */}
          <motion.div
            className={styles.iconContainer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className={styles.icon}>{currentStory.icon}</span>
          </motion.div>

          {/* Story Content */}
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className={styles.headline}>{currentStory.headline}</h2>
            <p className={styles.body}>{currentStory.body}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        className={styles.navigation}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {/* Progress Dots */}
        <div className={styles.progressDots}>
          {stories.map((_, index) => (
            <div
              key={index}
              className={`${styles.progressDot} ${
                index === currentStoryIndex ? styles.active : ''
              } ${index < currentStoryIndex ? styles.completed : ''}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className={styles.skipButton}
          >
            Skip
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            className={styles.nextButton}
          >
            {isLastStory ? 'Continue' : 'Next →'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}; 