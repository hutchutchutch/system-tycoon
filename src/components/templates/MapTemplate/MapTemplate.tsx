import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import GameHUD from '../../organisms/GameHUD';
import CareerMap from '../../organisms/CareerMap';

interface MapTemplateProps {
  children?: React.ReactNode;
}

/**
 * MapTemplate - Template for the main game map view
 * 
 * Redux State Management:
 * - game.player: Current player data and stats
 * - game.currentLocation: Player's current position on map
 * - game.unlockedLocations: Available locations to travel to
 * - ui.activeModal: Current modal/dialog state
 */
export const MapTemplate: React.FC<MapTemplateProps> = ({ children }) => {
  // Redux state selectors
  const player = useAppSelector((state) => state.game.player);
  const currentLocation = useAppSelector((state) => state.game.currentLocation);
  const unlockedLocations = useAppSelector((state) => state.game.unlockedLocations);

  return (
    <div className="map-template">
      <div className="map-template__hud">
        <GameHUD />
      </div>
      <main className="map-template__content">
        <CareerMap 
          currentLocation={currentLocation}
          unlockedLocations={unlockedLocations}
        />
        {children}
      </main>
    </div>
  );
};

export default MapTemplate;