import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, OnboardingRoute } from './components/common/ProtectedRoute';

import { ErrorPage } from './pages/ErrorPage';

const SimpleLanding = lazy(() => import('./pages/SimpleLanding').then((module) => ({ default: module.SimpleLanding })));
const RootLayout = lazy(() => import('./components/layout/RootLayout').then((module) => ({ default: module.RootLayout })));
const GameLayout = lazy(() => import('./components/layout/GameLayout').then((module) => ({ default: module.GameLayout })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then((module) => ({ default: module.OnboardingPage })));
const AuthFlowPage = lazy(() => import('./pages/auth/AuthFlowPage').then((module) => ({ default: module.AuthFlowPage })));
const OAuthCallback = lazy(() => import('./pages/auth/OAuthCallback').then((module) => ({ default: module.OAuthCallback })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })));
const VerifyEmailSentPage = lazy(() => import('./pages/auth/VerifyEmailSentPage').then((module) => ({ default: module.VerifyEmailSentPage })));
const InitialExperience = lazy(() => import('./pages/InitialExperience').then((module) => ({ default: module.InitialExperience })));
const ChooseMissionWrapper = lazy(() => import('./pages/InitialExperience/ChooseMissionWrapper').then((module) => ({ default: module.ChooseMissionWrapper })));
const EmailClientWrapper = lazy(() => import('./pages/InitialExperience/EmailClientWrapper').then((module) => ({ default: module.EmailClientWrapper })));
const MissionWhiteboard = lazy(() => import('./pages/InitialExperience/CrisisSystemDesignCanvas').then((module) => ({ default: module.MissionWhiteboard })));
const BlankSystemDesignPage = lazy(() => import('./pages/BlankSystemDesignPage').then((module) => ({ default: module.BlankSystemDesignPage })));
const MissionResultsPage = lazy(() => import('./pages/game/MissionResultsPage').then((module) => ({ default: module.MissionResultsPage })));

const routeFallback = (
  <div role="status" aria-live="polite" style={{ padding: '2rem', textAlign: 'center' }}>
    Loading…
  </div>
);

const load = (element: React.ReactNode) => <Suspense fallback={routeFallback}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: load(<SimpleLanding />),
  },
  {
    path: '/',
    element: load(<RootLayout />),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'onboarding',
        element: (
          <OnboardingRoute>
            {load(<OnboardingPage />)}
          </OnboardingRoute>
        ),
      },
      {
        path: 'game',
        element: (
          <ProtectedRoute>
            {load(<GameLayout />)}
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: load(<InitialExperience />),
          },
        ],
      },

      {
        path: 'browser/news',
        element: (
          <ProtectedRoute>
            {load(<GameLayout />)}
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: load(<ChooseMissionWrapper />),
          },
        ],
      },
      {
        path: 'email',
        element: (
          <ProtectedRoute>
            {load(<GameLayout />)}
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: load(<EmailClientWrapper />),
          },
        ],
      },
      {
        path: 'whiteboard/stage/:stageId',
        element: <ProtectedRoute>{load(<GameLayout />)}</ProtectedRoute>,
        children: [{ index: true, element: load(<MissionWhiteboard />) }],
      },
      {
        path: 'whiteboard/:emailId',
        element: (
          <ProtectedRoute>
            {load(<GameLayout />)}
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: load(<MissionWhiteboard />),
          },
        ],
      },
      {
        path: 'whiteboard',
        element: (
          <ProtectedRoute>
            {load(<GameLayout />)}
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: load(<BlankSystemDesignPage />),
          },
        ],
      },
      {
        // Mission-flow results: whiteboard hands off here after
        // POST /missions/complete-stage with the payload in router state.
        path: 'results/stage/:stageId',
        element: (
          <ProtectedRoute>
            {load(<GameLayout />)}
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: load(<MissionResultsPage />),
          },
        ],
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
  // Standalone auth routes (no layout wrapper)
  {
    path: 'auth',
    element: load(<AuthFlowPage />),
  },
  {
    path: 'auth/signin',
    element: <Navigate to="/auth" replace />,
  },
  {
    path: 'auth/signup', 
    element: <Navigate to="/auth" replace />,
  },
  {
    path: 'auth/callback',
    element: load(<OAuthCallback />),
  },
  {
    path: 'auth/forgot-password',
    element: load(<ForgotPasswordPage />),
  },
  {
    path: 'auth/reset-password',
    element: load(<ResetPasswordPage />),
  },
  {
    path: 'auth/verify-email',
    element: load(<VerifyEmailSentPage />),
  },
  // Legacy auth redirects
  {
    path: 'login',
    element: <Navigate to="/auth" replace />,
  },
  {
    path: 'signup',
    element: <Navigate to="/auth" replace />,
  },
]);
