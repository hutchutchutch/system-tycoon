import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithOAuth, 
  clearError,
  demoSignIn 
} from '../../features/auth/authSlice';
import { AuthModal } from './components/AuthModal';
import { AuthFlowDiagram } from './components/AuthFlowDiagram';
import './AuthFlowPage.css';

export const AuthFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [authSubmitted, setAuthSubmitted] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
    setAuthSubmitted(true);
    const result = await dispatch(signInWithEmail({ email, password }));
    if (signInWithEmail.fulfilled.match(result)) {
      setTimeout(() => navigate('/game'), 2000); // Give time for animation
    } else {
      setAuthSubmitted(false);
    }
  };

  const handleSignUp = async (email: string, password: string, username: string) => {
    setAuthSubmitted(true);
    const result = await dispatch(signUpWithEmail({ email, password, username }));
    if (signUpWithEmail.fulfilled.match(result)) {
      setTimeout(() => navigate('/game'), 2000); // Give time for animation
    } else {
      setAuthSubmitted(false);
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github' | 'linkedin') => {
    setAuthSubmitted(true);
    dispatch(signInWithOAuth(provider));
  };

  const handleDemoSignIn = async () => {
    setAuthSubmitted(true);
    const result = await dispatch(demoSignIn('1c8d0b3a-0fae-4916-9c8a-987473c0a24e'));
    if (demoSignIn.fulfilled.match(result)) {
      setTimeout(() => navigate('/game'), 2000); // Give time for animation
    } else {
      setAuthSubmitted(false);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
    setAuthSubmitted(false);
  };

  return (
    <div className="auth-flow-page">
      <div className="auth-modal-container">
        <AuthModal
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onOAuthSignIn={handleOAuthSignIn}
          onDemoSignIn={handleDemoSignIn}
          onClearError={handleClearError}
          isLoading={isLoading}
          error={error}
          authSubmitted={authSubmitted}
        />
      </div>
      
      <div className="auth-diagram-container">
        <AuthFlowDiagram 
          isAnimating={authSubmitted} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}; 