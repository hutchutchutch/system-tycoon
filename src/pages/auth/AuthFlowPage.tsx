import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFlowDiagram } from './components/AuthFlowDiagram';
import './AuthFlowPage.css';

export const AuthFlowPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    // Navigate to game after successful authentication
    navigate('/game');
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