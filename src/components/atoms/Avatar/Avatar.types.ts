import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export interface AvatarGroupProps {
  avatars: Array<{
    src: string;
    alt: string;
    name?: string;
  }>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  maxVisible?: number;
  className?: string;
} 