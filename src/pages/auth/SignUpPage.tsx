import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signUpWithEmail, signInWithOAuth, clearError } from '../../features/auth/authSlice';
import { OAUTH_PROVIDERS } from '../../constants';
import styles from './SignUpPage.module.css';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await dispatch(signUpWithEmail({
      email: formData.email,
      password: formData.password,
      username: formData.username,
    }));

    if (signUpWithEmail.fulfilled.match(result)) {
      navigate('/game');
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github' | 'linkedin') => {
    dispatch(signInWithOAuth(provider));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  return (
    <div className={clsx(styles.page, 'bg-dots')}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Your Account</h1>
          <p className={styles.subtitle}>Start your system design journey today</p>
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

        <div className={styles.divider}>
          <span className={styles.dividerText}>Or sign up with email</span>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className={clsx(styles.formInput, {
                [styles.formInputError]: validationErrors.username
              })}
              placeholder="johndoe"
            />
            {validationErrors.username && (
              <div className={styles.fieldError}>{validationErrors.username}</div>
            )}
          </div>

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
              className={clsx(styles.formInput, {
                [styles.formInputError]: validationErrors.email
              })}
              placeholder="you@example.com"
            />
            {validationErrors.email && (
              <div className={styles.fieldError}>{validationErrors.email}</div>
            )}
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
              className={clsx(styles.formInput, {
                [styles.formInputError]: validationErrors.password
              })}
              placeholder="••••••••"
            />
            {validationErrors.password && (
              <div className={styles.fieldError}>{validationErrors.password}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={clsx(styles.formInput, {
                [styles.formInputError]: validationErrors.confirmPassword
              })}
              placeholder="••••••••"
            />
            {validationErrors.confirmPassword && (
              <div className={styles.fieldError}>{validationErrors.confirmPassword}</div>
            )}
          </div>

          <div className={styles.termsGroup}>
            <input
              type="checkbox"
              id="terms"
              required
              className={styles.checkbox}
            />
            <label htmlFor="terms" className={styles.termsLabel}>
              I agree to the{' '}
              <a href="/terms" className={styles.link}>Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" className={styles.link}>Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={clsx(styles.submitButton, {
              [styles.submitButtonLoading]: isLoading
            })}
          >
            {isLoading ? (
              <span className={styles.loading}>Creating account...</span>
            ) : (
              'Create Account'
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