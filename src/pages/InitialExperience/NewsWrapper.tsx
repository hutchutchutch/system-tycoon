import React from 'react';
import { Newspaper, TrendingUp, Clock, Star } from 'lucide-react';

export const NewsWrapper: React.FC = () => {
  const newsItems = [
    {
      title: "New Database Scaling Patterns Released",
      summary: "Industry leaders share innovative approaches to horizontal scaling with microservices.",
      category: "Database",
      time: "2 hours ago",
      trending: true
    },
    {
      title: "Cloud Architecture Best Practices 2024",
      summary: "Updated guidelines for building resilient cloud-native applications.",
      category: "Cloud",
      time: "4 hours ago",
      trending: false
    },
    {
      title: "System Design Interview Trends",
      summary: "What top tech companies are looking for in system design interviews this year.",
      category: "Career",
      time: "6 hours ago",
      trending: true
    },
    {
      title: "Kubernetes Security Updates",
      summary: "Critical security patches and best practices for container orchestration.",
      category: "Security",
      time: "8 hours ago",
      trending: false
    }
  ];

  return (
    <div style={{ 
      padding: '2rem',
      height: '100%', 
      background: 'var(--color-neutral-50)',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--color-orange-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem'
          }}>
            <Newspaper size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '600' }}>Tech News</h1>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-neutral-600)' }}>
              Latest updates in system design and engineering
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['All', 'Database', 'Cloud', 'Security', 'Career'].map((category) => (
            <button
              key={category}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: category === 'All' ? 'none' : '1px solid var(--color-neutral-300)',
                background: category === 'All' ? 'var(--color-primary-500)' : 'var(--color-white)',
                color: category === 'All' ? 'white' : 'var(--color-neutral-700)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {newsItems.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '1.5rem',
                border: '1px solid var(--color-neutral-200)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {item.trending && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--color-orange-500)',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  <TrendingUp size={12} />
                  Trending
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: 'var(--color-primary-100)',
                  color: 'var(--color-primary-700)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {item.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-neutral-500)', fontSize: '0.75rem' }}>
                  <Clock size={12} />
                  {item.time}
                </div>
              </div>
              
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-neutral-900)' }}>
                {item.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-neutral-600)', lineHeight: '1.5' }}>
                {item.summary}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          padding: '1rem',
          border: '1px dashed var(--color-neutral-300)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-neutral-500)'
        }}>
          <Star size={20} style={{ marginBottom: '0.5rem' }} />
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            Subscribe to get the latest system design news delivered to your inbox
          </p>
        </div>
      </div>
    </div>
  );
}; 