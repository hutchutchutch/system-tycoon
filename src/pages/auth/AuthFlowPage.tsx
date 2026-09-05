import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { checkAuth } from '../../features/auth/authSlice';
import { AuthFlowDiagram } from './components/AuthFlowDiagram';
import './AuthFlowPage.css';

export const AuthFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.auth);

  // Verify session with the server on mount.
  // This clears any stale persisted auth state if the session cookie is gone.
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Note: we intentionally don't auto-redirect here when the user becomes
  // authenticated. The AuthFlowDiagram plays its success animation and then
  // calls handleAuthSuccess to navigate — that's the single source of truth
  // for the authenticated-redirect.

  const handleAuthSuccess = () => {
    if (profile?.onboarding_completed) {
      // Honor the deep link the user originally requested, if a route
      // guard sent them here (ProtectedRoute passes it via state.from).
      const from = (location.state as { from?: { pathname?: string } } | null)?.from;
      navigate(from?.pathname ?? '/game');
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
