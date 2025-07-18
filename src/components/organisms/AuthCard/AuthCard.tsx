import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { signInWithEmail, signUpWithEmail, clearError } from '../../../features/auth/authSlice';
import type { AuthCardProps } from './AuthCard.types';

interface FormFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  showToggle?: boolean;
  onToggle?: () => void;
  showPassword?: boolean;
}

const AnimatedFormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  value,
  onChange,
  icon,
  showToggle,
  onToggle,
  showPassword
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <div style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af',
        zIndex: 1
      }}>
        {icon}
      </div>
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 12px 12px 40px',
          paddingRight: showToggle ? '40px' : '12px',
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          borderColor: isFocused ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)'
        }}
        className="auth-input"
      />

      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};



interface AuthCardNodeData extends Record<string, unknown> {
  error?: string;
  onSuccess?: () => void; // Optional callback for when authentication succeeds
  onAnimationStart?: () => void; // Callback to start edge animation
  onDatabaseError?: () => void; // Callback for database-specific errors
  onAuthServiceError?: () => void; // Callback for authentication service errors
}

// Auth Card Node for React Flow
export const AuthCardNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as AuthCardNodeData;
  const dispatch = useAppDispatch();
  const { isLoading, error: authError, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Clear any auth errors when component mounts or mode changes
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, isSignUp]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && nodeData?.onSuccess) {
      nodeData.onSuccess();
    }
  }, [isAuthenticated, nodeData]);

  // Trigger animation when loading starts
  useEffect(() => {
    if (isLoading && nodeData?.onAnimationStart) {
      nodeData.onAnimationStart();
    }
  }, [isLoading, nodeData]);

  // Handle authentication service errors
  useEffect(() => {
    if (authError && nodeData?.onAuthServiceError) {
      // Check for authentication service-related error messages
      const isAuthServiceError = authError.toLowerCase().includes('invalid login credentials') ||
                                 authError.toLowerCase().includes('invalid credentials') ||
                                 authError.toLowerCase().includes('authentication failed') ||
                                 authError.toLowerCase().includes('login failed');
      
      if (isAuthServiceError) {
        nodeData.onAuthServiceError();
      }
    }
  }, [authError, nodeData]);

  // Handle database-specific errors
  useEffect(() => {
    if (authError && nodeData?.onDatabaseError) {
      // Check for database-related error messages
      const isDatabaseError = authError.toLowerCase().includes('database error saving new user') ||
                             authError.toLowerCase().includes('database error') ||
                             authError.toLowerCase().includes('profile creation error') ||
                             authError.toLowerCase().includes('failed to create profile');
      
      if (isDatabaseError) {
        nodeData.onDatabaseError();
      }
    }
  }, [authError, nodeData]);

  // Validation functions
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email || !validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!name || name.length < 2) {
        errors.name = 'Username must be at least 2 characters';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isSignUp) {
        // Dispatch sign up action
        await dispatch(signUpWithEmail({
          email: email.trim(),
          password,
          username: name.trim()
        })).unwrap();
      } else {
        // Dispatch sign in action
        await dispatch(signInWithEmail({
          email: email.trim(),
          password
        })).unwrap();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Error is handled by Redux slice
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
    setValidationErrors({});
    dispatch(clearError()); // Clear any existing errors
  };

  // Clear validation errors when user types
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  }, [email, password, name]);

  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const displayError = authError || nodeData?.error;
  const hasAnyError = displayError || hasValidationErrors;

  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      width: '280px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: `2px solid ${hasAnyError ? '#ef4444' : '#3b82f6'}`,
      boxShadow: `0 0 20px ${hasAnyError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
      padding: '20px',
      color: 'white',
      transition: 'all 0.3s ease',
    }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          marginBottom: '12px'
        }}>
          <User style={{ width: '20px', height: '20px', color: '#e5e7eb' }} />
        </div>
        <h1 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '4px',
          margin: 0
        }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>
          {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
        </p>
      </div>

      {/* Error Display */}
      {displayError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#fca5a5' }}>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isSignUp && (
            <div>
              <AnimatedFormField
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User size={18} />}
              />
              {validationErrors.name && (
                <span style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', display: 'block' }}>
                  {validationErrors.name}
                </span>
              )}
            </div>
          )}

          <div>
            <AnimatedFormField
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
            />
            {validationErrors.email && (
              <span style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', display: 'block' }}>
                {validationErrors.email}
              </span>
            )}
          </div>

          <div>
            <AnimatedFormField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={16} />}
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
            />
            {validationErrors.password && (
              <span style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', display: 'block' }}>
                {validationErrors.password}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '12px',
                  height: '12px',
                  accentColor: '#3b82f6',
                  backgroundColor: '#1f2937',
                  borderColor: '#4b5563',
                  borderRadius: '4px'
                }}
              />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>Remember me</span>
            </label>
            
            {!isSignUp && (
              <button
                type="button"
                style={{
                  fontSize: '12px',
                  color: '#3b82f6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Forgot password?
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              position: 'relative',
              background: isLoading ? 'rgba(59, 130, 246, 0.6)' : '#3b82f6',
              color: 'white',
              padding: '14px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease-in-out',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#3b82f6';
              }
            }}
          >
            <span style={{ 
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.2s'
            }}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </span>
            
            {isLoading && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            )}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={toggleMode}
            disabled={isLoading}
            style={{
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              textDecoration: 'underline',
              fontSize: '13px'
            }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      
      {/* Add spin animation for loading spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .auth-input::placeholder {
          color: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </div>
  );
};

// Legacy AuthCard component - keeping for backward compatibility
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
  return (
    <div className={className} style={{
      position: 'relative',
      zIndex: 10,
      width: '100%',
      maxWidth: '384px',
      borderRadius: '16px',
      background: 'rgba(31, 41, 55, 0.9)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '50%',
        marginBottom: '16px'
      }}>
        <User style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
      </div>
      
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '32px',
        textAlign: 'center',
        margin: 0
      }}>
        {title}
      </h2>
      
      <div style={{ color: 'white' }}>
        Legacy AuthCard - Use AuthCardNode for React Flow integration
      </div>
    </div>
  );
}; 