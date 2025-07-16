import React, { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Input } from '../../atoms/Input';
import { ComponentCard } from '../../molecules/ComponentCard';
import type { ComponentDrawerProps } from './ComponentDrawer.types';
import type { ComponentData } from '../../molecules/ComponentCard/ComponentCard.types';
import styles from './ComponentDrawer.module.css';

export const ComponentDrawer: React.FC<ComponentDrawerProps> = ({
  components,
  categories,
  searchQuery,
  onSearchChange,
  onComponentDragStart,
  onComponentDragEnd,
  className,
}) => {
  // Local state for category expansion
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.id))
  );

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchQuery) return components;
    
    const query = searchQuery.toLowerCase();
    return components.filter(component => 
      component.name.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query) ||
      component.category.toLowerCase().includes(query)
    );
  }, [components, searchQuery]);

  // Group filtered components by category
  const groupedComponents = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = filteredComponents.filter(
        component => component.category === category.id
      );
      return acc;
    }, {} as Record<string, ComponentData[]>);
  }, [categories, filteredComponents]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const handleComponentDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, component: ComponentData) => {
    onComponentDragStart?.(component);
  }, [onComponentDragStart]);

  const handleComponentDragEnd = useCallback(() => {
    onComponentDragEnd?.();
  }, [onComponentDragEnd]);

  return (
    <div className={clsx(styles.drawer, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Components</h2>
        <Input
          type="search"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search components..."
          leftIcon={<Icon name="search" size="sm" />}
          className={styles.search}
          aria-label="Search components"
        />
      </div>

      <div className={styles.categories}>
        {categories.map(category => {
          const categoryComponents = groupedComponents[category.id] || [];
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <div key={category.id} className={styles.category}>
              <button
                className={styles.categoryHeader}
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isExpanded}
                aria-controls={`category-${category.id}`}
              >
                <Icon name={category.icon as any} size="md" />
                <span className={styles.categoryTitle}>{category.name}</span>
                <span className={styles.categoryCount}>
                  {categoryComponents.length}
                </span>
                <Icon 
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  className={clsx(
                    styles.chevron,
                    isExpanded && styles['chevron--expanded']
                  )}
                  size="sm"
                />
              </button>
              
              {isExpanded && (
                <div 
                  id={`category-${category.id}`}
                  className={styles.categoryItems}
                >
                  {categoryComponents.length === 0 ? (
                    <p className={styles.emptyMessage}>
                      No components found
                    </p>
                  ) : (
                    categoryComponents.map(component => (
                      <ComponentCard
                        key={component.id}
                        data={component}
                        variant="drawer"
                        onDragStart={handleComponentDragStart}
                        onDragEnd={handleComponentDragEnd}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};