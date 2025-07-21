import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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


// import { ComponentDrawer } from '../../components/organisms/ComponentDrawer/ComponentDrawer';
import { ComponentDrawer } from '../../components/organisms/ComponentDrawer/ComponentDrawer';
import { Requirements } from '../../components/molecules/Requirements/Requirements';
import { MultiConnectionLine } from '../../components/molecules/MultiConnectionLine/MultiConnectionLine';
import { MentorNotification } from '../../components/atoms/MentorNotification/MentorNotification';
import { MentorChat } from '../../components/molecules/MentorChat/MentorChat';
import { useConversationSession } from '../../hooks/useConversationSession';
import { CursorManager } from '../../components/organisms/CursorManager/CursorManager';

import { ComponentDetailModal, type ComponentDetail } from '../../components/molecules/ComponentDetailModal/ComponentDetailModal';
import { missionService, type MissionData, type Requirement } from '../../services/missionService';
import { useRequirementValidation } from '../../hooks/useRequirementValidation';
import type { ValidationResponse } from '../../services/missionService';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../services/supabase';
import { realtimeCollaborationService } from '../../services/realtimeCollaboration';

// Redux imports following the established patterns
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { store } from '../../store';
import { completeStep, updateMetrics, setDatabaseMission, completeDatabaseStage, clearDatabaseMission, resetTimerTestTrigger } from '../../features/mission/missionSlice';
import { loadCollaborationInvitations } from '../../store/slices/collaborationSlice';
import { 
  addNode, 
  setDraggedComponent,
  onNodesChange,
  onEdgesChange,
  selectNodes,
  selectEdges,
  addEdge as addEdgeAction,
  setSystemRequirements,
  validateRequirements as validateRequirementsAction,
  clearCanvas,
  updateRequirementValidationResults
} from '../../features/design/designSlice';
import {
  setActiveCanvas,
  updateCanvasState,
  loadCanvasState,
  selectCanvasState,
  selectSavingStatus,
  selectCanvasSaveError,
  serializeNode,
  serializeEdge
} from '../../store/slices/canvasSlice';
import { useLoadCanvasStateQuery, useSaveCanvasStateMutation } from '../../store/api/canvasApi';

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

// Get color based on user count - poker chip style colors
const getUserCountColor = (count: number) => {
  if (count >= 100000) return '#1F2937'; // Black chip - Highest denomination
  if (count >= 10000) return '#7C3AED'; // Purple chip
  if (count >= 1000) return '#2563EB'; // Blue chip  
  if (count >= 100) return '#F59E0B'; // Yellow/Gold chip
  if (count >= 10) return '#6B7280'; // Gray chip
  return '#E5E7EB'; // White chip - Lowest denomination
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
      <div className={styles.userNodeIcon} style={{ color: userColor }}>
        <Users size={24} />
      </div>
      
      <div className={styles.userNodeContent}>
        <div className={styles.userNodeCount} style={{ color: userColor }}>
          {data.userCount.toLocaleString()}
        </div>
        <div className={styles.userNodeLabel}>{data.label}</div>
      </div>
      
      {/* Output handle (right side only) */}
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

  // Check if node is broken
  const isBroken = (data as any).status === 'broken';

  return (
    <div className={`${styles.customNode} ${styles[getCategoryClass(data.category)]} ${selected ? styles.selected : ''} ${isBroken ? styles.brokenNode : ''}`}>
      {/* Input handle (left side) */}
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
        {process.env.NODE_ENV === 'development' && (
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
            ID: {id}
          </div>
        )}
      </div>
      
      {/* Output handle (right side) */}
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

// User node breakdown logic - breaks down total users into denominations
const createUserNodeBreakdown = (totalUsers: number) => {
  const denominations = [100000, 10000, 1000, 500, 100, 10, 1];
  const breakdown: Array<{
    id: string;
    name: string;
    label: string;
    description: string;
    userCount: number;
  }> = [];
  
  let remaining = totalUsers;
  
  for (const denom of denominations) {
    const count = Math.floor(remaining / denom);
    for (let i = 0; i < count; i++) {
      const userType = denom >= 10000 ? 'Enterprise Users' : 
                       denom >= 1000 ? 'Organizations' : 
                       denom >= 100 ? 'Community Groups' : 
                       denom >= 10 ? 'Small Groups' : 'Individuals';
      
      breakdown.push({
        id: `users-${denom}-${i}`,
        name: `${userType}`,
        label: `${denom} Users`,
        description: `${denom} users (${userType.toLowerCase()}) trying to access the system`,
        userCount: denom
      });
    }
    remaining -= count * denom;
  }
  
  return breakdown;
};

interface CrisisSystemDesignCanvasProps {
  missionSlug?: string;
  // emailId is now obtained from route params, not props
}

const CrisisSystemDesignCanvasInner: React.FC<CrisisSystemDesignCanvasProps> = ({ 
  missionSlug = 'health-tracker-crisis'
}) => {
  const { emailId } = useParams<{ emailId: string }>();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const mission = useAppSelector(state => state.mission);
  const user = useAppSelector(state => state.auth?.user);
  const nodes = useAppSelector(state => state.design?.nodes || []);
  const edges = useAppSelector(state => state.design?.edges || []);
  const draggedComponent = useAppSelector(state => state.design?.draggedComponent);
  
  const { screenToFlowPosition } = useReactFlow();
  
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  const [missionStageData, setMissionStageData] = useState<MissionStageData | null>(null);
  
  // Collaboration state
  const sessionId = searchParams.get('session');
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [collaborationSession, setCollaborationSession] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [cursors, setCursors] = useState<Record<string, { x: number; y: number; timestamp: number }>>({});
  const collaborationChannelRef = useRef<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasInitializedRef = useRef<boolean>(false);
  
  // Canvas state from Redux (after missionStageData is available)
  const canvasState = useAppSelector(state => 
    missionStageData?.id ? selectCanvasState(missionStageData.id)(state) : null
  );
  const savingStatus = useAppSelector(selectSavingStatus);
  const saveError = useAppSelector(selectCanvasSaveError);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [notificationStep, setNotificationStep] = useState<number>(0); // 0: none, 1: issue analysis, 2: requirements explanation, 3: component drawer guidance
  const [showRequirements, setShowRequirements] = useState(false);
  const [showComponentDrawer, setShowComponentDrawer] = useState(false);
  const conversationSessionId = useConversationSession();
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

  // Transform mission components for the component drawer
  const drawerComponents = useMemo(() => {
    if (!activeMission) return [];
    
    return activeMission.components.map(comp => ({
      id: comp.id,
      name: comp.name,
      icon: comp.icon_name,
      color: comp.color || '#3B82F6', // Use database color or default
      shortDescription: comp.short_description,
      category: comp.category
    }));
  }, [activeMission]);

  // Legacy availableComponents for React Flow compatibility
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

  // Component drawer state
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');

  // React Flow event handlers
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
      
      // Dispatch API validation results to Redux so MentorChat can access them
      dispatch(updateRequirementValidationResults({
        requirements: result.requirements,
        summary: {
          allCompleted: result.summary.allCompleted,
          completedCount: result.summary.completedRequirements,
          totalCount: result.summary.totalRequirements,
          percentage: result.summary.completionPercentage
        }
      }));

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
        
        // Don't load initial system state here - let initializeCanvasForStage handle it
        // to prevent duplicate loading and infinite update loops
        
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

      // Calculate center position for better layout
      const centerX = 400;
      const centerY = 300;

      if (stageData?.initial_system_state) {
        const { nodes: initialNodes = [], edges: initialEdges = [] } = stageData.initial_system_state;
        
        console.log('Loading initial system state:', { 
          nodes: initialNodes.length, 
          edges: initialEdges.length 
        });

        // Break down user count into multiple nodes with different capacities
        const totalUsers = 200;
        const userNodes = createUserNodeBreakdown(totalUsers);
        
        userNodes.forEach((userNode, index) => {
          // UserNode height is ~122px (90px + 32px padding)
          // We need at least half a node height (61px) as gap between nodes
          // So total spacing should be: node height (122px) + gap (61px) = 183px
          const nodeHeight = 122;
          const nodeGap = nodeHeight / 2; // Half the node height as gap
          const nodeSpacing = nodeHeight + nodeGap; // Total spacing between node centers
          
          // Calculate total height of all nodes
          const totalHeight = (userNodes.length - 1) * nodeSpacing;
          
          // Position nodes starting from top, with proper spacing
          const startY = centerY - (totalHeight / 2);
          const yPosition = startY + (index * nodeSpacing);
          
          dispatch(addNode({
            component: {
              id: userNode.id,
              name: userNode.name,
              type: 'user',
              category: 'stakeholder',
              cost: 0,
              capacity: userNode.userCount,
              description: userNode.description,
              icon: 'users'
            },
            position: { x: centerX - 400, y: yPosition }, // Absolute positioning with proper spacing
            nodeType: 'user',
            nodeData: {
              id: userNode.id,
              name: userNode.name,
              type: 'user',
              category: 'stakeholder',
              cost: 0,
              capacity: userNode.userCount,
              description: userNode.description,
              label: userNode.label,
              icon: 'users',
              userCount: userNode.userCount
            }
          }));
        });

        // Set the initial nodes from database
        if (initialNodes.length > 0) {
          initialNodes.forEach((node: any, index: number) => {
            // Position nodes in a layout - system nodes go to the right
            let position = node.position || { x: centerX + 100, y: centerY };
            
            // Regular component node - mark as broken
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
              position: position,
              nodeData: {
                id: node.id,
                name: node.data?.label || 'Current System',
                type: node.type || 'custom',
                category: node.data?.category || 'compute',
                cost: 0,
                capacity: 1000,
                description: node.data?.description || 'Current laptop running everything',
                label: node.data?.label || 'Current System',
                icon: node.data?.icon || 'server',
                status: 'broken' // Mark as broken to show red outline
              }
            }));
          });
        }

        // Add edges from all user nodes to system node (horizontal layout)
        if (initialNodes.length > 0) {
          userNodes.forEach((userNode) => {
            dispatch(addEdgeAction({
              source: userNode.id,
              target: initialNodes[0].id,
              sourceHandle: `${userNode.id}-output`,
              targetHandle: `${initialNodes[0].id}-input`
            }));
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
          position: { x: centerX + 100, y: centerY },
          data: {
            label: "Alex's Laptop",
            icon: 'server',
            category: 'compute',
            description: 'Running both web server and database'
          }
        };

        // Add system node
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
          position: defaultSystemNode.position,
          nodeData: {
            id: defaultSystemNode.id,
            name: defaultSystemNode.data.label,
            type: 'custom',
            category: defaultSystemNode.data.category,
            cost: 0,
            capacity: 1000,
            description: defaultSystemNode.data.description,
            label: defaultSystemNode.data.label,
            icon: defaultSystemNode.data.icon,
            status: 'broken' // Mark as broken
          }
        }));

        // Create multiple user nodes with breakdown logic
        const totalUsers = 200;
        const userNodes = createUserNodeBreakdown(totalUsers);
        
        userNodes.forEach((userNode, index) => {
          const yOffset = (index - (userNodes.length - 1) / 2) * 140;
          dispatch(addNode({
            component: {
              id: userNode.id,
              name: userNode.name,
              type: 'user',
              category: 'stakeholder',
              cost: 0,
              capacity: userNode.userCount,
              description: userNode.description,
              icon: 'users'
            },
            position: { x: centerX - 350, y: centerY + yOffset },
            nodeType: 'user',
            nodeData: {
              id: userNode.id,
              name: userNode.name,
              type: 'user',
              category: 'stakeholder',
              cost: 0,
              capacity: userNode.userCount,
              description: userNode.description,
              label: userNode.label,
              icon: 'users',
              userCount: userNode.userCount
            }
          }));
        });

        // Add edges from all user nodes to system
        userNodes.forEach((userNode) => {
          dispatch(addEdgeAction({
            source: userNode.id,
            target: 'current-system',
            sourceHandle: `${userNode.id}-output`,
            targetHandle: 'current-system-input'
          }));
        });
      }
      
      console.log('✅ Initial system state loaded successfully:', { 
        nodesDispatched: 'User nodes + system nodes', 
        edgesDispatched: 'User to system connections',
        totalUsers: 200 
      });
    } catch (error) {
      console.error('Failed to load initial system state:', error);
    }
  };

  // Fetch components from database based on mission stage requirements
  const fetchRequiredComponents = async (stageId: string) => {
    try {
      // Get the stage's required components
      const { data: stageData, error: stageError } = await supabase
        .from('mission_stages')
        .select('required_components, optional_components')
        .eq('id', stageId)
        .single();

      if (stageError) {
        console.error('Failed to fetch stage components:', stageError);
        return getDefaultComponents();
      }

      const requiredComponentIds = stageData.required_components || [];
      const optionalComponentIds = stageData.optional_components || [];
      const allComponentIds = [...new Set([...requiredComponentIds, ...optionalComponentIds])];

      if (allComponentIds.length === 0) {
        console.log('No components specified for stage, using defaults');
        return getDefaultComponents();
      }

      // Fetch the actual component data from the components table
      const { data: components, error: componentsError } = await supabase
        .from('components')
        .select('id, name, category, icon_name, color, short_description, detailed_description, concepts, use_cases, compatible_with, unlock_level, sort_order')
        .in('id', allComponentIds)
        .order('sort_order', { ascending: true });

      if (componentsError) {
        console.error('Failed to fetch components:', componentsError);
        return getDefaultComponents();
      }

      console.log(`Loaded ${components.length} components for stage:`, components.map(c => c.name));
      console.log('Required component IDs:', requiredComponentIds);
      console.log('Optional component IDs:', optionalComponentIds);
      
      return components.map(comp => ({
        id: comp.id,
        name: comp.name,
        category: comp.category,
        icon_name: comp.icon_name,
        color: comp.color,
        short_description: comp.short_description,
        detailed_description: comp.detailed_description,
        concepts: comp.concepts,
        use_cases: comp.use_cases,
        compatible_with: comp.compatible_with,
        unlock_level: comp.unlock_level || 1,
        required: requiredComponentIds.includes(comp.id) // Mark if this component is required vs optional
      }));
    } catch (error) {
      console.error('Error fetching required components:', error);
      return getDefaultComponents();
    }
  };

  const loadMissionData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let mission: MissionData | null = null;
      let stageData: MissionStageData | null = null;

      // Clear the canvas before loading new stage (Redux best practice - isolation)
      dispatch(clearCanvas({ keepRequirements: false }));
      console.log('🧹 Canvas cleared for new mission stage');

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
            components: await fetchRequiredComponents(stageData.id),
            requirements: stageData.system_requirements
          };
          
          setMissionStageData(stageData);
          console.log('Using stage-specific requirements:', stageData.system_requirements);
          
          // Dispatch system requirements to Redux (Redux best practice)
          if (stageData.system_requirements) {
            dispatch(setSystemRequirements(stageData.system_requirements));
            console.log('✅ System requirements dispatched to Redux:', stageData.system_requirements.length);
            
            // Trigger initial validation to populate requirementValidationResults
            dispatch(validateRequirementsAction());
          }
          
          // Load initial requirements when stage data is available (fallback for legacy components)
          if (stageData.id) {
            const initialReqs = stageData.system_requirements.map(req => ({
              id: req.id,
              description: req.description,
              completed: false
            }));
            setRequirements(initialReqs);
          }
          
          // Don't load initial system state here - let initializeCanvasForStage handle it
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
            // Find the current stage index based on the stage we're viewing
            const currentStageIndex = allStages.findIndex(stage => stage.id === stageData.id);
            
            console.log('🚀 CrisisSystemDesignCanvas: Dispatching setDatabaseMission', {
              missionId: stageData.mission.id,
              missionTitle: stageData.mission.title,
              stagesCount: allStages.length,
              currentStageIndex,
              allStages: allStages.map(s => ({ id: s.id, stage_number: s.stage_number, title: s.title }))
            });
            
            dispatch(setDatabaseMission({
              id: stageData.mission.id,
              title: stageData.mission.title,
              description: stageData.mission.description,
              slug: mission.slug,
              stages: allStages,
              currentStageIndex: currentStageIndex >= 0 ? currentStageIndex : 0
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
      color: '#3B82F6',
      short_description: 'Runs your application code',
      detailed_description: 'A virtual or physical server that executes your application code and handles user requests.',
      concepts: ['virtualization', 'compute resources', 'scaling'],
      use_cases: ['web applications', 'API backends', 'microservices'],
      compatible_with: ['data_store', 'load_balancer'],
      unlock_level: 1,
      required: true
    },
    {
      id: 'data_store',
      name: 'Database',
      category: 'database',
      icon_name: 'database',
      color: '#2563EB',
      short_description: 'Stores and manages application data',
      detailed_description: 'A persistent storage system for your application data with ACID properties.',
      concepts: ['data persistence', 'ACID properties', 'indexing'],
      use_cases: ['user data', 'application state', 'analytics'],
      compatible_with: ['compute_server', 'backup_service'],
      unlock_level: 1,
      required: true
    },
    {
      id: 'file_storage',
      name: 'File Storage',
      category: 'storage',
      icon_name: 'hard-drive',
      color: '#8B5CF6',
      short_description: 'Stores files and media',
      detailed_description: 'Object storage for files, images, videos, and other unstructured data.',
      concepts: ['object storage', 'CDN integration', 'backup'],
      use_cases: ['user uploads', 'static assets', 'media storage'],
      compatible_with: ['compute_server', 'cdn'],
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

  // Generate categories based on available components
  const componentCategories = useMemo(() => {
    if (!activeMission || !activeMission.components) return [];
    
    const categories = new Set(activeMission.components.map(comp => comp.category));
    console.log('Available component categories:', Array.from(categories));
    
    return Array.from(categories).map(categoryId => {
      const iconMap: Record<string, string> = {
        compute: 'server',
        database: 'database', 
        storage: 'hard-drive',
        network: 'globe',
        security: 'shield',
        analytics: 'bar-chart-3',
        integration: 'zap'
      };
      
      const nameMap: Record<string, string> = {
        compute: 'Compute',
        database: 'Database',
        storage: 'Storage', 
        network: 'Networking',
        security: 'Security',
        analytics: 'Analytics',
        integration: 'Integration'
      };
      
      return {
        id: categoryId,
        name: nameMap[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
        icon: iconMap[categoryId] || 'box'
      };
    });
  }, [activeMission]);

  // Load mission stage data when emailId is provided
  useEffect(() => {
    // Reset initialization flag when emailId changes
    canvasInitializedRef.current = false;
    
    loadMissionData();
    
    // Cleanup when component unmounts
    return () => {
      dispatch(clearDatabaseMission());
      canvasInitializedRef.current = false;
    };
  }, [emailId, missionSlug, dispatch]);

  // Load collaboration invitations when user is authenticated
  useEffect(() => {
    if (user?.id) {
      dispatch(loadCollaborationInvitations());
    }
  }, [user?.id, dispatch]);

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
  const handleRunTest = useCallback(async () => {
    if (!missionStageData?.id) {
      console.warn('No stage ID available for validation');
      return;
    }
    
    await validateRequirements(nodes, edges);
  }, [validateRequirements, nodes, edges, missionStageData?.id]);

  // Get timer test triggered state from Redux
  const timerTestTriggered = useAppSelector(state => state.mission.timerTestTriggered);
  
  // Listen for timer test trigger from Redux state
  useEffect(() => {
    if (timerTestTriggered && missionStageData?.id) {
      console.log('Timer test triggered - running validation');
      handleRunTest();
      // Reset the trigger so it doesn't fire multiple times
      dispatch(resetTimerTestTrigger());
    }
  }, [timerTestTriggered, missionStageData?.id, handleRunTest, dispatch]);

  // Trigger validation when canvas changes or stage loads
  useEffect(() => {
    if (missionStageData?.id && nodes.length > 0) {
      // Add a small delay to ensure Redux state is updated
      const timer = setTimeout(() => {
        console.log('🔍 Auto-validating requirements for canvas changes...');
        validateRequirements(nodes, edges);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [nodes.length, edges.length, missionStageData?.id, validateRequirements]);

  // Trigger initial validation when stage loads (even with empty canvas)
  useEffect(() => {
    if (missionStageData?.id) {
      console.log('📋 Running initial requirements validation for stage...');
      validateRequirements([], []);
    }
  }, [missionStageData?.id, validateRequirements]);

  // Handle closing mentor notification
  const handleCloseMentorNotification = useCallback(() => {
    setNotificationStep(0);
  }, []);

  // Handle mentor notification step progression
  const handleMentorAction = useCallback(() => {
    if (notificationStep === 1) {
      // Move from issue analysis to requirements explanation and show requirements
      setShowRequirements(true);
      setNotificationStep(2);
    } else if (notificationStep === 2) {
      // Show component drawer and move to drag/connect guidance
      setShowComponentDrawer(true);
      setNotificationStep(3);
    } else if (notificationStep === 3) {
      // End the flow
      setNotificationStep(0);
    }
  }, [notificationStep]);

  // Callback functions for multi-step flow
  const handleShowRequirements = useCallback(() => {
    setShowRequirements(true);
    // Don't change step - let the main flow handle it
  }, []);

  const handleShowComponentDrawer = useCallback(() => {
    setShowComponentDrawer(true);
    // Don't change step - let the main flow handle it
  }, []);

  const handleHideRequirements = useCallback(() => {
    setShowRequirements(false);
  }, []);

  const handleHideComponentDrawer = useCallback(() => {
    setShowComponentDrawer(false);
  }, []);

  // Track if notification flow has been started to prevent restart
  const [notificationFlowStarted, setNotificationFlowStarted] = useState(false);

  // Show mentor notification for specific email ID
  useEffect(() => {
    if (emailId === '4c9569fb-89a4-4439-80c4-8e3944990d7c' && !notificationFlowStarted) {
      // Small delay to let the UI load first
      const timer = setTimeout(() => {
        setNotificationStep(1);
        setNotificationFlowStarted(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [emailId, notificationFlowStarted]);

  // Start mentor notification flow when mission stage loads
  useEffect(() => {
    if (missionStageData && !notificationFlowStarted) {
      // Start the notification flow automatically
      const timer = setTimeout(() => {
        setNotificationStep(1);
        setNotificationFlowStarted(true);
      }, 2000); // 2 second delay for dramatic effect
      
      return () => clearTimeout(timer);
    }
  }, [missionStageData, notificationFlowStarted]); // Removed notificationStep dependency

  const toggleDrawer = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  // RTK Query for loading canvas state (after state declarations)
  const {
    data: savedCanvasData,
    isLoading: isLoadingCanvas,
    error: canvasLoadError
  } = useLoadCanvasStateQuery(
    user?.id && missionStageData?.id 
      ? { userId: user.id, stageId: missionStageData.id }
      : skipToken
  );
  
  // RTK Query mutation for saving canvas state
  const [saveCanvasStateMutation, { isLoading: isSaving }] = useSaveCanvasStateMutation();

  // Redux-based canvas state management following established patterns
  const initializeCanvasForStage = useCallback(() => {
    if (!missionStageData?.id) return;
    
    // Check if we've already initialized for this stage
    if (canvasInitializedRef.current) {
      console.log('⚠️ Canvas already initialized, skipping...');
      return;
    }
    
    // Get current state directly from Redux to avoid dependency issues
    const currentNodes = selectNodes(store.getState());
    const currentEdges = selectEdges(store.getState());
    
    console.log('🎨 Initializing canvas for stage:', missionStageData.id);
    console.log('Current nodes in canvas:', currentNodes.length);
    
    // Mark as initialized
    canvasInitializedRef.current = true;
    
    // Set this as the active canvas
    dispatch(setActiveCanvas({ stageId: missionStageData.id }));
    
    // Check if we have saved canvas state for this stage
    if (savedCanvasData?.canvasState && savedCanvasData.canvasState.nodes.length > 0) {
      console.log('📂 Loading saved canvas state into design slice');
      console.log('Saved nodes count:', savedCanvasData.canvasState.nodes.length);
      
      // Only load if canvas is empty to prevent duplicates
      if (currentNodes.length === 0) {
        // Load saved nodes into design slice
        savedCanvasData.canvasState.nodes.forEach((node: any) => {
          // Validate node has required data
          if (!node.data || !node.position) {
            console.warn('⚠️ Skipping invalid node:', node);
            return;
          }
          
          dispatch(addNode({ 
            component: node.data, 
            position: node.position,
            nodeType: node.type || 'custom',
            nodeData: node.data
          }));
        });
        
        // Load saved edges into design slice
        savedCanvasData.canvasState.edges.forEach((edge: any) => {
          // Validate edge has required fields
          if (!edge.source || !edge.target) {
            console.warn('⚠️ Skipping invalid edge:', edge);
            return;
          }
          
          dispatch(addEdgeAction({
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle
          }));
        });
      } else {
        console.log('⚠️ Skipping saved state load - nodes already exist in canvas');
      }
      
      // Also update canvas slice for persistence tracking
      dispatch(loadCanvasState({
        stageId: missionStageData.id,
        nodes: savedCanvasData.canvasState.nodes,
        edges: savedCanvasData.canvasState.edges,
        viewport: savedCanvasData.canvasState.viewport
      }));
    } else if (missionStageData.id && !savedCanvasData?.canvasState && currentNodes.length === 0) {
      console.log('🆕 No saved canvas state and canvas is empty, will load initial system state');
      
      // Load initial system state for this stage
      loadInitialSystemState(missionStageData.id);
    } else if (currentNodes.length > 0) {
      console.log('📦 Syncing current design state to canvas slice');
      // Sync designSlice state to canvasSlice for persistence
      dispatch(updateCanvasState({
        stageId: missionStageData.id,
        nodes: currentNodes.map(serializeNode),
        edges: currentEdges.map(serializeEdge),
        viewport: { x: 0, y: 0, zoom: 0.6 }
      }));
    }
  }, [dispatch, missionStageData?.id, savedCanvasData]);

  // Auto-save canvas state when nodes/edges change
  const persistCanvasState = useCallback(async () => {
    if (!user?.id || !missionStageData?.id || nodes.length === 0) return;
    
    const canvasStateData = {
      nodes: nodes.map(serializeNode),
      edges: edges.map(serializeEdge),
      viewport: { x: 0, y: 0, zoom: 0.6 },
      timestamp: new Date().toISOString()
    };
    
    try {
      // Save to local storage/Redux
      await saveCanvasStateMutation({
        userId: user.id,
        missionId: missionStageData.mission.id,
        stageId: missionStageData.id,
        canvasState: canvasStateData
      }).unwrap();
      
      // If in collaborative mode, update the session
      if (isCollaborative && sessionId) {
        await realtimeCollaborationService.updateCanvasState(sessionId, nodes, edges);
      }
      
      console.log('Canvas state saved successfully');
    } catch (error) {
      console.error('Failed to save canvas state:', error);
    }
  }, [user?.id, missionStageData, nodes, edges, saveCanvasStateMutation, isCollaborative, sessionId]);

  // Initialize canvas when stage data is available
  useEffect(() => {
    if (user && missionStageData && !isLoadingCanvas) {
      // Only initialize if we've finished loading canvas data or determined there is none
      if (savedCanvasData !== undefined || canvasLoadError) {
        initializeCanvasForStage();
      }
    }
  }, [user, missionStageData, isLoadingCanvas, savedCanvasData, canvasLoadError, initializeCanvasForStage]);

  // Auto-save with debouncing when nodes/edges change
  useEffect(() => {
    if (!user || !missionStageData || nodes.length === 0) return;
    
    // Debounce the save operation to avoid excessive API calls
    const timeoutId = setTimeout(() => {
      persistCanvasState();
    }, 2000); // Save after 2 seconds of inactivity
    
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, user, missionStageData, persistCanvasState]);

  // Handle collaboration session
  useEffect(() => {
    if (!sessionId || !user) return;

    const initializeCollaboration = async () => {
      try {
        // Join the session
        const session = await realtimeCollaborationService.joinSession(sessionId);
        setCollaborationSession(session);
        setIsCollaborative(true);

        // Subscribe to real-time updates
        const subscription = supabase
          .channel(`design_session:${sessionId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'design_sessions',
            filter: `id=eq.${sessionId}`
          }, (payload) => {
            // Update canvas state when session changes
            if (payload.new && 'canvas_state' in payload.new && payload.new.canvas_state) {
              const { nodes: newNodes, edges: newEdges } = payload.new.canvas_state as { nodes: any[], edges: any[] };
              dispatch(onNodesChange(newNodes));
              dispatch(onEdgesChange(newEdges));
            }
          })
          .on('presence', { event: 'sync' }, () => {
            // Handle collaborator presence
            const state = subscription.presenceState();
            const collaboratorList = Object.values(state).flat();
            setCollaborators(collaboratorList);
            
            // Update cursors
            const newCursors: Record<string, { x: number; y: number; timestamp: number }> = {};
            collaboratorList.forEach((collab: any) => {
              if (collab.userId !== user.id && collab.cursor) {
                newCursors[collab.userId] = {
                  ...collab.cursor,
                  timestamp: Date.now()
                };
              }
            });
            setCursors(newCursors);
            
            // Notify GameHUD about existing collaborators on initial sync
            if ((window as any).handleCollaboratorPresence) {
              // First clear all collaborators
              collaboratorList.forEach((collab: any) => {
                if (collab.userId !== user.id) {
                  (window as any).handleCollaboratorPresence('left', {
                    id: collab.userId,
                    username: collab.username || 'Anonymous'
                  });
                }
              });
              
              // Then add current collaborators
              collaboratorList.forEach((collab: any) => {
                if (collab.userId !== user.id) {
                  (window as any).handleCollaboratorPresence('joined', {
                    id: collab.userId,
                    username: collab.username || 'Anonymous'
                  });
                }
              });
            }
          })
          .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            console.log('User joined:', newPresences);
            // Notify GameHUD of new collaborator
            newPresences.forEach((presence: any) => {
              if (presence.userId !== user.id) {
                const username = presence.username || 'Anonymous';
                if ((window as any).handleCollaboratorPresence) {
                  (window as any).handleCollaboratorPresence('joined', {
                    id: presence.userId,
                    username: username
                  });
                }
              }
            });
          })
          .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            console.log('User left:', leftPresences);
            // Notify GameHUD of collaborator leaving
            leftPresences.forEach((presence: any) => {
              if (presence.userId !== user.id) {
                const username = presence.username || 'Anonymous';
                if ((window as any).handleCollaboratorPresence) {
                  (window as any).handleCollaboratorPresence('left', {
                    id: presence.userId,
                    username: username
                  });
                }
              }
            });
          })
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              // Send initial presence
              await subscription.track({
                userId: user.id,
                username: user.email?.split('@')[0] || 'Anonymous',
                cursor: { x: 0, y: 0 }
              });
            }
          });

        // Store subscription reference
        collaborationChannelRef.current = subscription;

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Failed to join collaboration session:', error);
        setError('Failed to join collaboration session');
      }
    };

    initializeCollaboration();
  }, [sessionId, user, dispatch]);

  // Track mouse movement for collaborative cursor
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isCollaborative || !collaborationChannelRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Throttle cursor updates
    if (collaborationChannelRef.current) {
      collaborationChannelRef.current.track({
        userId: user?.id,
        username: user?.email?.split('@')[0] || 'Anonymous',
        cursor: { x, y }
      });
    }
  }, [isCollaborative, user]);

  // Debug useEffect to check if nodes and edges are loaded for MentorChat
  useEffect(() => {
    if (missionStageData && nodes.length > 0 && edges.length > 0) {
      console.log('Nodes and edges loaded for MentorChat:', {
        nodesCount: nodes.length,
        edgesCount: edges.length
      });
    }
  }, [missionStageData, nodes, edges]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading mission data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  const miniMapNodeColor = (node: Node) => {
    const type = node.data?.componentType || node.type;
    return componentTypeColors[type as keyof typeof componentTypeColors] || componentTypeColors.default;
  };

  const componentTypeColors = {
    api: '#3B82F6',
    database: '#2563EB',
    queue: '#8B5CF6',
    cache: '#EC4899',
    service: '#10B981',
    load_balancer: '#F59E0B',
    cdn: '#6366F1',
    default: '#6B7280'
  };

  return (
    <div className={styles.crisisCanvas}>
      {/* React Flow Canvas - Always visible */}
      <div className={styles.canvasContainer}>
        {/* Component Drawer - Shows when needed */}
        {showComponentDrawer && (
          <div className={styles.componentDrawer}>
            <ComponentDrawer
              components={drawerComponents}
              categories={componentCategories}
              searchQuery={drawerSearchQuery}
              onSearchChange={setDrawerSearchQuery}
              onComponentSelect={(component) => {
                console.log('Component selected:', component);
                // Could add component to canvas here
              }}
              className={styles.drawerContainer}
            />
          </div>
        )}

            <div className={styles.reactFlowWrapper} onMouseMove={handleMouseMove} ref={canvasRef}>
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
            elementsSelectable={true}
            selectNodesOnDrag={false}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              color={theme === 'dark' ? '#1a1a1a' : '#e0e0e0'}
            />
            <Controls
              position="bottom-right"
              showInteractive={false}
            />
          </ReactFlow>
          
          {/* Render collaborator cursors */}
          {isCollaborative && canvasRef.current && (
            <CursorManager
              cursors={cursors}
              participants={Object.fromEntries(
                collaborators.map((c: any) => [c.userId, { 
                  id: c.userId,
                  name: c.username,
                  color: '#' + Math.floor(Math.random()*16777215).toString(16),
                  last_seen: Date.now(),
                  status: 'active' as const
                }])
              )}
              canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
            />
          )}
        </div>

        {/* Floating Requirements on the right side */}
        {missionStageData && showRequirements && (
          <div className={styles.floatingRequirements}>
            <Requirements
              onTestSystem={handleRunTest}
              className={styles.bottomRequirements}
            />
          </div>
        )}

        {/* Mentor Notification - Multi-step Flow */}
        {notificationStep > 0 && missionStageData && (
          <MentorNotification
            title={
              notificationStep === 1 ? "System Analysis" : 
              notificationStep === 2 ? "Requirements Needed" :
              "Drag & Connect Guide"
            }
            message={
              notificationStep === 1
                ? `${missionStageData.title}: ${missionStageData.problem_description} Ahhh the classic overloaded server problem. This guy thought he could just run a website from his local computer and everything would be fine.`
                : notificationStep === 2
                ? "To fix this system, you need to implement 3 specific architecture requirements: 1) Separate the web server from the database, 2) Connect the web server to the database properly, and 3) Ensure proper data flow between components. I've shown the requirements on the right - now let me show you how to implement them."
                : "Perfect! Now you can see the available components on the left. To build your architecture: 1) Drag components like 'Web Server' and 'Database' from the drawer onto the canvas, 2) Click and drag from the small circular handles on each component to connect them together, 3) Make sure to connect users → web server → database for proper data flow."
            }
            onClose={handleCloseMentorNotification}
            actionLabel={
              notificationStep === 1 ? "What do I need to do?" : 
              notificationStep === 2 ? "How do I do this?" :
              "Got it!"
            }
            onAction={handleMentorAction}
            onShowRequirements={handleShowRequirements}
            onShowComponentDrawer={handleShowComponentDrawer}
            onHideRequirements={handleHideRequirements}
            onHideComponentDrawer={handleHideComponentDrawer}
            missionStageId={missionStageData?.id}
            conversationSessionId={conversationSessionId}
            position="bottom"
            autoHideDuration={0}
          />
        )}

        {/* Mentor Chat - Only render when stage data and initial state are loaded */}
        {missionStageData && (
          <MentorChat 
            missionStageId={emailId}
            missionTitle={missionStageData?.title}
            problemDescription={missionStageData?.problem_description}
            canvasNodes={nodes}
            canvasEdges={edges}
            requirements={requirements}
            availableComponents={availableComponents}
          />
        )}

        {/* Component Detail Modal */}
        <ComponentDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          component={selectedComponent}
          availableComponents={allComponentDetails}
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