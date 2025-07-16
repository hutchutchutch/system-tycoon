import React, { useState, useRef, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import type { ImageComparisonProps } from './ImageComparison.types';

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

  const containerClasses = clsx(
    'relative w-full h-full overflow-hidden rounded-lg select-none',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const sliderClasses = clsx(
    'absolute top-0 bottom-0 w-1 bg-white z-30',
    'before:content-[""] before:absolute before:top-1/2 before:-translate-y-1/2',
    'before:left-1/2 before:-translate-x-1/2 before:w-10 before:h-10',
    'before:bg-white before:rounded-full before:shadow-lg',
    'after:content-[""] after:absolute after:top-1/2 after:-translate-y-1/2',
    'after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-6',
    'after:border-2 after:border-gray-400 after:rounded-full',
    !disabled && 'cursor-ew-resize hover:before:scale-110 transition-transform',
    isDragging && 'before:scale-110'
  );

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* ProblemVille Side (Green/Nature) */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-600">
        {/* Nature Assets */}
        <img 
          src={treePineImg} 
          alt="Pine Tree" 
          className="absolute bottom-10 left-10 w-24 h-32 object-contain"
        />
        <img 
          src={treeRoundImg} 
          alt="Round Tree" 
          className="absolute bottom-20 right-20 w-28 h-28 object-contain"
        />
        <img 
          src={rocksImg} 
          alt="Rocks" 
          className="absolute bottom-5 left-1/3 w-20 h-16 object-contain"
        />
        <img 
          src={boulderImg} 
          alt="Boulder" 
          className="absolute bottom-12 right-1/3 w-24 h-20 object-contain"
        />
        <img 
          src={treePineImg} 
          alt="Pine Tree" 
          className="absolute bottom-5 left-1/2 w-20 h-28 object-contain opacity-80"
        />
      </div>

      {/* DataWorld Side (Blue/Tech) */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* Tech Assets */}
        <img 
          src={apiImg} 
          alt="API" 
          className="absolute top-20 left-10 w-20 h-20 object-contain animate-pulse"
        />
        <img 
          src={databaseImg} 
          alt="Database" 
          className="absolute bottom-20 right-10 w-24 h-24 object-contain"
        />
        <img 
          src={computeImg} 
          alt="Compute" 
          className="absolute top-1/3 right-1/4 w-28 h-28 object-contain"
        />
        <img 
          src={cacheImg} 
          alt="Cache" 
          className="absolute bottom-1/3 left-1/4 w-20 h-20 object-contain"
        />
        <img 
          src={loadBalancerImg} 
          alt="Load Balancer" 
          className="absolute top-1/4 left-1/2 w-24 h-24 object-contain"
        />
        
        {/* Connection lines between tech assets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line 
            x1="20%" y1="30%" 
            x2="50%" y2="25%" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <line 
            x1="50%" y1="25%" 
            x2="75%" y2="40%" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <line 
            x1="25%" y1="65%" 
            x2="75%" y2="75%" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      {/* Slider Handle */}
      <div 
        className={sliderClasses}
        style={{ left: `${position}%` }}
      />

      {/* Labels */}
      {showLabels && (
        <>
          <div className="absolute top-4 left-4 z-20">
            <h3 className="text-white text-2xl font-bold drop-shadow-lg">
              {leftLabel}
            </h3>
            <p className="text-white/80 text-sm drop-shadow">
              Where problems grow wild
            </p>
          </div>
          <div className="absolute top-4 right-4 z-20 text-right">
            <h3 className="text-white text-2xl font-bold drop-shadow-lg">
              {rightLabel}
            </h3>
            <p className="text-white/80 text-sm drop-shadow">
              Where solutions scale
            </p>
          </div>
        </>
      )}
    </div>
  );
};