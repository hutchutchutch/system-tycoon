import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ReactFlow, 
  ReactFlowProvider,
  Controls, 
  Background,
  BackgroundVariant,
  MiniMap,
  Handle,
  Position,
  useReactFlow
} from '@xyflow/react';
import type { Connection, Node, NodeProps } from '@xyflow/react';
import { ChevronDown, ChevronUp, AlertTriangle, Users, Server, Database, Zap, Box, HardDrive, Globe, Shield, BarChart3, Info } from 'lucide-react';
import { ConnectionDebugOverlay } from './ConnectionDebugOverlay';

// import { ComponentDrawer } from '../../components/organisms/ComponentDrawer/ComponentDrawer';
import { Requirements } from '../../components/molecules/Requirements/Requirements';
import { MultiConnectionLine } from '../../components/molecules/MultiConnectionLine/MultiConnectionLine';
import { ProblemCard } from '../../components/molecules/ProblemCard/ProblemCard';

import { ComponentDetailModal, type ComponentDetail } from '../../components/molecules/ComponentDetailModal/ComponentDetailModal';
import { missionService, type MissionData, type Requirement } from '../../services/missionService';
import { useRequirementValidation } from '../../hooks/useRequirementValidation';
import type { ValidationResponse } from '../../services/missionService';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../services/supabase';

// Redux imports following the established patterns
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { completeStep, updateMetrics, setDatabaseMission, completeDatabaseStage, clearDatabaseMission } from '../../features/mission/missionSlice';
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

// User Node Data type
interface UserNodeData extends CustomNodeData {
  userCount: number;
}

// Get color based on user count
const getUserCountColor = (count: number) => {
  if (count >= 100000) return '#FF1744'; // Red - Critical mass
  if (count >= 10000) return '#FF6B00'; // Orange - Very high
  if (count >= 1000) return '#FFA726'; // Light orange - High
  if (count >= 100) return '#FFD600'; // Yellow - Medium
  if (count >= 10) return '#66BB6A'; // Green - Low
  return '#4CAF50'; // Light green - Very low
};

// User Node Component
const UserNode: React.FC<NodeProps<Node<UserNodeData>>> = React.memo(({ data, selected, isConnectable, id }) => {
  const userColor = getUserCountColor(data.userCount || 1);
  
  return (
    <div 
      className={`${styles.userNode} ${selected ? styles.selected : ''}`}
      style={{ 
        borderColor: userColor,
        backgroundColor: userColor + '15'
      }}
    >
      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        id={`${id}-input`}
        className={styles.nodeHandle}
        isConnectable={isConnectable}
      />
      
      <div className={styles.userNodeIcon} style={{ color: userColor }}>
        <Users size={24} />
      </div>
      
      <div className={styles.userNodeContent}>
        <div className={styles.userNodeCount} style={{ color: userColor }}>
          {data.userCount.toLocaleString()}
        </div>
        <div className={styles.userNodeLabel}>{data.label}</div>
      </div>
      
      {/* Output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-output`}
        className={styles.nodeHandle}
        isConnectable={isConnectable}
      />
    </div>
  );
});

UserNode.displayName = 'UserNode';

// Custom Node Component with proper handles
const CustomNode: React.FC<NodeProps<Node<CustomNodeData>>> = React.memo(({ data, selected, isConnectable, id }) => {
  // Map categories to node type classes for styling
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
      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
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
        {process.env.NODE_ENV === 'development' && (
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
            ID: {id}
          </div>
        )}
      </div>
      
      {/* Output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-output`}
        className={styles.nodeHandle}
        isConnectable={isConnectable}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

interface CrisisSystemDesignCanvasProps {
  missionSlug?: string;
  // emailId is now obtained from route params, not props
}

const CrisisSystemDesignCanvasInner: React.FC<CrisisSystemDesignCanvasProps> = ({ 
  missionSlug = 'health-tracker-crisis'
}) => {
  const { emailId } = useParams<{ emailId: string }>();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const mission = useAppSelector(state => state.mission);
  const nodes = useAppSelector(state => state.design?.nodes || []);
  const edges = useAppSelector(state => state.design?.edges || []);
  const draggedComponent = useAppSelector(state => state.design?.draggedComponent);
  
  const { screenToFlowPosition } = useReactFlow();
  
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [showingProblemCard, setShowingProblemCard] = useState(true);
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

  // Component detail modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetail | null>(null);
  const [allComponentDetails, setAllComponentDetails] = useState<ComponentDetail[]>([]);

  // Memoized node types (critical for React Flow performance)
  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
    user: UserNode,
  }), []);

  // Fetch detailed component information from Supabase
  const fetchComponentDetails = async (componentId: string): Promise<ComponentDetail | null> => {
    try {
      const { data, error } = await supabase
        .from('components')
        .select('id, name, category, icon_name, short_description, detailed_description, compatible_with')
        .eq('id', componentId)
        .single();

      if (error) {
        console.error('Failed to fetch component details:', error);
        return null;
      }

      return data as ComponentDetail;
    } catch (error) {
      console.error('Error fetching component details:', error);
      return null;
    }
  };

  // Fetch all available components for compatibility resolution
  const fetchAllComponentDetails = async (): Promise<ComponentDetail[]> => {
    try {
      const { data, error } = await supabase
        .from('components')
        .select('id, name, category, icon_name, short_description, detailed_description, compatible_with');

      if (error) {
        console.error('Failed to fetch all components:', error);
        return [];
      }

      return data as ComponentDetail[];
    } catch (error) {
      console.error('Error fetching all components:', error);
      return [];
    }
  };

  // Handle opening the component detail modal
  const handleComponentInfoClick = async (componentId: string) => {
    const componentDetail = await fetchComponentDetails(componentId);
    if (componentDetail) {
      setSelectedComponent(componentDetail);
      setIsModalOpen(true);
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComponent(null);
  };

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
  
  // Fetch mission stage data and initial system state directly from Supabase
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
        
        // Load initial system state from database
        await loadInitialSystemState(emailData.stage_id);
        
        return stageData;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch mission stage from email:', error);
      return null;
    }
  };

  // Load initial system state from database and set nodes/edges
  const loadInitialSystemState = async (stageId: string) => {
    try {
      const { data: stageData, error } = await supabase
        .from('mission_stages')
        .select('initial_system_state')
        .eq('id', stageId)
        .single();

      if (error) {
        console.warn('Failed to load initial system state:', error);
        return;
      }

      if (stageData?.initial_system_state) {
        const { nodes: initialNodes = [], edges: initialEdges = [] } = stageData.initial_system_state;
        
        console.log('Loading initial system state:', { 
          nodes: initialNodes.length, 
          edges: initialEdges.length 
        });

        // Calculate center position for better layout
        const centerX = 400;
        const centerY = 300;

        // Set the initial nodes and edges using Redux
        if (initialNodes.length > 0) {
          initialNodes.forEach((node: any, index: number) => {
            // Position nodes in a layout
            let position = node.position;
            
            // If no position, calculate based on node type
            if (!position) {
              if (node.type === 'user' || node.data?.category === 'stakeholder') {
                // Position user nodes above the center
                position = { x: centerX - 150 + (index * 150), y: centerY - 200 };
              } else {
                // Center the main system node
                position = { x: centerX, y: centerY };
              }
            }

            // Check if this is a user node
            if (node.type === 'user' || node.data?.category === 'stakeholder') {
              // Add user node directly to state (bypass component logic)
              const userNode = {
                id: node.id,
                type: 'user',
                position: position,
                data: {
                  label: node.data?.label || 'Users',
                  icon: 'users',
                  category: 'stakeholder',
                  userCount: node.data?.userCount || 200,
                  ...node.data
                }
              };
              // We need to dispatch a custom action for user nodes
              dispatch(addNode({
                component: {
                  id: node.id,
                  name: node.data?.label || 'Users',
                  type: 'user',
                  category: 'stakeholder',
                  cost: 0,
                  capacity: node.data?.userCount || 200,
                  description: node.data?.description || 'Affected families',
                  icon: 'users'
                },
                position: position,
                nodeType: 'user',
                nodeData: {
                  ...userNode.data,
                  userCount: node.data?.userCount || 200
                }
              }));
            } else {
              // Regular component node - center it
              dispatch(addNode({
                component: {
                  id: node.id,
                  name: node.data?.label || 'Current System',
                  type: node.type || 'custom',
                  category: node.data?.category || 'compute',
                  cost: 0,
                  capacity: 1000,
                  description: node.data?.description || 'Current laptop running everything',
                  icon: node.data?.icon || 'server'
                },
                position: position
              }));
            }
          });
        }

        if (initialEdges.length > 0) {
          initialEdges.forEach((edge: any) => {
            dispatch(addEdgeAction({
              source: edge.source,
              target: edge.target,
              sourceHandle: edge.sourceHandle || `${edge.source}-output`,
              targetHandle: edge.targetHandle || `${edge.target}-input`
            }));
          });
        }
      } else {
        console.log('No initial system state found for stage:', stageId);
        // If no initial state, create default nodes
        const defaultSystemNode = {
          id: 'current-system',
          type: 'custom',
          position: { x: centerX, y: centerY },
          data: {
            label: "Alex's Laptop",
            icon: 'server',
            category: 'compute',
            description: 'Running both web server and database'
          }
        };

        const defaultUserNode = {
          id: 'families',
          type: 'user',
          position: { x: centerX, y: centerY - 200 },
          data: {
            label: 'Affected Families',
            icon: 'users',
            category: 'stakeholder',
            userCount: 200
          }
        };

        // Add default nodes
        dispatch(addNode({
          component: {
            id: defaultSystemNode.id,
            name: defaultSystemNode.data.label,
            type: 'custom',
            category: defaultSystemNode.data.category,
            cost: 0,
            capacity: 1000,
            description: defaultSystemNode.data.description,
            icon: defaultSystemNode.data.icon
          },
          position: defaultSystemNode.position
        }));

        dispatch(addNode({
          component: {
            id: defaultUserNode.id,
            name: defaultUserNode.data.label,
            type: 'user',
            category: 'stakeholder',
            cost: 0,
            capacity: defaultUserNode.data.userCount,
            description: 'Families trying to report symptoms',
            icon: 'users'
          },
          position: defaultUserNode.position,
          nodeType: 'user',
          nodeData: {
            ...defaultUserNode.data,
            userCount: defaultUserNode.data.userCount
          }
        }));

        // Add edge between them
        dispatch(addEdgeAction({
          source: 'families',
          target: 'current-system',
          sourceHandle: 'families-output',
          targetHandle: 'current-system-input'
        }));
      }
    } catch (error) {
      console.error('Failed to load initial system state:', error);
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
        
        // If we have stage data, dispatch it to Redux for GameHUD
        if (stageData && stageData.mission) {
          // Load all stages for this mission from database
          const { data: allStages, error: stagesError } = await supabase
            .from('mission_stages')
            .select('id, stage_number, title, problem_description')
            .eq('mission_id', stageData.mission.id)
            .order('stage_number');

          if (!stagesError && allStages) {
            dispatch(setDatabaseMission({
              id: stageData.mission.id,
              title: stageData.mission.title,
              description: stageData.mission.description,
              slug: mission.slug,
              stages: allStages
            }));
          }
        }
        
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
    
    // Cleanup when component unmounts
    return () => {
      dispatch(clearDatabaseMission());
    };
  }, [emailId, missionSlug, dispatch]);

  // Load all component details for compatibility resolution
  useEffect(() => {
    const loadAllComponents = async () => {
      const components = await fetchAllComponentDetails();
      setAllComponentDetails(components);
    };
    
    loadAllComponents();
  }, []);

  // Removed automatic validation - now using on-demand API validation

  // Handle starting the design process
  const handleStartDesign = useCallback(() => {
    setShowingProblemCard(false);
  }, []);

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


  
  const onConnect = useCallback((params: Connection) => {
    console.log('🔗 Connection attempt:', {
      source: params.source,
      target: params.target,
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle
    });
    
    // Ensure we have valid source and target
    if (!params.source || !params.target) {
      console.error('❌ Invalid connection - missing source or target');
      return;
    }
    
    // Prevent self-connections
    if (params.source === params.target) {
      console.warn('⚠️ Cannot connect node to itself');
      return;
    }
    
    // Log which node is being used as source
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    console.log('📍 Connecting:', sourceNode?.data.label, '→', targetNode?.data.label);
    console.log('📊 Node IDs:', { sourceId: params.source, targetId: params.target });
    
    dispatch(addEdgeAction(params));
  }, [dispatch, nodes]);

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
      {showingProblemCard && missionStageData ? (
        /* Show Problem Card initially */
        <div className={styles.problemCardContainer}>
          <ProblemCard
            title={missionStageData.title}
            problem={missionStageData.problem_description}
            urgency="critical"
            affectedCount={200}
            timeframe="Urgent - System Failing"
            onStartDesign={handleStartDesign}
            className={styles.centeredProblemCard}
          />
        </div>
      ) : (
        /* Show System Design Interface */
        <>
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
            fitViewOptions={{
              padding: 0.2,
              includeHiddenNodes: false
            }}
            colorMode={theme}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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
              // Validate the connection
              if (!connection.source || !connection.target) return false;
              if (connection.source === connection.target) return false;
              
              // Check if edge already exists
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
            {process.env.NODE_ENV === 'development' && <ConnectionDebugOverlay />}
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
                <button
                  className={styles.infoButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleComponentInfoClick(component.id);
                  }}
                  aria-label={`Show details for ${component.name}`}
                  title={`View detailed information about ${component.name}`}
                >
                  <Info size={16} />
                </button>
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
        

          </div>

          {/* Component Detail Modal */}
          <ComponentDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            component={selectedComponent}
            availableComponents={allComponentDetails}
          />
        </>
      )}
    </div>
  );
};

// Export wrapped with ReactFlowProvider
export const CrisisSystemDesignCanvas: React.FC<CrisisSystemDesignCanvasProps> = (props) => (
  <ReactFlowProvider>
    <CrisisSystemDesignCanvasInner {...props} />
  </ReactFlowProvider>
);