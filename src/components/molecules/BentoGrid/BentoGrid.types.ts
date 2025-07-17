import type { ReactNode } from 'react';
import type { IconName } from '../../atoms/Icon/Icon.types';

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  icon: IconName;
  description: string;
  href?: string;
  cta?: string;
  onClick?: () => void;
  priority?: 'urgent' | 'high' | 'normal';
  category?: string;
  time?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
} 