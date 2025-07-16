import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import { useTheme } from '../../../contexts/ThemeContext';
import { CAREER_TITLES } from '../../../constants';
import { Settings, User, Trophy, Star, Sun, Moon, AlertTriangle } from 'lucide-react';

interface GameHUDProps {
  className?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { profile } = useAppSelector(state => state.auth);
  const { crisisMetrics } = useAppSelector(state => state.mission);
  const { theme, toggleTheme } = useTheme();
  
  if (!profile) {
    return null;
  }

  const username = profile.username || 'Unknown User';
  const currentLevel = profile.current_level || 1;
  const reputationPoints = profile.reputation_points || 0;
  const careerTitle = profile.career_title || CAREER_TITLES[Math.min(currentLevel - 1, CAREER_TITLES.length - 1)];
  
  // Get data lost from mission state
  const dataLost = crisisMetrics?.totalDataLost || 0;

  return (
    <header className={`game-hud ${className}`}>
      {/* Left Section - User Profile */}
      <div className="game-hud__section game-hud__section--left">
        <div className="game-hud__profile">
          <div className="game-hud__avatar">
            <span className="game-hud__avatar-text">
              {username[0]?.toUpperCase() || 'U'}
            </span>
            <div className="game-hud__status-indicator" />
          </div>
          <div className="game-hud__user-info">
            <div className="game-hud__username">{username}</div>
            <div className="game-hud__career-title">{careerTitle}</div>
          </div>
        </div>
      </div>
      
      {/* Center Section - System Status */}
      <div className="game-hud__section game-hud__section--center">
        <div className="game-hud__system-status">
          <div className="game-hud__status-item">
            <div className="game-hud__status-dot game-hud__status-dot--online" />
            <span className="game-hud__status-text">System Online</span>
          </div>
          {dataLost > 0 && (
            <div className="game-hud__status-item game-hud__status-item--warning">
              <AlertTriangle size={14} />
              <span className="game-hud__status-text">Data Lost: {dataLost}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Section - Stats & Actions */}
      <div className="game-hud__section game-hud__section--right">
        <div className="game-hud__stats">
          <div className="game-hud__stat">
            <div className="game-hud__stat-icon">
              <Trophy size={16} />
            </div>
            <div className="game-hud__stat-content">
              <div className="game-hud__stat-label">Level</div>
              <div className="game-hud__stat-value">{currentLevel}</div>
            </div>
          </div>
          
          <div className="game-hud__stat">
            <div className="game-hud__stat-icon">
              <Star size={16} />
            </div>
            <div className="game-hud__stat-content">
              <div className="game-hud__stat-label">Reputation</div>
              <div className="game-hud__stat-value">
                {reputationPoints.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="game-hud__actions">
          <button 
            className="game-hud__action-button game-hud__action-button--theme" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button className="game-hud__action-button" aria-label="User profile">
            <User size={16} />
          </button>
          <button className="game-hud__action-button" aria-label="Settings">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};