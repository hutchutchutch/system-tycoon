import React from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import { useTheme } from '../../../contexts/ThemeContext';
import { CAREER_TITLES } from '../../../constants';
import { Settings, User, Trophy, Star, Sun, Moon, AlertTriangle } from 'lucide-react';
import styles from './GameHUD.module.css';

interface GameHUDProps {
  className?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { profile } = useAppSelector(state => state.auth);
  const { crisisMetrics } = useAppSelector(state => state.mission);
  const { theme, toggleTheme } = useTheme();
  
  if (!profile) {
    return (
      <header className={clsx(styles.hud, className)} style={{ background: 'red', color: 'white', padding: '8px' }}>
        GameHUD: No Profile Found
      </header>
    );
  }

  const username = profile.username || 'Unknown User';
  const currentLevel = profile.current_level || 1;
  const reputationPoints = profile.reputation_points || 0;
  const careerTitle = profile.career_title || CAREER_TITLES[Math.min(currentLevel - 1, CAREER_TITLES.length - 1)];
  
  // Get data lost from mission state
  const dataLost = crisisMetrics?.totalDataLost || 0;

  return (
    <header className={clsx(styles.hud, className)}>
      {/* Left Section - User Profile */}
      <div className={clsx(styles.section, styles['section--left'])}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>
              {username[0]?.toUpperCase() || 'U'}
            </span>
            <div className={styles.statusIndicator} />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.username}>{username}</div>
            <div className={styles.careerTitle}>{careerTitle}</div>
          </div>
        </div>
      </div>
      
      {/* Center Section - System Status */}
      <div className={clsx(styles.section, styles['section--center'])}>
        <div className={styles.systemStatus}>
          <div className={styles.statusItem}>
            <div className={clsx(styles.statusDot, styles['statusDot--online'])} />
            <span className={styles.statusText}>System Online</span>
          </div>
          {dataLost > 0 && (
            <div className={clsx(styles.statusItem, styles['statusItem--warning'])}>
              <AlertTriangle size={14} />
              <span className={styles.statusText}>Data Lost: {dataLost}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Section - Stats & Actions */}
      <div className={clsx(styles.section, styles['section--right'])}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <Trophy size={16} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Level</div>
              <div className={styles.statValue}>{currentLevel}</div>
            </div>
          </div>
          
          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <Star size={16} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Reputation</div>
              <div className={styles.statValue}>
                {reputationPoints.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={clsx(styles.actionButton, styles['actionButton--theme'])} 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button className={styles.actionButton} aria-label="User profile">
            <User size={16} />
          </button>
          <button className={styles.actionButton} aria-label="Settings">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};