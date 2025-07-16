import React from 'react';
import { User, Settings, Award, Calendar } from 'lucide-react';

export const ProfileWrapper: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem',
      height: '100%', 
      background: 'var(--color-neutral-50)',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={32} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>System Designer</h1>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-neutral-600)' }}>Level 1 Engineer</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{
            padding: '1rem',
            border: '1px solid var(--color-neutral-200)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <Settings size={24} style={{ color: 'var(--color-primary-500)', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Settings</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
              Manage your preferences
            </p>
          </div>

          <div style={{
            padding: '1rem',
            border: '1px solid var(--color-neutral-200)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <Award size={24} style={{ color: 'var(--color-yellow-500)', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Achievements</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
              View your progress
            </p>
          </div>

          <div style={{
            padding: '1rem',
            border: '1px solid var(--color-neutral-200)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <Calendar size={24} style={{ color: 'var(--color-green-500)', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Schedule</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
              Upcoming missions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 