import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BeamsBackground } from '../../ui/beams-background';
import styles from './LandingHero.module.css';

const LandingHero: React.FC = () => {
  const navigate = useNavigate();

  const handleStartBuilding = () => {
    navigate('/auth/signin');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.23, 0.86, 0.39, 0.96] 
      }
    }
  };

  return (
    <section className={styles.heroSection}>
      {/* Animated gradient background */}
      <BeamsBackground intensity="subtle" />
      
      <motion.div 
        className={styles.contentWrapper}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.container}>
          {/* Main heading */}
          <motion.h1 
            className={styles.title}
            variants={fadeInUp}
          >
            <span className={styles.titleMain}>Worldly Problems</span>
            <span className={styles.titleSub}>
              Software Solutions
            </span>
          </motion.h1>
          
          {/* CTA button */}
          <motion.div 
            className={styles.ctaSection}
            variants={fadeInUp}
          >
            <button 
              className={styles.ctaButton}
              onClick={handleStartBuilding}
            >
              Join Mission
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingHero;