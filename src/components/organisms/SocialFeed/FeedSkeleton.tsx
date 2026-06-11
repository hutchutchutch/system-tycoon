import styles from './FeedSkeleton.module.css';

interface FeedSkeletonProps {
  count?: number;
}

export const FeedSkeleton = ({ count = 3 }: FeedSkeletonProps) => {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeletonPost}>
          <div className={styles.header}>
            <div className={styles.avatar} />
            <div className={styles.authorInfo}>
              <div className={styles.name} />
              <div className={styles.handle} />
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.line} />
            <div className={styles.line} />
            <div className={styles.lineShort} />
          </div>
          <div className={styles.tags}>
            <div className={styles.tag} />
            <div className={styles.tag} />
            <div className={styles.tag} />
          </div>
          <div className={styles.actions}>
            <div className={styles.action} />
            <div className={styles.action} />
            <div className={styles.action} />
            <div className={styles.action} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedSkeleton;
