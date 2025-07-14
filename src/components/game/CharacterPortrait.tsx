import React from 'react';
import { clsx } from 'clsx';

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
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-[120px] h-[120px]',
    large: 'w-32 h-32',
  };

  const classes = clsx(
    'character-portrait',
    isAvailable && 'character-portrait--available',
    sizeClasses[size],
    onClick && 'cursor-pointer'
  );

  return (
    <div className={classes} onClick={onClick}>
      <div className="character-portrait__glow" />
      <img
        src={avatar}
        alt={name}
        className="character-portrait__image"
      />
      {badge && (
        <div className="character-portrait__badge">
          {badge}
        </div>
      )}
    </div>
  );
};