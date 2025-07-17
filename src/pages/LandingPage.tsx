import React from 'react';
import Globe3D from '../components/ui/hero';
import CrisisAlert from '../components/organisms/CrisisAlert/CrisisAlert';
import HowItWorks from '../components/organisms/HowItWorks/HowItWorks';
import MissionShowcase from '../components/organisms/MissionShowcase/MissionShowcase';
import FooterCTA from '../components/organisms/FooterCTA/FooterCTA';
import styles from './LandingPage.module.css';

export const LandingPage: React.FC = () => {
  return (
    <main className={styles.page}>
      {/* Fixed Crisis Alert Bar */}
      <CrisisAlert />
      
      {/* Hero Section */}
      <Globe3D />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Mission Showcase Section */}
      <MissionShowcase />
      
      {/* Footer CTA Section */}
      <FooterCTA />
    </main>
  );
};