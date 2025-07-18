import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../atoms/Button';
import { Globe } from '../../../ui/globe';
import styles from './OpeningImpactScreen.module.css';

export interface OpeningImpactScreenProps {
  onContinue: () => void;
}

export const OpeningImpactScreen: React.FC<OpeningImpactScreenProps> = ({
  onContinue
}) => {
  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <div className={styles.animatedBackground}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>

      {/* Content */}
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.23, 0.86, 0.39, 0.96] }}
      >
        <motion.h1
          className={styles.headline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Software Changed Everything
        </motion.h1>

        <motion.div
          className={styles.buttonContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onContinue}
            className={styles.continueButton}
          >
            Continue →
          </Button>
        </motion.div>
      </motion.div>

      {/* Globe at bottom */}
      <motion.div
        className={styles.globeContainer}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 1.2, ease: [0.23, 0.86, 0.39, 0.96] }}
      >
        <Globe />
      </motion.div>
    </div>
  );
}; 