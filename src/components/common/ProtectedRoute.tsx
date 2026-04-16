import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * If true (default), users who haven't completed onboarding get redirected
   * to /onboarding. Set to false on the /onboarding route itself.
   */
  requireOnboarded?: boolean;
}

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  </div>
);

/**
 * Gates a route behind authentication and (by default) completed onboarding.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireOnboarded = true,
}) => {
  const { isAuthenticated, isLoading, profile } = useAppSelector((state) => state.auth);

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireOnboarded && profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

/**
 * Route guard for /onboarding itself.
 * Requires auth, but redirects to /game if the user has already finished onboarding.
 */
export const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, profile } = useAppSelector((state) => state.auth);

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.onboarding_completed) {
    return <Navigate to="/game" replace />;
  }

  return <>{children}</>;
};
