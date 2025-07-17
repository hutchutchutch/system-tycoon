import React from 'react';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import type { AuthFormProps } from './AuthForm.types';

export const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleSignIn,
  submitLabel = 'Sign in',
  showSocialAuth = true,
  className = '',
}) => {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    gap: 'var(--spacing-md)',
  };

  const inputGroupStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    gap: 'var(--spacing-sm)',
  };

  const dividerStyles = {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 'var(--spacing-sm) 0',
  };

  const errorStyles = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-accent-error)',
    textAlign: 'left' as const,
  };

  const googleButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-sm)',
    width: '100%',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--radius-full)',
    background: 'linear-gradient(to bottom, #232526, #2d2e30)',
    color: 'var(--color-text-primary)',
    border: 'none',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-weight-medium)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    outline: 'none',
  };

  const googleIconStyles = {
    width: '20px',
    height: '20px',
  };

  return (
    <div style={containerStyles} className={className}>
      <div style={inputGroupStyles}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
          fullWidth
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          fullWidth
        />
        {error && (
          <div style={errorStyles}>{error}</div>
        )}
      </div>
      
      <div style={dividerStyles} />
      
      <div>
        <Button
          onClick={onSubmit}
          variant="ghost"
          style={{
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text-primary)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--spacing-sm)',
          }}
        >
          {submitLabel}
        </Button>
        
        {showSocialAuth && onGoogleSignIn && (
          <button
            onClick={onGoogleSignIn}
            style={googleButtonStyles}
            onMouseOver={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              style={googleIconStyles}
            />
            Continue with Google
          </button>
        )}
      </div>
    </div>
  );
}; 