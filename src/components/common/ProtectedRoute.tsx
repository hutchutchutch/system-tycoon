import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
  const { isAuthenticated, isLoading, initialized, profile } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  // Wait for the first checkAuth round-trip before deciding — otherwise a
  // fresh browser deep-linking to a protected URL bounces to /auth (and
  // loses the destination) before the session cookie is even checked.
  // Once authenticated, background re-checks must NOT unmount the page.
  if (!isAuthenticated && (isLoading || !initialized)) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
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
  const { isAuthenticated, isLoading, initialized, profile } = useAppSelector(
    (state) => state.auth,
  );

  if (!isAuthenticated && (isLoading || !initialized)) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.onboarding_completed) {
    return <Navigate to="/game" replace />;
  }

  return <>{children}</>;
};
