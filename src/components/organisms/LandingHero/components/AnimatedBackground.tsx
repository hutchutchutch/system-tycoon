import React from 'react';
import { clsx } from 'clsx';
import styles from './AnimatedBackground.module.css';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className={styles.background}>
      {/* Grid pattern overlay */}
      <div className={styles.gridOverlay} />
      
      {/* Floating tech icons */}
      <div className={clsx(styles.floatingIcon, styles.icon1)}>💻</div>
      <div className={clsx(styles.floatingIcon, styles.floatingIconDelayed, styles.icon2)}>🌐</div>
      <div className={clsx(styles.floatingIcon, styles.icon3)}>⚡</div>
      <div className={clsx(styles.floatingIcon, styles.floatingIconDelayed, styles.icon4)}>🚀</div>
    </div>
  );
};