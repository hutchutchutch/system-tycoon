import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import { useTheme } from '../../../contexts/ThemeContext';
import { CAREER_TITLES } from '../../../constants';
import { User, Trophy, Star, Sun, Moon, AlertTriangle, Mail, Globe, FileText, Clock } from 'lucide-react';
import styles from './GameHUD.module.css';

interface GameHUDProps {
  className?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAppSelector(state => state.auth);
  const { currentMission, currentDatabaseMission, crisisMetrics } = useAppSelector(state => state.mission);
  const { theme, toggleTheme } = useTheme();
  
  // Avatar dropdown state
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if we're on the crisis system design canvas
  const isOnCrisisCanvas = location.pathname.includes('/crisis/') || location.pathname.includes('/game/email/');
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    };
    
    if (isAvatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isAvatarMenuOpen]);
  
  // Timer effect - start timer when on crisis canvas
  useEffect(() => {
    if (isOnCrisisCanvas && !isTimerActive) {
      // Start the timer at 3 minutes (180 seconds)
      setTimerSeconds(180);
      setIsTimerActive(true);
    } else if (!isOnCrisisCanvas && isTimerActive) {
      // Stop the timer when leaving crisis canvas
      setIsTimerActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isOnCrisisCanvas, isTimerActive]);
  
  // Timer countdown effect
  useEffect(() => {
    if (isTimerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive, timerSeconds]);
  
  const handleAvatarClick = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
  };
  
  const handleDropdownItemClick = (action: () => void) => {
    action();
    setIsAvatarMenuOpen(false);
  };
  
  // Format timer display
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  if (!profile) {
    return (
      <header className={clsx(styles.hud, className)} style={{ background: 'red', color: 'white', padding: '8px' }}>
        GameHUD: No Profile Found
      </header>
    );
  }

  const username = profile.username || 'Unknown User';
  const currentLevel = profile.current_level || 1;
  const reputationPoints = profile.reputation_score || 0;
  const careerTitle = profile.career_title || CAREER_TITLES[Math.min(currentLevel - 1, CAREER_TITLES.length - 1)];
  
  // Get data lost from mission state
  const dataLost = crisisMetrics?.totalDataLost || 0;

  // Check if we're on the game route (where InitialExperience and system design canvas are)
  const isOnGameRoute = location.pathname.startsWith('/game');
  
  // Check if we're on the Today's News screen
  const isOnTodaysNews = location.pathname === '/browser/news';
  
  // Prioritize database mission over hardcoded mission
  const activeMission = currentDatabaseMission || currentMission;
  const hasStages = currentDatabaseMission 
    ? currentDatabaseMission.stages && currentDatabaseMission.stages.length > 0
    : currentMission && currentMission.steps && currentMission.steps.length > 0;
  
  // Show mission stages if we have an active mission and we're on the game route
  const showMissionStages = isOnGameRoute && activeMission && hasStages && !isOnTodaysNews;

  return (
    <header className={clsx(styles.hud, className)}>
      {/* Left Section - User Profile */}
      <div className={clsx(styles.section, styles['section--left'])}>
        <div className={styles.profile} ref={avatarRef}>
          <div 
            className={clsx(styles.avatar, isAvatarMenuOpen && styles.avatarActive)} 
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
            aria-label="Open user menu"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAvatarClick();
              }
            }}
          >
            <span className={styles.avatarText}>
              {username[0]?.toUpperCase() || 'U'}
            </span>
            <div className={styles.statusIndicator} />
          </div>
          <div 
            className={styles.userInfo}
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAvatarClick();
              }
            }}
          >
            <div className={styles.username}>{username}</div>
            <div className={styles.careerTitle}>{careerTitle}</div>
          </div>
          
          {/* Avatar Dropdown Menu */}
          {isAvatarMenuOpen && (
            <div className={styles.avatarDropdown}>
              <div className={styles.dropdownHeader}>Browser Options</div>

              <button
                className={styles.dropdownItem}
                onClick={() => handleDropdownItemClick(() => {
                  navigate('/browser/news');
                })}
              >
                <FileText size={14} />
                <span>Today's News</span>
              </button>
              <div className={styles.dropdownDivider} />
              <button
                className={styles.dropdownItem}
                onClick={() => handleDropdownItemClick(() => {
                  navigate('/email');
                })}
              >
                <Mail size={14} />
                <span>Email Client</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Center Section - Timer, Mission Stages, Today's News Message, or System Status */}
      <div className={clsx(styles.section, styles['section--center'])}>
        {isTimerActive && timerSeconds > 0 ? (
          <div className={clsx(styles.timer, timerSeconds <= 30 && styles['timer--warning'])}>
            <Clock size={16} className={styles.timerIcon} />
            <span className={styles.timerText}>Time Remaining: {formatTimer(timerSeconds)}</span>
          </div>
        ) : isOnTodaysNews ? (
          <div className={styles.todaysNewsMessage}>
            <span className={styles.newsMessageText}>People need help! Choose your Mission</span>
          </div>
        ) : showMissionStages ? (
          <div className={styles.missionStages}>
            <span className={styles.stageLabel}>Stage:</span>
            <div className={styles.stageIndicators}>
              {currentDatabaseMission ? (
                // Render database mission stages
                currentDatabaseMission.stages.map((stage, index) => {
                  const isCurrentStage = index === currentDatabaseMission.currentStageIndex;
                  const isCompleted = stage.completed || false;
                  const isUpcoming = index > currentDatabaseMission.currentStageIndex;
                  
                  return (
                    <div
                      key={stage.id}
                      className={clsx(styles.stageIndicator, {
                        [styles['stageIndicator--current']]: isCurrentStage,
                        [styles['stageIndicator--completed']]: isCompleted,
                        [styles['stageIndicator--upcoming']]: isUpcoming,
                      })}
                      title={stage.title}
                    >
                      {stage.stage_number}
                    </div>
                  );
                })
              ) : (
                // Render hardcoded mission steps (fallback)
                currentMission?.steps.map((step, index) => {
                  const isCurrentStage = index === currentMission.currentStepIndex;
                  const isCompleted = step.completed;
                  const isUpcoming = index > currentMission.currentStepIndex;
                  
                  return (
                    <div
                      key={step.id}
                      className={clsx(styles.stageIndicator, {
                        [styles['stageIndicator--current']]: isCurrentStage,
                        [styles['stageIndicator--completed']]: isCompleted,
                        [styles['stageIndicator--upcoming']]: isUpcoming,
                      })}
                      title={step.title}
                    >
                      {index + 1}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
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
        )}
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
        </div>
      </div>
    </header>
  );
};