import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { useDraggable } from '@dnd-kit/core';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { ComponentCardProps } from './ComponentCard.types';

export const ComponentCard: React.FC<ComponentCardProps> = ({
  data,
  variant = 'drawer',
  status = 'healthy',
  isDragging = false,
  isSelected = false,
  onSelect,
  className,
}) => {
  // Local UI state for hover effects
  const [isHovered, setIsHovered] = useState(false);
  
  // Draggable setup for drawer variant
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data.id,
    data: data,
    disabled: data.locked || variant === 'canvas',
  });

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={variant === 'drawer' ? setNodeRef : undefined}
      style={style}
      className={clsx(
        'component-card',
        `component-card--${variant}`,
        `component-card--${status}`,
        {
          'component-card--dragging': isDragging,
          'component-card--selected': isSelected,
          'component-card--locked': data.locked,
          'component-card--hovered': isHovered,
        },
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      role={variant === 'canvas' ? 'button' : undefined}
      tabIndex={variant === 'canvas' ? 0 : undefined}
      {...(variant === 'drawer' ? { ...attributes, ...listeners } : {})}
    >
      <div className="component-card__header">
        <Icon 
          name={data.icon as any || 'server'} 
          size="md" 
          className="component-card__icon"
        />
        <h3 className="component-card__name">{data.name}</h3>
        {data.locked && (
          <Icon 
            name="lock" 
            size="sm" 
            className="component-card__lock-icon"
            aria-label="Component locked"
          />
        )}
      </div>
      
      {variant === 'canvas' && (
        <div className="component-card__metrics">
          <div className="component-card__metric">
            <span className="component-card__metric-label">Load</span>
            <span className="component-card__metric-value">
              {Math.round((data.capacity / 100) * 75)}%
            </span>
          </div>
          <div className="component-card__metric">
            <span className="component-card__metric-label">Cost</span>
            <span className="component-card__metric-value">${data.cost}/mo</span>
          </div>
        </div>
      )}
      
      {variant === 'drawer' && (
        <div className="component-card__footer">
          <span className="component-card__cost">${data.cost}/mo</span>
          <Badge variant="info" size="sm">
            {data.capacity} req/s
          </Badge>
        </div>
      )}
    </div>
  );
};