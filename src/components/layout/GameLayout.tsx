import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GameHUD } from '../organisms/GameHUD';
import styles from './GameLayout.module.css';

export const GameLayout: React.FC = () => {
  const location = useLocation();
  
  // Hide GameHUD on design pages since they have their own integrated HUD
  const shouldShowGameHUD = !location.pathname.startsWith('/design');

  return (
    <div className={styles.gameLayout}>
      {shouldShowGameHUD && <GameHUD />}
      <main className={shouldShowGameHUD ? styles.mainWithHUD : styles.mainNoHUD}>
        <Outlet />
      </main>
    </div>
  );
};