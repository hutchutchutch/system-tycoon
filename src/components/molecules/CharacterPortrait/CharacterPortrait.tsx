import React from 'react';
import { clsx } from 'clsx';
import styles from './CharacterPortrait.module.css';

export interface CharacterPortraitProps {
  name: string;
  avatar: string;
  isAvailable?: boolean;
  badge?: string | number;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  name,
  avatar,
  isAvailable = false,
  badge,
  size = 'medium',
  onClick,
}) => {
  return (
    <div 
      className={clsx(
        styles.characterPortrait,
        styles[`characterPortrait--${size}`],
        {
          [styles['characterPortrait--available']]: isAvailable,
          [styles['characterPortrait--clickable']]: onClick
        }
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`${name} portrait${isAvailable ? ' (available)' : ''}`}
    >
      <div className={styles.glow} />
      <img
        src={avatar}
        alt={name}
        className={styles.image}
      />
      {badge && (
        <div className={styles.badge}>
          {badge}
        </div>
      )}
    </div>
  );
};