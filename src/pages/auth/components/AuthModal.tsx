import React, { useState } from 'react';
import { User } from 'lucide-react';

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
    return (
      <div className="custom-node auth-node animated" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-md)',
        minWidth: '300px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        color: 'var(--color-text-primary)',
        position: 'relative'
      }}>
        {/* Fake handles using CSS */}
        <div style={{
          position: 'absolute',
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '12px',
          height: '12px',
          background: 'rgba(139, 92, 246, 0.8)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%'
        }} />
        
        <div className="node-icon" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-sm)',
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          <User size={24} />
        </div>
        
        <div className="node-content">
          <div className="node-title" style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            Authentication
          </div>
          <div className="node-subtitle" style={{
            fontSize: 'var(--text-xs)',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: 'var(--spacing-sm)',
            lineHeight: '1.3'
          }}>
            Processing login...
          </div>
        </div>
        
        <div style={{
          position: 'absolute',
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '12px',
          height: '12px',
          background: 'rgba(139, 92, 246, 0.8)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%'
        }} />
      </div>
    );
  }

  return (
    <div className="custom-node auth-node" style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-md)',
      minWidth: '300px',
      maxWidth: '400px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      color: 'var(--color-text-primary)',
      position: 'relative'
    }}>
      {/* Fake left handle */}
      <div style={{
        position: 'absolute',
        left: '-6px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '12px',
        height: '12px',
        background: 'rgba(139, 92, 246, 0.8)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%'
      }} />
      
      <div className="node-icon" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--spacing-sm)',
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        <User size={24} />
      </div>
      
      <div className="node-content">
        <div className="node-title" style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-xs)'
        }}>
          Authentication Portal
        </div>
        <div className="node-subtitle" style={{
          fontSize: 'var(--text-xs)',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: 'var(--spacing-sm)',
          lineHeight: '1.3'
        }}>
          {authMode === 'signin' ? 'User credentials verification' : 'Account creation process'}
        </div>
      </div>

      {error && <div style={{ 
        color: '#fca5a5', 
        fontSize: 'var(--text-xs)', 
        marginBottom: 'var(--spacing-sm)' 
      }}>
        {error}
      </div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {authMode === 'signup' && (
          <div>
            <label style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'rgba(255, 255, 255, 0.8)',
              display: 'block',
              marginBottom: '4px'
            }}>
              Username
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                fontSize: 'var(--text-xs)'
              }}
            />
          </div>
        )}
        
        <div>
          <label style={{ 
            fontSize: 'var(--text-xs)', 
            color: 'rgba(255, 255, 255, 0.8)',
            display: 'block',
            marginBottom: '4px'
          }}>
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              fontSize: 'var(--text-xs)'
            }}
          />
        </div>

        <div>
          <label style={{ 
            fontSize: 'var(--text-xs)', 
            color: 'rgba(255, 255, 255, 0.8)',
            display: 'block',
            marginBottom: '4px'
          }}>
            Password
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              fontSize: 'var(--text-xs)'
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            padding: '10px',
            background: 'rgba(139, 92, 246, 0.8)',
            border: '1px solid rgba(139, 92, 246, 1)',
            borderRadius: '6px',
            color: 'white',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            marginTop: 'var(--spacing-xs)'
          }}
        >
          {isLoading ? 'Loading...' : authMode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-sm)', 
        marginTop: 'var(--spacing-sm)',
        flexDirection: 'column'
      }}>
        <button 
          onClick={() => onOAuthSignIn('google')} 
          disabled={isLoading}
          style={{
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: 'white',
            fontSize: 'var(--text-xs)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          Google
        </button>

        <button 
          onClick={onDemoSignIn} 
          disabled={isLoading}
          style={{
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: 'white',
            fontSize: 'var(--text-xs)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          Demo
        </button>

        <button 
          onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: 'rgba(139, 92, 246, 0.8)',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {authMode === 'signin' ? 'Create Account' : 'Sign In'}
        </button>
      </div>
      
      {/* Fake right handle */}
      <div style={{
        position: 'absolute',
        right: '-6px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '12px',
        height: '12px',
        background: 'rgba(139, 92, 246, 0.8)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%'
      }} />
    </div>
  );
}; 