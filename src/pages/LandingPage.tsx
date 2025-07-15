import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, TrendingUp, Users, Zap } from 'lucide-react';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth/signin');
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-container">
          <nav className="landing-nav">
            <h1 className="landing-logo">System Tycoon</h1>
            <button 
              className="landing-signin-btn"
              onClick={handleGetStarted}
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-container">
            <div className="hero-content">
              <h2 className="hero-title">
                From Laid-Off Developer to
                <span className="hero-highlight"> Tech Consultant</span>
              </h2>
              <p className="hero-subtitle">
                Experience the journey from financial desperation to building a thriving consultancy. 
                Learn real AWS architecture, client management, and business skills through an immersive simulation.
              </p>
              <div className="hero-actions">
                <button 
                  className="hero-cta"
                  onClick={handleGetStarted}
                >
                  Start Your Journey
                  <ArrowRight size={20} />
                </button>
                <span className="hero-note">No credit card required</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="browser-preview">
                <div className="browser-bar">
                  <div className="browser-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="browser-content">
                  <div className="email-preview">
                    <div className="email-item email-item--urgent">
                      <span className="email-sender">Chase Bank</span>
                      <span className="email-subject">Your account balance is $0.00</span>
                    </div>
                    <div className="email-item email-item--urgent">
                      <span className="email-sender">Visa</span>
                      <span className="email-subject">Payment Failed - Action Required</span>
                    </div>
                    <div className="email-item email-item--opportunity">
                      <span className="email-sender">Sarah Chen</span>
                      <span className="email-subject">Quick favor? (I can pay!)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="landing-container">
            <h3 className="features-title">Learn By Doing</h3>
            <div className="features-grid">
              <div className="feature-card">
                <Code2 className="feature-icon" />
                <h4>Real System Design</h4>
                <p>Build AWS architectures using actual cloud patterns and best practices</p>
              </div>
              <div className="feature-card">
                <Users className="feature-icon" />
                <h4>Client Management</h4>
                <p>Navigate client personalities, gather requirements, and manage expectations</p>
              </div>
              <div className="feature-card">
                <TrendingUp className="feature-icon" />
                <h4>Business Growth</h4>
                <p>Scale from solo freelancer to agency owner with multiple consultants</p>
              </div>
              <div className="feature-card">
                <Zap className="feature-icon" />
                <h4>Emotional Journey</h4>
                <p>Experience the stress and triumph of building a business from nothing</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <p>&copy; 2024 System Tycoon. A realistic tech consulting simulator.</p>
        </div>
      </footer>
    </div>
  );
};