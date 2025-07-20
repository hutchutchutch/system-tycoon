import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { CAREER_TITLES } from '../../../constants';
import { User, Trophy, Star, AlertTriangle, Mail, Globe, FileText, Clock, Users, Menu } from 'lucide-react';
import { InviteCollaboratorModal } from '../InviteCollaboratorModal';
import { getUnreadEmailCount } from '../../../services/emailService';
import { triggerTestSystem } from '../../../features/mission/missionSlice';
import styles from './GameHUD.module.css';

interface GameHUDProps {
  className?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector(state => state.auth);
  const { currentMission, currentDatabaseMission, crisisMetrics } = useAppSelector(state => state.mission);
  
  // Avatar dropdown state
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  
  // Invite modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Email notification state
  const [unreadEmailCount, setUnreadEmailCount] = useState(0);
  
  // Mentor notification progress state
  const [mentorNotificationProgress, setMentorNotificationProgress] = useState<{[stageId: string]: number}>({});
  
  // Check if we're on the crisis system design canvas
  const isOnCrisisCanvas = location.pathname.includes('/crisis-design/') || location.pathname.includes('/game/email/');
  
  // Extract email ID from URL if on crisis canvas (the route is /crisis-design/:emailId)
  const getEmailIdFromPath = () => {
    const match = location.pathname.match(/\/crisis-design\/([^/?]+)/);
    return match ? match[1] : null;
  };
  
  const emailId = getEmailIdFromPath();
  // For now, use emailId as stageId since they're related
  const stageId = emailId;
  const missionId = currentDatabaseMission?.id || currentMission?.id;
  
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
    const currentStageId = currentDatabaseMission?.stages?.[currentDatabaseMission?.currentStageIndex || 0]?.id;
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
  }, [isOnCrisisCanvas, isTimerActive, mentorNotificationProgress, currentDatabaseMission]);
  
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

  // Timer countdown effect - pause when invite modal is open
  useEffect(() => {
    if (isTimerActive && timerSeconds > 0 && !isInviteModalOpen) {
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
  }, [isTimerActive, timerSeconds, isOnCrisisCanvas, isInviteModalOpen, dispatch]);
  
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
    if (isOnCrisisCanvas && stageId && missionId) {
      // Open invite modal when on crisis canvas
      setIsInviteModalOpen(true);
    } else {
      // Default behavior - could open user profile
      console.log('User profile clicked');
    }
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
  
  // Check if we're on a system design page (CrisisSystemDesignCanvas or SystemDesignPage)
  const isOnSystemDesignPage = location.pathname.includes('/crisis-design/') ||
                               location.pathname.includes('/system-design') ||
                               location.pathname.includes('/email/');
  
  // Prioritize database mission over hardcoded mission
  const activeMission = currentDatabaseMission || currentMission;
  const hasStages = currentDatabaseMission 
    ? currentDatabaseMission.stages && currentDatabaseMission.stages.length > 0
    : currentMission && currentMission.steps && currentMission.steps.length > 0;
  
  // Show mission stages ONLY if we're on a system design page
  const showMissionStages = isOnSystemDesignPage && activeMission && hasStages;
  
  // Check if mentor notifications are pending for current stage
  const currentStageId = currentDatabaseMission?.stages?.[currentDatabaseMission?.currentStageIndex || 0]?.id;
  const notificationsCompleted = currentStageId ? (mentorNotificationProgress[currentStageId] || 0) >= 3 : false;
  const showMentorNotificationPending = isOnCrisisCanvas && currentStageId && !notificationsCompleted;

  // Debug logging to understand mission stage display
  console.log('🎮 GameHUD Debug:', {
    location: location.pathname,
    isOnSystemDesignPage,
    isOnCrisisCanvas,
    showMissionStages,
    hasStages,
    currentDatabaseMission: currentDatabaseMission ? {
      id: currentDatabaseMission.id,
      title: currentDatabaseMission.title,
      stagesCount: currentDatabaseMission.stages?.length || 0,
      currentStageIndex: currentDatabaseMission.currentStageIndex
    } : null,
    currentMission: currentMission ? {
      id: currentMission.id,
      title: currentMission.title,
      stepsCount: currentMission.steps?.length || 0
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
                    <div className={styles.statLabel}>Reputation</div>
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
                    navigate('/design-canvas');
                  })}
                >
                  <Globe size={14} />
                  <span>System Design Canvas</span>
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
              className={clsx(styles.actionButton, {
                [styles['actionButton--collaborate']]: isOnCrisisCanvas
              })} 
              onClick={handleUserProfileClick}
              aria-label={isOnCrisisCanvas ? "Invite collaborator" : "User profile"}
              title={isOnCrisisCanvas ? "Invite collaborator" : "User profile"}
            >
              {isOnCrisisCanvas ? <Users size={16} /> : <User size={16} />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Invite Collaborator Modal */}
      {isInviteModalOpen && stageId && missionId && (
        <InviteCollaboratorModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          stageId={stageId}
          missionId={missionId}
        />
      )}
    </>
  );
};