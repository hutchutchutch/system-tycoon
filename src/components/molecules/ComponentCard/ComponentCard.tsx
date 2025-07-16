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
  variant = 'drawer',
  status = 'healthy',
  isDragging = false,
  isSelected = false,
  onSelect,
  onDragStart,
  onDragEnd,
  className,
}) => {
  // Local UI state for hover effects
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    // Set the component data for the drag operation
    event.dataTransfer.setData('application/reactflow', data.type);
    event.dataTransfer.setData('application/component', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
    
    // Call parent handler
    onDragStart?.(event, data);
  }, [data, onDragStart]);

  const handleDragEnd = useCallback(() => {
    onDragEnd?.();
  }, [onDragEnd]);

  return (
    <div
      className={clsx(
        styles.componentCard,
        styles[`componentCard--${variant}`],
        styles[`componentCard--${status}`],
        {
          [styles['componentCard--dragging']]: isDragging,
          [styles['componentCard--selected']]: isSelected,
          [styles['componentCard--locked']]: data.locked,
          [styles['componentCard--hovered']]: isHovered,
        },
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      // HTML Drag and Drop API
      draggable={variant === 'drawer' && !data.locked}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      role={variant === 'canvas' ? 'button' : undefined}
      tabIndex={variant === 'canvas' ? 0 : undefined}
    >
      <div className={styles.header}>
        <Icon 
          name={data.icon as any || 'server'} 
          size="md" 
          className={styles.icon}
        />
        <h3 className={styles.name}>{data.name}</h3>
        {data.locked && (
          <Icon 
            name="lock" 
            size="sm" 
            className={styles.lockIcon}
            aria-label="Component locked"
          />
        )}
      </div>
      
      {variant === 'canvas' && (
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Load</span>
            <span className={styles.metricValue}>
              {Math.round((data.capacity / 100) * 75)}%
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Cost</span>
            <span className={styles.metricValue}>${data.cost}/mo</span>
          </div>
        </div>
      )}
      
      {variant === 'drawer' && (
        <div className={styles.footer}>
          <span className={styles.cost}>${data.cost}/mo</span>
          <Badge variant="default" size="sm">
            {data.capacity} req/s
          </Badge>
        </div>
      )}
    </div>
  );
};