import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { GameLayout } from './components/layout/GameLayout';
import { ProtectedRoute, OnboardingRoute } from './components/common/ProtectedRoute';

// Pages
import { SimpleLanding } from './pages/SimpleLanding';
import { OnboardingPage } from './pages/OnboardingPage';
import { AuthFlowPage } from './pages/auth/AuthFlowPage';
import { OAuthCallback } from './pages/auth/OAuthCallback';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailSentPage } from './pages/auth/VerifyEmailSentPage';
import { InitialExperience } from './pages/InitialExperience';
import { ChooseMissionWrapper } from './pages/InitialExperience/ChooseMissionWrapper';
import { ErrorPage } from './pages/ErrorPage';

import { EmailClientWrapper } from './pages/InitialExperience/EmailClientWrapper';
import { MissionWhiteboard } from './pages/InitialExperience/CrisisSystemDesignCanvas';
import { BlankSystemDesignPage } from './pages/BlankSystemDesignPage';
import { MissionResultsPage } from './pages/game/MissionResultsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <SimpleLanding />,
  },
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'onboarding',
        element: (
          <OnboardingRoute>
            <OnboardingPage />
          </OnboardingRoute>
        ),
      },
      {
        path: 'game',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <InitialExperience />,
          },
        ],
      },

      {
        path: 'browser/news',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ChooseMissionWrapper />,
          },
        ],
      },
      {
        path: 'email',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <EmailClientWrapper />,
          },
        ],
      },
      {
        path: 'whiteboard/:emailId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <MissionWhiteboard />,
          },
        ],
      },
      {
        path: 'whiteboard',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <BlankSystemDesignPage />,
          },
        ],
      },
      {
        // Mission-flow results: whiteboard hands off here after
        // POST /missions/complete-stage with the payload in router state.
        path: 'results/stage/:stageId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <MissionResultsPage />,
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
    element: <AuthFlowPage />,
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
    element: <OAuthCallback />,
  },
  {
    path: 'auth/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: 'auth/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: 'auth/verify-email',
    element: <VerifyEmailSentPage />,
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