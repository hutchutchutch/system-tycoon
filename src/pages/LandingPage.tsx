import React from 'react';
import { HeroSection } from '../components/ui/hero-section-1';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-white text-black dark:bg-black dark:text-white">
      <HeroSection />
    </div>
  );
};