import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { AuthFlowDiagram } from './components/AuthFlowDiagram';
import './AuthFlowPage.css';

export const AuthFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAppSelector((state) => state.auth);

  const handleAuthSuccess = () => {
    // Check if user has completed onboarding
    if (profile?.onboarding_completed) {
      // User has already completed onboarding, go to game
      navigate('/game');
    } else {
      // User hasn't completed onboarding yet, go to onboarding flow
      navigate('/onboarding');
    }
  };

  return (
    <div className="auth-flow-page">
      <div className="auth-diagram-container">
        <AuthFlowDiagram 
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
}; 