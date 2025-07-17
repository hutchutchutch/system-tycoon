import React from 'react';
import { Avatar } from '../../atoms/Avatar';
import type { AvatarGroupProps } from './AvatarGroup.types';

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  maxVisible = 4,
  className = '',
}) => {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = avatars.length - maxVisible;

  const containerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
  };

  const avatarWrapperStyles = {
    position: 'relative' as const,
    marginLeft: '-4px',
  };

  const firstAvatarStyles = {
    position: 'relative' as const,
    marginLeft: '0',
  };

  return (
    <div style={containerStyles} className={className}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          style={index === 0 ? firstAvatarStyles : avatarWrapperStyles}
        >
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            name={avatar.name}
            size={size}
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div style={avatarWrapperStyles}>
          <Avatar
            name={`+${remainingCount}`}
            size={size}
          />
        </div>
      )}
    </div>
  );
}; 