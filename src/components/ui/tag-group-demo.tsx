import React, { useState } from 'react';
import { TagGroup, TagList, Tag } from './tag-group-design-system';

export function TagGroupDemo() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    { id: 'Emergency', name: 'Emergency' },
    { id: 'Security', name: 'Security' },
    { id: 'Careers', name: 'Careers' },
    { id: 'Global', name: 'Global' }
  ];

  return (
    <div style={{
      padding: 'var(--space-4)',
      background: 'var(--color-surface-primary)',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-primary)'
    }}>
      <h2 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: 'var(--space-4)',
        color: 'var(--color-text-primary)'
      }}>
        News Category Filter
      </h2>
      
      <TagGroup 
        selectionMode="multiple" 
        selectedKeys={selectedCategories}
        onSelectionChange={(keys) => setSelectedCategories(Array.from(keys) as string[])}
        style={{ marginBottom: 'var(--space-4)' }}
      >
        <TagList>
          {categories.map((category) => (
            <Tag key={category.id} id={category.id}>
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
          ? 'No categories selected. Select categories to filter.' 
          : `Selected categories: ${selectedCategories.join(', ')}`
        }
      </div>
    </div>
  );
} 