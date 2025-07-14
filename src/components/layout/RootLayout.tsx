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
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};