import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
// import { MapTemplate } from '../../templates/MapTemplate'; // Missing template
// import { ComponentDrawer } from '../../organisms/ComponentDrawer'; // Wrong path

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
  
  // Redux state selectors - TODO: Add these properties to Redux state
  // const currentLocation = useAppSelector((state) => state.game.currentLocation);
  // const availableActions = useAppSelector((state) => state.game.availableActions);
  // const showDrawer = useAppSelector((state) => state.ui.showComponentDrawer);
  // const inventory = useAppSelector((state) => state.game.inventory);

  return (
    <div className="game-page">
      <div className="game-content">
        {/* Location-specific content and interactions */}
        <div className="location-info">
          <h2>Game Location</h2>
          <p>Current game state - under development</p>
        </div>
        
        {/* TODO: Component discovery drawer */}
        <p>Game page - under development</p>
      </div>
    </div>
  );
};

export default GamePage;