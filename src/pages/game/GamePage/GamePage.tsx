import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { MapTemplate } from '../../templates/MapTemplate';
import { ComponentDrawer } from '../../organisms/ComponentDrawer';

/**
 * GamePage - Main gameplay page showing the career map
 * 
 * Redux State Management:
 * - game.currentLocation: Player's position on the map
 * - game.availableActions: Actions available at current location
 * - ui.showComponentDrawer: Component discovery drawer state
 * - game.inventory: Player's collected components
 */
export const GamePage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const currentLocation = useAppSelector((state) => state.game.currentLocation);
  const availableActions = useAppSelector((state) => state.game.availableActions);
  const showDrawer = useAppSelector((state) => state.ui.showComponentDrawer);
  const inventory = useAppSelector((state) => state.game.inventory);

  return (
    <MapTemplate>
      <div className="game-content">
        {/* Location-specific content and interactions */}
        {currentLocation && (
          <div className="location-info">
            <h2>{currentLocation.name}</h2>
            <p>{currentLocation.description}</p>
          </div>
        )}
        
        {/* Component discovery drawer */}
        {showDrawer && <ComponentDrawer />}
      </div>
    </MapTemplate>
  );
};

export default GamePage;