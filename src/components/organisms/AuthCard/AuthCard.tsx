import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
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
  onSignIn?: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string, username: string) => void;
}

// Auth Card Node for React Flow
export const AuthCardNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as AuthCardNodeData;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (nodeData?.onSignUp && name.trim()) {
          await nodeData.onSignUp(email, password, name);
        }
      } else {
        if (nodeData?.onSignIn) {
          await nodeData.onSignIn(email, password);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      width: '250px',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '2px solid #3b82f6',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      padding: '16px',
      color: 'white',
      transition: 'all 0.3s ease',
    }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          marginBottom: '8px'
        }}>
          <User style={{ width: '18px', height: '18px', color: '#e5e7eb' }} />
        </div>
        <h1 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '2px',
          margin: 0
        }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p style={{ color: '#9ca3af', margin: 0, fontSize: '12px' }}>
          {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     {isSignUp && (
             <AnimatedFormField
               type="text"
               placeholder="Enter your full name"
               value={name}
               onChange={(e) => setName(e.target.value)}
               icon={<User size={18} />}
             />
           )}

          <AnimatedFormField
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={14} />}
          />

          <AnimatedFormField
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={14} />}
            showToggle
            onToggle={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '10px',
                  height: '10px',
                  accentColor: '#3b82f6',
                  backgroundColor: '#1f2937',
                  borderColor: '#4b5563',
                  borderRadius: '4px'
                }}
              />
              <span style={{ fontSize: '10px', color: '#9ca3af' }}>Remember me</span>
            </label>
            
            {!isSignUp && (
              <button
                type="button"
                style={{
                  fontSize: '10px',
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
            disabled={isSubmitting}
            style={{
              width: '100%',
              position: 'relative',
              background: '#3b82f6',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.5 : 1,
              transition: 'all 0.3s ease-in-out',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)';
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = '#3b82f6';
              }
            }}
          >
            <span style={{ 
              opacity: isSubmitting ? 0 : 1,
              transition: 'opacity 0.2s'
            }}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </span>
            
            {isSubmitting && (
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



      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={toggleMode}
            style={{
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline'
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