import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { CAREER_TITLES } from '../../constants';

export const GameHUD: React.FC = () => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.auth.profile);

  if (!profile) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left section - User info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {profile.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium">{profile.username}</div>
              <div className="text-xs text-gray-400">
                {CAREER_TITLES[Math.min(profile.currentLevel - 1, CAREER_TITLES.length - 1)]}
              </div>
            </div>
          </div>
        </div>

        {/* Center section - Level & Reputation */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Level</div>
            <div className="text-xl font-bold">{profile.currentLevel}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Reputation</div>
            <div className="text-xl font-bold text-yellow-400">
              {profile.reputationPoints.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Right section - Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/career')}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Career Map
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};