import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { handleOAuthReturn } from '../../features/auth/authSlice';

export const OAuthCallback: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error, profile } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(handleOAuthReturn());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      if (profile?.onboarding_completed) {
        navigate('/game', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isAuthenticated, profile, navigate]);

  useEffect(() => {
    if (error) {
      // Redirect back to auth page on error
      setTimeout(() => navigate('/auth', { replace: true }), 2000);
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      {error ? (
        <p className="text-red-500">Sign-in failed: {error}</p>
      ) : (
        <p>Completing sign-in...</p>
      )}
    </div>
  );
};
