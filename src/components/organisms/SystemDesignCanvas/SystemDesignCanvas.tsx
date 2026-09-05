import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { SystemDesignCanvasProps } from './SystemDesignCanvas.types';
import { ComponentNode } from './nodes/ComponentNode';
import styles from './SystemDesignCanvas.module.css';

// Define custom node types
  const nodeTypes = {
    component: ComponentNode,
  };

// Component styling based on type
const getNodeStyle = (type: string) => {
  const styles: Record<string, unknown> = {
    'web-server': { backgroundColor: '#e3f2fd', borderColor: '#1976d2' },
    'database': { backgroundColor: '#f3e5f5', borderColor: '#7b1fa2' },
    'cache': { backgroundColor: '#fff3e0', borderColor: '#f57c00' },
    'load-balancer': { backgroundColor: '#e8f5e9', borderColor: '#388e3c' },
    'message-queue': { backgroundColor: '#fce4ec', borderColor: '#c2185b' },
    'cdn': { backgroundColor: '#e0f2f1', borderColor: '#00897b' },
  };
  return styles[type] || { backgroundColor: '#f5f5f5', borderColor: '#9e9e9e' };
};

export const Whiteboard: React.FC<SystemDesignCanvasProps> = ({ onValidate }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Handle node addition (from drag and drop)
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('component-type');
      const componentData = JSON.parse(event.dataTransfer.getData('component-data'));

      if (!type || !canvasRef.current) return;

      const reactFlowBounds = canvasRef.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'component',
        position,
        data: {
          ...componentData,
          label: componentData.name,
          type,
        },
        style: getNodeStyle(type),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle connections
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge = { ...params, id: `edge-${Date.now()}` } as Edge;
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle validation
  const handleValidate = useCallback(() => {
    const isValid = nodes.length > 0 && edges.length > 0;
    onValidate?.(isValid);
    return isValid;
  }, [nodes, edges, onValidate]);

  return (
    <div className={styles.canvasContainer} ref={canvasRef}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          preventScrolling={false}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
        >
          <Background />
          <Controls />
          <MiniMap />

          <Panel position="bottom-right">
            <button onClick={handleValidate} className={styles.validateButton}>
              Validate Design
            </button>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
