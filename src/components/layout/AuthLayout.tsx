import React from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { Button } from '../atoms/Button';

export const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // If already authenticated, redirect to career map
  if (isAuthenticated) {
    return <Navigate to="/game" replace />;
  }

  const isSignIn = location.pathname === '/auth/signin';
  const isSignUp = location.pathname === '/auth/signup';

  return (
    <div className="auth-layout">
      {/* Navigation */}
      <nav className="auth-layout__nav">
        <div className="auth-layout__nav-container">
          <button 
            className="auth-layout__logo"
            onClick={() => navigate('/')}
          >
            System Tycoon
          </button>
          <div className="auth-layout__nav-actions">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="auth-layout__nav-button"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Auth Container */}
      <div className="auth-layout__container">
        <div className="auth-layout__content">
          {/* Auth Form Container */}
          <div className="auth-layout__form-container">
            {/* Tab Navigation */}
            <div className="auth-layout__tabs">
              <button
                className={`auth-layout__tab ${isSignIn ? 'auth-layout__tab--active' : ''}`}
                onClick={() => navigate('/auth/signin')}
              >
                Sign In
              </button>
              <button
                className={`auth-layout__tab ${isSignUp ? 'auth-layout__tab--active' : ''}`}
                onClick={() => navigate('/auth/signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <div className="auth-layout__form-content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};