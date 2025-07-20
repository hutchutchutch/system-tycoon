import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { GameHUD } from '../../organisms/GameHUD';
// import { CareerMap } from '../../organisms/CareerMap'; // Missing component
import styles from './MapTemplate.module.css';

interface MapTemplateProps {
  children?: React.ReactNode;
}

/**
 * MapTemplate - Template for the main game map view
 * 
 * Redux State Management:
 * - game: Current game state and progress
 * - auth.user: Current user authentication state
 */
export const MapTemplate: React.FC<MapTemplateProps> = ({ children }) => {
  // Redux state selectors
  const gameState = useAppSelector((state) => state.game);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className={styles.mapTemplate}>
      <div className={styles.hud}>
        <GameHUD />
      </div>
      <main className={styles.content}>
{/* <CareerMap /> */}
        <div>Map placeholder</div>
        {children}
      </main>
    </div>
  );
};

export default MapTemplate;