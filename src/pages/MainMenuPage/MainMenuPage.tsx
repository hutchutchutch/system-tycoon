import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { MenuTemplate } from '../../templates/MenuTemplate';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';

/**
 * MainMenuPage - Game main menu
 * 
 * Redux State Management:
 * - auth.isAuthenticated: User authentication status
 * - game.hasSaveGame: Whether user has existing save
 * - ui.menuAnimation: Menu transition states
 * - settings.soundEnabled: Audio settings for menu sounds
 */
export const MainMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasSaveGame = useAppSelector((state) => state.game.hasSaveGame);
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled);

  const handleNewGame = () => {
    dispatch({ type: 'game/newGame' });
    navigate('/game');
  };

  const handleContinue = () => {
    dispatch({ type: 'game/loadSave' });
    navigate('/game');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <MenuTemplate>
              <Card className="menu-card">
          <div className="menu-options">
          {hasSaveGame && (
            <Button
              onClick={handleContinue}
              size="lg"
              className="menu-button"
            >
              Continue Game
            </Button>
          )}
          
          <Button
            onClick={handleNewGame}
            size="lg"
            variant={hasSaveGame ? 'outline' : 'default'}
            className="menu-button"
          >
            New Game
          </Button>
          
          <Button
            onClick={handleSettings}
            size="lg"
            variant="outline"
            className="menu-button"
          >
            Settings
          </Button>
          
          {!isAuthenticated && (
            <Button
              onClick={() => navigate('/auth/login')}
              size="lg"
              variant="secondary"
              className="menu-button"
            >
              Login / Register
            </Button>
          )}
        </div>
      </Card>
    </MenuTemplate>
  );
};

export default MainMenuPage;