import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Load Balancer' },
    position: { x: 100, y: 100 },
    style: { background: '#4f46e5', color: 'white' },
  },
  {
    id: '2',
    data: { label: 'Web Server' },
    position: { x: 300, y: 100 },
    style: { background: '#059669', color: 'white' },
  },
  {
    id: '3',
    data: { label: 'Database' },
    position: { x: 500, y: 100 },
    style: { background: '#dc2626', color: 'white' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export const SystemDesignCanvas: React.FC = () => {
  const { scenarioId } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-full bg-gray-900 text-white">
      <div className="h-full flex">
        {/* Component Drawer */}
        <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <div className="space-y-2">
            <div className="p-3 bg-gray-700 rounded cursor-move">
              Web Server
            </div>
            <div className="p-3 bg-gray-700 rounded cursor-move">
              Database
            </div>
            <div className="p-3 bg-gray-700 rounded cursor-move">
              Load Balancer
            </div>
            <div className="p-3 bg-gray-700 rounded cursor-move">
              API Gateway
            </div>
            <div className="p-3 bg-gray-700 rounded cursor-move">
              Cache
            </div>
            <div className="p-3 bg-gray-700 rounded cursor-move">
              Compute
            </div>
          </div>
        </div>
        
        {/* Main Canvas */}
        <div className="flex-1 relative">
          <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
            <div className="bg-gray-800 px-4 py-2 rounded">
              Timer: 15:00
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded">
              Budget: $0 / $200
            </div>
          </div>
          
          <div className="h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              className="bg-gray-800"
            >
              <Controls />
              <MiniMap 
                className="bg-gray-700"
                nodeColor="#4f46e5"
                maskColor="rgba(0, 0, 0, 0.5)"
              />
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            </ReactFlow>
          </div>
        </div>
        
        {/* Mentor Assistant */}
        <div className="w-80 bg-gray-800 p-4 border-l border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Mentor Guidance</h2>
          <p className="text-gray-400">
            Your selected mentor's advice will appear here
          </p>
        </div>
      </div>
    </div>
  );
};