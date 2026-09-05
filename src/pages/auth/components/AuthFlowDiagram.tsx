import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { Node, Edge, Connection, NodeProps } from '@xyflow/react';
import { User, Server, Database } from 'lucide-react';
import { useAppSelector } from '../../../hooks/redux';
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
    <div className={`custom-node auth-service-node ${data.animated ? 'animated' : ''} ${data.success ? 'success' : ''} ${data.error ? 'error' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-icon">
        <Server size={18} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title as string}</div>
        <div className="node-subtitle">{data.subtitle as string}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
};

const DatabaseNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={`custom-node database-node ${data.animated ? 'animated' : ''} ${data.success ? 'success' : ''} ${data.error ? 'error' : ''}`}>
      <Handle type="target" position={Position.Top} id="top" />
      <div className="node-icon">
        <Database size={18} />
      </div>
      <div className="node-content">
        <div className="node-title">{data.title as string}</div>
        <div className="node-subtitle">{data.subtitle as string}</div>
      </div>
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
    position: { x: 400, y: 250 },
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
    position: { x: 750, y: 250 },
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
    position: { x: 750, y: 450 },
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
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 2 },
    data: { phase: 'right' }
  },
];

export const AuthFlowDiagram: React.FC<AuthFlowDiagramProps> = ({
  onAuthSuccess
}) => {
  const { error: authError, isAuthenticated } = useAppSelector((state) => state.auth);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [animationPhase, setAnimationPhase] = useState<'none' | 'left' | 'right' | 'success' | 'error'>('none');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasDatabaseError, setHasDatabaseError] = useState(false);
  const [hasAuthServiceError, setHasAuthServiceError] = useState(false);

  // Animation trigger callbacks
  const handleAnimationStart = useCallback(() => {
    setIsAnimating(true);
    setAnimationPhase('left');
    setHasDatabaseError(false); // Reset database error state
    setHasAuthServiceError(false); // Reset auth service error state
  }, []);

  const handleDatabaseError = useCallback(() => {
    setHasDatabaseError(true);
    setAnimationPhase('error');
    setIsAnimating(false);
  }, []);

  const handleAuthServiceError = useCallback(() => {
    setHasAuthServiceError(true);
    setAnimationPhase('error');
    setIsAnimating(false);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

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
  }, [animationPhase, setEdges, setNodes]);

  useEffect(() => {
    if (animationPhase === 'right') {
      const animateRightPhase = () => {
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
  }, [animationPhase, setEdges]);

  useEffect(() => {
    if (animationPhase === 'success') {
      // Double-check no auth error before proceeding
      if (authError) {
        console.warn('Auth error present, preventing success animation');
        setAnimationPhase('error');
        return;
      }

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
  }, [animationPhase, onAuthSuccess, authError, setNodes]);

  // Handle authentication service error state
  useEffect(() => {
    if (animationPhase === 'error' && hasAuthServiceError) {
      // Highlight auth service node in red
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === '2' && node.type === 'authServiceNode') {
            return {
              ...node,
              data: {
                ...node.data,
                error: true,
                animated: false,
                success: false,
              },
            };
          }
          return node;
        })
      );

      // Make auth service edge red (AuthCard to Auth Service)
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === 'e1-2') {
            return {
              ...edge,
              animated: false,
              style: {
                ...edge.style,
                stroke: '#ef4444',
                strokeWidth: 3,
              },
            };
          }
          return edge;
        })
      );
    }
  }, [animationPhase, hasAuthServiceError, setEdges, setNodes]);

  // Handle database error state
  useEffect(() => {
    if (animationPhase === 'error' && hasDatabaseError) {
      // Highlight database node in red
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === '3' && node.type === 'databaseNode') {
            return {
              ...node,
              data: {
                ...node.data,
                error: true,
                animated: false,
                success: false,
              },
            };
          }
          return node;
        })
      );

      // Make database edge red
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === 'e2-3') {
            return {
              ...edge,
              animated: false,
              style: {
                ...edge.style,
                stroke: '#ef4444',
                strokeWidth: 3,
              },
            };
          }
          return edge;
        })
      );
    }
  }, [animationPhase, hasDatabaseError, setEdges, setNodes]);

  // Handle successful authentication
  useEffect(() => {
    if (!isAuthenticated || hasDatabaseError || hasAuthServiceError || authError) {
      return;
    }

    if (animationPhase === 'none') {
      // Fresh auth with no animation in flight — e.g., returning from Google
      // OAuth, or a restored session on page load. Play the full sequence
      // (AuthCard → AuthService → Database → flash green) so the user sees
      // the handshake visualization.
      setIsAnimating(true);
      setAnimationPhase('left');
    } else if (animationPhase !== 'success' && animationPhase !== 'error') {
      // Animation already in flight (e.g., email/password submission in
      // progress). Jump ahead to the success flash.
      setAnimationPhase('success');
    }
  }, [isAuthenticated, hasDatabaseError, hasAuthServiceError, authError, animationPhase]);

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
              onSuccess: onAuthSuccess,
              onAnimationStart: handleAnimationStart,
              onDatabaseError: handleDatabaseError,
              onAuthServiceError: handleAuthServiceError,
            },
          };
        }
        return node;
      })
    );
  }, [authError, onAuthSuccess, handleAnimationStart, handleDatabaseError, handleAuthServiceError, setNodes]);

  // Reset animation when not animating
  useEffect(() => {
    if (!isAnimating && !hasDatabaseError && !hasAuthServiceError) {
      setAnimationPhase('none');
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            animated: false,
            success: false,
            error: false, // Reset error state
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
  }, [isAnimating, hasDatabaseError, hasAuthServiceError, setEdges, setNodes]);

  // Reset error states when authentication error is cleared
  useEffect(() => {
    if (!authError && (hasDatabaseError || hasAuthServiceError)) {
      setHasDatabaseError(false);
      setHasAuthServiceError(false);
      setAnimationPhase('none');

      // Reset all nodes to normal state
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            error: false,
            animated: false,
            success: false,
          },
        }))
      );

      // Reset all edges to normal state
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
  }, [authError, hasDatabaseError, hasAuthServiceError, setEdges, setNodes]);

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
          fitViewOptions={{ padding: 0.3 }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.65 }}
          className="auth-flow"
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
        >
          <Background color="transparent" gap={20} size={0} />
        </ReactFlow>
      </div>
    </div>
  );
};
