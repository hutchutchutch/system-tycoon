import React, { useState } from 'react';
import Globe3D from '../components/ui/hero';
import CrisisAlert from '../components/organisms/CrisisAlert/CrisisAlert';
import HowItWorks from '../components/organisms/HowItWorks/HowItWorks';
import MissionShowcase from '../components/organisms/MissionShowcase/MissionShowcase';
import FooterCTA from '../components/organisms/FooterCTA/FooterCTA';
import { OnboardingFlow } from '../components/organisms/OnboardingFlow';
import styles from './LandingPage.module.css';

export const LandingPage: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <main className={styles.page}>
      {/* Fixed Crisis Alert Bar */}
      <CrisisAlert onStartMission={handleStartOnboarding} />
      
      {/* Hero Section */}
      <Globe3D onStartMission={handleStartOnboarding} />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Mission Showcase Section */}
      <MissionShowcase />
      
      {/* Footer CTA Section */}
      <FooterCTA onStartMission={handleStartOnboarding} />

      {/* Onboarding Flow */}
      <OnboardingFlow 
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </main>
  );
};