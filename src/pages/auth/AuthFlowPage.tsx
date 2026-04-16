import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { checkAuth } from '../../features/auth/authSlice';
import { AuthFlowDiagram } from './components/AuthFlowDiagram';
import './AuthFlowPage.css';

export const AuthFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Verify session with the server on mount.
  // This clears any stale persisted auth state if the session cookie is gone.
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Only redirect an already-authenticated user AFTER the server confirms the session.
  useEffect(() => {
    if (!isLoading && isAuthenticated && profile) {
      if (profile.onboarding_completed) {
        navigate('/game', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, profile, navigate]);

  const handleAuthSuccess = () => {
    if (profile?.onboarding_completed) {
      navigate('/game');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="auth-flow-page">
      <div className="auth-diagram-container">
        <AuthFlowDiagram onAuthSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};
