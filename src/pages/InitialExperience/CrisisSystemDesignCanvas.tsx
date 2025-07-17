import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useReactFlow, ReactFlowProvider, useNodes, Handle, Position } from '@xyflow/react';
import type { Connection, Node, Edge, NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AlertTriangle, Server, Database, Users, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Zap, Box, HardDrive, Globe, Shield, BarChart3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { completeStep, updateMetrics } from '../../features/mission/missionSlice';
import { 
  addNode, 
  onNodesChange, 
  onEdgesChange, 
  addEdge, 
  setDraggedComponent,
  selectNodes,
  selectEdges
} from '../../features/design/designSlice';
import { Requirements } from '../../components/molecules';
import { MultiConnectionLine } from '../../components/molecules/MultiConnectionLine';
import { useTheme } from '../../contexts/ThemeContext';
import { missionService, type MissionData, type Requirement } from '../../services/missionService';
import styles from './CrisisSystemDesignCanvas.module.css';

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

// Custom Node Component with proper handles
const CustomNode: React.FC<NodeProps<Node<CustomNodeData>>> = React.memo(({ data, selected }) => {
  return (
    <div className={`${styles.customNode} ${selected ? styles.selected : ''}`}>
      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        style={{
          background: '#555',
          width: 10,
          height: 10,
          border: '2px solid #fff',
        }}
      />
      
      <div className={styles.nodeHeader}>
        {getIconComponent(data.icon)}
        <h4 className={styles.nodeTitle}>{data.label}</h4>
      </div>
      
      {data.description && (
        <p className={styles.nodeDescription}>{data.description}</p>
      )}
      
      {/* Output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        style={{
          background: '#555',
          width: 10,
          height: 10,
          border: '2px solid #fff',
        }}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

// Memoized node types (critical for React Flow performance)
const nodeTypes = {
  custom: CustomNode,
};

interface CrisisSystemDesignCanvasProps {
  missionSlug?: string;
  emailId?: string;
}

const CrisisSystemDesignCanvasInner: React.FC<CrisisSystemDesignCanvasProps> = ({ 
  missionSlug = 'health-tracker-crisis',
  emailId 
}) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const mission = useAppSelector(state => state.mission);
  const nodes = useAppSelector(selectNodes);
  const edges = useAppSelector(selectEdges);
  const draggedComponent = useAppSelector(state => state.design.draggedComponent);
  
  const { screenToFlowPosition } = useReactFlow();
  
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [metrics, setMetrics] = useState({
    reportsSaved: 0,
    familiesHelped: 0,
    uptimePercent: 42,
    dataLost: 47,
    systemHealth: 'critical' as 'critical' | 'warning' | 'healthy'
  });

  // Load mission data using the mission service
  useEffect(() => {
    const loadMissionData = async () => {
      try {
        setLoading(true);
        
        let mission: MissionData | null = null;
        
        // If we have an emailId, load mission from email context
        if (emailId) {
          mission = await missionService.getMissionFromEmail(emailId);
        }
        
        // Fallback to loading by slug
        if (!mission) {
          mission = await missionService.loadMissionBySlug(missionSlug);
        }
        
        if (mission) {
          setActiveMission(mission);
        } else {
          throw new Error('Failed to load mission data');
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load mission data');
      } finally {
        setLoading(false);
      }
    };

    loadMissionData();
  }, [missionSlug, emailId]);

  // Update requirements when nodes/edges change
  useEffect(() => {
    if (activeMission) {
      const validatedRequirements = missionService.validateRequirements(nodes, edges);
      setRequirements(validatedRequirements);
    }
  }, [nodes, edges, activeMission]);

  // Initialize with the families node if not already present
  useEffect(() => {
    if (nodes.length === 0 && !loading && activeMission) {
      dispatch(addNode({
        component: {
          id: 'families',
          name: 'Families',
          type: 'families',
          category: 'stakeholder',
          cost: 0,
          capacity: 200,
          description: 'Affected families trying to report',
          icon: 'users'
        },
        position: { x: 250, y: 50 }
      }));
    }
  }, [nodes.length, dispatch, loading, activeMission]);

  // Transform mission components for the component drawer
  const availableComponents = useMemo(() => {
    if (!activeMission) return [];
    
    return activeMission.components.map(comp => ({
      id: comp.id,
      name: comp.name,
      type: comp.category,
      category: comp.category,
      cost: 50, // Default cost, could be from component_offerings
      capacity: 1000,
      description: comp.short_description,
      icon: comp.icon_name
    }));
  }, [activeMission]);

  const reactFlowNodes = useNodes();
  
  const onConnect = useCallback((params: Connection) => {
    // Get all selected nodes when connection is made
    const selectedNodes = reactFlowNodes.filter(node => node.selected);
    
    // If multiple nodes are selected, create edges from all selected nodes to the target
    if (selectedNodes.length > 1 && params.target) {
      selectedNodes.forEach(node => {
        // Don't create self-connections
        if (node.id !== params.target) {
          dispatch(addEdge({
            ...params,
            source: node.id,
            sourceHandle: 'output',
            targetHandle: 'input'
          }));
        }
      });
    } else {
      // Single connection (default behavior)
      dispatch(addEdge({
        ...params,
        sourceHandle: params.sourceHandle || 'output',
        targetHandle: params.targetHandle || 'input'
      }));
    }
  }, [dispatch, reactFlowNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    // Check if we have a dragged component from data transfer
    const componentData = event.dataTransfer.getData('application/component');
    const componentType = event.dataTransfer.getData('application/reactflow');
    
    if (!componentData && !componentType) return;

    let component: any;
    
    if (componentData) {
      component = JSON.parse(componentData);
    } else if (componentType) {
      // Fallback to finding component by type
      const foundComponent = availableComponents.find(c => c.type === componentType);
      if (!foundComponent) return;
      component = foundComponent;
    } else {
      return;
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    dispatch(addNode({ component, position }));
  }, [screenToFlowPosition, dispatch, availableComponents]);

  const onDragStart = (event: React.DragEvent, component: any) => {
    dispatch(setDraggedComponent(component));
    event.dataTransfer.setData('application/reactflow', component.type);
    event.dataTransfer.setData('application/component', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleRunTest = useCallback(() => {
    const allCompleted = requirements.every(req => req.completed);
    
    if (allCompleted) {
      setShowSuccessMessage(true);
      setMetrics(prev => ({
        ...prev,
        reportsSaved: 200,
        familiesHelped: 200,
        uptimePercent: 99,
        dataLost: 0,
        systemHealth: 'healthy'
      }));
      
      dispatch(updateMetrics({
        totalReportsSaved: 200,
        familiesHelped: 200,
        systemUptime: 99
      }));
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  }, [requirements, dispatch]);

  const toggleDrawer = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  if (loading) {
    return (
      <div className={styles.crisisCanvas}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>Loading mission data...</div>
        </div>
      </div>
    );
  }

  if (error || !activeMission) {
    return (
      <div className={styles.crisisCanvas}>
        <div className={styles.errorContainer}>
          <AlertTriangle size={24} />
          <p>Failed to load mission: {error || 'Mission not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.crisisCanvas}>
      {/* React Flow Canvas - Full Width */}
      <div className={styles.canvasContainer}>
        <div className={styles.reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => dispatch(onNodesChange(changes))}
            onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            connectionLineComponent={MultiConnectionLine}
            multiSelectionKeyCode={["Meta", "Control"]}
            fitView
            colorMode={theme}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            minZoom={0.2}
            maxZoom={2}
          >
            <Background gap={20} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        {/* Floating Component Drawer Card - Top Side */}
        <div className={`${styles.componentDrawerCard} ${isDrawerCollapsed ? styles['componentDrawerCard--collapsed'] : ''}`}>
          <div className={styles.drawerHeader}>
            <h3 className={styles.drawerTitle}>Available Components</h3>
            <button 
              className={styles.drawerToggle}
              onClick={toggleDrawer}
              aria-label={isDrawerCollapsed ? "Expand drawer" : "Collapse drawer"}
            >
              {isDrawerCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          </div>
          
          <div className={styles.drawerContent}>
            <p className={styles.drawerHint}>
              Drag components to the canvas to fix {activeMission.title}!
            </p>
            
            {availableComponents.map((component) => (
              <div
                key={component.id}
                className={styles.componentCard}
                draggable
                onDragStart={(e) => onDragStart(e, component)}
              >
                {getIconComponent(component.icon, 24)}
                <div className={styles.componentInfo}>
                  <h4 className={styles.componentName}>{component.name}</h4>
                  <p className={styles.componentDescription}>{component.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Requirements Card - Right Side */}
        <div className={styles.requirementsCard}>
          <Requirements 
            requirements={requirements}
            onRunTest={handleRunTest}
          />
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <h3 className={styles.successTitle}>
              <AlertTriangle size={24} />
              Crisis Resolved!
            </h3>
            <p className={styles.successDescription}>
              {activeMission.title} is now stable and helping families in need!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Export wrapped with ReactFlowProvider
export const CrisisSystemDesignCanvas: React.FC<CrisisSystemDesignCanvasProps> = (props) => (
  <ReactFlowProvider>
    <CrisisSystemDesignCanvasInner {...props} />
  </ReactFlowProvider>
);