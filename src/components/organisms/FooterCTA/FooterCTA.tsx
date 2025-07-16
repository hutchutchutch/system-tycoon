import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { CountdownTimer } from '../../molecules/CountdownTimer';
import { AnimatedCounter } from '../../molecules/AnimatedCounter';
import styles from './FooterCTA.module.css';

const FooterCTA: React.FC = () => {
  const [stats] = useState({
    activeDevelopers: 2384,
    nextMissionTime: 16997 // seconds
  });
  
  return (
    <section className={styles.footerCta}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Ready to Code for Good?
        </h2>
        
        <p className={styles.description}>
          Join a global community using technology to solve humanity's greatest challenges.
          Your next line of code could save lives.
        </p>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <span className={styles.statIcon}>🌍</span>
              <span className={styles.statNumber}>
                <AnimatedCounter value={stats.activeDevelopers} />
              </span>
            </div>
            <p className={styles.statLabel}>developers solving missions</p>
          </div>
          <CountdownTimer 
            icon="⏰"
            seconds={stats.nextMissionTime}
            label="Next urgent mission in"
          />
        </div>
        
        <div className={styles.actions}>
          <Button 
            variant="secondary" 
            size="large" 
            className={styles.ctaButton}
          >
            🚀 Start Your First Mission - Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;