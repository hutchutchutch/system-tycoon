import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GameHUD } from '../organisms/GameHUD';

export const GameLayout: React.FC = () => {
  const location = useLocation();
  
  // Hide GameHUD on career page since it has its own PhaseHeader
  const shouldShowGameHUD = !location.pathname.startsWith('/career');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {shouldShowGameHUD && <GameHUD />}
      <main className={shouldShowGameHUD ? "h-screen pt-16" : "h-screen"}>
        <Outlet />
      </main>
    </div>
  );
};