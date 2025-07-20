import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CursorManager } from '../CursorManager';
import { ParticipantsList } from '../../molecules/ParticipantsList';
import { useRealtimeCollaboration } from '../../../hooks/useRealtimeCollaboration';
import { realtimeCollaborationService } from '../../../services/realtimeCollaboration';
import type { SystemDesignCanvasProps } from './SystemDesignCanvas.types';
import { ComponentNode } from './nodes/ComponentNode';
import styles from './SystemDesignCanvas.module.css';

// Define custom node types
  const nodeTypes = {
    component: ComponentNode,
  };

// Component styling based on type
const getNodeStyle = (type: string) => {
  const styles: Record<string, any> = {
    'web-server': { backgroundColor: '#e3f2fd', borderColor: '#1976d2' },
    'database': { backgroundColor: '#f3e5f5', borderColor: '#7b1fa2' },
    'cache': { backgroundColor: '#fff3e0', borderColor: '#f57c00' },
    'load-balancer': { backgroundColor: '#e8f5e9', borderColor: '#388e3c' },
    'message-queue': { backgroundColor: '#fce4ec', borderColor: '#c2185b' },
    'cdn': { backgroundColor: '#e0f2f1', borderColor: '#00897b' },
  };
  return styles[type] || { backgroundColor: '#f5f5f5', borderColor: '#9e9e9e' };
};

export const SystemDesignCanvas: React.FC<SystemDesignCanvasProps> = ({
  projectId,
  requirements,
  budget,
  onValidate,
  sessionId,
  isCollaborative = false,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isSessionReady, setIsSessionReady] = useState(false);

  // Realtime collaboration hook
  const {
    collaborationState,
    isConnected,
    trackCursor,
    updateSelection,
    broadcastNodeUpdate,
    broadcastEdgeUpdate,
    broadcastNodeDeletion,
    broadcastEdgeDeletion,
  } = useRealtimeCollaboration(sessionId || '');

  // Load session state when joining
  useEffect(() => {
    if (sessionId && isCollaborative) {
      loadSessionState();
    } else {
      setIsSessionReady(true);
    }
  }, [sessionId, isCollaborative]);

  const loadSessionState = async () => {
    try {
      const session = await realtimeCollaborationService.joinSession(sessionId!);
      if (session.canvas_state) {
        setNodes(session.canvas_state.nodes || []);
        setEdges(session.canvas_state.edges || []);
      }
      setIsSessionReady(true);
    } catch (error) {
      console.error('Failed to load session:', error);
      setIsSessionReady(true);
    }
  };

  // Handle mouse movement for cursor tracking
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isCollaborative || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    trackCursor({ x, y, timestamp: Date.now() });
  }, [isCollaborative, trackCursor]);

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

      // Broadcast to collaborators
      if (isCollaborative) {
        broadcastNodeUpdate(newNode);
        realtimeCollaborationService.upsertComponent({
          session_id: sessionId!,
          component_id: newNode.id,
          component_type: type,
          position,
          data: newNode.data,
          style: newNode.style,
        });
      }
    },
    [isCollaborative, sessionId, broadcastNodeUpdate]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle node changes with collaboration
  const handleNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);

      if (!isCollaborative) return;

      changes.forEach((change) => {
        if (change.type === 'remove') {
          broadcastNodeDeletion(change.id);
          realtimeCollaborationService.logAction(sessionId!, 'node_deleted', { nodeId: change.id });
        } else if (change.type === 'position' && change.position) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            const updatedNode = { ...node, position: change.position };
            broadcastNodeUpdate(updatedNode);
            realtimeCollaborationService.upsertComponent({
              session_id: sessionId!,
              component_id: node.id,
              component_type: node.data.type,
              position: change.position,
              data: node.data,
              style: node.style,
            });
          }
        }
      });
    },
    [isCollaborative, sessionId, nodes, onNodesChange, broadcastNodeUpdate, broadcastNodeDeletion]
  );

  // Handle edge changes with collaboration
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);

      if (!isCollaborative) return;

      changes.forEach((change) => {
        if (change.type === 'remove') {
          broadcastEdgeDeletion(change.id);
          realtimeCollaborationService.deleteConnection(sessionId!, change.id);
        }
      });
    },
    [isCollaborative, sessionId, onEdgesChange, broadcastEdgeDeletion]
  );

  // Handle connections
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge = { ...params, id: `edge-${Date.now()}` } as Edge;
      setEdges((eds) => addEdge(newEdge, eds));

      if (isCollaborative && params.source && params.target) {
        broadcastEdgeUpdate(newEdge);
        realtimeCollaborationService.upsertConnection({
          session_id: sessionId!,
          connection_id: newEdge.id,
          source_component_id: params.source,
          target_component_id: params.target,
          connection_type: params.sourceHandle || 'default',
          style: {},
        });
      }
    },
    [isCollaborative, sessionId, setEdges, broadcastEdgeUpdate]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (isCollaborative) {
        updateSelection([node.id]);
        realtimeCollaborationService.updateComponentSelection(sessionId!, node.id, true);
      }
    },
    [isCollaborative, sessionId, updateSelection]
  );

  // Handle validation
  const handleValidate = useCallback(() => {
    const isValid = nodes.length > 0 && edges.length > 0;
    onValidate?.(isValid);
    return isValid;
  }, [nodes, edges, onValidate]);

  // Listen for realtime updates
  useEffect(() => {
    if (!isCollaborative || !isConnected) return;

    // Subscribe to node updates from collaborators
    const handleRemoteNodeUpdate = (node: Node) => {
      setNodes((nds) => {
        const existingIndex = nds.findIndex((n) => n.id === node.id);
        if (existingIndex >= 0) {
          const updated = [...nds];
          updated[existingIndex] = node;
          return updated;
        }
        return [...nds, node];
      });
    };

    const handleRemoteNodeDeletion = (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    };

    const handleRemoteEdgeUpdate = (edge: Edge) => {
      setEdges((eds) => {
        const existingIndex = eds.findIndex((e) => e.id === edge.id);
        if (existingIndex >= 0) {
          const updated = [...eds];
          updated[existingIndex] = edge;
          return updated;
        }
        return [...eds, edge];
      });
    };

    const handleRemoteEdgeDeletion = (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    };

    // Set up event listeners (these would be implemented in the hook)
    // For now, we'll use the collaborationState to sync

    return () => {
      // Cleanup
    };
  }, [isCollaborative, isConnected, setNodes, setEdges]);

  if (!isSessionReady) {
    return <div className={styles.loading}>Loading session...</div>;
  }

  return (
    <div className={styles.canvasContainer} ref={canvasRef}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onMouseMove={handleMouseMove}
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
          
          {isCollaborative && (
            <>
              <Panel position="top-right" className={styles.collaborationPanel}>
                <ParticipantsList participants={collaborationState.participants} />
              </Panel>
              
              <Panel position="bottom-right">
                <button onClick={handleValidate} className={styles.validateButton}>
                  Validate Design
                </button>
              </Panel>
            </>
          )}
        </ReactFlow>
        
        {isCollaborative && (
          <CursorManager
            cursors={collaborationState.cursors}
            participants={collaborationState.participants}
            canvasRef={canvasRef}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};