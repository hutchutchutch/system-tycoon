import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { CAREER_TITLES } from '../../../constants';
import { User, Trophy, Star, AlertTriangle, Mail, Globe, FileText, Clock, Users, Menu, LogOut } from 'lucide-react';
import { getUnreadEmailCount } from '../../../services/emailService';
import { triggerTestSystem } from '../../../features/mission/missionSlice';
import { signOut } from '../../../features/auth/authSlice';
import styles from './GameHUD.module.css';

interface GameHUDProps {
  className?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector(state => state.auth);
  const { currentMission, crisisMetrics } = useAppSelector(state => state.mission);
  
  // Avatar dropdown state
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Email notification state
  const [unreadEmailCount, setUnreadEmailCount] = useState(0);
  
  // Mentor notification progress state
  const [mentorNotificationProgress, setMentorNotificationProgress] = useState<{[stageId: string]: number}>({});
  
  // Check if we're on the crisis system design canvas
  const isOnCrisisCanvas = location.pathname.includes('/whiteboard/') || location.pathname.includes('/game/email/');
  
  // Extract email ID from URL if on crisis canvas (the route is /whiteboard/:emailId)
  const getEmailIdFromPath = () => {
    const match = location.pathname.match(/\/whiteboard\/([^/?]+)/);
    return match ? match[1] : null;
  };
  
  const emailId = getEmailIdFromPath();
  
  // Get the correct stage ID - FIXED: was incorrectly using emailId as stageId
  const stageId = (() => {
    // First, try to get stage ID from current database mission
    const currentStageId = currentMission?.stages?.[currentMission?.currentStageIndex || 0]?.id;
    if (currentStageId) {
      return currentStageId;
    }
    
    // Fallback: if we have valid email and mission context, use the first available stage
    // This ensures we always have a valid stage ID for invitations
    if (emailId && currentMission?.id === '11111111-1111-1111-1111-111111111111') {
      // For Community Health Tracker mission, use first stage
      return '550e8400-e29b-41d4-a716-446655440001'; // "Separate Database from Web Server"
    }
    
    return null;
  })();
  
  const missionId = currentMission?.id;
  
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
  
  // Timer effect - start timer when on crisis canvas AND all mentor notifications are complete
  useEffect(() => {
    const currentStageId = currentMission?.stages?.[currentMission?.currentStageIndex || 0]?.id;
    const notificationsCompleted = currentStageId ? (mentorNotificationProgress[currentStageId] || 0) >= 3 : false;
    
    if (isOnCrisisCanvas && !isTimerActive && notificationsCompleted) {
      // Start the timer at 3 minutes (180 seconds) only after notifications are complete
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
  }, [isOnCrisisCanvas, isTimerActive, mentorNotificationProgress, currentMission]);
  
  // Function to update mentor notification progress
  const updateMentorNotificationProgress = (stageId: string, step: number) => {
    setMentorNotificationProgress(prev => ({
      ...prev,
      [stageId]: Math.max(prev[stageId] || 0, step)
    }));
  };
  
  // Expose the progress update function globally so other components can use it
  useEffect(() => {
    (window as any).updateMentorNotificationProgress = updateMentorNotificationProgress;

    return () => {
      delete (window as any).updateMentorNotificationProgress;
    };
  }, []);
  
  // Timer countdown effect
  useEffect(() => {
    if (isTimerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            // Dispatch the test system trigger when timer reaches 0
            if (isOnCrisisCanvas) {
              console.log('Timer expired - triggering test system');
              dispatch(triggerTestSystem());
            }
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
  }, [isTimerActive, timerSeconds, isOnCrisisCanvas, dispatch]);
  
  // Email notification animation state
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  
  // Fetch unread email count on mount and periodically
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await getUnreadEmailCount();
      setUnreadEmailCount(count);
    };
    
    // Initial fetch
    fetchUnreadCount();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to trigger email notification
  const triggerEmailNotification = () => {
    setShowEmailNotification(true);
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowEmailNotification(false);
    }, 3000);
    // Also refresh unread count
    getUnreadEmailCount().then(setUnreadEmailCount);
  };
  
  // Expose the notification trigger globally so EmailComposer can use it
  useEffect(() => {
    (window as any).triggerEmailNotification = triggerEmailNotification;
    
    return () => {
      delete (window as any).triggerEmailNotification;
    };
  }, []);
  
  const handleAvatarClick = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
  };
  
  const handleDropdownItemClick = (action: () => void) => {
    action();
    setIsAvatarMenuOpen(false);
  };

  const handleUserProfileClick = () => {
    // Default behavior - could open user profile
    console.log('User profile clicked');
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
  
      // Check if we're on the Choose Mission screen
  const isOnChooseMission = location.pathname === '/browser/news' || location.pathname === '/game';
  
  // Check if we're on a system design page (MissionWhiteboard or SystemDesignPage)
  const isOnSystemDesignPage = location.pathname.includes('/whiteboard/') ||
                               location.pathname.includes('/system-design') ||
                               location.pathname.includes('/email/');
  
  // Active mission is the current mission from the API
  const activeMission = currentMission;
  const hasStages = currentMission
    ? currentMission.stages && currentMission.stages.length > 0
    : false;
  
  // Show mission stages ONLY if we're on a system design page
  const showMissionStages = isOnSystemDesignPage && activeMission && hasStages;
  
  // Check if mentor notifications are pending for current stage
  const currentStageId = currentMission?.stages?.[currentMission?.currentStageIndex || 0]?.id;
  const notificationsCompleted = currentStageId ? (mentorNotificationProgress[currentStageId] || 0) >= 3 : false;
  const showMentorNotificationPending = isOnCrisisCanvas && currentStageId && !notificationsCompleted;

  // Debug logging to understand mission stage display
  console.log('🎮 GameHUD Debug:', {
    location: location.pathname,
    isOnSystemDesignPage,
    isOnCrisisCanvas,
    showMissionStages,
    hasStages,
    currentMission: currentMission ? {
      id: currentMission.id,
      title: currentMission.title,
      stagesCount: currentMission.stages?.length || 0,
      currentStageIndex: currentMission.currentStageIndex
    } : null,
    activeMission: activeMission ? {
      id: activeMission.id,
      title: activeMission.title
    } : null,
  });

  return (
    <>
      <header className={clsx(styles.hud, className)}>
        {/* Left Section - User Profile */}
        <div className={clsx(styles.section, styles['section--left'])}>
          <div className={styles.profile} ref={avatarRef}>
            <div 
              className={clsx(styles.avatar, isAvatarMenuOpen && styles.avatarActive)} 
              onClick={handleAvatarClick}
              role="button"
              tabIndex={0}
              aria-label="Open navigation menu"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAvatarClick();
                }
              }}
            >
              <Menu size={16} className={styles.menuIcon} />
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
                    <div className={styles.statLabel}>Impact</div>
                    <div className={styles.statValue}>
                      {reputationPoints.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Dropdown Menu */}
            {isAvatarMenuOpen && (
              <div className={styles.avatarDropdown}>
                <div className={styles.dropdownHeader}>Navigation</div>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleDropdownItemClick(() => {
                    navigate('/browser/news');
                  })}
                >
                  <FileText size={14} />
                  <span>Choose Your Mission</span>
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleDropdownItemClick(() => {
                    navigate('/email');
                  })}
                >
                  <Mail size={14} />
                  <span>Email</span>
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleDropdownItemClick(() => {
                    navigate('/whiteboard');
                  })}
                >
                  <Globe size={14} />
                  <span>Whiteboard</span>
                </button>
                <div className={styles.dropdownDivider} />
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleDropdownItemClick(async () => {
                    await dispatch(signOut());
                    navigate('/auth');
                  })}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Center Section - Timer, Mission Stages, Choose Mission Message, or System Status */}
        <div className={clsx(styles.section, styles['section--center'])}>
          {showMentorNotificationPending ? (
            <div className={styles.mentorNotificationPending}>
              <Users size={16} className={styles.mentorIcon} />
              <span className={styles.mentorText}>Complete mentor briefing to start timer</span>
            </div>
          ) : isTimerActive ? (
            <div className={styles.timerAndStages}>
              <div className={clsx(styles.timer, {
                [styles['timer--warning']]: timerSeconds <= 30 && timerSeconds > 0,
                [styles['timer--expired']]: timerSeconds === 0
              })}>
                <Clock size={16} className={styles.timerIcon} />
                <span className={styles.timerText}>
                  {timerSeconds === 0 ? 'Testing System...' : `Time Remaining: ${formatTimer(timerSeconds)}`}
                </span>
              </div>
              {showMissionStages && (
                <div className={styles.missionStages}>
                  <span className={styles.stageLabel}>Stage:</span>
                  <div className={styles.stageIndicators}>
                    {currentMission?.stages.map((stage: any, index: number) => {
                      const isCurrentStage = index === currentMission.currentStageIndex;
                      const isCompleted = stage.completed || false;
                      const isUpcoming = index > currentMission.currentStageIndex;

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
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : isOnChooseMission ? (
            <div className={styles.chooseMissionMessage}>
              <span className={styles.newsMessageText}>People need help! Choose your Mission</span>
            </div>
          ) : showMissionStages ? (
            <div className={styles.missionStages}>
              <span className={styles.stageLabel}>Stage:</span>
              <div className={styles.stageIndicators}>
                {currentMission?.stages.map((stage: any, index: number) => {
                  const isCurrentStage = index === currentMission.currentStageIndex;
                  const isCompleted = stage.completed || false;
                  const isUpcoming = index > currentMission.currentStageIndex;

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
                })}
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
        
        {/* Right Section - Actions Only */}
        <div className={clsx(styles.section, styles['section--right'])}>
          <div className={styles.actions}>
            <div className={styles.emailButtonContainer}>
              {showEmailNotification && (
                <div className={styles.emailNotification}>
                  <Mail size={12} />
                  <span>Email sent!</span>
                </div>
              )}
              <button 
                className={clsx(styles.actionButton, styles['actionButton--email'], {
                  [styles['actionButton--hasNotification']]: unreadEmailCount > 0
                })} 
                onClick={() => navigate('/email')}
                aria-label={`Email (${unreadEmailCount} unread)`}
                title={`Email (${unreadEmailCount} unread)`}
              >
                <Mail size={16} />
                {unreadEmailCount > 0 && (
                  <span className={styles.notificationBadge}>
                    {unreadEmailCount > 9 ? '9+' : unreadEmailCount}
                  </span>
                )}
              </button>
            </div>
            
            <button
              className={styles.actionButton}
              onClick={handleUserProfileClick}
              aria-label="User profile"
              title="User profile"
            >
              <User size={16} />
            </button>
          </div>
        </div>
      </header>
      
    </>
  );
};