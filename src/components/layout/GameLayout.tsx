import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GameHUD } from '../organisms/GameHUD';

export const GameLayout: React.FC = () => {
  const location = useLocation();
  
  // Hide GameHUD on design pages since they have their own integrated HUD
  const shouldShowGameHUD = !location.pathname.startsWith('/design');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {shouldShowGameHUD && <GameHUD />}
      <main className={shouldShowGameHUD ? "h-screen pt-16" : "h-screen"}>
        <Outlet />
      </main>
    </div>
  );
};