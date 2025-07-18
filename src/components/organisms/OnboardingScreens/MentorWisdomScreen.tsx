import React from 'react';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';
import type { MentorForUI } from '../../../services/mentorService';

export interface MentorWisdomScreenProps {
  mentor: MentorForUI;
  onComplete: () => void;
}

export const MentorWisdomScreen: React.FC<MentorWisdomScreenProps> = ({
  mentor,
  onComplete
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '40px',
      maxWidth: '800px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: 0,
          color: 'var(--color-text-primary)',
          marginBottom: '16px'
        }}>
          Welcome to Your Journey
        </h2>
        
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--color-text-secondary)',
          maxWidth: '600px',
          lineHeight: 1.6,
          margin: 0
        }}>
          {mentor.name} has a message for you as you begin your consulting career.
        </p>
      </div>

      <Card style={{
        padding: '32px',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface-secondary)',
        border: '1px solid var(--color-border-primary)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '4rem' }}>
            {mentor.avatar}
          </div>
          
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: 0,
              color: 'var(--color-text-primary)',
              marginBottom: '8px'
            }}>
              {mentor.name}
            </h3>
            
            <p style={{
              fontSize: '1rem',
              color: 'var(--color-accent-primary)',
              margin: 0,
              fontWeight: '500'
            }}>
              {mentor.title} at {mentor.company}
            </p>
          </div>

          <blockquote style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: '500px'
          }}>
            "{mentor.toastMessage}"
          </blockquote>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center'
          }}>
            {mentor.expertise.map((skill, index) => (
              <span
                key={index}
                style={{
                  fontSize: '0.875rem',
                  padding: '6px 12px',
                  backgroundColor: 'var(--color-surface-interactive)',
                  color: 'var(--color-text-secondary)',
                  borderRadius: '16px'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: '1rem',
          color: 'var(--color-text-tertiary)',
          margin: 0,
          marginBottom: '24px'
        }}>
          You can always reach out to {mentor.name} for guidance throughout your journey.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={onComplete}
          style={{
            padding: '16px 48px',
            fontSize: '1.125rem'
          }}
        >
          Begin Your Career →
        </Button>
      </div>
    </div>
  );
}; 