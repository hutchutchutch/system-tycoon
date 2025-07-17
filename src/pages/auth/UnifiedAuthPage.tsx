import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithOAuth, 
  clearError,
  demoSignIn 
} from '../../features/auth/authSlice';
import { Gamepad2, Chrome, Github, Linkedin } from 'lucide-react';
import styles from './UnifiedAuthPage.module.css';

type AuthMode = 'signin' | 'signup';

export const UnifiedAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (authMode === 'signup') {
      if (!formData.username || formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (authMode === 'signin') {
      const result = await dispatch(signInWithEmail({
        email: formData.email,
        password: formData.password,
      }));
      if (signInWithEmail.fulfilled.match(result)) {
        navigate('/game');
      }
    } else {
      const result = await dispatch(signUpWithEmail({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      }));
      if (signUpWithEmail.fulfilled.match(result)) {
        navigate('/game');
      }
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
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return <Chrome className="w-5 h-5" />;
      case 'github': return <Github className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden w-full">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className={`absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 ${styles['animate-blob']}`}></div>
      <div className={`absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 ${styles['animate-blob']} ${styles['animation-delay-2000']}`}></div>
      <div className={`absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 ${styles['animate-blob']} ${styles['animation-delay-4000']}`}></div>
      
      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center border border-white/10">
        {/* Logo */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg">
          <span className="text-white font-bold text-xl">ST</span>
        </div>
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          System Tycoon
        </h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          {authMode === 'signin' ? 'Welcome back, architect!' : 'Start your system design journey'}
        </p>

        {/* Auth Mode Toggle */}
        <div className="flex w-full mb-6 bg-white/5 rounded-full p-1">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
              authMode === 'signin' 
                ? 'bg-white/20 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
              authMode === 'signup' 
                ? 'bg-white/20 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="w-full mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col w-full gap-4">
          {authMode === 'signup' && (
            <div>
              <input
                name="username"
                placeholder="Username"
                type="text"
                value={formData.username}
                className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/10"
                onChange={handleInputChange}
              />
              {validationErrors.username && (
                <div className="text-xs text-red-400 mt-1">{validationErrors.username}</div>
              )}
            </div>
          )}
          
          <div>
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={formData.email}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/10"
              onChange={handleInputChange}
            />
            {validationErrors.email && (
              <div className="text-xs text-red-400 mt-1">{validationErrors.email}</div>
            )}
          </div>
          
          <div>
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={formData.password}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/10"
              onChange={handleInputChange}
            />
            {validationErrors.password && (
              <div className="text-xs text-red-400 mt-1">{validationErrors.password}</div>
            )}
          </div>

          {authMode === 'signup' && (
            <div>
              <input
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/10"
                onChange={handleInputChange}
              />
              {validationErrors.confirmPassword && (
                <div className="text-xs text-red-400 mt-1">{validationErrors.confirmPassword}</div>
              )}
            </div>
          )}

          <div className="border-t border-white/10 my-2"></div>

          {/* Action Buttons */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-5 py-3 rounded-full shadow hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Loading...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
          </button>

          {/* Demo Mode Button */}
          <button
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-5 py-3 font-medium text-green-300 shadow hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Gamepad2 className="w-5 h-5" />
            Demo Mode
          </button>

          {/* OAuth Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 font-medium text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {getProviderIcon('google')}
              Google
            </button>
            <button
              onClick={() => handleOAuthSignIn('github')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 font-medium text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {getProviderIcon('github')}
              GitHub
            </button>
            <button
              onClick={() => handleOAuthSignIn('linkedin')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 font-medium text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {getProviderIcon('linkedin')}
              LinkedIn
            </button>
          </div>

          {authMode === 'signup' && (
            <div className="text-center mt-4">
              <label className="flex items-start gap-2 text-xs text-gray-400">
                <input type="checkbox" className="mt-0.5" required />
                <span>
                  I agree to the <a href="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and{' '}
                  <a href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* User count and avatars */}
      <div className="relative z-10 mt-8 flex flex-col items-center text-center">
        <p className="text-gray-300 text-sm mb-3">
          Join <span className="font-semibold text-white">10,000+</span> system architects
        </p>
        <div className="flex -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
            alt="user"
            className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            alt="user"
            className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
            alt="user"
            className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
            alt="user"
            className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
          />
          <div className="w-10 h-10 rounded-full border-2 border-gray-800 bg-purple-600 flex items-center justify-center text-white text-xs font-semibold">
            +9k
          </div>
        </div>
      </div>
    </div>
  );
};