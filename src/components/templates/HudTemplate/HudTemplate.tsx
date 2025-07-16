import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { GameHUD } from '../../organisms/GameHUD';
import styles from './HudTemplate.module.css';

interface HudTemplateProps {
  children?: React.ReactNode;
  showMetrics?: boolean;
}

/**
 * HudTemplate - Basic template with HUD for game screens
 * 
 * Redux State Management:
 * - game: Current game state and progress
 * - auth.user: Current user information
 */
export const HudTemplate: React.FC<HudTemplateProps> = ({ 
  children,
  showMetrics = true 
}) => {
  // Redux state selectors
  const gameState = useAppSelector((state) => state.game);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className={styles.hudTemplate}>
      <div className={styles.hud}>
        <GameHUD />
      </div>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default HudTemplate;