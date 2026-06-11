import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from '../../../utils/relativeTime';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { 
  toggleLikePost, 
  toggleBookmarkPost,
  startConversation,
  setActiveConversation,
} from '../../../features/social/socialSlice';
import type { FeedPost as FeedPostType, DifficultyHint, Urgency, MissionSummary } from '../../../types/social';
import styles from './FeedPost.module.css';

interface FeedPostProps {
  post: FeedPostType;
  onStartProject?: (missionId: string, npcId: string) => void;
}

export const FeedPost = ({ post, onStartProject }: FeedPostProps) => {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [showMissionCard, setShowMissionCard] = useState(false);
  
  const handleLike = useCallback(async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await dispatch(toggleLikePost(post.id)).unwrap();
    } finally {
      setIsLiking(false);
    }
  }, [dispatch, post.id, isLiking]);
  
  const handleBookmark = useCallback(async () => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    try {
      await dispatch(toggleBookmarkPost(post.id)).unwrap();
    } finally {
      setIsBookmarking(false);
    }
  }, [dispatch, post.id, isBookmarking]);
  
  const handleReply = useCallback(async () => {
    if (!post.npc) return;
    const result = await dispatch(startConversation({ 
      npcId: post.npc.id, 
      postId: post.id 
    })).unwrap();
    dispatch(setActiveConversation(result.id));
  }, [dispatch, post.npc, post.id]);

  const handleStartProject = useCallback(() => {
    if (post.mission_id && post.npc) {
      onStartProject?.(post.mission_id, post.npc.id);
    }
    // Also start the conversation
    handleReply();
  }, [post.mission_id, post.npc, onStartProject, handleReply]);
  
  const npc = post.npc;
  const mission = post.mission;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const isHelpRequest = post.post_type === 'help_request';
  const hasMission = isHelpRequest && (post.mission_id || mission);
  
  return (
    <article className={`${styles.post} ${hasMission ? styles.hasMission : ''}`}>
      {/* Mission indicator strip */}
      {hasMission && (
        <div className={styles.missionStrip}>
          <span className={styles.missionIndicator}>
            <ProjectIcon />
            Available Project
          </span>
        </div>
      )}

      {/* Post Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          {npc?.avatar_url ? (
            <img src={npc.avatar_url} alt={npc.name} />
          ) : (
            <span className={styles.avatarFallback}>
              {npc?.name.charAt(0) || '?'}
            </span>
          )}
          {npc?.role && (
            <span className={styles.roleIndicator} title={formatRole(npc.role)}>
              {getRoleEmoji(npc.role)}
            </span>
          )}
        </div>
        
        <div className={styles.authorInfo}>
          <div className={styles.authorName}>
            <span className={styles.name}>{npc?.name || 'Unknown'}</span>
            {npc?.verified && (
              <span className={styles.verified} title="Verified">✓</span>
            )}
          </div>
          <div className={styles.authorMeta}>
            <span className={styles.handle}>@{npc?.handle}</span>
            {npc?.company && (
              <>
                <span className={styles.dot}>·</span>
                <span className={styles.company}>{npc.company}</span>
              </>
            )}
            <span className={styles.dot}>·</span>
            <span className={styles.time}>{timeAgo}</span>
          </div>
        </div>
        
        <button className={styles.moreButton}>
          <MoreIcon />
        </button>
      </div>
      
      {/* Post Content */}
      <div className={styles.content}>
        <p className={isExpanded ? styles.expanded : styles.collapsed}>
          {post.content}
        </p>
        {post.content.length > 280 && !isExpanded && (
          <button 
            className={styles.showMore} 
            onClick={() => setIsExpanded(true)}
          >
            Show more
          </button>
        )}
      </div>
      
      {/* Tags & Metadata */}
      {(isHelpRequest || post.tech_tags.length > 0) && (
        <div className={styles.metadata}>
          {post.difficulty_hint && (
            <DifficultyBadge difficulty={post.difficulty_hint} />
          )}
          {post.urgency && (
            <UrgencyBadge urgency={post.urgency} />
          )}
          {post.budget_range && (
            <span className={styles.budget}>💰 {post.budget_range}</span>
          )}
          <div className={styles.tags}>
            {post.tech_tags.slice(0, 4).map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
            {post.tech_tags.length > 4 && (
              <span className={styles.moreTags}>+{post.tech_tags.length - 4}</span>
            )}
          </div>
        </div>
      )}

      {/* Mission Card (expandable) */}
      {hasMission && (
        <div className={styles.missionSection}>
          <button 
            className={styles.missionToggle}
            onClick={() => setShowMissionCard(!showMissionCard)}
          >
            <span>{showMissionCard ? 'Hide' : 'View'} Project Details</span>
            <ChevronIcon direction={showMissionCard ? 'up' : 'down'} />
          </button>
          
          <AnimatePresence>
            {showMissionCard && (
              <motion.div
                className={styles.missionCard}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MissionCard 
                  mission={mission} 
                  difficulty={post.difficulty_hint}
                  urgency={post.urgency}
                  budget={post.budget_range}
                  techTags={post.tech_tags}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Actions */}
      <div className={styles.actions}>
        <motion.button 
          className={`${styles.actionButton} ${styles.reply}`}
          onClick={handleReply}
          whileTap={{ scale: 0.95 }}
          title="Reply to start a conversation"
        >
          <ReplyIcon />
          <span>Reply</span>
        </motion.button>
        
        <motion.button 
          className={`${styles.actionButton} ${styles.repost}`}
          whileTap={{ scale: 0.95 }}
        >
          <RepostIcon />
          <span>{post.reposts > 0 ? post.reposts : ''}</span>
        </motion.button>
        
        <motion.button 
          className={`${styles.actionButton} ${styles.like} ${post.is_liked ? styles.liked : ''}`}
          onClick={handleLike}
          disabled={isLiking}
          whileTap={{ scale: 0.95 }}
        >
          <HeartIcon filled={post.is_liked} />
          <span>{post.likes > 0 ? post.likes : ''}</span>
        </motion.button>
        
        <motion.button 
          className={`${styles.actionButton} ${styles.bookmark} ${post.is_bookmarked ? styles.bookmarked : ''}`}
          onClick={handleBookmark}
          disabled={isBookmarking}
          whileTap={{ scale: 0.95 }}
        >
          <BookmarkIcon filled={post.is_bookmarked} />
        </motion.button>
        
        <motion.button 
          className={`${styles.actionButton} ${styles.share}`}
          whileTap={{ scale: 0.95 }}
        >
          <ShareIcon />
        </motion.button>
      </div>
      
      {/* Help Request CTA */}
      {isHelpRequest && (
        <motion.button 
          className={`${styles.helpCTA} ${hasMission ? styles.projectCTA : ''}`}
          onClick={hasMission ? handleStartProject : handleReply}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {hasMission ? (
            <>
              <RocketIcon />
              <span>Start This Project</span>
              {post.difficulty_hint && (
                <DifficultyStars difficulty={post.difficulty_hint} />
              )}
            </>
          ) : (
            <>🚀 Offer to Help</>
          )}
        </motion.button>
      )}
    </article>
  );
};

// Mission Card Component
interface MissionCardProps {
  mission?: MissionSummary;
  difficulty?: DifficultyHint;
  urgency?: Urgency;
  budget?: string;
  techTags: string[];
}

const MissionCard = ({ mission, difficulty, urgency, budget, techTags }: MissionCardProps) => {
  return (
    <div className={styles.missionCardContent}>
      <div className={styles.missionHeader}>
        <h4>{mission?.title || 'System Design Challenge'}</h4>
        {mission?.tagline && <p className={styles.tagline}>{mission.tagline}</p>}
      </div>
      
      <div className={styles.missionStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Difficulty</span>
          <span className={styles.statValue}>
            <DifficultyStars difficulty={difficulty || 'beginner'} showLabel />
          </span>
        </div>
        
        {mission?.estimated_duration_minutes && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Est. Time</span>
            <span className={styles.statValue}>
              <ClockIcon />
              {formatDuration(mission.estimated_duration_minutes)}
            </span>
          </div>
        )}
        
        {budget && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Budget</span>
            <span className={styles.statValue}>{budget}</span>
          </div>
        )}
        
        {mission?.min_level && mission.min_level > 1 && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Req. Level</span>
            <span className={styles.statValue}>Lv. {mission.min_level}+</span>
          </div>
        )}
      </div>
      
      <div className={styles.missionSkills}>
        <span className={styles.skillsLabel}>Skills You'll Practice:</span>
        <div className={styles.skillTags}>
          {techTags.map(tag => (
            <span key={tag} className={styles.skillTag}>{tag}</span>
          ))}
        </div>
      </div>
      
      <div className={styles.missionRewards}>
        <div className={styles.reward}>
          <StarIcon />
          <span>XP & Reputation</span>
        </div>
        <div className={styles.reward}>
          <TrophyIcon />
          <span>Portfolio Project</span>
        </div>
        <div className={styles.reward}>
          <HeartIcon filled />
          <span>Help Real People</span>
        </div>
      </div>
    </div>
  );
};

// Difficulty Stars Component
const DifficultyStars = ({ difficulty, showLabel = false }: { difficulty: DifficultyHint; showLabel?: boolean }) => {
  const levels = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };
  const level = levels[difficulty];
  
  return (
    <span className={styles.difficultyStars}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className={`${styles.star} ${i < level ? styles.filled : ''}`}>
          ★
        </span>
      ))}
      {showLabel && <span className={styles.difficultyLabel}>{difficulty}</span>}
    </span>
  );
};

// Badge Components
const DifficultyBadge = ({ difficulty }: { difficulty: DifficultyHint }) => {
  const config = {
    beginner: { label: 'Beginner', class: styles.beginner },
    intermediate: { label: 'Intermediate', class: styles.intermediate },
    advanced: { label: 'Advanced', class: styles.advanced },
    expert: { label: 'Expert', class: styles.expert },
  };
  
  const { label, class: className } = config[difficulty];
  
  return (
    <span className={`${styles.badge} ${className}`}>
      {label}
    </span>
  );
};

const UrgencyBadge = ({ urgency }: { urgency: Urgency }) => {
  const config = {
    low: { label: '🟢 Low Priority', class: styles.urgencyLow },
    medium: { label: '🟡 Medium', class: styles.urgencyMedium },
    high: { label: '🟠 High Priority', class: styles.urgencyHigh },
    critical: { label: '🔴 Critical', class: styles.urgencyCritical },
  };
  
  const { label, class: className } = config[urgency];
  
  return (
    <span className={`${styles.urgencyBadge} ${className}`}>
      {label}
    </span>
  );
};

// Helper functions
function formatRole(role: string): string {
  const roles: Record<string, string> = {
    startup_founder: 'Startup Founder',
    enterprise_cto: 'Enterprise CTO',
    indie_dev: 'Indie Developer',
    agency_lead: 'Agency Lead',
    nonprofit_director: 'Nonprofit Director',
  };
  return roles[role] || role;
}

function getRoleEmoji(role: string): string {
  const emojis: Record<string, string> = {
    startup_founder: '🚀',
    enterprise_cto: '🏢',
    indie_dev: '💻',
    agency_lead: '📊',
    nonprofit_director: '💚',
  };
  return emojis[role] || '👤';
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Icons
const ProjectIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const ChevronIcon = ({ direction }: { direction: 'up' | 'down' }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    style={{ transform: direction === 'up' ? 'rotate(180deg)' : 'none' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const ReplyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const RepostIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BookmarkIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export default FeedPost;
