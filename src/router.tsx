import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { GameLayout } from './components/layout/GameLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { InitialExperience } from './pages/InitialExperience';
import { CareerMapPage } from './pages/game/CareerMapPage';
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
        element: <LandingPage />,
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/auth/signin" replace />,
          },
          {
            path: 'signin',
            element: <SignInPage />,
          },
          {
            path: 'signup',
            element: <SignUpPage />,
          },
          {
            path: 'callback',
            element: <div>Processing authentication...</div>, // OAuth callback handler
          },
        ],
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
        path: 'career',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <CareerMapPage />,
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
]);