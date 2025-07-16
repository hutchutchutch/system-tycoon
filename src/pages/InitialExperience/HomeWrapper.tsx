import React from 'react';
import { Mail, User, HelpCircle, Newspaper } from 'lucide-react';

interface HomeWrapperProps {
  onProfileClick?: () => void;
  onHelpClick?: () => void;
  onNewsClick?: () => void;
  onEmailClick?: () => void;
}

export const HomeWrapper: React.FC<HomeWrapperProps> = ({
  onProfileClick,
  onHelpClick,
  onNewsClick,
  onEmailClick
}) => {
  return (
    <div style={{ 
      padding: 'var(--space-4)',
      height: '100%', 
      background: 'var(--color-surface-primary)',
      fontFamily: 'var(--font-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 140px)',
        gap: 'var(--space-4)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--card-padding)',
            background: 'var(--card-background)',
            border: 'var(--card-border)',
            borderRadius: 'var(--card-radius)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--card-shadow)',
            minWidth: '140px',
            minHeight: '120px'
          }}
          onClick={onProfileClick}
          aria-label="Open profile"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-interactive)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--card-background)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--color-accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <User size={24} />
          </div>
          <span style={{ 
            fontSize: 'var(--text-sm)', 
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)'
          }}>Profile</span>
        </button>
        
        <button 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--card-padding)',
            background: 'var(--card-background)',
            border: 'var(--card-border)',
            borderRadius: 'var(--card-radius)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--card-shadow)',
            minWidth: '140px',
            minHeight: '120px'
          }}
          onClick={onHelpClick}
          aria-label="Open help"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-interactive)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--card-background)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--color-accent-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <HelpCircle size={24} />
          </div>
          <span style={{ 
            fontSize: 'var(--text-sm)', 
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)'
          }}>Help</span>
        </button>
        
        <button 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--card-padding)',
            background: 'var(--card-background)',
            border: 'var(--card-border)',
            borderRadius: 'var(--card-radius)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--card-shadow)',
            minWidth: '140px',
            minHeight: '120px'
          }}
          onClick={onNewsClick}
          aria-label="Open news"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-interactive)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--card-background)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--color-accent-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Newspaper size={24} />
          </div>
          <span style={{ 
            fontSize: 'var(--text-sm)', 
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)'
          }}>News</span>
        </button>
        
        <button 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--card-padding)',
            background: 'var(--card-background)',
            border: 'var(--card-border)',
            borderRadius: 'var(--card-radius)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--card-shadow)',
            minWidth: '140px',
            minHeight: '120px',
            position: 'relative'
          }}
          onClick={onEmailClick}
          aria-label="Open email"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-interactive)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--card-background)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--color-accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Mail size={24} />
          </div>
          <span style={{ 
            fontSize: 'var(--text-sm)', 
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)'
          }}>Email</span>
          <div style={{
            position: 'absolute',
            top: 'var(--space-2)',
            right: 'var(--space-2)',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--color-accent-error)',
            border: '2px solid var(--color-surface-secondary)'
          }} />
        </button>
      </div>
    </div>
  );
}; 