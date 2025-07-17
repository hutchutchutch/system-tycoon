import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import styles from './ComponentNode.module.css';

export interface ComponentNodeData {
  label: string;
  type: string;
  cost?: number;
  icon?: string;
  isSelected?: boolean;
  selectedBy?: string;
}

export const ComponentNode = memo(({ data, selected }: NodeProps<ComponentNodeData>) => {
  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      'web-server': '🖥️',
      'database': '🗄️',
      'cache': '⚡',
      'load-balancer': '⚖️',
      'message-queue': '📬',
      'cdn': '🌐',
    };
    return icons[type] || '📦';
  };

  return (
    <div className={`${styles.componentNode} ${selected ? styles.selected : ''} ${data.isSelected ? styles.collaboratorSelected : ''}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      
      <div className={styles.nodeContent}>
        <span className={styles.icon}>{data.icon || getIcon(data.type)}</span>
        <div className={styles.label}>{data.label}</div>
        {data.cost && (
          <div className={styles.cost}>${data.cost}/mo</div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      
      {data.isSelected && data.selectedBy && (
        <div className={styles.selectionIndicator} />
      )}
    </div>
  );
});

ComponentNode.displayName = 'ComponentNode'; 