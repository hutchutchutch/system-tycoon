import React from 'react';

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