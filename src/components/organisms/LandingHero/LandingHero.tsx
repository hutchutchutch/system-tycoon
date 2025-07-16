import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Button } from '../../atoms/Button';
import { AnimatedBackground } from './components/AnimatedBackground';
import styles from './LandingHero.module.css';

const LandingHero: React.FC = () => {
  const navigate = useNavigate();

  const handleStartBuilding = () => {
    navigate('/auth/signin');
  };

  return (
    <section className={styles.hero}>
      <AnimatedBackground />
      
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Worldly Problems
            <br />
            <span className={styles.subtitle}>
              Software Solutions
            </span>
          </h1>
          
          <p className={styles.description}>
            Navigate the journey from financial desperation to tech consulting success. 
            Build systems, manage clients, and grow your consulting empire.
          </p>
          
          <div className={styles.actions}>
            <Button 
              variant="primary" 
              size="large"
              className={styles.cta}
              onClick={handleStartBuilding}
            >
              🚀 Start Building Your Empire
            </Button>
            
            <p className={styles.hint}>
              Experience realistic consulting workflows
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;