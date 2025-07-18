import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { Node, Edge, Connection, NodeProps } from '@xyflow/react';
import { User, Shield, Server, Database } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import './AuthFlowDiagram.css';

interface AuthFlowDiagramProps {
  isAnimating: boolean;
  isLoading: boolean;
}

// Component types with colors
const componentColors = {
  user: '#3b82f6',      // Blue - User/Client
  network: '#eab308',   // Yellow - Network
  compute: '#22c55e',   // Green - Compute
  storage: '#a855f7',   // Purple - Storage
  security: '#8b5cf6',  // Purple - Security
};

// Custom node components
const UserNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={`custom-node user-node ${data.animated ? 'animated' : ''}`}>
      <div className="node-icon">
        <User size={24} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title}</div>
        <div className="node-subtitle">{data.subtitle}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const NetworkNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={`custom-node network-node ${data.animated ? 'animated' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-icon">
        <Server size={24} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title}</div>
        <div className="node-subtitle">{data.subtitle}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const SecurityNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={`custom-node security-node ${data.animated ? 'animated' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-icon">
        <Shield size={24} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title}</div>
        <div className="node-subtitle">{data.subtitle}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const ComputeNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={`custom-node compute-node ${data.animated ? 'animated' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-icon">
        <Server size={24} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title}</div>
        <div className="node-subtitle">{data.subtitle}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const StorageNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={`custom-node storage-node ${data.animated ? 'animated' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-icon">
        <Database size={24} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title}</div>
        <div className="node-subtitle">{data.subtitle}</div>
      </div>
    </div>
  );
};

const nodeTypes = {
  userNode: UserNode,
  networkNode: NetworkNode,
  securityNode: SecurityNode,
  computeNode: ComputeNode,
  storageNode: StorageNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'userNode',
    position: { x: 300, y: 50 },
    data: { 
      title: 'User',
      subtitle: 'Submits credentials',
      animated: false,
      step: 1
    },
  },
  {
    id: '2',
    type: 'networkNode',
    position: { x: 150, y: 180 },
    data: { 
      title: 'Load Balancer',
      subtitle: 'Distributes requests',
      animated: false,
      step: 2
    },
  },
  {
    id: '3',
    type: 'securityNode',
    position: { x: 450, y: 180 },
    data: { 
      title: 'Firewall',
      subtitle: 'Security filtering',
      animated: false,
      step: 3
    },
  },
  {
    id: '4',
    type: 'networkNode',
    position: { x: 300, y: 310 },
    data: { 
      title: 'API Gateway',
      subtitle: 'Request routing & rate limiting',
      animated: false,
      step: 4
    },
  },
  {
    id: '5',
    type: 'computeNode',
    position: { x: 300, y: 440 },
    data: { 
      title: 'Auth Service',
      subtitle: 'Validates credentials & generates tokens',
      animated: false,
      step: 5
    },
  },
  {
    id: '6',
    type: 'storageNode',
    position: { x: 150, y: 570 },
    data: { 
      title: 'Cache',
      subtitle: 'Fast session lookups',
      animated: false,
      step: 6
    },
  },
  {
    id: '7',
    type: 'storageNode',
    position: { x: 450, y: 570 },
    data: { 
      title: 'Database',
      subtitle: 'User data storage',
      animated: false,
      step: 6
    },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 2 },
    label: '1'
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3', 
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 2 },
    label: '1'
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 2 },
    label: '2'
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4', 
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 2 },
    label: '3'
  },
  { 
    id: 'e4-5', 
    source: '4', 
    target: '5', 
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 2 },
    label: '4'
  },
  { 
    id: 'e5-6', 
    source: '5', 
    target: '6', 
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 2 },
    label: '5'
  },
  { 
    id: 'e5-7', 
    source: '5', 
    target: '7', 
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 2 },
    label: '6'
  },
];

export const AuthFlowDiagram: React.FC<AuthFlowDiagramProps> = ({ isAnimating, isLoading }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentStep, setCurrentStep] = useState(0);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const animateFlow = () => {
        let step = 0;
        const maxSteps = 7;
        
        const interval = setInterval(() => {
          if (step <= maxSteps) {
            setCurrentStep(step);
            
            // Animate nodes
            setNodes((nds) =>
              nds.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  animated: node.data.step <= step,
                },
              }))
            );

            // Animate edges
            setEdges((eds) =>
              eds.map((edge) => ({
                ...edge,
                animated: parseInt(String(edge.label) || '0') <= step,
                style: {
                  ...edge.style,
                  stroke: parseInt(String(edge.label) || '0') <= step ? '#22c55e' : '#64748b',
                  strokeWidth: parseInt(String(edge.label) || '0') <= step ? 3 : 2,
                },
              }))
            );

            step++;
          } else {
            clearInterval(interval);
          }
        }, 500);

        return () => clearInterval(interval);
      };

      animateFlow();
    } else {
      // Reset animation
      setCurrentStep(0);
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            animated: false,
          },
        }))
      );
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          animated: false,
          style: {
            ...edge.style,
            stroke: '#64748b',
            strokeWidth: 2,
          },
        }))
      );
    }
  }, [isAnimating, setNodes, setEdges]);

  return (
    <div className="auth-flow-diagram">
      <div className="diagram-header">
        <h2 className="diagram-title">Authentication System Architecture</h2>
      </div>
      
      {isAnimating && (
        <div className="animation-status">
          <div className="status-indicator">
            <div className="pulse-dot" />
            <span>Processing Step {currentStep}</span>
          </div>
        </div>
      )}

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="auth-flow"
        >
          <Controls />
          <Background color="#1f2937" gap={20} />
        </ReactFlow>
      </div>

      <div className="diagram-legend">
        <h3>Component Categories</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color user"></div>
            <span>🔵 User/Client</span>
          </div>
          <div className="legend-item">
            <div className="legend-color network"></div>
            <span>🟡 Network</span>
          </div>
          <div className="legend-item">
            <div className="legend-color compute"></div>
            <span>🟢 Compute</span>
          </div>
          <div className="legend-item">
            <div className="legend-color storage"></div>
            <span>🟣 Storage</span>
          </div>
          <div className="legend-item">
            <div className="legend-color security"></div>
            <span>🟣 Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 