import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../atoms/Button';
import { useNavigate } from 'react-router-dom';
import styles from './FooterCTA.module.css';

const FooterCTA: React.FC = () => {
  const navigate = useNavigate();
  const [activeDevelopers, setActiveDevelopers] = useState(2384);
  const [timeLeft, setTimeLeft] = useState(16997); // seconds until next mission

  useEffect(() => {
    // Simulate live developer count
    const devInterval = setInterval(() => {
      setActiveDevelopers(prev => prev + Math.floor(Math.random() * 5 - 1));
    }, 5000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 16997));
    }, 1000);

    return () => {
      clearInterval(devInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartMission = () => {
    navigate('/auth');
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 0.86, 0.39, 0.96] }}
          className={styles.content}
        >
          <h2 className={styles.title}>Ready to Code for Good?</h2>
          <p className={styles.subtitle}>
            Join a global community using technology to solve humanity's greatest challenges.
            <br />
            Your next line of code could save lives.
          </p>

          <div className={styles.stats}>
            <motion.div
              className={styles.statItem}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className={styles.statIcon}>🌍</span>
              <div>
                <span className={styles.statValue}>{activeDevelopers.toLocaleString()}</span>
                <span className={styles.statLabel}>developers solving missions</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.statItem}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className={styles.statIcon}>⏰</span>
              <div>
                <span className={styles.statValue}>{formatTime(timeLeft)}</span>
                <span className={styles.statLabel}>Next urgent mission in</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              size="large"
              onClick={handleStartMission}
              className={styles.button}
            >
              🚀 Start Your First Mission - Free
            </Button>
          </motion.div>

          <p className={styles.disclaimer}>
            No credit card required • Join 14,287 developers • Real impact from day one
          </p>
        </motion.div>

        <div className={styles.backgroundPattern} />
      </div>
    </section>
  );
};

export default FooterCTA;