import React from 'react';
import { useReactFlow, useNodes, getSimpleBezierPath } from '@xyflow/react';
import type { ConnectionLineComponentProps } from '@xyflow/react';
import styles from './MultiConnectionLine.module.css';

export const MultiConnectionLine: React.FC<ConnectionLineComponentProps> = ({ 
  toX, 
  toY 
}) => {
  const { getInternalNode } = useReactFlow();
  const nodes = useNodes();
  
  // Get all selected nodes
  const selectedNodes = nodes.filter((node) => node.selected);
  
  // If no nodes are selected, don't render anything
  if (selectedNodes.length === 0) {
    return null;
  }
  
  // Get all source handles from selected nodes
  const handleBounds = selectedNodes.flatMap((userNode) => {
    const node = getInternalNode(userNode.id);
    
    // Check if the node has source handles
    if (!node || !node.internals.handleBounds?.source) {
      return [];
    }
    
    // Map each source handle
    return node.internals.handleBounds.source.map((bounds) => ({
      nodeId: node.id,
      positionAbsolute: node.internals.positionAbsolute,
      bounds,
    }));
  });
  
  // Draw a connection line from each source handle to the cursor
  return (
    <g>
      {handleBounds.map(({ nodeId, positionAbsolute, bounds }, index) => {
        // Calculate the center position of the handle
        const fromHandleX = bounds.x + bounds.width / 2;
        const fromHandleY = bounds.y + bounds.height / 2;
        
        // Calculate absolute position
        const fromX = positionAbsolute.x + fromHandleX;
        const fromY = positionAbsolute.y + fromHandleY;
        
        // Create bezier path
        const [d] = getSimpleBezierPath({
          sourceX: fromX,
          sourceY: fromY,
          targetX: toX,
          targetY: toY,
        });
        
        return (
          <g key={`${nodeId}-${bounds.id || index}`}>
            {/* Connection path */}
            <path 
              d={d} 
              className={styles.connectionPath}
            />
          </g>
        );
      })}
      
      {/* Cursor indicator - only show once */}
      <circle 
        cx={toX} 
        cy={toY} 
        r={4} 
        className={styles.cursorIndicator}
      />
    </g>
  );
};