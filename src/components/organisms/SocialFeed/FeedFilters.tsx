import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { 
  setFilters, 
  resetFilters, 
  selectFilters 
} from '../../../features/social/socialSlice';
import type { PostType, DifficultyHint, Urgency } from '../../../types/social';
import styles from './FeedFilters.module.css';

export const FeedFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasActiveFilters = 
    filters.postTypes.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.urgencies.length > 0 ||
    filters.techTags.length > 0 ||
    filters.showLikedOnly ||
    filters.showBookmarkedOnly;
  
  const togglePostType = (type: PostType) => {
    const current = filters.postTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    dispatch(setFilters({ postTypes: updated }));
  };
  
  const toggleDifficulty = (difficulty: DifficultyHint) => {
    const current = filters.difficulties;
    const updated = current.includes(difficulty)
      ? current.filter(d => d !== difficulty)
      : [...current, difficulty];
    dispatch(setFilters({ difficulties: updated }));
  };
  
  const toggleUrgency = (urgency: Urgency) => {
    const current = filters.urgencies;
    const updated = current.includes(urgency)
      ? current.filter(u => u !== urgency)
      : [...current, urgency];
    dispatch(setFilters({ urgencies: updated }));
  };
  
  const handleReset = () => {
    dispatch(resetFilters());
  };
  
  return (
    <div className={styles.filtersContainer}>
      {/* Quick Filters Bar */}
      <div className={styles.quickFilters}>
        <button
          className={`${styles.quickFilter} ${filters.postTypes.includes('help_request') ? styles.active : ''}`}
          onClick={() => togglePostType('help_request')}
        >
          🆘 Help Requests
        </button>
        <button
          className={`${styles.quickFilter} ${filters.postTypes.includes('tip') ? styles.active : ''}`}
          onClick={() => togglePostType('tip')}
        >
          💡 Tips
        </button>
        <button
          className={`${styles.quickFilter} ${filters.showBookmarkedOnly ? styles.active : ''}`}
          onClick={() => dispatch(setFilters({ showBookmarkedOnly: !filters.showBookmarkedOnly }))}
        >
          🔖 Saved
        </button>
        
        <button
          className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FilterIcon />
          {hasActiveFilters && <span className={styles.filterBadge} />}
        </button>
      </div>
      
      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.expandedFilters}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Post Types */}
            <div className={styles.filterSection}>
              <h4>Post Type</h4>
              <div className={styles.filterOptions}>
                {(['help_request', 'announcement', 'success_story', 'tip', 'industry_news'] as PostType[]).map(type => (
                  <button
                    key={type}
                    className={`${styles.filterOption} ${filters.postTypes.includes(type) ? styles.active : ''}`}
                    onClick={() => togglePostType(type)}
                  >
                    {getPostTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Difficulty */}
            <div className={styles.filterSection}>
              <h4>Difficulty</h4>
              <div className={styles.filterOptions}>
                {(['beginner', 'intermediate', 'advanced', 'expert'] as DifficultyHint[]).map(diff => (
                  <button
                    key={diff}
                    className={`${styles.filterOption} ${styles[diff]} ${filters.difficulties.includes(diff) ? styles.active : ''}`}
                    onClick={() => toggleDifficulty(diff)}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Urgency */}
            <div className={styles.filterSection}>
              <h4>Urgency</h4>
              <div className={styles.filterOptions}>
                {(['low', 'medium', 'high', 'critical'] as Urgency[]).map(urg => (
                  <button
                    key={urg}
                    className={`${styles.filterOption} ${styles[`urgency-${urg}`]} ${filters.urgencies.includes(urg) ? styles.active : ''}`}
                    onClick={() => toggleUrgency(urg)}
                  >
                    {getUrgencyLabel(urg)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Reset */}
            {hasActiveFilters && (
              <button className={styles.resetButton} onClick={handleReset}>
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getPostTypeLabel(type: PostType): string {
  const labels: Record<PostType, string> = {
    help_request: '🆘 Help Request',
    announcement: '📢 Announcement',
    success_story: '🎉 Success Story',
    tip: '💡 Tip',
    industry_news: '📰 News',
  };
  return labels[type];
}

function getUrgencyLabel(urgency: Urgency): string {
  const labels: Record<Urgency, string> = {
    low: '🟢 Low',
    medium: '🟡 Medium',
    high: '🟠 High',
    critical: '🔴 Critical',
  };
  return labels[urgency];
}

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export default FeedFilters;
