import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import type { 
  BentoGridProps, 
  BentoCardProps, 
  BentoCardSmallProps, 
  BentoCardMediumProps, 
  BentoCardLargeProps 
} from './BentoGrid.types';
import type { NewsArticle } from '../../../types/news.types';

// BorderTrail component for animated border effect
type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

const BorderTrail: React.FC<BorderTrailProps> = ({
  className = '',
  size = 60,
  transition,
  delay,
  onAnimationComplete,
  style,
}) => {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: 5,
    ease: 'linear' as const,
  };

  return (
    <div className='pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]'>
      <motion.div
        className={`absolute aspect-square ${className}`}
        style={{
          width: size,
          height: size,
          background: 'var(--color-accent-primary)',
          borderRadius: '50%',
          boxShadow: '0 0 8px var(--color-accent-primary)',
          offsetPath: `rect(0 auto auto 0 round var(--radius-lg))`,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          ...(transition ?? BASE_TRANSITION),
          delay: delay,
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
};



// Common card base component
const BentoCardBase: React.FC<{
  children: React.ReactNode;
  name: string;
  className?: string;
  background?: React.ReactNode;
  href?: string;
  onClick?: () => void;
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
  href,
  onClick,
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


  const displayName = article ? article.headline : name;
  const displayCategory = article ? article.category_slug : category;
  const displayTime = article ? new Date(article.published_at).toLocaleDateString() : time;

  return (
    <div
      key={displayName}
      className={`bento-card ${className}`}
      data-bento-card="true"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        background: 'var(--color-surface-secondary)',
        border: '1px solid var(--color-border-primary)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer',
        transform: actuallyHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: actuallyHovered ? '0 0 20px rgba(59, 130, 246, 0.3), var(--shadow-lg)' : 'var(--shadow-sm)',
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
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-3)'
        }}>
          {(displayCategory || displayTime) && (
            <>
              {displayCategory && (
                <span style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  {displayCategory}
                </span>
              )}
              {displayTime && (
                <span style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-secondary)',
                  marginLeft: 'auto'
                }}>
                  {displayTime}
                </span>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

                {/* Contact button for articles */}
        {actuallyHovered && article && onContact && (
          <div style={{ marginTop: 'var(--space-3)' }}>
            <button
              onClick={handleContactClick}
              style={{
                position: 'relative',
                padding: '16px 32px',
                background: 'linear-gradient(to right, #3B82F6, #A855F7)',
                color: 'white',
                fontWeight: '600',
                fontSize: '1.125rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s',
                overflow: 'hidden',
                pointerEvents: 'auto',
                zIndex: 10,
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
            >
              <span style={{ position: 'relative', zIndex: 10 }}>Contact</span>
            </button>
          </div>
        )}
      </div>

      {/* Animated border trail on hover */}
      {actuallyHovered && (
        <BorderTrail
          size={3}
          style={{
            background: 'var(--color-accent-primary)',
            borderRadius: '50%',
            boxShadow: '0 0 6px var(--color-accent-primary)',
          }}
        />
      )}
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
            description={articles[0].preview_text}
            onContact={onContact}
          />
          <BentoCardSmall
            article={articles[1]}
            name={articles[1].headline}
            description={articles[1].preview_text}
            onContact={onContact}
          />
        </div>

        {/* Column 2: Large card */}
        <div>
          <BentoCardLarge
            article={articles[2]}
            name={articles[2].headline}
            description={articles[2].preview_text}
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
            description={articles[3].preview_text}
            onContact={onContact}
          />
          <BentoCardMedium
            article={articles[4]}
            name={articles[4].headline}
            description={articles[4].preview_text}
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