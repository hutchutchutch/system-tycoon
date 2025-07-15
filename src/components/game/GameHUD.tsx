import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { CAREER_TITLES } from '../../constants';

interface GameHUDProps {
  className?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ className = '' }) => {
  const { profile } = useAppSelector(state => state.auth);
  
  if (!profile) {
    return null;
  }

  const username = profile.username || 'Unknown User';
  const currentLevel = profile.current_level || 1;
  const reputationPoints = profile.reputation_points || 0;
  const careerTitle = profile.career_title || CAREER_TITLES[Math.min(currentLevel - 1, CAREER_TITLES.length - 1)];

  return (
    <div className={`game-hud ${className}`}>
      <div className="game-hud__user-info">
        <div className="game-hud__avatar">
          {username[0]?.toUpperCase() || 'U'}
        </div>
        <div className="game-hud__user-details">
          <div className="text-sm font-medium">{username}</div>
          <div className="text-xs text-gray-600">
            {careerTitle}
          </div>
        </div>
      </div>
      
      <div className="game-hud__stats">
        <div className="game-hud__stat">
          <div className="text-xs text-gray-600">Level</div>
          <div className="text-xl font-bold">{currentLevel}</div>
        </div>
        <div className="game-hud__stat">
          <div className="text-xs text-gray-600">Reputation</div>
          <div className="text-lg font-semibold">
            {reputationPoints.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};