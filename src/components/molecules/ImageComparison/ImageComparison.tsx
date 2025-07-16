import React, { useState, useRef, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import type { ImageComparisonProps } from './ImageComparison.types';
import styles from './ImageComparison.module.css';

// Public asset paths
const treePineImg = '/tree_pine.png';
const treeRoundImg = '/tree_round.png';
const rocksImg = '/rocks.png';
const boulderImg = '/boulder.png';
const apiImg = '/api.png';
const databaseImg = '/database.png';
const computeImg = '/compute.png';
const cacheImg = '/cache.png';
const loadBalancerImg = '/load_balancer.png';

/**
 * ImageComparison Component
 * 
 * Purpose: Interactive comparison slider between ProblemVille and DataWorld themes
 * Shows the transition from nature-based problems to tech-based solutions
 * 
 * State Management:
 * - Local state for slider position
 * - Callbacks for position changes
 * - No Redux connections needed
 * 
 * @example
 * <ImageComparison 
 *   initialPosition={50}
 *   onPositionChange={(pos) => console.log('Position:', pos)}
 * />
 */
export const ImageComparison: React.FC<ImageComparisonProps> = ({
  className,
  initialPosition = 50,
  onPositionChange,
  showLabels = true,
  leftLabel = 'ProblemVille',
  rightLabel = 'DataWorld',
  disabled = false,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate position based on mouse/touch event
  const calculatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    return Math.max(0, Math.min(100, percentage));
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  }, [disabled]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;
    
    const newPosition = calculatePosition(e.clientX);
    if (newPosition !== undefined) {
      setPosition(newPosition);
      onPositionChange?.(newPosition);
    }
  }, [isDragging, disabled, calculatePosition, onPositionChange]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || disabled) return;
    
    const touch = e.touches[0];
    const newPosition = calculatePosition(touch.clientX);
    if (newPosition !== undefined) {
      setPosition(newPosition);
      onPositionChange?.(newPosition);
    }
  }, [isDragging, disabled, calculatePosition, onPositionChange]);

  // Set up event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div 
      ref={containerRef}
      className={clsx(
        styles.container,
        disabled && styles['container--disabled'],
        className
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* ProblemVille Side (Green/Nature) */}
      <div className={styles.leftSide}>
        {/* Nature Assets */}
        <img 
          src={treePineImg} 
          alt="Pine Tree" 
          className={clsx(styles.asset, styles.pineTree1)}
        />
        <img 
          src={treeRoundImg} 
          alt="Round Tree" 
          className={clsx(styles.asset, styles.roundTree)}
        />
        <img 
          src={rocksImg} 
          alt="Rocks" 
          className={clsx(styles.asset, styles.rocks)}
        />
        <img 
          src={boulderImg} 
          alt="Boulder" 
          className={clsx(styles.asset, styles.boulder)}
        />
        <img 
          src={treePineImg} 
          alt="Pine Tree" 
          className={clsx(styles.asset, styles.pineTree2)}
        />
      </div>

      {/* DataWorld Side (Blue/Tech) */}
      <div 
        className={styles.rightSide}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* Tech Assets */}
        <img 
          src={apiImg} 
          alt="API" 
          className={clsx(styles.asset, styles.api)}
        />
        <img 
          src={databaseImg} 
          alt="Database" 
          className={clsx(styles.asset, styles.database)}
        />
        <img 
          src={computeImg} 
          alt="Compute" 
          className={clsx(styles.asset, styles.compute)}
        />
        <img 
          src={cacheImg} 
          alt="Cache" 
          className={clsx(styles.asset, styles.cache)}
        />
        <img 
          src={loadBalancerImg} 
          alt="Load Balancer" 
          className={clsx(styles.asset, styles.loadBalancer)}
        />
        
        {/* Connection lines between tech assets */}
        <svg className={styles.connections}>
          <line 
            x1="20%" y1="30%" 
            x2="50%" y2="25%" 
            className={styles.connectionLine}
          />
          <line 
            x1="50%" y1="25%" 
            x2="75%" y2="40%" 
            className={styles.connectionLine}
          />
          <line 
            x1="25%" y1="65%" 
            x2="75%" y2="75%" 
            className={styles.connectionLine}
          />
        </svg>
      </div>

      {/* Slider Handle */}
      <div 
        className={clsx(
          styles.slider,
          isDragging && styles['slider--dragging'],
          disabled && styles['slider--disabled']
        )}
        style={{ left: `${position}%` }}
      />

      {/* Labels */}
      {showLabels && (
        <>
          <div className={clsx(styles.label, styles['label--left'])}>
            <h3 className={styles.labelTitle}>
              {leftLabel}
            </h3>
            <p className={styles.labelSubtitle}>
              Where problems grow wild
            </p>
          </div>
          <div className={clsx(styles.label, styles['label--right'])}>
            <h3 className={styles.labelTitle}>
              {rightLabel}
            </h3>
            <p className={styles.labelSubtitle}>
              Where solutions scale
            </p>
          </div>
        </>
      )}
    </div>
  );
};