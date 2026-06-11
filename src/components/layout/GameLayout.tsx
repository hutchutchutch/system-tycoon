import React from 'react';
import { Outlet } from 'react-router-dom';
import { GameHUD } from '../organisms/GameHUD';
import styles from './GameLayout.module.css';

export const GameLayout: React.FC = () => {
  return (
    <div className={styles.gameLayout}>
      <GameHUD />
      <main className={styles.mainWithHUD}>
        <Outlet />
      </main>
    </div>
  );
};