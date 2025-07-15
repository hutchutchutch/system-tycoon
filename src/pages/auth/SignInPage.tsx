import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signInWithEmail, signInWithOAuth, clearError, demoSignIn } from '../../features/auth/authSlice';
import { OAUTH_PROVIDERS } from '../../constants';

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
    <div className="auth-page">
      <div className="auth-page__header">
        <h1 className="auth-page__title">Welcome Back</h1>
        <p className="auth-page__subtitle">Sign in to continue your journey</p>
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

      {/* Demo Button */}
      <div className="auth-page__demo-section">
        <button
          onClick={handleDemoSignIn}
          disabled={isLoading}
          className="auth-page__demo-button"
        >
          <span className="auth-page__oauth-icon">🎮</span>
          <span>Demo Mode</span>
        </button>
      </div>

      <div className="auth-page__divider">
        <span className="auth-page__divider-text">Or continue with email</span>
      </div>

      {/* Email Sign In Form */}
      <form onSubmit={handleSubmit} className="auth-page__form">
        {error && (
          <div className="auth-page__error-message">
            {error}
          </div>
        )}

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
            className="auth-page__form-input"
            placeholder="you@example.com"
          />
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
            className="auth-page__form-input"
            placeholder="••••••••"
          />
        </div>

        <div className="auth-page__form-actions">
          <div className="auth-page__checkbox-group">
            <input type="checkbox" id="remember" className="auth-page__checkbox" />
            <label htmlFor="remember" className="auth-page__checkbox-label">Remember me</label>
          </div>
          <a href="#" className="auth-page__link">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-page__submit-button"
        >
          {isLoading ? (
            <span className="auth-page__loading">Signing in...</span>
          ) : (
            'Sign In'
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