import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { demoSignIn } from '../../features/auth/authSlice';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import './SignIn.css';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // For demo purposes, use the demo sign in
    if (email && password) {
      try {
        await dispatch(demoSignIn('demo-user-id')).unwrap();
        navigate('/game');
      } catch (err) {
        setError('Failed to sign in. Please try again.');
        setLoading(false);
      }
    } else {
      setError('Please enter both email and password');
      setLoading(false);
    }
  };

  return (
    <div className="signin">
      <div className="signin__header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue your journey from developer to consultant</p>
      </div>

      <form className="signin__form" onSubmit={handleSubmit}>
        {error && (
          <div className="signin__error">
            {error}
          </div>
        )}

        <div className="signin__field">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={loading}
          />
        </div>

        <div className="signin__field">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="signin__footer">
          <p>New to System Tycoon? <a href="/auth/signup">Create an account</a></p>
        </div>
      </form>

      <div className="signin__demo">
        <p>🎮 Demo Mode: Use any email and password to sign in</p>
      </div>
    </div>
  );
};