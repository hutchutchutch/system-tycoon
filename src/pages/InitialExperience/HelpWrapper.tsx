import React from 'react';
import { HelpCircle, Book, MessageCircle, Video, ExternalLink } from 'lucide-react';

export const HelpWrapper: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem',
      height: '100%', 
      background: 'var(--color-neutral-50)',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--color-blue-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <HelpCircle size={28} color="white" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '600' }}>Help Center</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-neutral-600)' }}>
            Get help with system design and troubleshooting
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            padding: '1.5rem',
            border: '1px solid var(--color-neutral-200)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <Book size={32} style={{ color: 'var(--color-green-500)', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Documentation
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
              Complete guides on system design patterns and best practices
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary-500)', fontSize: '0.875rem', fontWeight: '500' }}>
              Read docs <ExternalLink size={14} style={{ marginLeft: '0.25rem' }} />
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid var(--color-neutral-200)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <Video size={32} style={{ color: 'var(--color-red-500)', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Video Tutorials
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
              Step-by-step video guides for common system design challenges
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary-500)', fontSize: '0.875rem', fontWeight: '500' }}>
              Watch videos <ExternalLink size={14} style={{ marginLeft: '0.25rem' }} />
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid var(--color-neutral-200)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <MessageCircle size={32} style={{ color: 'var(--color-purple-500)', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Community Support
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
              Connect with other engineers and get help from the community
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary-500)', fontSize: '0.875rem', fontWeight: '500' }}>
              Join community <ExternalLink size={14} style={{ marginLeft: '0.25rem' }} />
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--color-blue-50)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-blue-200)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: 'var(--color-blue-900)' }}>
            Quick Tips
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-blue-800)' }}>
            <li style={{ marginBottom: '0.25rem' }}>Start with understanding the problem before designing solutions</li>
            <li style={{ marginBottom: '0.25rem' }}>Consider scalability, reliability, and performance early</li>
            <li style={{ marginBottom: '0.25rem' }}>Use established patterns and don't reinvent the wheel</li>
            <li>Document your decisions and trade-offs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 