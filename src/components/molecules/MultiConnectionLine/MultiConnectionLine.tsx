import React from 'react';
import { getSimpleBezierPath } from '@xyflow/react';
import type { ConnectionLineComponentProps } from '@xyflow/react';
import styles from './MultiConnectionLine.module.css';

export const MultiConnectionLine: React.FC<ConnectionLineComponentProps> = ({ 
  fromX,
  fromY,
  toX, 
  toY,
  fromNode,
  fromHandle,
  fromPosition,
  connectionStatus
}) => {
  // If we don't have the required connection information, don't render anything
  if (fromX === undefined || fromY === undefined || toX === undefined || toY === undefined) {
    return null;
  }

  // Create bezier path from the clicked handle to the cursor
  const [d] = getSimpleBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    sourcePosition: fromPosition,
  });

  // Determine connection line color based on validation status
  const getConnectionClass = () => {
    if (connectionStatus === 'valid') return styles.connectionPathValid;
    if (connectionStatus === 'invalid') return styles.connectionPathInvalid;
    return styles.connectionPath;
  };

  return (
    <g>
      {/* Connection path from the clicked handle to cursor */}
      <path 
        d={d} 
        className={getConnectionClass()}
      />
      
      {/* Cursor indicator */}
      <circle 
        cx={toX} 
        cy={toY} 
        r={4} 
        className={styles.cursorIndicator}
      />
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && fromNode && fromHandle && (
        <text
          x={toX + 10}
          y={toY - 10}
          fontSize="10"
          fill="white"
          style={{ pointerEvents: 'none' }}
        >
          {fromNode.id}:{fromHandle.id || 'default'}
        </text>
      )}
    </g>
  );
};