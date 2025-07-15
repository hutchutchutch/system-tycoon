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
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
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
    </div>
  );
};