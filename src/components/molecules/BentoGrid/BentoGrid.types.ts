import type { ReactNode } from 'react';
import type { IconName } from '../../atoms/Icon/Icon.types';
import type { NewsArticle } from '../../../types/news.types';

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
  // New props for structured layout
  articles?: NewsArticle[];
  onContact?: (article: NewsArticle) => void;
}

export interface BentoCardBaseProps {
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
  // New props for news articles
  article?: NewsArticle;
  onContact?: (article: NewsArticle) => void;
  isHovered?: boolean;
  onHover?: (hovered: boolean) => void;
}

// Legacy interface for backward compatibility
export interface BentoCardProps extends BentoCardBaseProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// New specific card types
export interface BentoCardSmallProps extends BentoCardBaseProps {
  // Small cards only show headline
}

export interface BentoCardMediumProps extends BentoCardBaseProps {
  subheadline?: string;
  // Medium cards show headline + 2 lines of subheadline
}

export interface BentoCardLargeProps extends BentoCardBaseProps {
  subheadline?: string;
  previewText?: string;
  // Large cards show headline + subheadline + preview_text
} 