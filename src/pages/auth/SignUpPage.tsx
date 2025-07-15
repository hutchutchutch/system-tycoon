import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signUpWithEmail, signInWithOAuth, clearError } from '../../features/auth/authSlice';
import { OAUTH_PROVIDERS } from '../../constants';

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
    <div className="auth-page">
      <div className="auth-page__header">
        <h1 className="auth-page__title">Create Your Account</h1>
        <p className="auth-page__subtitle">Start your system design journey today</p>
      </div>

      {/* OAuth Providers */}
      <div className="auth-page__oauth-providers">
        {Object.entries(OAUTH_PROVIDERS).map(([key, provider]) => (
          <button
            key={key}
            onClick={() => handleOAuthSignIn(key.toLowerCase() as any)}
            disabled={isLoading}
            className="auth-page__oauth-button"
          >
            <span className="auth-page__oauth-icon">{getProviderIcon(provider.name)}</span>
            <span>Continue with {provider.name}</span>
          </button>
        ))}
      </div>

      <div className="auth-page__divider">
        <span className="auth-page__divider-text">Or sign up with email</span>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="auth-page__form">
        {error && (
          <div className="auth-page__error-message">
            {error}
          </div>
        )}

        <div className="auth-page__form-group">
          <label htmlFor="username" className="auth-page__form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className={`auth-page__form-input ${
              validationErrors.username ? 'auth-page__form-input--error' : ''
            }`}
            placeholder="johndoe"
          />
          {validationErrors.username && (
            <div className="auth-page__form-error-text">{validationErrors.username}</div>
          )}
        </div>

        <div className="auth-page__form-group">
          <label htmlFor="email" className="auth-page__form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={`auth-page__form-input ${
              validationErrors.email ? 'auth-page__form-input--error' : ''
            }`}
            placeholder="you@example.com"
          />
          {validationErrors.email && (
            <div className="auth-page__form-error-text">{validationErrors.email}</div>
          )}
        </div>

        <div className="auth-page__form-group">
          <label htmlFor="password" className="auth-page__form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={`auth-page__form-input ${
              validationErrors.password ? 'auth-page__form-input--error' : ''
            }`}
            placeholder="••••••••"
          />
          {validationErrors.password && (
            <div className="auth-page__form-error-text">{validationErrors.password}</div>
          )}
        </div>

        <div className="auth-page__form-group">
          <label htmlFor="confirmPassword" className="auth-page__form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className={`auth-page__form-input ${
              validationErrors.confirmPassword ? 'auth-page__form-input--error' : ''
            }`}
            placeholder="••••••••"
          />
          {validationErrors.confirmPassword && (
            <div className="auth-page__form-error-text">{validationErrors.confirmPassword}</div>
          )}
        </div>

        <div className="auth-page__terms-group">
          <input
            type="checkbox"
            id="terms"
            required
            className="auth-page__terms-checkbox auth-page__checkbox"
          />
          <label htmlFor="terms" className="auth-page__terms-label">
            I agree to the{' '}
            <a href="/terms">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy">Privacy Policy</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-page__submit-button"
        >
          {isLoading ? (
            <span className="auth-page__loading">Creating account...</span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
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