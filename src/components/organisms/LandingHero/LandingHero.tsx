import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section className={styles.heroSection}>
      {/* Animated gradient background */}
      <BeamsBackground intensity="subtle" />
      
      <motion.div 
        className={styles.contentWrapper}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.container}>
          {/* Social proof badges */}
          <motion.div 
            className={styles.socialProof}
            variants={fadeInUp}
          >
            <Badge variant="success" size="small" className={styles.badge}>
              🔥 287 developers solving missions right now
            </Badge>
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            className={styles.title}
            variants={fadeInUp}
          >
            <span className={styles.titleMain}>Worldly Problems</span>
            <span className={styles.titleSub}>Software Solutions</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className={styles.subtitle}
            variants={fadeInUp}
          >
            Build software that solves real problems for real organizations.
            <br />
            Master cloud architecture while your code helps humanity.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            className={styles.ctaSection}
            variants={fadeInUp}
          >
            <Button 
              variant="primary" 
              size="large"
              className={styles.ctaButton}
              onClick={handleStartBuilding}
            >
              🚀 Start Your First Mission - Free
            </Button>
            <Button 
              variant="outline" 
              size="large"
              className={styles.ctaButtonSecondary}
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Live stats */}
          <motion.div 
            className={styles.liveStats}
            variants={fadeInUp}
          >
            <div className={styles.statItem}>
              <span className={styles.statValue}>2,847</span>
              <span className={styles.statLabel}>Active Missions</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>142K</span>
              <span className={styles.statLabel}>Lives Impacted</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>98%</span>
              <span className={styles.statLabel}>Hired Rate</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingHero;