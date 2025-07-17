import React from 'react';

export interface LogoProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square' | 'rounded';
  className?: string;
  onClick?: () => void;
} 