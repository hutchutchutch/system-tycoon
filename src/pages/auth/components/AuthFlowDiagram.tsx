import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { Node, Edge, Connection, NodeProps } from '@xyflow/react';
import { User, Server, Database } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { signInWithEmail, signUpWithEmail, clearError } from '../../../features/auth/authSlice';
import { Requirements } from '../../../components/molecules/Requirements';
import { AuthCardNode } from '../../../components/organisms/AuthCard/AuthCard';
import '@xyflow/react/dist/style.css';
import './AuthFlowDiagram.css';

interface AuthFlowDiagramProps {
  onAuthSuccess?: () => void;
}

// Custom node components
const UserNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={`custom-node user-node ${data.animated ? 'animated' : ''} ${data.success ? 'success' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-icon">
        <User size={18} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title as string}</div>
        <div className="node-subtitle">{data.subtitle as string}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const AuthServiceNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={`custom-node auth-service-node ${data.animated ? 'animated' : ''} ${data.success ? 'success' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-icon">
        <Server size={18} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title as string}</div>
        <div className="node-subtitle">{data.subtitle as string}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const DatabaseNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={`custom-node database-node ${data.animated ? 'animated' : ''} ${data.success ? 'success' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-icon">
        <Database size={18} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title as string}</div>
        <div className="node-subtitle">{data.subtitle as string}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const nodeTypes = {
  userNode: UserNode,
  authServiceNode: AuthServiceNode,
  databaseNode: DatabaseNode,
  authCardNode: AuthCardNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'authCardNode',
    position: { x: 50, y: 200 },
    data: { 
      error: undefined,
      onSignIn: undefined,
      onSignUp: undefined,
      animated: false,
      success: false,
      step: 1
    },
  },
  {
    id: '2',
    type: 'authServiceNode',
    position: { x: 400, y: 500 },
    data: { 
      title: 'Authentication Service',
      subtitle: 'Validates credentials',
      animated: false,
      success: false,
      step: 2
    },
  },
  {
    id: '3',
    type: 'databaseNode',
    position: { x: 600, y: 500 },
    data: { 
      title: 'Database',
      subtitle: 'User data storage',
      animated: false,
      success: false,
      step: 3
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
    data: { phase: 'left' }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 2 },
    data: { phase: 'right' }
  },
];

const authRequirements = [
  { id: '1', description: 'Validate user inputs', completed: false },
  { id: '2', description: 'Route to auth service', completed: false },
  { id: '3', description: 'Authenticate', completed: false },
];

export const AuthFlowDiagram: React.FC<AuthFlowDiagramProps> = ({ 
  onAuthSuccess
}) => {
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  
  const handleSignIn = useCallback(async (email: string, password: string) => {
    const result = await dispatch(signInWithEmail({ email, password }));
    if (signInWithEmail.fulfilled.match(result) && onAuthSuccess) {
      onAuthSuccess();
    }
  }, [dispatch, onAuthSuccess]);

  const handleSignUp = useCallback(async (email: string, password: string, username: string) => {
    const result = await dispatch(signUpWithEmail({ email, password, username }));
    if (signUpWithEmail.fulfilled.match(result) && onAuthSuccess) {
      onAuthSuccess();
    }
  }, [dispatch, onAuthSuccess]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [requirements, setRequirements] = useState(authRequirements);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'none' | 'left' | 'right' | 'success'>('none');
  const [isAnimating, setIsAnimating] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleRunTest = () => {
    // This will be called when Requirements "Run Test" is clicked
    // For now, we'll just trigger the left animation phase
    setAnimationPhase('left');
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating && animationPhase === 'none') {
      setAnimationPhase('left');
    }
  }, [isAnimating, animationPhase]);

  useEffect(() => {
    if (animationPhase === 'left') {
      const animateLeftPhase = () => {
        let step = 0;
        const maxSteps = 2; // Two nodes in left phase
        
        const interval = setInterval(() => {
          if (step <= maxSteps) {
            setCurrentStep(step);
            
            // Update requirements
            setRequirements(prev => prev.map((req, index) => ({
              ...req,
              completed: index < step
            })));
            
            // Animate left edges and nodes
            setNodes((nds) =>
              nds.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  animated: (node.data.step as number) <= step,
                },
              }))
            );

            // Animate left edges only
            setEdges((eds) =>
              eds.map((edge) => ({
                ...edge,
                animated: edge.data?.phase === 'left' && step >= 1,
                style: {
                  ...edge.style,
                  stroke: edge.data?.phase === 'left' && step >= 1 ? '#22c55e' : '#64748b',
                  strokeWidth: edge.data?.phase === 'left' && step >= 1 ? 3 : 2,
                },
              }))
            );

            step++;
          } else {
            clearInterval(interval);
            // Start right phase after a brief delay
            setTimeout(() => {
              setAnimationPhase('right');
            }, 500);
          }
        }, 800);

        return () => clearInterval(interval);
      };

      animateLeftPhase();
    }
  }, [animationPhase]);

  useEffect(() => {
    if (animationPhase === 'right') {
      const animateRightPhase = () => {
        // Complete the third requirement
        setRequirements(prev => prev.map(req => ({ ...req, completed: true })));

        // Animate right edges
        setEdges((eds) =>
          eds.map((edge) => ({
            ...edge,
            animated: edge.data?.phase === 'right',
            style: {
              ...edge.style,
              stroke: edge.data?.phase === 'right' ? '#22c55e' : edge.style?.stroke,
              strokeWidth: edge.data?.phase === 'right' ? 3 : edge.style?.strokeWidth,
            },
          }))
        );

        // After right animation completes, flash green and transition
        setTimeout(() => {
          setAnimationPhase('success');
        }, 1000);
      };

      animateRightPhase();
    }
  }, [animationPhase]);

  useEffect(() => {
    if (animationPhase === 'success') {
      // Flash all nodes green
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            success: true,
          },
        }))
      );

      // Transition to InitialExperience after flash effect
      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      }, 1500);
    }
  }, [animationPhase, onAuthSuccess]);

  // Update auth card node with functions and error
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1' && node.type === 'authCardNode') {
          return {
            ...node,
            data: {
              ...node.data,
              error: authError,
              onSignIn: handleSignIn,
              onSignUp: handleSignUp,
            },
          };
        }
        return node;
      })
    );
  }, [authError, handleSignIn, handleSignUp]);

  // Reset animation when not animating
  useEffect(() => {
    if (!isAnimating) {
      setAnimationPhase('none');
      setCurrentStep(0);
      setRequirements(authRequirements);
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            animated: false,
            success: false,
            ...(node.id === '1' && node.type === 'authCardNode' 
              ? { 
                  error: authError,
                  onSignIn: handleSignIn,
                  onSignUp: handleSignUp,
                } 
              : {}),
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
  }, [isAnimating, authError, handleSignIn, handleSignUp]);

  return (
    <div className="auth-flow-diagram" style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      display: 'flex'
    }}>
      {/* Main Flow Area */}
      <div className="flow-container" style={{ flex: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          className="auth-flow"
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
        >
          <Background color="transparent" gap={20} size={0} />
        </ReactFlow>
      </div>
      
      {/* Requirements Panel - Right Side */}
      <div className="requirements-container" style={{ 
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '400px',
        padding: '20px', 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000
      }}>
        <Requirements 
          requirements={requirements}
          onRunTest={handleRunTest}
        />
      </div>
    </div>
  );
}; 