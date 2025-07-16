import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, Handle, Position } from '@xyflow/react';
import type { Connection, Node, Edge, NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AlertTriangle, Server, Database, Users, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { completeStep, updateMetrics } from '../../features/mission/missionSlice';
import { Requirements } from '../../components/molecules';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './CrisisSystemDesignCanvas.module.css';

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  icon: React.ComponentType;
  description?: string;
}

// Custom Node Component
const CustomNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as CustomNodeData;
  const IconComponent = nodeData.icon;
  
  return (
    <div className={`${styles.customNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.nodeHeader}>
        <IconComponent className={styles.nodeIcon} />
        <h4 className={styles.nodeTitle}>{nodeData.label}</h4>
      </div>
      {nodeData.description && (
        <p className={styles.nodeDescription}>{nodeData.description}</p>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Node types for React Flow
const nodeTypes = {
  custom: CustomNode,
};

const components = [
  {
    id: 'families',
    name: 'Families',
    description: 'Affected families trying to report',
    icon: Users,
    color: '#fbbf24'
  },
  {
    id: 'web_server',
    name: 'Web Server',
    description: 'Handles user requests and serves web pages',
    icon: Server,
    color: '#3b82f6'
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Stores and manages application data',
    icon: Database,
    color: '#10b981'
  }
];

export const CrisisSystemDesignCanvas: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const mission = useAppSelector(state => state.mission);
  
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'families',
      type: 'custom',
      position: { x: 250, y: 50 },
      data: { 
        label: '200+ Families Trying to Report',
        icon: Users,
        description: 'Families affected by the crisis'
      } as CustomNodeData,
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [metrics, setMetrics] = useState({
    reportsSaved: 0,
    familiesHelped: 0,
    uptimePercent: 42,
    dataLost: 47,
    systemHealth: 'critical' as 'critical' | 'warning' | 'healthy'
  });

  const requirements = [
    {
      id: 'separate_server',
      description: 'Separate web server from database',
      completed: nodes.length >= 2 && nodes.some(n => n.id.includes('web_server')) && nodes.some(n => n.id.includes('database'))
    },
    {
      id: 'connect_server_db',
      description: 'Connect web server to database',
      completed: edges.some((e: Edge) => 
        (e.source.includes('web_server') && e.target.includes('database')) ||
        (e.source.includes('database') && e.target.includes('web_server'))
      )
    },
    {
      id: 'connect_families',
      description: 'Connect families to web server',
      completed: edges.some((e: Edge) => 
        (e.source === 'families' && e.target.includes('web_server')) ||
        (e.source.includes('web_server') && e.target === 'families')
      )
    }
  ];

  const onConnect = useCallback((params: Edge | Connection) => {
    const newEdge = { 
      ...params, 
      animated: true, 
      style: { stroke: '#ef4444', strokeWidth: 2 }
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const componentId = event.dataTransfer.getData('application/reactflow');
    const component = components.find(c => c.id === componentId);

    if (!component) return;

    const position = {
      x: event.clientX - reactFlowBounds.left - 90,
      y: event.clientY - reactFlowBounds.top - 30,
    };

    const newNode: Node = {
      id: `${componentId}_${Date.now()}`,
      type: 'custom',
      position,
      data: { 
        label: component.name,
        icon: component.icon,
        description: component.description
      } as CustomNodeData,
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onDragStart = (event: React.DragEvent, componentId: string) => {
    event.dataTransfer.setData('application/reactflow', componentId);
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
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
                onDragStart={(e) => onDragStart(e, component.id)}
              >
                <component.icon className={styles.componentIcon} />
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