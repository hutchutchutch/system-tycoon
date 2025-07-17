import React, { useState } from 'react';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';
import type { 
  BentoGridProps, 
  BentoCardProps, 
  BentoCardSmallProps, 
  BentoCardMediumProps, 
  BentoCardLargeProps 
} from './BentoGrid.types';
import type { IconName } from '../../atoms/Icon/Icon.types';
import type { NewsArticle } from '../../../types/news.types';

// Map category slugs to icons
const getCategoryIcon = (categorySlug: string): IconName => {
  const iconMap: Record<string, IconName> = {
    'healthcare': 'heart',
    'environment': 'globe',
    'education': 'users',
    'small-business': 'trending-up',
    'community': 'users',
    'technology': 'cpu',
    'emergency': 'alert-circle'
  };
  return iconMap[categorySlug] || 'alert-circle';
};

// Map urgency to priority
const getUrgencyPriority = (urgency: string): 'urgent' | 'high' | 'normal' => {
  switch (urgency) {
    case 'critical': return 'urgent';
    case 'high': return 'high';
    default: return 'normal';
  }
};

// Common card base component
const BentoCardBase: React.FC<{
  children: React.ReactNode;
  name: string;
  className?: string;
  background?: React.ReactNode;
  icon: IconName;
  href?: string;
  onClick?: () => void;
  priority?: 'urgent' | 'high' | 'normal';
  category?: string;
  time?: string;
  article?: NewsArticle;
  onContact?: (article: NewsArticle) => void;
  isHovered?: boolean;
  onHover?: (hovered: boolean) => void;
  height: string;
}> = ({
  children,
  name,
  className = '',
  background,
  icon,
  href,
  onClick,
  priority = 'normal',
  category,
  time,
  article,
  onContact,
  isHovered = false,
  onHover,
  height
}) => {
  const [isLocalHovered, setIsLocalHovered] = useState(false);
  const actuallyHovered = isHovered || isLocalHovered;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, '_blank');
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (article && onContact) {
      onContact(article);
    }
  };

  const handleMouseEnter = () => {
    setIsLocalHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsLocalHovered(false);
    onHover?.(false);
  };

  const getPriorityColor = () => {
    if (article) {
      switch (article.urgency_level) {
        case 'critical':
          return 'var(--color-accent-error)';
        case 'high':
          return 'var(--color-accent-warning)';
        case 'medium':
          return 'var(--color-accent-primary)';
        default:
          return 'var(--color-accent-success)';
      }
    }

    switch (priority) {
      case 'urgent':
        return 'var(--color-accent-error)';
      case 'high':
        return 'var(--color-accent-warning)';
      default:
        return 'var(--color-accent-primary)';
    }
  };

  const displayIcon = article ? getCategoryIcon(article.category_slug) : icon;
  const displayName = article ? article.headline : name;
  const displayCategory = article ? article.category_slug : category;
  const displayTime = article ? new Date(article.published_at).toLocaleDateString() : time;

  return (
    <div
      key={displayName}
      className={`bento-card ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        background: 'var(--color-surface-secondary)',
        border: actuallyHovered ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border-primary)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer',
        transform: actuallyHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: actuallyHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        height,
        minHeight: height
      }}
    >
      {background}
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: 'var(--space-5)',
              height: 'var(--space-5)',
              background: getPriorityColor(),
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon 
                name={displayIcon} 
                size="sm" 
                color="var(--color-accent-primary-foreground)" 
              />
            </div>
          </div>

          {(displayCategory || displayTime) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
              {displayCategory && (
                <span style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {displayCategory}
                </span>
              )}
              {displayTime && (
                <span style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-secondary)'
                }}>
                  {displayTime}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        {/* Contact button for articles */}
        {actuallyHovered && article && onContact && (
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={handleContactClick}
              style={{
                width: '100%',
                background: getPriorityColor(),
                border: 'none'
              }}
            >
              Contact
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Small Card - Just headline
const BentoCardSmall: React.FC<BentoCardSmallProps> = (props) => {
  const displayName = props.article ? props.article.headline : props.name;

  return (
    <BentoCardBase {...props} height="192px">
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-primary)',
        lineHeight: '1.3',
        margin: 0,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {displayName}
      </h3>
    </BentoCardBase>
  );
};

// Medium Card - Headline + 2 lines of subheadline
const BentoCardMedium: React.FC<BentoCardMediumProps> = (props) => {
  const displayName = props.article ? props.article.headline : props.name;
  const displaySubheadline = props.article ? props.article.preview_text : (props.subheadline || props.description);

  return (
    <BentoCardBase {...props} height="384px">
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-primary)',
        lineHeight: '1.3',
        margin: 0,
        marginBottom: 'var(--space-3)',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {displayName}
      </h3>
      
      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        lineHeight: '1.5',
        margin: 0,
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 8,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {displaySubheadline}
      </p>
    </BentoCardBase>
  );
};

// Large Card - Headline + subheadline + preview_text
const BentoCardLarge: React.FC<BentoCardLargeProps> = (props) => {
  const displayName = props.article ? props.article.headline : props.name;
  const displaySubheadline = props.article ? props.article.preview_text.slice(0, 100) + '...' : (props.subheadline || props.description);
  const displayPreviewText = props.article ? props.article.preview_text : (props.previewText || props.description);

  return (
    <BentoCardBase {...props} height="592px">
      <h3 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-primary)',
        lineHeight: '1.3',
        margin: 0,
        marginBottom: 'var(--space-3)',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {displayName}
      </h3>
      
      <h4 style={{
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--font-weight-medium)',
        color: 'var(--color-text-secondary)',
        lineHeight: '1.4',
        margin: 0,
        marginBottom: 'var(--space-3)',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {displaySubheadline}
      </h4>

      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-tertiary)',
        lineHeight: '1.6',
        margin: 0,
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 12,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {displayPreviewText}
      </p>
    </BentoCardBase>
  );
};

// Legacy BentoCard for backward compatibility
const BentoCard: React.FC<BentoCardProps> = ({ size = 'md', ...props }) => {
  switch (size) {
    case 'sm':
      return <BentoCardSmall {...props} />;
    case 'lg':
    case 'xl':
      return <BentoCardLarge {...props} />;
    default:
      return <BentoCardMedium {...props} />;
  }
};

const BentoGrid: React.FC<BentoGridProps> = ({ 
  children, 
  className = '',
  articles,
  onContact
}) => {
  // If articles are provided, render the structured layout
  if (articles && articles.length >= 5) {
    return (
      <div 
        className={`bento-grid ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-4)',
          alignItems: 'start',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Column 1: Medium + Small cards with 16px gap */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}>
          <BentoCardMedium
            article={articles[0]}
            name={articles[0].headline}
            icon={getCategoryIcon(articles[0].category_slug)}
            description={articles[0].preview_text}
            priority={getUrgencyPriority(articles[0].urgency_level)}
            onContact={onContact}
          />
          <BentoCardSmall
            article={articles[1]}
            name={articles[1].headline}
            icon={getCategoryIcon(articles[1].category_slug)}
            description={articles[1].preview_text}
            priority={getUrgencyPriority(articles[1].urgency_level)}
            onContact={onContact}
          />
        </div>

        {/* Column 2: Large card */}
        <div>
          <BentoCardLarge
            article={articles[2]}
            name={articles[2].headline}
            icon={getCategoryIcon(articles[2].category_slug)}
            description={articles[2].preview_text}
            priority={getUrgencyPriority(articles[2].urgency_level)}
            onContact={onContact}
          />
        </div>

        {/* Column 3: Small + Medium cards with 16px gap */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}>
          <BentoCardSmall
            article={articles[3]}
            name={articles[3].headline}
            icon={getCategoryIcon(articles[3].category_slug)}
            description={articles[3].preview_text}
            priority={getUrgencyPriority(articles[3].urgency_level)}
            onContact={onContact}
          />
          <BentoCardMedium
            article={articles[4]}
            name={articles[4].headline}
            icon={getCategoryIcon(articles[4].category_slug)}
            description={articles[4].preview_text}
            priority={getUrgencyPriority(articles[4].urgency_level)}
            onContact={onContact}
          />
        </div>
      </div>
    );
  }

  // Fallback to original layout with children
  return (
    <div 
      className={`bento-grid ${className}`}
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        alignItems: 'start'
      }}
    >
      {children}
    </div>
  );
};

export { BentoGrid, BentoCard, BentoCardSmall, BentoCardMedium, BentoCardLarge }; 