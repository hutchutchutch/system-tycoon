import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import GameHUD from '../../organisms/GameHUD';

interface HudTemplateProps {
  children?: React.ReactNode;
  showMetrics?: boolean;
}

/**
 * HudTemplate - Basic template with HUD for game screens
 * 
 * Redux State Management:
 * - game.player: Player stats and resources
 * - game.metrics: Performance metrics and scores
 * - ui.notifications: Active notifications/toasts
 * - ui.hudSettings: HUD display preferences
 */
export const HudTemplate: React.FC<HudTemplateProps> = ({ 
  children,
  showMetrics = true 
}) => {
  // Redux state selectors
  const player = useAppSelector((state) => state.game.player);
  const metrics = useAppSelector((state) => state.game.metrics);
  const notifications = useAppSelector((state) => state.ui.notifications);

  return (
    <div className="hud-template">
      <div className="hud-template__hud">
        <GameHUD showMetrics={showMetrics} />
      </div>
      <main className="hud-template__content">
        {children}
      </main>
    </div>
  );
};

export default HudTemplate;