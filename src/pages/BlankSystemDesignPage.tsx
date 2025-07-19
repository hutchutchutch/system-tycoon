import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  Handle,
  Position,
  useReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import type { Connection, Node, NodeProps, Edge } from '@xyflow/react';
import { Users, Server, Database, Zap, Box, HardDrive, Globe, Shield, BarChart3, Building2, Lightbulb } from 'lucide-react';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { useTheme } from '../contexts/ThemeContext';
import '@xyflow/react/dist/style.css';
import styles from './InitialExperience/CrisisSystemDesignCanvas.module.css';

// Types
interface CustomNodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  description?: string;
  category?: string;
  color?: string;
}

// Icon mapping utility
const getIconComponent = (iconType: string, size: number = 20) => {
  const iconMap = {
    users: Users,
    server: Server,
    database: Database,
    zap: Zap,
    box: Box,
    'hard-drive': HardDrive,
    globe: Globe,
    shield: Shield,
    'bar-chart-3': BarChart3,
  };
  
  const IconComponent = iconMap[iconType as keyof typeof iconMap] || Server;
  return <IconComponent size={size} />;
};

// Custom Node Component
const CustomNode: React.FC<NodeProps<Node<CustomNodeData>>> = React.memo(({ data, selected, isConnectable, id }) => {
  const getCategoryClass = (category?: string) => {
    const categoryMap: Record<string, string> = {
      'compute': 'compute-node',
      'database': 'database-node',
      'storage': 'storage-node',
      'network': 'network-node',
      'networking': 'network-node',
      'security': 'security-node',
      'stakeholder': 'user-node',
      'monitoring': 'monitoring-node',
      'analytics': 'analytics-node'
    };
    return categoryMap[category || ''] || 'default-node';
  };

  return (
    <div className={`${styles.customNode} ${styles[getCategoryClass(data.category)]} ${selected ? styles.selected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        className={styles.nodeHandle}
        isConnectable={isConnectable}
      />
      
      <div className={styles.nodeIcon}>
        {getIconComponent(data.icon)}
      </div>
      
      <div className={styles.nodeContent}>
        <div className={styles.nodeTitle}>{data.label}</div>
        {data.description && (
          <div className={styles.nodeSubtitle}>{data.description}</div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className={styles.nodeHandle}
        isConnectable={isConnectable}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

const BlankSystemDesignCanvasInner: React.FC = () => {
  const { theme } = useTheme();
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [showInputModal, setShowInputModal] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [projectTitle, setProjectTitle] = useState('');

  // Memoized node types
  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
  }), []);

  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return;
    if (params.source === params.target) return;
    
    const edgeExists = edges.some(edge => 
      (edge.source === params.source && edge.target === params.target) ||
      (edge.source === params.target && edge.target === params.source)
    );
    
    if (!edgeExists) {
      setEdges((eds) => addEdge(params, eds));
    }
  }, [edges, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    // For now, just a placeholder - no component library integration
  }, []);

  const handleStartDesign = () => {
    if (userInput.trim()) {
      setProjectTitle(userInput);
      setShowInputModal(false);
    }
  };

  const handleShowInputModal = () => {
    setShowInputModal(true);
  };

  return (
    <div className={styles.crisisCanvas}>
      <div className={styles.canvasContainer}>
        <div className={styles.reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            multiSelectionKeyCode={["Meta", "Control"]}
            fitView
            fitViewOptions={{
              padding: 0.5,
              includeHiddenNodes: false,
              maxZoom: 0.8
            }}
            colorMode={theme}
            defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
            minZoom={0.2}
            maxZoom={2}
            className={styles.reactFlow}
            deleteKeyCode={["Backspace", "Delete"]}
            panOnScroll={false}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            nodeOrigin={[0.5, 0.5]}
            panOnDrag={true}
            selectionOnDrag={false}
            elementsSelectable={true}
            nodesDraggable={true}
            nodesConnectable={true}
            isValidConnection={(connection) => {
              if (!connection.source || !connection.target) return false;
              if (connection.source === connection.target) return false;
              
              const edgeExists = edges.some(edge => 
                (edge.source === connection.source && edge.target === connection.target) ||
                (edge.source === connection.target && edge.target === connection.source)
              );
              
              return !edgeExists;
            }}
          >
            <Background 
              variant={BackgroundVariant.Lines} 
              gap={16} 
              color={theme === 'dark' ? '#1a1a1a' : '#e0e0e0'}
              lineWidth={0.5}
            />
            <Controls className={styles.reactFlowControls} />
            <MiniMap className={styles.reactFlowMinimap} />
          </ReactFlow>
        </div>

        {/* Project Title Display */}
        {projectTitle && (
          <div className={styles.projectTitleOverlay}>
            <h2 className={styles.projectTitle}>Building: {projectTitle}</h2>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleShowInputModal}
              className={styles.changeProjectButton}
            >
              Change Project
            </Button>
          </div>
        )}

        {/* Input Modal */}
        {showInputModal && (
          <div className={styles.inputModalOverlay}>
            <div className={styles.inputModalContent}>
              <div className={styles.modalHeader}>
                <div className={styles.iconContainer}>
                  <Building2 size={48} className={styles.buildingIcon} />
                  <Lightbulb size={32} className={styles.ideaIcon} />
                </div>
                
                <h1 className={styles.modalTitle}>System Design Canvas</h1>
                <p className={styles.modalSubtitle}>
                  Tell us what you want to build, and we'll help you design the system architecture
                </p>
              </div>
              
              <div className={styles.inputSection}>
                <Input
                  type="text"
                  placeholder="e.g., A social media platform, An e-commerce website, A real-time chat app..."
                  value={userInput}
                  onChange={(value) => setUserInput(value)}
                  className={styles.projectInput}
                />
                <Button
                  onClick={handleStartDesign}
                  disabled={!userInput.trim()}
                  className={styles.startButton}
                >
                  Start Designing
                </Button>
              </div>
              
              <div className={styles.exampleProjects}>
                <p className={styles.examplesLabel}>Popular project ideas:</p>
                <div className={styles.exampleChips}>
                  <button 
                    className={styles.exampleChip}
                    onClick={() => setUserInput('A real-time messaging application')}
                  >
                    Messaging App
                  </button>
                  <button 
                    className={styles.exampleChip}
                    onClick={() => setUserInput('An e-commerce platform with inventory management')}
                  >
                    E-commerce Platform
                  </button>
                  <button 
                    className={styles.exampleChip}
                    onClick={() => setUserInput('A social media platform with user feeds')}
                  >
                    Social Media
                  </button>
                  <button 
                    className={styles.exampleChip}
                    onClick={() => setUserInput('A video streaming service')}
                  >
                    Video Streaming
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export wrapped with ReactFlowProvider
export const BlankSystemDesignPage: React.FC = () => (
  <ReactFlowProvider>
    <BlankSystemDesignCanvasInner />
  </ReactFlowProvider>
); 