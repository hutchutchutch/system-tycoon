import React from 'react';
import { clsx } from 'clsx';
import {
  LandingHero,
  CrisisAlert,
  HowItWorks,
  MissionShowcase,
  ImpactDashboard,
  LearningPaths,
  Partners,
  CollaborationFeature,
  Certification,
  Pricing,
  FooterCTA
} from '../components/organisms';
import styles from './LandingPage.module.css';

export const LandingPage: React.FC = () => {
  return (
    <main className={clsx(styles.page, 'bg-dots')}>
      {/* Fixed Crisis Alert Bar */}
      <CrisisAlert />
      
      {/* Main Content Sections */}
      <div className={styles.content}>
        <section className={styles.heroSection}>
          <LandingHero />
        </section>
        
        <section className={styles.processSection}>
          <HowItWorks />
        </section>
        
        <section className={styles.missionsSection}>
          <MissionShowcase />
        </section>
        
        <section className={styles.impactSection}>
          <ImpactDashboard />
        </section>
        
        <section className={styles.learningSection}>
          <LearningPaths />
        </section>
        
        <section className={styles.partnersSection}>
          <Partners />
        </section>
        
        <section className={styles.collaborationSection}>
          <CollaborationFeature />
        </section>
        
        <section className={styles.certificationSection}>
          <Certification />
        </section>
        
        <section className={styles.pricingSection}>
          <Pricing />
        </section>
        
        <section className={styles.ctaSection}>
          <FooterCTA />
        </section>
      </div>
    </main>
  );
};