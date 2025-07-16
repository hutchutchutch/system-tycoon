import React from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAppSelector } from '../../hooks/redux';
import { Button } from '../atoms/Button';
import styles from './AuthLayout.module.css';

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
    <div className={styles.layout}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <button 
            className={styles.logo}
            onClick={() => navigate('/')}
          >
            System Tycoon
          </button>
          <div className={styles.navActions}>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className={styles.navButton}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Auth Container */}
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Auth Form Container */}
          <div className={styles.formContainer}>
            {/* Tab Navigation */}
            <div className={styles.tabs}>
              <button
                className={clsx(styles.tab, {
                  [styles.tabActive]: isSignIn
                })}
                onClick={() => navigate('/auth/signin')}
              >
                Sign In
              </button>
              <button
                className={clsx(styles.tab, {
                  [styles.tabActive]: isSignUp
                })}
                onClick={() => navigate('/auth/signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <div className={styles.formContent}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};