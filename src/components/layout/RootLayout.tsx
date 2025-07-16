import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { checkAuth } from '../../features/auth/authSlice';

export const RootLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check for existing session on mount
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-neutral-50)' }}>
      <Outlet />
    </div>
  );
};