import React, { useCallback } from 'react';
import { ReactFlow, ReactFlowProvider, Handle, Position, addEdge, useNodesState, useEdgesState, Controls, Background } from '@xyflow/react';
import type { Node, Edge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Simple test node component
const TestNode = ({ data, id }: any) => {
  return (
    <div style={{
      padding: '10px 20px',
      border: '2px solid #333',
      borderRadius: '8px',
      background: 'white',
      minWidth: '150px',
      textAlign: 'center'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        id={`${id}-input`}
        style={{
          background: '#555',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          top: '-8px'
        }}
      />
      <div>{data.label}</div>
      <div style={{ fontSize: '10px', color: '#666' }}>ID: {id}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-output`}
        style={{
          background: '#555',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          bottom: '-8px'
        }}
      />
    </div>
  );
};

const nodeTypes = {
  test: TestNode
};

const initialNodes: Node[] = [
  {
    id: 'families',
    type: 'test',
    position: { x: 250, y: 50 },
    data: { label: 'Families' }
  },
  {
    id: 'compute',
    type: 'test',
    position: { x: 100, y: 200 },
    data: { label: 'Compute Server' }
  },
  {
    id: 'database',
    type: 'test',
    position: { x: 400, y: 200 },
    data: { label: 'Database' }
  }
];

const ConnectionTestInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Connection) => {
    console.log('🔗 Connection attempt:', {
      source: params.source,
      target: params.target,
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle
    });

    // Log which nodes are being connected
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    console.log('📍 Connecting:', sourceNode?.data.label, '→', targetNode?.data.label);

    setEdges((eds) => addEdge(params, eds));
  }, [setEdges, nodes]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div style={{ padding: '10px', background: '#f0f0f0' }}>
        <h3>Connection Test Instructions:</h3>
        <ol>
          <li>Try dragging from the bottom handle of "Compute Server" to top handle of "Database"</li>
          <li>Check console to see which node is reported as source</li>
          <li>The source should be "Compute Server", not "Families"</li>
        </ol>
      </div>
    </div>
  );
};

export const ConnectionTest = () => (
  <ReactFlowProvider>
    <ConnectionTestInner />
  </ReactFlowProvider>
);