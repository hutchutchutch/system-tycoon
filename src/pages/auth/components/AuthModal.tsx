import React, { useState } from 'react';

interface AuthModalProps {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, username: string) => void;
  onOAuthSignIn: (provider: 'google' | 'github' | 'linkedin') => void;
  onDemoSignIn: () => void;
  onClearError: () => void;
  isLoading: boolean;
  error: string | null;
  authSubmitted: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onSignIn,
  onSignUp,
  onOAuthSignIn,
  onDemoSignIn,
  onClearError,
  isLoading,
  error,
  authSubmitted,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signin') {
      onSignIn(formData.email, formData.password);
    } else {
      onSignUp(formData.email, formData.password, formData.username);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) onClearError();
  };

  if (authSubmitted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</h1>
      
      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>
        {authMode === 'signup' && (
          <div>
            <label>Username</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
        )}
        
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : authMode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <button onClick={() => onOAuthSignIn('google')} disabled={isLoading}>
        Google
      </button>

      <button onClick={onDemoSignIn} disabled={isLoading}>
        Demo
      </button>

      <button onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}>
        {authMode === 'signin' ? 'Create Account' : 'Sign In'}
      </button>
    </div>
  );
}; 