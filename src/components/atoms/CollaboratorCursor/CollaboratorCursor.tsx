import React from 'react';
import { motion } from 'framer-motion';
import type { CollaboratorCursorProps } from './CollaboratorCursor.types';
import styles from './CollaboratorCursor.module.css';

export const CollaboratorCursor: React.FC<CollaboratorCursorProps> = ({
  x,
  y,
  color,
  name,
  avatar,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className={styles.collaboratorCursor}
      initial={{ x: x - 12, y: y - 12, opacity: 0 }}
      animate={{ 
        x: x - 12, 
        y: y - 12, 
        opacity: 1,
        transition: { 
          type: 'spring',
          stiffness: 500,
          damping: 30
        }
      }}
      exit={{ opacity: 0 }}
    >
      {/* Cursor SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={styles.cursorSvg}
      >
        <path
          d="M5.65 1.74L13.73 21.94C13.93 22.54 14.83 22.54 15.03 21.94L17.05 15.74L21.29 13.05C21.89 12.65 21.69 11.75 20.99 11.55L1.09 3.49C0.49 3.29 0.29 2.39 0.89 1.99L5.65 1.74Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      
      {/* User name badge */}
      <div 
        className={styles.nameBadge}
        style={{ backgroundColor: color }}
      >
        {avatar && (
          <img 
            src={avatar} 
            alt={name}
            className={styles.avatar}
          />
        )}
        <span className={styles.name}>{name}</span>
      </div>
    </motion.div>
  );
}; 