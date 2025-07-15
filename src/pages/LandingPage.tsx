import React from 'react';
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

export const LandingPage: React.FC = () => {
  return (
    <main className="landing-page">
      <CrisisAlert />
      <LandingHero />
      <HowItWorks />
      <MissionShowcase />
      <ImpactDashboard />
      <LearningPaths />
      <Partners />
      <CollaborationFeature />
      <Certification />
      <Pricing />
      <FooterCTA />
    </main>
  );
};