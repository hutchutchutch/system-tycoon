import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { GameLayout } from '../components/layout/GameLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Screens
import { LandingPage } from '../screens/LandingPage';
import { SignInPage } from '../screens/auth/SignInPage';
import { SignUpPage } from '../screens/auth/SignUpPage';
import { CareerMapScreen } from '../screens/game/CareerMapScreen';
import { MeetingRoomScreen } from '../screens/game/MeetingRoomScreen';
import { MentorSelectionScreen } from '../screens/game/MentorSelectionScreen';
import { SystemDesignCanvas } from '../screens/game/SystemDesignCanvas';
import { SimulationScreen } from '../screens/game/SimulationScreen';
import { ResultsScreen } from '../screens/game/ResultsScreen';

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
        path: 'career',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <CareerMapScreen />,
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
            element: <MeetingRoomScreen />,
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
            element: <MentorSelectionScreen />,
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
            element: <SystemDesignCanvas />,
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
            element: <SimulationScreen />,
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
            element: <ResultsScreen />,
          },
        ],
      },
    ],
  },
]);