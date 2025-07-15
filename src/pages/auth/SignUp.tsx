import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { demoSignIn } from '../../features/auth/authSlice';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import './SignUp.css';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // For demo purposes, use the demo sign in
    if (name && email && password) {
      try {
        await dispatch(demoSignIn('demo-user-id')).unwrap();
        navigate('/game');
      } catch (err) {
        setError('Failed to create account. Please try again.');
        setLoading(false);
      }
    } else {
      setError('Please fill in all fields');
      setLoading(false);
    }
  };

  return (
    <div className="signup">
      <div className="signup__header">
        <h2>Create Your Account</h2>
        <p>Start your journey from laid-off developer to successful consultant</p>
      </div>

      <form className="signup__form" onSubmit={handleSubmit}>
        {error && (
          <div className="signup__error">
            {error}
          </div>
        )}

        <div className="signup__field">
          <label htmlFor="name">Full Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={loading}
          />
        </div>

        <div className="signup__field">
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

        <div className="signup__field">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
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
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <div className="signup__footer">
          <p>Already have an account? <a href="/auth/signin">Sign in</a></p>
        </div>
      </form>

      <div className="signup__demo">
        <p>🎮 Demo Mode: Fill any values to create an account</p>
      </div>
    </div>
  );
};