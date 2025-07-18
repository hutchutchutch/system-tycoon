import React from 'react';
import { Button } from '../../atoms/Button';

export interface OpeningImpactScreenProps {
  onContinue: () => void;
}

export const OpeningImpactScreen: React.FC<OpeningImpactScreenProps> = ({
  onContinue
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      maxWidth: '800px',
      padding: '40px',
      gap: '40px'
    }}>
      <div style={{ lineHeight: 1, margin: 0, padding: 0, overflow: 'visible' }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          margin: 0,
          color: 'var(--color-text-primary)',
          lineHeight: 1
        }}>
          Software Changed
        </h1>
        <h1 style={{ 
          fontSize: window.innerWidth >= 1024 ? '4.5rem' : '3rem',
          fontWeight: 'bold',
          letterSpacing: '-0.025em',
          margin: 0,
          background: 'linear-gradient(to right, #60A5FA, #A855F7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          lineHeight: 1,
          paddingBottom: '0.5em' // add space below to prevent cutoff
        }}>
          Everything
        </h1>
      </div>
      
      <p style={{
        fontSize: '1.25rem',
        color: 'var(--color-text-secondary)',
        maxWidth: '600px',
        lineHeight: 1.6,
        margin: 0
      }}>
        From connecting remote villages to the global internet, to enabling instant video calls across continents, software has transformed how we solve the world's most pressing challenges.
      </p>

      <Button
        variant="primary"
        size="lg"
        onClick={onContinue}
        style={{
          padding: '16px 48px',
          fontSize: '1.125rem'
        }}
      >
        Continue →
      </Button>
    </div>
  );
}; 