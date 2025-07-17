import React from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { Button } from '../atoms/Button';
import styles from './AuthLayout.module.css';

export const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // If already authenticated, redirect to career map
  if (isAuthenticated) {
    return <Navigate to="/game" replace />;
  }

  return (
    <div className={styles.layout}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <button 
            className={styles.logo}
            onClick={() => navigate('/')}
          >
            Service as a Software
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
        <Outlet />
      </div>
    </div>
  );
};