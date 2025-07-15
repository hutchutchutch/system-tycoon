import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import { AnimatedBackground } from './components/AnimatedBackground';

const LandingHero: React.FC = () => {
  const navigate = useNavigate();

  const handleStartBuilding = () => {
    navigate('/auth/signin');
  };

  return (
    <section className="landing-page__hero">
      <AnimatedBackground />
      
      <div className="landing-page__hero-container">
        <div className="landing-page__hero-content">
          <h1 className="landing-page__hero-title">
            System Tycoon
            <br />
            <span className="landing-page__hero-subtitle">
              Tech Consultant Simulator
            </span>
          </h1>
          
          <p className="landing-page__hero-description">
            Navigate the journey from financial desperation to tech consulting success. 
            Build systems, manage clients, and grow your consulting empire through 
            realistic browser-based professional tools.
          </p>
          
          <div className="landing-page__hero-actions">
            <Button 
              variant="primary" 
              size="large"
              className="landing-page__hero-cta"
              onClick={handleStartBuilding}
            >
              🚀 Start Building Your Empire
            </Button>
            
            <p className="landing-page__hero-hint">
              Experience realistic consulting workflows
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;