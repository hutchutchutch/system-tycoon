import React from 'react';
import { AuthCard } from '../../organisms/AuthCard';
import { AuthPromoBanner } from '../../organisms/AuthPromoBanner';
import type { AuthPageTemplateProps } from './AuthPageTemplate.types';

export const AuthPageTemplate: React.FC<AuthPageTemplateProps> = ({
  title = 'HextaUI',
  logoSrc,
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleSignIn,
  onSignUpClick,
  submitLabel = 'Sign in',
  showPromoBanner = true,
  userAvatars,
  className = '',
}) => {
  const containerStyles = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    position: 'relative' as const,
    overflow: 'hidden',
    width: '100%',
    borderRadius: 'var(--radius-xl)',
  };

  return (
    <div style={containerStyles} className={className}>
      <AuthCard
        title={title}
        logoSrc={logoSrc}
        email={email}
        password={password}
        error={error}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onSubmit={onSubmit}
        onGoogleSignIn={onGoogleSignIn}
        submitLabel={submitLabel}
      />
      
      {showPromoBanner && (
        <AuthPromoBanner
          onLinkClick={onSignUpClick}
          userAvatars={userAvatars}
        />
      )}
    </div>
  );
}; 