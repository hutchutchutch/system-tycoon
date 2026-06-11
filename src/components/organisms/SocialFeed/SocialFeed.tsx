import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchFeed,
  addPost,
  updatePost,
  selectFeed,
  selectFeedLoading,
  selectFeedError,
  selectFeedHasMore,
  selectFilters,
  setConnected,
} from '../../../features/social/socialSlice';
import { socialFeedService } from '../../../services/socialFeedService';
import { FeedPost } from './FeedPost';
import { FeedFilters } from './FeedFilters';
import { FeedSkeleton } from './FeedSkeleton';
import styles from './SocialFeed.module.css';

export const SocialFeed = () => {
  const dispatch = useAppDispatch();
  const feed = useAppSelector(selectFeed);
  const loading = useAppSelector(selectFeedLoading);
  const error = useAppSelector(selectFeedError);
  const hasMore = useAppSelector(selectFeedHasMore);
  const filters = useAppSelector(selectFilters);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Initial fetch
  useEffect(() => {
    dispatch(fetchFeed({ refresh: true }));
  }, [dispatch, filters]);
  
  // Realtime subscription
  useEffect(() => {
    const channel = socialFeedService.subscribeFeed(
      (newPost) => {
        dispatch(addPost(newPost));
      },
      (updatedPost) => {
        dispatch(updatePost(updatedPost));
      }
    );
    
    dispatch(setConnected(true));
    
    return () => {
      socialFeedService.unsubscribe(channel);
      dispatch(setConnected(false));
    };
  }, [dispatch]);
  
  // Infinite scroll
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchFeed({ refresh: false }));
    }
  }, [dispatch, loading, hasMore]);
  
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);
  
  const handleRefresh = () => {
    dispatch(fetchFeed({ refresh: true }));
  };
  
  return (
    <div className={styles.socialFeed}>
      <header className={styles.header}>
        <h1 className={styles.title}>Feed</h1>
        <button 
          className={styles.refreshButton} 
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshIcon spinning={loading} />
        </button>
      </header>
      
      <FeedFilters />
      
      {error && (
        <div className={styles.error}>
          <span>⚠️ {error}</span>
          <button onClick={handleRefresh}>Retry</button>
        </div>
      )}
      
      <div className={styles.feedContent}>
        <AnimatePresence mode="popLayout">
          {feed.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.2, 
                delay: index < 10 ? index * 0.05 : 0 
              }}
            >
              <FeedPost post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && feed.length === 0 && <FeedSkeleton count={5} />}
        
        {/* Load more trigger */}
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {loading && feed.length > 0 && (
            <div className={styles.loadingMore}>
              <span className={styles.spinner} />
              Loading more...
            </div>
          )}
          {!hasMore && feed.length > 0 && (
            <div className={styles.endOfFeed}>
              You've reached the end! Check back later for new opportunities.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Refresh icon component
const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
  <svg 
    className={`${styles.refreshIcon} ${spinning ? styles.spinning : ''}`}
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export default SocialFeed;
