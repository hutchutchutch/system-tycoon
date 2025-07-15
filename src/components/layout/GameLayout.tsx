import React from 'react';
import { Outlet } from 'react-router-dom';
import { GameHUD } from '../organisms/GameHUD';

export const GameLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameHUD />
      <main className="h-screen pt-16">
        <Outlet />
      </main>
    </div>
  );
};