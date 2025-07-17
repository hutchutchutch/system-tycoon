import React from 'react';
import { AvatarGroup } from '../../molecules/AvatarGroup';
import type { AuthPromoBannerProps } from './AuthPromoBanner.types';

export const AuthPromoBanner: React.FC<AuthPromoBannerProps> = ({
  message = 'Join',
  highlightText = 'thousands',
  linkText = 'Sign up, it\'s free!',
  linkHref = '#',
  onLinkClick,
  userAvatars = [
    { src: 'https://randomuser.me/api/portraits/men/32.jpg', alt: 'user', name: 'John' },
    { src: 'https://randomuser.me/api/portraits/women/44.jpg', alt: 'user', name: 'Sarah' },
    { src: 'https://randomuser.me/api/portraits/men/54.jpg', alt: 'user', name: 'Mike' },
    { src: 'https://randomuser.me/api/portraits/women/68.jpg', alt: 'user', name: 'Anna' },
  ],
  className = '',
}) => {
  const containerStyles = {
    position: 'relative' as const,
    zIndex: 10,
    marginTop: 'var(--spacing-3xl)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
  };

  const textStyles = {
    color: 'var(--color-text-tertiary)',
    fontSize: 'var(--text-sm)',
    marginBottom: 'var(--spacing-sm)',
  };

  const highlightStyles = {
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-primary)',
  };

  const linkStyles = {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'underline',
    transition: 'color var(--transition-fast)',
    cursor: 'pointer',
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick();
    }
  };

  return (
    <div style={containerStyles} className={className}>
      <p style={textStyles}>
        {message} <span style={highlightStyles}>{highlightText}</span> of
        developers who are already using HextaUI.
      </p>
      <AvatarGroup 
        avatars={userAvatars}
        size="sm"
        maxVisible={4}
      />
      <div style={{ marginTop: 'var(--spacing-sm)' }}>
        <span style={{ ...textStyles, fontSize: 'var(--text-xs)' }}>
          Don't have an account?{' '}
          <a
            href={linkHref}
            onClick={handleLinkClick}
            style={linkStyles}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            {linkText}
          </a>
        </span>
      </div>
    </div>
  );
}; 