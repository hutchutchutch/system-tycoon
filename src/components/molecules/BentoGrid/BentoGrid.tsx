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
        background: actuallyHovered 
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)' 
          : 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
        border: actuallyHovered 
          ? '1px solid rgba(59, 130, 246, 0.3)' 
          : '1px solid var(--color-border-primary)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer',
        transform: actuallyHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: actuallyHovered 
          ? '0 0 30px rgba(59, 130, 246, 0.4), 0 10px 40px rgba(0, 0, 0, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.2)',
        height,
        minHeight: height,
        backdropFilter: 'blur(10px)'
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
                  color: actuallyHovered ? 'rgba(147, 197, 253, 0.9)' : 'rgba(148, 163, 184, 0.9)',
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
                  color: actuallyHovered ? 'rgba(147, 197, 253, 0.7)' : 'rgba(148, 163, 184, 0.7)',
                  marginLeft: 'auto'
                }}>
                  {displayTime}
                </span>
              )}
            </>
          )}
        </div>

        {/* Spacer to push content to bottom */}
        <div style={{ flex: 1 }} />

        {/* Content container with slide effect */}
        <div style={{
          position: 'relative',
          transition: 'transform 0.3s ease',
          transform: actuallyHovered && article && onContact ? 'translateY(-60px)' : 'translateY(0)'
        }}>
          {/* Content */}
          <div>
            {children}
          </div>
        </div>

        {/* Contact button - positioned absolutely at bottom */}
        {article && onContact && (
          <div style={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'var(--space-4)',
            opacity: actuallyHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: actuallyHovered ? 'auto' : 'none'
          }}>
            <button
              onClick={handleContactClick}
              style={{
                position: 'relative',
                padding: '12px 24px',
                background: 'linear-gradient(to right, #3B82F6, #A855F7)',
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s',
                overflow: 'hidden',
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <BentoCardBase {...props} height="192px" isHovered={isHovered} onHover={setIsHovered}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        color: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(241, 245, 249, 0.9)',
        lineHeight: '1.3',
        margin: 0,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        transition: 'color 0.3s ease'
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <BentoCardBase {...props} height="384px" isHovered={isHovered} onHover={setIsHovered}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        color: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(241, 245, 249, 0.9)',
        lineHeight: '1.3',
        margin: 0,
        marginBottom: 'var(--space-3)',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        transition: 'color 0.3s ease'
      }}>
        {displayName}
      </h3>
      
      <p style={{
        fontSize: 'var(--text-sm)',
        color: isHovered ? 'rgba(226, 232, 240, 0.9)' : 'rgba(203, 213, 225, 0.9)',
        lineHeight: '1.5',
        margin: 0,
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 8,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        transition: 'color 0.3s ease'
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <BentoCardBase {...props} height="592px" isHovered={isHovered} onHover={setIsHovered}>
      <h3 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--font-weight-semibold)',
        color: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(241, 245, 249, 0.9)',
        lineHeight: '1.3',
        margin: 0,
        marginBottom: 'var(--space-3)',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        transition: 'color 0.3s ease'
      }}>
        {displayName}
      </h3>
      
      <h4 style={{
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--font-weight-medium)',
        color: isHovered ? 'rgba(226, 232, 240, 0.9)' : 'rgba(203, 213, 225, 0.9)',
        lineHeight: '1.4',
        margin: 0,
        marginBottom: 'var(--space-3)',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        transition: 'color 0.3s ease'
      }}>
        {displaySubheadline}
      </h4>

      <p style={{
        fontSize: 'var(--text-sm)',
        color: isHovered ? 'rgba(203, 213, 225, 0.8)' : 'rgba(148, 163, 184, 0.8)',
        lineHeight: '1.6',
        margin: 0,
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 12,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        transition: 'color 0.3s ease'
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