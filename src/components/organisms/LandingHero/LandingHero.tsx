import React from 'react';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { MetricCard } from '../../molecules/MetricCard';
import { AnimatedBackground } from './components/AnimatedBackground';
import { LiveWorldMap } from './components/LiveWorldMap';
import { SocialProofBar } from './components/SocialProofBar';
import { Container } from './components/Container';
import { HeroContent } from './components/HeroContent';

const LandingHero: React.FC = () => {
  return (
    <section className="hero-section h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Container>
        <HeroContent />
        <div className="flex gap-4 justify-center mt-8">
          <Button variant="primary" size="large">
            🚀 Start Your First Mission - Free
          </Button>
          <Button variant="outline" size="large">
            Watch Demo
          </Button>
        </div>
        <SocialProofBar />
        <LiveWorldMap />
      </Container>
    </section>
  );
};

export default LandingHero;