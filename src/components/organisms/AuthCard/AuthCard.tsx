import React from 'react';
import { Logo } from '../../atoms/Logo';
import { AuthForm } from '../../molecules/AuthForm';
import type { AuthCardProps } from './AuthCard.types';

export const AuthCard: React.FC<AuthCardProps> = ({
  title = 'HextaUI',
  logoSrc,
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleSignIn,
  submitLabel = 'Sign in',
  className = '',
}) => {
  const cardStyles = {
    position: 'relative' as const,
    zIndex: 10,
    width: '100%',
    maxWidth: '384px',
    borderRadius: 'var(--radius-xl)',
    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.1), #121212)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: 'var(--spacing-2xl)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  };

  const titleStyles = {
    fontSize: 'var(--text-2xl)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--spacing-xl)',
    textAlign: 'center' as const,
    marginTop: 'var(--spacing-xl)',
  };

  return (
    <div style={cardStyles} className={className}>
      <Logo 
        src={logoSrc}
        size="md" 
      />
      
      <h2 style={titleStyles}>
        {title}
      </h2>
      
      <AuthForm
        email={email}
        password={password}
        error={error}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onSubmit={onSubmit}
        onGoogleSignIn={onGoogleSignIn}
        submitLabel={submitLabel}
      />
    </div>
  );
}; 