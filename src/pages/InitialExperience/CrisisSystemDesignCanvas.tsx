import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  ReactFlow, 
  ReactFlowProvider,
  addEdge, 
  useNodesState, 
  useEdgesState, 
  Controls, 
  Background,
  MiniMap,
  Handle,
  Position,
  useReactFlow
} from '@xyflow/react';
import type { Connection, Edge, Node, NodeTypes, EdgeTypes, NodeProps } from '@xyflow/react';
import { ChevronDown, ChevronUp, Settings, Clock, AlertTriangle, Users, Server, Database, Zap, Box, HardDrive, Globe, Shield, BarChart3 } from 'lucide-react';

import { ComponentDrawer } from '../../components/organisms/ComponentDrawer/ComponentDrawer';
import { Requirements } from '../../components/molecules/Requirements/Requirements';
import { MultiConnectionLine } from '../../components/molecules/MultiConnectionLine/MultiConnectionLine';
import { MentorChat } from '../../components/molecules/MentorChat/MentorChat';
import { missionService, type MissionData, type Requirement } from '../../services/missionService';
import { useRequirementValidation } from '../../hooks/useRequirementValidation';
import type { ValidationResponse } from '../../services/missionService';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../services/supabase';

// Redux imports following the established patterns
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { completeStep, updateMetrics } from '../../features/mission/missionSlice';
import { 
  addNode, 
  setDraggedComponent,
  onNodesChange,
  onEdgesChange,
  selectNodes,
  selectEdges,
  addEdge as addEdgeAction 
} from '../../features/design/designSlice';

import '@xyflow/react/dist/style.css';
import styles from './CrisisSystemDesignCanvas.module.css';

// Types
interface CustomNodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  description?: string;
  category?: string;
  color?: string;
}

interface MissionStageData {
  id: string;
  title: string;
  problem_description: string;
  system_requirements: Requirement[];
  mission: {
    id: string;
    title: string;
    description: string;
    crisis_description: string;
  };
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
  const nodes = useAppSelector(state => state.design?.nodes || []);
  const edges = useAppSelector(state => state.design?.edges || []);
  const draggedComponent = useAppSelector(state => state.design?.draggedComponent);
  
  const { screenToFlowPosition } = useReactFlow();
  
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  const [missionStageData, setMissionStageData] = useState<MissionStageData | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [metrics, setMetrics] = useState({
    reportsSaved: 0,
    familiesHelped: 0,
    uptimePercent: 42,
    dataLost: 47,
    systemHealth: 'critical' as 'critical' | 'warning' | 'healthy'
  });

  // Validation hook for API-powered requirement checking
  const { isValidating, validateRequirements } = useRequirementValidation({
    stageId: missionStageData?.id || '',
    onValidationComplete: (result: ValidationResponse) => {
      // Convert API response to Requirements component format
      const convertedReqs = result.requirements
        .filter(req => req.visible) // Only show visible requirements
        .map(req => ({
          id: req.id,
          description: req.description,
          completed: req.completed
        }));
      
      setRequirements(convertedReqs);

      // Update metrics on completion
      if (result.summary.allCompleted) {
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
      }
    }
  });
  
  // Fetch mission stage data directly from Supabase
  const fetchMissionStageFromEmail = async (emailId: string): Promise<MissionStageData | null> => {
    try {
      console.log('Fetching mission stage data for email:', emailId);
      
      // Get the email with its associated stage_id
      const { data: emailData, error: emailError } = await supabase
        .from('mission_emails')
        .select('id, mission_id, stage_id')
        .eq('id', emailId)
        .single();

      if (emailError) {
        console.warn('Failed to load email:', emailError);
        return null;
      }

      if (!emailData.stage_id) {
        console.warn('Email has no stage_id:', emailData);
        return null;
      }

      // Load the mission stage data using the missionService
      const stageData = await missionService.loadMissionStageById(emailData.stage_id);
      
      if (stageData) {
        console.log('Successfully loaded mission stage from database:', stageData);
        return stageData;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch mission stage from email:', error);
      return null;
    }
  };

  const loadMissionData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let mission: MissionData | null = null;
      let stageData: MissionStageData | null = null;

      // If we have an emailId, try to load the specific stage data
      if (emailId) {
        console.log('Loading mission stage data from email ID:', emailId);
        stageData = await fetchMissionStageFromEmail(emailId);
        
        if (stageData) {
          // Create a mission data object from the stage data
          mission = {
            id: stageData.mission.id,
            slug: 'loaded-from-stage',
            title: stageData.mission.title,
            description: stageData.mission.description,
            crisis_description: stageData.mission.crisis_description,
            stages: [stageData],
            components: getDefaultComponents(),
            requirements: stageData.system_requirements
          };
          
                  setMissionStageData(stageData);
        console.log('Using stage-specific requirements:', stageData.system_requirements);
        
        // Load initial requirements when stage data is available
        if (stageData.id) {
          // Convert stage requirements to our format for initial display
          const initialReqs = stageData.system_requirements.map(req => ({
            id: req.id,
            description: req.description,
            completed: false // Start with all incomplete
          }));
          setRequirements(initialReqs);
        }
        }
      }

      // Fallback to loading by slug
      if (!mission) {
        console.log('Loading mission by slug:', missionSlug);
        mission = await missionService.loadMissionBySlug(missionSlug);
      }

      if (mission) {
        setActiveMission(mission);
        console.log('Mission loaded successfully:', mission.title);
        console.log('Requirements:', mission.requirements);
        
        // Set initial requirements for fallback missions
        if (mission.requirements) {
          setRequirements(mission.requirements.map(req => ({
            ...req,
            completed: false // Reset completion state
          })));
        }
      } else {
        throw new Error('Mission not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to load mission data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Default components for fallback
  const getDefaultComponents = () => [
    {
      id: 'compute_server',
      name: 'Compute Server',
      category: 'compute',
      icon_name: 'server',
      short_description: 'Runs your application code',
      unlock_level: 1,
      required: true
    },
    {
      id: 'data_store',
      name: 'Database',
      category: 'database',
      icon_name: 'database',
      short_description: 'Stores and manages application data',
      unlock_level: 1,
      required: true
    },
    {
      id: 'file_storage',
      name: 'File Storage',
      category: 'storage',
      icon_name: 'hard-drive',
      short_description: 'Stores files and media',
      unlock_level: 1,
      required: false
    }
  ];

  // Default requirements for fallback
  const getDefaultRequirements = () => [
    {
      id: 'separate_server',
      description: 'Separate web server from database',
      completed: false,
      validator: (nodes: any[], edges: any[]) => {
        return nodes.length >= 2 && 
          nodes.some((n: any) => n.data.category === 'compute') && 
          nodes.some((n: any) => n.data.category === 'database');
      }
    },
    {
      id: 'connect_server_db',
      description: 'Connect web server to database',
      completed: false,
      validator: (nodes: any[], edges: any[]) => {
        return edges.some((e: any) => {
          const sourceNode = nodes.find((n: any) => n.id === e.source);
          const targetNode = nodes.find((n: any) => n.id === e.target);
          return (sourceNode?.data.category === 'compute' && targetNode?.data.category === 'database') ||
                 (sourceNode?.data.category === 'database' && targetNode?.data.category === 'compute');
        });
      }
    }
  ];

  // Load mission stage data when emailId is provided
  useEffect(() => {
    loadMissionData();
  }, [emailId, missionSlug]);

  // Removed automatic validation - now using on-demand API validation

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

  const reactFlowNodes = useAppSelector(selectNodes);
  
  const onConnect = useCallback((params: Connection) => {
    // Get all selected nodes when connection is made
    const selectedNodes = reactFlowNodes.filter((node: Node) => node.selected);
    
    // If multiple nodes are selected, create edges from all selected nodes to the target
    if (selectedNodes.length > 1 && params.target) {
      selectedNodes.forEach((node: Node) => {
        // Don't create self-connections
        if (node.id !== params.target) {
          dispatch(addEdgeAction({
            ...params,
            source: node.id,
            sourceHandle: 'output',
            targetHandle: 'input'
          } as Connection));
        }
      });
    } else {
      // Single connection (default behavior)
      dispatch(addEdgeAction({
        ...params,
        sourceHandle: params.sourceHandle || 'output',
        targetHandle: params.targetHandle || 'input'
      } as Connection));
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

  const handleRunTest = useCallback(async () => {
    if (!missionStageData?.id) {
      console.warn('No stage ID available for validation');
      return;
    }
    
    await validateRequirements(nodes, edges);
  }, [validateRequirements, nodes, edges, missionStageData?.id]);

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

  if (error) {
    return (
      <div className={styles.crisisCanvas}>
        <div className={styles.errorContainer}>
          <AlertTriangle size={24} />
          <p>Failed to load mission: {error}</p>
        </div>
      </div>
    );
  }

  if (!activeMission) {
    return (
      <div className={styles.crisisCanvas}>
        <div className={styles.errorContainer}>
          <AlertTriangle size={24} />
          <p>Mission not found.</p>
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
            {/* Stage Information - shown when loaded from email */}
            {missionStageData && (
              <div className={styles.stageInfo}>
                <h4 className={styles.stageTitle}>
                  {missionStageData.title}
                </h4>
                <p className={styles.stageProblem}>
                  {missionStageData.problem_description}
                </p>
              </div>
            )}
            
            <p className={styles.drawerHint}>
              Drag components to the canvas to fix {activeMission?.title}!
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
          {isValidating && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '8px', 
              margin: '1rem 0',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#0369a1'
            }}>
              🔍 Validating your design...
            </div>
          )}
        </div>

        {/* Success Message */}
        {/* {showSuccessMessage && ( // This state is removed */}
        {/*   <div className={styles.successMessage}> */}
        {/*     <h3 className={styles.successTitle}> */}
        {/*       <AlertTriangle size={24} /> */}
        {/*       Crisis Resolved! */}
        {/*     </h3> */}
        {/*     <p className={styles.successDescription}> */}
        {/*       {activeMission?.title} is now stable and helping families in need! */}
        {/*     </p> */}
        {/*   </div> */}
        {/* )} */}
        
        {/* Floating Mentor Chat - Bottom Left */}
        <MentorChat
          missionStageId={missionStageData?.id}
          missionTitle={missionStageData?.title || activeMission?.title}
          problemDescription={missionStageData?.problem_description}
        />
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