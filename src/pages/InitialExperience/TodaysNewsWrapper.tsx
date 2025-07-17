import React, { useState } from 'react';
import { BentoNewsDemo } from '../../components/ui/bento-news-demo';
import { TagGroup, TagList, Tag } from '../../components/ui/tag-group-design-system';

export const TodaysNewsWrapper: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    { id: 'Emergency', name: 'Emergency' },
    { id: 'Security', name: 'Security' },
    { id: 'Careers', name: 'Careers' },
    { id: 'Global', name: 'Global' }
  ];

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--color-surface-primary)',
        overflow: 'auto',
        fontFamily: 'var(--font-primary)'
      }}
    >
      <div 
        style={{
          maxWidth: 'var(--layout-content-max-width)',
          margin: '0 auto',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
          minHeight: '100%'
        }}
      >
        {/* Header */}
        <div 
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-8)'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-error) 0%, var(--color-accent-warning) 100%)',
              color: 'var(--color-text-primary)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-bold)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              marginBottom: 'var(--space-4)',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            🚨 BREAKING NEWS
          </div>
          
          <h1 
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-2) 0',
              letterSpacing: '-0.02em'
            }}
          >
            Today's News
          </h1>
          
          <p 
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-tertiary)',
              margin: 0
            }}
          >
            Breaking stories from the healthcare technology sector
          </p>
        </div>

        {/* Filter Tags */}
        <div 
          style={{
            marginBottom: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--color-surface-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-primary)'
          }}
        >
          <TagGroup 
            selectionMode="multiple" 
            selectedKeys={selectedCategories}
            onSelectionChange={(keys) => setSelectedCategories(Array.from(keys) as string[])}
          >
                         <TagList>
              {categories.map((category) => (
                                 <Tag 
                   key={category.id} 
                   id={category.id}
                 >
                  {category.name}
                </Tag>
              ))}
            </TagList>
          </TagGroup>
          
          <div style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--color-text-tertiary)', 
            marginTop: 'var(--space-2)' 
          }}>
            {selectedCategories.length === 0 
              ? 'Showing all news articles. Select categories to filter.' 
              : `Showing ${selectedCategories.join(', ')} articles.`
            }
          </div>
        </div>

        {/* News Grid */}
        <div style={{ flex: 1 }}>
          <BentoNewsDemo selectedCategories={selectedCategories} />
        </div>

        {/* Footer */}
        <div 
          style={{
            textAlign: 'center',
            marginTop: 'var(--space-12)',
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--color-border-primary)',
            color: 'var(--color-text-tertiary)',
            fontSize: 'var(--text-sm)'
          }}
        >
          <p style={{ margin: 0 }}>
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}; 