import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import styles from './ComponentCard.module.css';
import type { ComponentCardProps } from './ComponentCard.types';

/**
 * ComponentCard
 * 
 * Purpose: Displays system architecture components in drawer and on canvas
 * Now supports both the old ComponentData format and new DrawerComponent format
 * 
 * State Management:
 * - Local state for hover effects and UI interactions only
 * - Component data passed via props from parent
 * - Dragging state managed by HTML Drag and Drop API
 * - Selection state controlled by parent
 * 
 * Redux Integration:
 * - Parent reads components from design.availableComponents
 * - Parent dispatches addNode when dropped on canvas
 */

export const ComponentCard: React.FC<ComponentCardProps> = ({
  data,
  drawerComponent,
  variant = 'drawer',
  status = 'healthy',
  isDragging = false,
  isSelected = false,
  isExpanded = false,
  onClick,
  onDragStart,
  onDragEnd,
  className,
}) => {
  // Local UI state for hover effects
  const [isHovered, setIsHovered] = useState(false);

  // Use either the new drawerComponent or fall back to old data format
  const component = drawerComponent || data;
  if (!component) return null;

  const isDrawerComponent = 'shortDescription' in component;

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (isDrawerComponent && drawerComponent) {
      // For drawer components from database, set up drag data
      event.dataTransfer.setData('application/reactflow', drawerComponent.category);
      event.dataTransfer.setData('application/component', JSON.stringify({
        id: drawerComponent.id,
        name: drawerComponent.name,
        type: drawerComponent.category,
        category: drawerComponent.category,
        cost: 50, // Default cost
        capacity: 1000, // Default capacity  
        description: drawerComponent.shortDescription,
        icon: drawerComponent.icon,
        color: drawerComponent.color
      }));
      event.dataTransfer.effectAllowed = 'move';
      
      console.log('Dragging drawer component:', drawerComponent.name);
      
      // Call parent handler
      onDragStart?.(event, drawerComponent);
      return;
    }

    if (!data) {
      event.preventDefault();
      return;
    }

    // Set the component data for the drag operation (legacy support)
    event.dataTransfer.setData('application/reactflow', data?.type || '');
    event.dataTransfer.setData('application/component', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'move';
    
    // Call parent handler
    onDragStart?.(event, component);
  }, [component, data, isDrawerComponent, drawerComponent, onDragStart]);

  const handleDragEnd = useCallback(() => {
    onDragEnd?.();
  }, [onDragEnd]);

  const renderDrawerView = () => {
    if (isDrawerComponent && drawerComponent) {
      return (
        <>
          <div className={styles.header}>
            <div 
              className={styles.iconWrapper}
              style={{ backgroundColor: drawerComponent.color }}
            >
              <Icon 
                name={drawerComponent.icon as any || 'server'} 
                size="md" 
                className={styles.icon}
              />
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{drawerComponent.name}</h3>
              <p className={styles.shortDescription}>{drawerComponent.shortDescription}</p>
            </div>
            <Icon 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size="sm" 
              className={styles.expandIcon}
            />
          </div>
        </>
      );
    }

    // Fallback to old drawer view
    return (
      <>
        <div className={styles.header}>
          <Icon 
            name={data?.icon as any || 'server'} 
            size="md" 
            className={styles.icon}
          />
          <h3 className={styles.name}>{data?.name}</h3>
          {data?.locked && (
            <Icon 
              name="lock" 
              size="sm" 
              className={styles.lockIcon}
              aria-label="Component locked"
            />
          )}
        </div>
        
        <div className={styles.footer}>
          <span className={styles.cost}>${data?.cost}/mo</span>
          <Badge variant="default" size="sm">
            {data?.capacity} req/s
          </Badge>
        </div>
      </>
    );
  };

  const renderCanvasView = () => {
    return (
      <>
        <div className={styles.header}>
          <Icon 
            name={data?.icon as any || 'server'} 
            size="md" 
            className={styles.icon}
          />
          <h3 className={styles.name}>{data?.name}</h3>
        </div>
        
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Load</span>
            <span className={styles.metricValue}>
              {Math.round((data?.capacity || 0) / 100 * 75)}%
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Cost</span>
            <span className={styles.metricValue}>${data?.cost || 0}/mo</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className={clsx(
        styles.componentCard,
        styles[`componentCard--${variant}`],
        styles[`componentCard--${status}`],
        {
          [styles['componentCard--dragging']]: isDragging,
          [styles['componentCard--selected']]: isSelected,
          [styles['componentCard--expanded']]: isExpanded,
          [styles['componentCard--locked']]: data?.locked,
          [styles['componentCard--hovered']]: isHovered,
          [styles['componentCard--drawerComponent']]: isDrawerComponent,
        },
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      // HTML Drag and Drop API - allow dragging for drawer components from database
      draggable={(variant === 'drawer' && isDrawerComponent) || (variant === 'drawer' && !isDrawerComponent && !data?.locked)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      role={variant === 'canvas' || onClick ? 'button' : undefined}
      tabIndex={variant === 'canvas' || onClick ? 0 : undefined}
    >
      {variant === 'drawer' ? renderDrawerView() : renderCanvasView()}
    </div>
  );
};