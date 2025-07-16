import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signInWithEmail, signInWithOAuth, clearError, demoSignIn } from '../../features/auth/authSlice';
import { OAUTH_PROVIDERS } from '../../constants';
import styles from './SignInPage.module.css';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(signInWithEmail(formData));
    if (signInWithEmail.fulfilled.match(result)) {
      navigate('/game');
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github' | 'linkedin') => {
    dispatch(signInWithOAuth(provider));
  };

  const handleDemoSignIn = async () => {
    const result = await dispatch(demoSignIn('1c8d0b3a-0fae-4916-9c8a-987473c0a24e'));
    if (demoSignIn.fulfilled.match(result)) {
      navigate('/game');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  return (
    <div className={clsx(styles.page, 'bg-dots')}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue your journey</p>
        </div>

        {/* OAuth Providers */}
        <div className={styles.oauthProviders}>
          {Object.entries(OAUTH_PROVIDERS).map(([key, provider]) => (
            <button
              key={key}
              onClick={() => handleOAuthSignIn(key.toLowerCase() as any)}
              disabled={isLoading}
              className={clsx(styles.oauthButton, {
                [styles.oauthButtonDisabled]: isLoading
              })}
            >
              <span className={styles.oauthIcon}>{getProviderIcon(provider.name)}</span>
              <span>Continue with {provider.name}</span>
            </button>
          ))}
        </div>

        {/* Demo Button */}
        <div className={styles.demoSection}>
          <button
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className={clsx(styles.demoButton, {
              [styles.demoButtonDisabled]: isLoading
            })}
          >
            <span className={styles.oauthIcon}>🎮</span>
            <span>Demo Mode</span>
          </button>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerText}>Or continue with email</span>
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.formInput}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={styles.formInput}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.formActions}>
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="remember" className={styles.checkbox} />
              <label htmlFor="remember" className={styles.checkboxLabel}>Remember me</label>
            </div>
            <a href="#" className={styles.link}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={clsx(styles.submitButton, {
              [styles.submitButtonLoading]: isLoading
            })}
          >
            {isLoading ? (
              <span className={styles.loading}>Signing in...</span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

function getProviderIcon(provider: string): string {
  switch (provider) {
    case 'Google':
      return '🔍';
    case 'GitHub':
      return '🐙';
    case 'LinkedIn':
      return '💼';
    default:
      return '🔗';
  }
}