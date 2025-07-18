import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { GameLayout } from './components/layout/GameLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Marketing
import { Landing, MarketingLayout } from './marketing';

// Pages
import { OnboardingPage } from './pages/OnboardingPage';
import { AuthFlowPage } from './pages/auth/AuthFlowPage';
import { InitialExperience } from './pages/InitialExperience';
import { MeetingRoomPage } from './pages/game/MeetingRoomPage';
import { MentorSelectionPage } from './pages/game/MentorSelectionPage';
import { SystemDesignPage } from './pages/game/SystemDesignPage';
import { SimulationPage } from './pages/game/SimulationPage';
import { ResultsPage } from './pages/game/ResultsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <MarketingLayout>
            <Landing />
          </MarketingLayout>
        ),
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />,
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
        path: 'meeting/:scenarioId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <MeetingRoomPage />,
          },
        ],
      },
      {
        path: 'mentor/:scenarioId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <MentorSelectionPage />,
          },
        ],
      },
      {
        path: 'design/:scenarioId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <SystemDesignPage />,
          },
        ],
      },
      {
        path: 'simulation/:scenarioId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <SimulationPage />,
          },
        ],
      },
      {
        path: 'results/:attemptId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ResultsPage />,
          },
        ],
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
    element: <div>Processing authentication...</div>,
  },
  // Login/Signup redirects for marketing header
  {
    path: 'login',
    element: <Navigate to="/auth" replace />,
  },
  {
    path: 'signup',
    element: <Navigate to="/auth" replace />,
  },
]);