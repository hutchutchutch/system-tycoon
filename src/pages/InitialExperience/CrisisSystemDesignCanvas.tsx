import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import type { Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AlertTriangle, Server, Database, Users, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
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
import { useTheme } from '../../contexts/ThemeContext';
import styles from './CrisisSystemDesignCanvas.module.css';
import type { ComponentData } from '../../components/molecules/ComponentCard/ComponentCard.types';

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  icon: string; // Changed from React.ComponentType to string
  description?: string;
}

// Custom Node Component
const CustomNode: React.FC<any> = ({ data, selected }) => {
  const nodeData = data as CustomNodeData;
  
  // Map icon string to actual icon component
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'users':
        return <Users size={20} />;
      case 'server':
        return <Server size={20} />;
      case 'database':
        return <Database size={20} />;
      default:
        return <Server size={20} />;
    }
  };
  
  return (
    <div className={`${styles.customNode} ${selected ? styles.selected : ''}`}>
      <div className={styles.nodeHeader}>
        {getIconComponent(nodeData.icon)}
        <h4 className={styles.nodeTitle}>{nodeData.label}</h4>
      </div>
      {nodeData.description && (
        <p className={styles.nodeDescription}>{nodeData.description}</p>
      )}
    </div>
  );
};

// Node types for React Flow
const nodeTypes = {
  custom: CustomNode,
};

const components: ComponentData[] = [
  {
    id: 'families',
    name: 'Families',
    type: 'server',
    category: 'compute',
    cost: 0,
    capacity: 200,
    description: 'Affected families trying to report',
    icon: 'users'
  },
  {
    id: 'web_server',
    name: 'Web Server',
    type: 'server',
    category: 'compute',
    cost: 50,
    capacity: 1000,
    description: 'Handles user requests and serves web pages',
    icon: 'server'
  },
  {
    id: 'database',
    name: 'Database',
    type: 'database',
    category: 'storage',
    cost: 100,
    capacity: 5000,
    description: 'Stores and manages application data',
    icon: 'database'
  }
];

const CrisisSystemDesignCanvasInner: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const mission = useAppSelector(state => state.mission);
  const nodes = useAppSelector(selectNodes);
  const edges = useAppSelector(selectEdges);
  const draggedComponent = useAppSelector(state => state.design.draggedComponent);
  
  const { screenToFlowPosition } = useReactFlow();
  
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [metrics, setMetrics] = useState({
    reportsSaved: 0,
    familiesHelped: 0,
    uptimePercent: 42,
    dataLost: 47,
    systemHealth: 'critical' as 'critical' | 'warning' | 'healthy'
  });

  // Initialize with the families node if not already present
  useEffect(() => {
    if (nodes.length === 0) {
      const familiesComponent = components.find(c => c.id === 'families');
      if (familiesComponent) {
        dispatch(addNode({
          component: familiesComponent,
          position: { x: 250, y: 50 }
        }));
      }
    }
  }, [nodes.length, dispatch]);

  const requirements = [
    {
      id: 'separate_server',
      description: 'Separate web server from database',
      completed: nodes.length >= 2 && nodes.some(n => n.id.includes('web_server')) && nodes.some(n => n.id.includes('database'))
    },
    {
      id: 'connect_server_db',
      description: 'Connect web server to database',
      completed: edges.some((e) => 
        (e.source.includes('web_server') && e.target.includes('database')) ||
        (e.source.includes('database') && e.target.includes('web_server'))
      )
    },
    {
      id: 'connect_families',
      description: 'Connect families to web server',
      completed: edges.some((e) => 
        (e.source.includes('families') && e.target.includes('web_server')) ||
        (e.source.includes('web_server') && e.target.includes('families'))
      )
    }
  ];

  const onConnect = useCallback((params: Connection) => {
    dispatch(addEdge(params));
  }, [dispatch]);

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

    let component: ComponentData;
    
    if (componentData) {
      component = JSON.parse(componentData);
    } else if (componentType) {
      // Fallback to finding component by type
      const foundComponent = components.find(c => c.type === componentType);
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
  }, [screenToFlowPosition, dispatch]);

  const onDragStart = (event: React.DragEvent, component: ComponentData) => {
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
            fitView
            colorMode={theme}
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
              Drag components to the canvas to fix Alex's system!
            </p>
            
            {components.map((component) => (
              <div
                key={component.id}
                className={styles.componentCard}
                draggable
                onDragStart={(e) => onDragStart(e, component)}
              >
                {component.icon === 'users' && <Users className={styles.componentIcon} />}
                {component.icon === 'server' && <Server className={styles.componentIcon} />}
                {component.icon === 'database' && <Database className={styles.componentIcon} />}
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
              Alex's system is now stable and helping families in need!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Export wrapped with ReactFlowProvider
export const CrisisSystemDesignCanvas: React.FC = () => (
  <ReactFlowProvider>
    <CrisisSystemDesignCanvasInner />
  </ReactFlowProvider>
);