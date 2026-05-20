import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
  useReactFlow,
  useViewport,
} from '@xyflow/react';
import type { Connection, Node, NodeProps } from '@xyflow/react';
import { ChevronDown, ChevronUp, AlertTriangle, Users, Server, Database, Zap, Box, HardDrive, Globe, Shield, BarChart3, Info, Settings, Clipboard, ClipboardCheck, X, LayoutGrid } from 'lucide-react';


import { ResourceDrawer } from '../../components/organisms/ComponentDrawer/ComponentDrawer';
import { Requirements } from '../../components/molecules/Requirements/Requirements';
import { CostEstimation } from '../../components/molecules/CostEstimation';
import { MultiConnectionLine } from '../../components/molecules/MultiConnectionLine/MultiConnectionLine';
import { MentorNotification } from '../../components/organisms/MentorNotification/MentorNotification';
import { MentorChat } from '../../components/organisms/MentorChat/MentorChat';
import { useConversationSession } from '../../hooks/useConversationSession';
import { computeInitialViewport } from '../../utils/canvasViewport';
import { ResourceDetailModal, type ComponentDetail } from '../../components/molecules/ComponentDetailModal/ComponentDetailModal';
import { missionService, type MissionData, type Requirement } from '../../services/missionService';
import { useRequirementValidation } from '../../hooks/useRequirementValidation';
import type { ValidationResponse } from '../../services/missionService';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../services/cloudflareApi';
// Redux imports following the established patterns
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { store } from '../../store';
import { completeStep, updateMetrics, setDatabaseMission, completeDatabaseStage, clearDatabaseMission, resetTimerTestTrigger } from '../../features/mission/missionSlice';
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

interface MissionWhiteboardProps {
  missionSlug?: string;
  // emailId is now obtained from route params, not props
}

const MissionWhiteboardInner: React.FC<MissionWhiteboardProps> = ({
  missionSlug = 'health-tracker-crisis'
}) => {
  const { emailId } = useParams<{ emailId: string }>();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const mission = useAppSelector(state => state.mission);
  const user = useAppSelector(state => state.auth?.user);
  const nodes = useAppSelector(state => state.design?.nodes || []);
  const edges = useAppSelector(state => state.design?.edges || []);
  const draggedComponent = useAppSelector(state => state.design?.draggedComponent);
  
  const { screenToFlowPosition, setViewport } = useReactFlow();
  const viewport = useViewport();

  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLogs, setCopiedLogs] = useState(false);

  // Rolling console log buffer — stores last 300 entries with timestamps
  const consoleLogBuffer = useRef<Array<{ ts: number; level: string; msg: string }>>([]);

  // Position change history — stores up to 50 viewport snapshots
  const positionLog = useRef<Array<{ ts: number; x: number; y: number; zoom: number }>>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  const [missionStageData, setMissionStageData] = useState<MissionStageData | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasInitializedRef = useRef<boolean>(false);

  // Intercept console.* on mount so the debug widget can capture logs
  useEffect(() => {
    const MAX = 300;
    const patch = (level: string, original: (...args: any[]) => void) =>
      (...args: any[]) => {
        original.apply(console, args);
        const msg = args.map(a => {
          try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch { return String(a); }
        }).join(' ');
        consoleLogBuffer.current.push({ ts: Date.now(), level, msg });
        if (consoleLogBuffer.current.length > MAX) consoleLogBuffer.current.shift();
      };

    const origLog   = console.log;
    const origWarn  = console.warn;
    const origError = console.error;
    console.log   = patch('log',   origLog);
    console.warn  = patch('warn',  origWarn);
    console.error = patch('error', origError);

    return () => {
      console.log   = origLog;
      console.warn  = origWarn;
      console.error = origError;
    };
  }, []);

  // Track viewport changes in positionLog
  // Always-current viewport ref — used by persistCanvasState without re-render churn
  const liveViewportRef = useRef(viewport);
  useEffect(() => { liveViewportRef.current = viewport; }, [viewport]);

  const prevViewport = useRef({ x: 0, y: 0, zoom: 0 });
  useEffect(() => {
    const { x, y, zoom } = viewport;
    const prev = prevViewport.current;
    if (Math.abs(x - prev.x) > 2 || Math.abs(y - prev.y) > 2 || Math.abs(zoom - prev.zoom) > 0.005) {
      prevViewport.current = { x, y, zoom };
      positionLog.current.push({ ts: Date.now(), x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, zoom: Math.round(zoom * 1000) / 1000 });
      if (positionLog.current.length > 50) positionLog.current.shift();
    }
  }, [viewport]);

  /** Animate the viewport to frame the current nodes nicely. */
  const fitNodesToView = useCallback((placedNodes: Array<{ id: string; type?: string; position: { x: number; y: number } }>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || placedNodes.length === 0) return;

    const drawerWidth = 300; // requirements panel on left (280px + gap)
    const HUD_HEIGHT = 60;

    const viewport = computeInitialViewport(placedNodes, {
      canvasWidth: rect.width,
      canvasHeight: rect.height - HUD_HEIGHT,
      drawerWidth,
      minZoom: 0.9,
      maxZoom: 2.4,
      fillRatio: 0.70,
    });

    console.log('🎯 Computed initial viewport:', viewport);
    setViewport(viewport);
  }, [isDrawerCollapsed, setViewport]);
  
  // Canvas state from Redux (after missionStageData is available)
  const canvasState = useAppSelector(state => 
    missionStageData?.id ? selectCanvasState(missionStageData.id)(state) : null
  );
  const savingStatus = useAppSelector(selectSavingStatus);
  const saveError = useAppSelector(selectCanvasSaveError);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [notificationStep, setNotificationStep] = useState<number>(0); // 0: none, 1: issue analysis, 2: requirements explanation, 3: component drawer guidance
  const [showRequirements, setShowRequirements] = useState(true);
  const [showComponentDrawer, setShowComponentDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Close category popover whenever the drawer closes
  useEffect(() => { if (!showComponentDrawer) setSelectedCategory(null); }, [showComponentDrawer]);

  // Drag a component from the category popover onto the canvas
  const handlePopoverDragStart = useCallback((e: React.DragEvent, comp: any) => {
    e.dataTransfer.setData('application/reactflow', comp.category);
    e.dataTransfer.setData('application/component', JSON.stringify({
      id: comp.id, name: comp.name, type: comp.category, category: comp.category,
      cost: 50, capacity: 1000, description: comp.shortDescription,
      icon: comp.icon, color: comp.color,
    }));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // Map category id → lucide icon component
  const getCatIcon = (id: string) => {
    const map: Record<string, React.ReactNode> = {
      compute: <Server size={14} />, database: <Database size={14} />,
      storage: <HardDrive size={14} />, networking: <Globe size={14} />,
      network: <Globe size={14} />, security: <Shield size={14} />,
      cache: <Zap size={14} />, observability: <BarChart3 size={14} />,
      analytics: <BarChart3 size={14} />,
    };
    return map[id] ?? <Box size={14} />;
  };

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
    const sourceNode = nodes.find((n: any) => n.id === params.source);
    const targetNode = nodes.find((n: any) => n.id === params.target);
    console.log('📍 Connecting:', sourceNode?.data.label, '→', targetNode?.data.label);
    console.log('📊 Node IDs:', { sourceId: params.source, targetId: params.target });
    
    // Track user interaction
    setHasUserInteracted(true);
    setLastUserActionTimestamp(Date.now());
    console.log('👤 User connected components - marking for validation');
    
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

    // Track user interaction
    setHasUserInteracted(true);
    setLastUserActionTimestamp(Date.now());
    console.log('👤 User added component via drag & drop - marking for validation');

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
      const components = await api.get<ComponentDetail[]>('/game/components');
      return components.find(c => c.id === componentId) || null;
    } catch (error) {
      console.error('Error fetching component details:', error);
      return null;
    }
  };

  // Fetch all available components for compatibility resolution
  const fetchAllComponentDetails = async (): Promise<ComponentDetail[]> => {
    try {
      return await api.get<ComponentDetail[]>('/game/components');
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
      const emailData = await api.get<{ id: string; mission_id: string; stage_id: string | null }>(`/emails/${emailId}`).catch(() => null);

      if (!emailData) {
        console.warn('Failed to load email');
        return null;
      }

      let resolvedStageId = emailData.stage_id;

      // If the email has no stage_id, look up stage 1 of the mission by mission_id
      if (!resolvedStageId && emailData.mission_id) {
        console.log('Email has no stage_id — loading first stage for mission:', emailData.mission_id);
        const firstStage = await api.get<{ id: string }>(`/missions/first-stage/${emailData.mission_id}`).catch(() => null);
        resolvedStageId = firstStage?.id ?? null;
      }

      if (!resolvedStageId) {
        console.warn('Could not resolve a stage_id for email:', emailData);
        return null;
      }

      // Load the mission stage data using the missionService
      const stageData = await missionService.loadMissionStageById(resolvedStageId);
      
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
      console.log('🔄 Loading initial system state for stage:', stageId);
      console.log('🎯 Expected for Alex Gonzalez mission: Only Alex\'s laptop and user nodes');
      
      // Clear existing nodes before loading
      const existingNodes = selectNodes(store.getState());
      if (existingNodes.length > 0) {
        console.log('🧹 Clearing existing nodes before loading initial state');
        dispatch(clearCanvas({ keepRequirements: true }));
      }
      
      const stageData = await api.get<{ initial_system_state: any; title: string; mission_id: string }>(`/missions/stage/${stageId}`).catch(() => null);

      if (!stageData) {
        console.error('❌ Failed to load initial system state');
        console.log('📦 Loading default fallback state');
        loadDefaultSystemState();
        return;
      }

      console.log('📄 Database response for initial_system_state:', {
        stageId,
        stageTitle: stageData?.title,
        missionId: stageData?.mission_id,
        hasInitialState: !!stageData?.initial_system_state,
        initialStateKeys: stageData?.initial_system_state ? Object.keys(stageData.initial_system_state) : []
      });

      // Calculate center position for better layout
      const centerX = 400;
      const centerY = 300;

      if (stageData?.initial_system_state) {
        const { nodes: initialNodes = [], edges: initialEdges = [] } = stageData.initial_system_state;
        
        console.log('📊 Initial system state breakdown:', { 
          totalNodes: initialNodes.length, 
          totalEdges: initialEdges.length
        });
        
        // Debug each initial node
        console.log('🔍 Detailed initial nodes analysis:');
        initialNodes.forEach((node: any, index: number) => {
          console.log(`Initial Node ${index + 1}:`, {
            id: node.id,
            type: node.type,
            label: node.data?.label,
            category: node.data?.category,
            description: node.data?.description,
            position: node.position
          });
        });
        
        // Validate no Margaret nodes in initial state
        const margaretNodes = initialNodes.filter((node: any) => 
          node.data?.label?.includes('Margaret') || 
          node.data?.description?.includes('Margaret') ||
          node.id?.includes('margaret')
        );
        
        if (margaretNodes.length > 0) {
          console.error('❌ CONTAMINATION IN DATABASE: Margaret nodes found in Alex mission initial state:', {
            contaminatedNodes: margaretNodes,
            stageId: stageId,
            stageTitle: stageData.title
          });
        } else {
          console.log('✅ Initial state validation passed: No Margaret nodes detected');
        }

        // Break down user count into multiple nodes with different capacities
        const totalUsers = 200;
        const userNodes = createUserNodeBreakdown(totalUsers);

        // ── Precompute positions so we can set the viewport BEFORE dispatching ──
        const nodeHeight = 122;
        const nodeSpacing = nodeHeight + nodeHeight / 2; // 183px between centers
        const totalHeight = (userNodes.length - 1) * nodeSpacing;
        const startY = centerY - totalHeight / 2;
        const precomputedPositions = [
          ...userNodes.map((u, i) => ({ id: u.id, type: 'user', position: { x: centerX - 400, y: startY + i * nodeSpacing } })),
          ...initialNodes.map((n: any) => ({ id: n.id, type: n.type || 'custom', position: n.position || { x: centerX + 100, y: centerY } })),
        ];
        fitNodesToView(precomputedPositions); // snap viewport now — nodes will render at correct zoom
        // ────────────────────────────────────────────────────────────────────────

        // ── Staggered reveal: system node first, then users, then edges ──
        const STAGGER = 60; // ms between each user node

        // T+0 — broken system node (the thing to fix)
        if (initialNodes.length > 0) {
          initialNodes.forEach((node: any) => {
            const position = node.position || { x: centerX + 100, y: centerY };
            dispatch(addNode({
              component: {
                id: node.id, name: node.data?.label || 'Current System',
                type: node.type || 'custom', category: node.data?.category || 'compute',
                cost: 0, capacity: 1000, description: node.data?.description || '', icon: node.data?.icon || 'server'
              },
              position,
              nodeData: {
                id: node.id, name: node.data?.label || 'Current System',
                type: node.type || 'custom', category: node.data?.category || 'compute',
                cost: 0, capacity: 1000, description: node.data?.description || '',
                label: node.data?.label || 'Current System', icon: node.data?.icon || 'server', status: 'broken'
              }
            }));
          });
        }

        // T+80, T+140, … — user nodes staggered
        userNodes.forEach((userNode, index) => {
          const yPosition = startY + (index * nodeSpacing);
          setTimeout(() => {
            dispatch(addNode({
              component: {
                id: userNode.id, name: userNode.name, type: 'user', category: 'stakeholder',
                cost: 0, capacity: userNode.userCount, description: userNode.description, icon: 'users'
              },
              position: { x: centerX - 400, y: yPosition },
              nodeType: 'user',
              nodeData: {
                id: userNode.id, name: userNode.name, type: 'user', category: 'stakeholder',
                cost: 0, capacity: userNode.userCount, description: userNode.description,
                label: userNode.label, icon: 'users', userCount: userNode.userCount
              }
            }));
          }, 80 + index * STAGGER);
        });

        // After all nodes land — add edges
        const edgeDelay = 80 + userNodes.length * STAGGER + 60;
        setTimeout(() => {
          if (initialNodes.length > 0) {
            userNodes.forEach((userNode) => {
              dispatch(addEdgeAction({
                source: userNode.id, target: initialNodes[0].id,
                sourceHandle: `${userNode.id}-output`, targetHandle: `${initialNodes[0].id}-input`
              }));
            });
          }
          initialEdges.forEach((edge: any) => {
            dispatch(addEdgeAction({
              source: edge.source, target: edge.target,
              sourceHandle: edge.sourceHandle || `${edge.source}-output`,
              targetHandle: edge.targetHandle || `${edge.target}-input`
            }));
          });
        }, edgeDelay);
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
        totalUsers: 200,
        expectedResult: 'Only Alex\'s laptop + user nodes should be visible'
      });
      
      // Final validation - check what's actually in Redux after loading
      setTimeout(() => {
        const finalNodes = selectNodes(store.getState());
        const finalEdges = selectEdges(store.getState());
        
        console.log('🎯 Final canvas state after loading initial system:', {
          totalNodes: finalNodes.length,
          totalEdges: finalEdges.length,
          nodeBreakdown: finalNodes.map(n => ({
            id: n.id,
            label: n.data?.label,
            type: n.type,
            category: n.data?.category
          })),
          anyMargaretNodes: finalNodes.some(n => 
            (typeof n.data?.label === 'string' && n.data.label.includes('Margaret')) || 
            (typeof n.data?.name === 'string' && n.data.name.includes('Margaret'))
          )
        });
        
        // Alert if Margaret nodes are still present
        const margaretNodesInFinal = finalNodes.filter(n => 
          (typeof n.data?.label === 'string' && n.data.label.includes('Margaret')) || 
          (typeof n.data?.name === 'string' && n.data.name.includes('Margaret'))
        );
        
        if (margaretNodesInFinal.length > 0) {
          console.error('🚨 MARGARET NODES STILL PRESENT AFTER LOADING INITIAL STATE:', {
            margaretNodes: margaretNodesInFinal.map(n => ({
              id: n.id,
              label: n.data?.label,
              name: n.data?.name
            }))
          });
        } else {
          console.log('✅ SUCCESS: No Margaret nodes detected in final state');
        }

      }, 100);
    } catch (error) {
      console.error('Failed to load initial system state:', error);
      console.log('📦 Loading default fallback state due to error');
      loadDefaultSystemState();
    }
  };

  // Load a default system state as fallback
  const loadDefaultSystemState = () => {
    console.log('🔧 Loading default system state as fallback');
    
    const centerX = 400;
    const centerY = 300;
    
    // Add a default broken system node
    dispatch(addNode({
      component: {
        id: 'current-system-fallback',
        name: "Current System",
        type: 'custom',
        category: 'compute',
        cost: 0,
        capacity: 1000,
        description: 'The current overloaded system',
        icon: 'server'
      },
      position: { x: centerX + 100, y: centerY },
      nodeData: {
        id: 'current-system-fallback',
        name: "Current System",
        type: 'custom',
        category: 'compute',
        cost: 0,
        capacity: 1000,
        description: 'The current overloaded system',
        label: "Current System",
        icon: 'server',
        status: 'broken'
      }
    }));
    
    // Add user nodes
    const totalUsers = 200;
    const userNodes = createUserNodeBreakdown(totalUsers);

    // Precompute positions → set viewport before dispatching
    const _nh = 122, _ns = _nh + _nh / 2, _th = (userNodes.length - 1) * _ns, _sy = centerY - _th / 2;
    fitNodesToView([
      { id: 'current-system-fallback', type: 'custom', position: { x: centerX + 100, y: centerY } },
      ...userNodes.map((u, i) => ({ id: u.id, type: 'user', position: { x: centerX - 400, y: _sy + i * _ns } })),
    ]);

    userNodes.forEach((userNode, index) => {
      const nodeHeight = 122;
      const nodeSpacing = nodeHeight + nodeHeight / 2;
      const totalHeight = (userNodes.length - 1) * nodeSpacing;
      const startY = centerY - totalHeight / 2;
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
        position: { x: centerX - 400, y: yPosition },
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
    
    // Connect users to system
    userNodes.forEach((userNode) => {
      dispatch(addEdgeAction({
        source: userNode.id,
        target: 'current-system-fallback',
        sourceHandle: `${userNode.id}-output`,
        targetHandle: 'current-system-fallback-input'
      }));
    });

  };

  // Fetch components from database based on mission stage requirements
  const fetchRequiredComponents = async (stageId: string) => {
    try {
      // Get the stage's required components
      const stageData = await api.get<{ required_components: any; optional_components: any }>(`/missions/stage/${stageId}`).catch(() => null);

      if (!stageData) {
        console.error('Failed to fetch stage components');
        return getDefaultComponents();
      }

      const requiredComponentIds = stageData.required_components || [];
      const optionalComponentIds = stageData.optional_components || [];
      const allComponentIds = [...new Set([...requiredComponentIds, ...optionalComponentIds])];

      if (allComponentIds.length === 0) {
        console.log('No components specified for stage, using defaults');
        return getDefaultComponents();
      }

      // Fetch all components and filter to the required ones
      const allComponents = await api.get<any[]>('/game/components').catch(() => []);
      const components = allComponents.filter((c: any) => allComponentIds.includes(c.id));

      if (components.length === 0) {
        console.error('Failed to fetch components');
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
          
          // Dispatch system requirements to Redux — always dispatch so
          // requirementValidationResults is populated even for empty stages
          const systemReqs = (stageData.system_requirements || []).map(req => ({
            id: req.id,
            type: req.type || '',
            priority: req.priority || '',
            description: req.description,
            validation_type: req.validation_type || '',
            required_nodes: req.required_nodes || [],
            min_nodes_of_type: req.min_nodes_of_type || {},
            required_connection: req.required_connection || undefined,
            forbidden_nodes: [],
            target_value: req.target_value || 0,
            target_metric: req.target_metric || ''
          }));

          dispatch(setSystemRequirements(systemReqs));
          console.log('✅ System requirements dispatched to Redux:', systemReqs.length);
          
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
          const missionData = await api.get<{ stages: any[] }>(`/missions/stage/${stageData.id}`).catch(() => null);
          const allStages = missionData?.stages || [];

          if (allStages.length > 0) {
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
          const slugSystemReqs = mission.requirements.map(req => ({
            id: req.id,
            type: req.type || '',
            priority: req.priority || '',
            description: req.description,
            validation_type: req.validation_type || '',
            required_nodes: req.required_nodes || [],
            min_nodes_of_type: req.min_nodes_of_type || {},
            required_connection: req.required_connection || undefined,
            forbidden_nodes: [],
            target_value: req.target_value || 0,
            target_metric: req.target_metric || ''
          }));
          dispatch(setSystemRequirements(slugSystemReqs));
          setRequirements(mission.requirements.map(req => ({
            ...req,
            completed: false
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

  // Load all component details for compatibility resolution
  useEffect(() => {
    const loadAllComponents = async () => {
      const components = await fetchAllComponentDetails();
      setAllComponentDetails(components);
    };
    
    loadAllComponents();
  }, []);

  // Removed automatic validation - now using on-demand API validation

  // Handle starting the design process - manual validation via "Test System" button
  const handleRunTest = useCallback(async () => {
    if (!missionStageData?.id) {
      console.warn('No stage ID available for validation');
      return;
    }
    
    console.log('🧪 Manual validation triggered via "Test System" button');
    await validateRequirements(nodes, edges);
    
    // Reset interaction flag since we just validated
    setHasUserInteracted(false);
  }, [validateRequirements, nodes, edges, missionStageData?.id]);

  // Track user interactions to only validate when user has actually modified the canvas
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [lastUserActionTimestamp, setLastUserActionTimestamp] = useState<number>(0);

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

  // User-interaction-based validation - ONLY validate after user actions
  useEffect(() => {
    if (!hasUserInteracted || !missionStageData?.id) return;
    
    // Debounce validation to avoid excessive calls during rapid user actions
    const timer = setTimeout(() => {
      console.log('🎯 Validating requirements after user interaction...');
      validateRequirements(nodes, edges);
      
      // Reset interaction flag after validation
      setHasUserInteracted(false);
    }, 800); // Slightly longer delay to ensure all actions are complete
    
    return () => clearTimeout(timer);
  }, [hasUserInteracted, lastUserActionTimestamp, missionStageData?.id, validateRequirements, nodes, edges]);

  // NO AUTOMATIC VALIDATION - Requirements are validated only when:
  // 1. User interacts with canvas (above useEffect)
  // 2. User clicks "Test System" button (handleRunTest)
  // 3. Timer test is triggered from GameHUD (timerTestTriggered useEffect)

  // Handle closing mentor notification — persist so it doesn't reappear on reload
  const handleCloseMentorNotification = useCallback(() => {
    setNotificationStep(0);
    if (emailId) {
      localStorage.setItem(`saas_seenWhiteboardTour_${emailId}`, 'true');
    }
  }, [emailId]);

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

  // Start mentor notification flow when mission stage loads (first visit only)
  useEffect(() => {
    if (missionStageData && !notificationFlowStarted) {
      const alreadySeen = emailId
        ? localStorage.getItem(`saas_seenWhiteboardTour_${emailId}`) === 'true'
        : false;
      if (alreadySeen) {
        setNotificationFlowStarted(true);
        return;
      }
      const timer = setTimeout(() => {
        setNotificationStep(1);
        setNotificationFlowStarted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [missionStageData, notificationFlowStarted, emailId]);

  const toggleDrawer = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  // RTK Query for loading canvas state (after state declarations)
  const {
    data: savedCanvasData,
    isLoading: isLoadingCanvas,
    error: canvasLoadError
  } = useLoadCanvasStateQuery(
    missionStageData?.id
      ? { stageId: missionStageData.id }
      : skipToken
  );
  
  // RTK Query mutation for saving canvas state
  const [saveCanvasStateMutation, { isLoading: isSaving }] = useSaveCanvasStateMutation();

  // Function to clear corrupted saved canvas state
  const clearCorruptedCanvasState = useCallback(async (stageId: string) => {
    if (!user?.id) return;
    
    try {
      console.log('🧹 Clearing corrupted saved canvas state for stage:', stageId);
      
      // Delete the saved canvas state from Supabase
      try {
        await api.delete(`/canvas/${stageId}`);
        console.log('✅ Successfully cleared corrupted canvas state from database');
      } catch (err) {
        console.error('❌ Failed to clear corrupted canvas state:', err);
      }
      
      // Also clear it from Redux state
      dispatch(updateCanvasState({
        stageId: stageId,
        nodes: [],
        edges: [],
        viewport: liveViewportRef.current
      }));
      
    } catch (error) {
      console.error('❌ Error clearing corrupted canvas state:', error);
    }
  }, [user?.id, dispatch]);

  // Redux-based canvas state management following established patterns
  const initializeCanvasForStage = useCallback(async () => {
    if (!missionStageData?.id) return;
    
    // For email navigation, always clear and reload
    const isFromEmail = !!emailId;
    if (isFromEmail) {
      console.log('📧 Navigation from email detected - forcing fresh load');
      canvasInitializedRef.current = false;
    }
    
    // Check if we've already initialized for this stage
    if (canvasInitializedRef.current && !isFromEmail) {
      console.log('⚠️ Canvas already initialized, skipping...');
      return;
    }
    
    // Get current state directly from Redux to avoid dependency issues
    const currentNodes = selectNodes(store.getState());
    const currentEdges = selectEdges(store.getState());
    
    console.log('🎨 Initializing canvas for stage:', missionStageData.id);
    console.log('📊 Current canvas state:', {
      currentNodesCount: currentNodes.length,
      missionTitle: missionStageData.mission.title,
      stageTitle: missionStageData.title,
      expectedMissionId: missionStageData.mission.id
    });
    console.log('🗺️ Viewport on init:', { x: viewport.x, y: viewport.y, zoom: viewport.zoom });
    console.log('📍 Node positions on init:', currentNodes.map(n => ({
      id: n.id,
      type: (n as any).type,
      label: (n as any).data?.label ?? (n as any).data?.name,
      position: n.position,
    })));
    
    // Mark as initialized
    canvasInitializedRef.current = true;
    
    // Set this as the active canvas
    dispatch(setActiveCanvas({ stageId: missionStageData.id }));
    
    // Debug saved canvas state in detail
    if (savedCanvasData?.canvasState) {
      console.log('📂 Saved canvas state analysis:', {
        hasState: !!savedCanvasData.canvasState,
        nodeCount: savedCanvasData.canvasState.nodes?.length || 0,
        edgeCount: savedCanvasData.canvasState.edges?.length || 0,
        timestamp: savedCanvasData.canvasState.timestamp,
        stageId: missionStageData.id
      });
      
      // Debug each saved node in detail
      if (savedCanvasData.canvasState.nodes?.length > 0) {
        console.log('🔍 Detailed saved node analysis:');
        savedCanvasData.canvasState.nodes.forEach((node: any, index: number) => {
          console.log(`Node ${index + 1}:`, {
            id: node.id,
            type: node.type,
            label: node.data?.label,
            category: node.data?.category,
            name: node.data?.name,
            position: node.position,
            nodeData: node.data
          });
        });
        
        // Validate that saved nodes belong to this mission/stage
        const potentialCrossMissionNodes = savedCanvasData.canvasState.nodes.filter((node: any) => 
          node.data?.label?.includes('Margaret') || 
          node.data?.name?.includes('Margaret') ||
          (node.data?.description && node.data.description.includes('Margaret'))
        );
        
                 if (potentialCrossMissionNodes.length > 0) {
           console.error('❌ CROSS-MISSION CONTAMINATION DETECTED:', {
             contaminatedNodes: potentialCrossMissionNodes.map((n: any) => ({
               id: n.id,
               label: n.data?.label,
               name: n.data?.name
             })),
             currentMission: missionStageData.mission.title,
             currentStage: missionStageData.title
           });
           
           // Clear invalid saved state from database and Redux, then load fresh initial state
           console.log('🧹 Clearing contaminated saved state and loading fresh initial state');
           await clearCorruptedCanvasState(missionStageData.id);
           loadInitialSystemState(missionStageData.id);
           return;
         }
      }
      
      // Only load saved state if canvas is empty and state is valid
      if (savedCanvasData.canvasState.nodes.length > 0 && currentNodes.length === 0) {

        console.log('✅ Loading validated saved canvas state into design slice');
        
        // Load saved nodes into design slice
        savedCanvasData.canvasState.nodes.forEach((node: any) => {
          // Validate node has required data
          if (!node.data || !node.position) {
            console.warn('⚠️ Skipping invalid node:', node);
            return;
          }
          
          console.log('➕ Adding saved node:', {
            id: node.id,
            label: node.data.label,
            type: node.type,
            category: node.data.category
          });
          
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
          
          console.log('🔗 Adding saved edge:', {
            source: edge.source,
            target: edge.target
          });
          
          dispatch(addEdgeAction({
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle
          }));
        });
        
        // Also update canvas slice for persistence tracking
        dispatch(loadCanvasState({
          stageId: missionStageData.id,
          nodes: savedCanvasData.canvasState.nodes,
          edges: savedCanvasData.canvasState.edges,
          viewport: savedCanvasData.canvasState.viewport
        }));
      } else if (currentNodes.length === 0) {
        // Saved state exists but is empty — load the initial stage state instead
        console.log('⚠️ Saved state has no nodes - loading initial state');
        loadInitialSystemState(missionStageData.id);
      }
    } else if (missionStageData.id && !savedCanvasData?.canvasState && currentNodes.length === 0) {
      console.log('🆕 No saved canvas state and canvas is empty, will load initial system state');
      
      // Load initial system state for this stage
      loadInitialSystemState(missionStageData.id);
    } else if (isFromEmail && currentNodes.length === 0) {
      // Special case: email navigation to empty canvas should always load initial state
      console.log('📧 Email navigation to empty canvas - loading initial state');
      loadInitialSystemState(missionStageData.id);
    } else if (currentNodes.length > 0) {
      console.log('📦 Syncing current design state to canvas slice');
      // Sync designSlice state to canvasSlice for persistence
      dispatch(updateCanvasState({
        stageId: missionStageData.id,
        nodes: currentNodes.map(serializeNode),
        edges: currentEdges.map(serializeEdge),
        viewport: liveViewportRef.current
      }));
    }
  }, [dispatch, missionStageData?.id, savedCanvasData, clearCorruptedCanvasState, emailId]);

  // Auto-save canvas state when nodes/edges change
  const persistCanvasState = useCallback(async () => {
    if (!user?.id || !missionStageData?.id || nodes.length === 0) return;
    
    const { x: vx, y: vy, zoom: vz } = liveViewportRef.current;
    const canvasStateData = {
      nodes: nodes.map(serializeNode),
      edges: edges.map(serializeEdge),
      viewport: { x: vx, y: vy, zoom: vz },
      timestamp: new Date().toISOString()
    };
    
    try {
      // Save to local storage/Redux
      await saveCanvasStateMutation({
        missionId: missionStageData.mission.id,
        stageId: missionStageData.id,
        canvasState: canvasStateData
      }).unwrap();
      
      console.log('Canvas state saved successfully');
    } catch (error) {
      console.error('Failed to save canvas state:', error);
    }
  }, [user?.id, missionStageData, nodes, edges, saveCanvasStateMutation]);

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


  // Debug useEffect to check if nodes and edges are loaded for MentorChat
  useEffect(() => {
    if (missionStageData && nodes.length > 0 && edges.length > 0) {
      console.log('Nodes and edges loaded for MentorChat:', {
        nodesCount: nodes.length,
        edgesCount: edges.length
      });
    }
  }, [missionStageData, nodes, edges]);
  
  // Trigger requirement validation when nodes or edges change
  useEffect(() => {
    // Only validate if we have system requirements set
    const systemReqs = store.getState().design.systemRequirements;
    if (systemReqs && systemReqs.length > 0) {
      dispatch(validateRequirementsAction());
    }
  }, [nodes, edges, dispatch]);

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
    const type = node.data?.resourceType || node.data?.componentType || node.type;
    return resourceTypeColors[type as keyof typeof resourceTypeColors] || resourceTypeColors.default;
  };

  const resourceTypeColors = {
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
      {/* React Flow Canvas */}
      <div className={styles.canvasContainer}>

        {/* ── Component Library FAB ──────────────────────────────────────── */}
        <button
          className={`${styles.componentFab} ${showComponentDrawer ? styles.open : ''}`}
          onClick={() => setShowComponentDrawer(o => !o)}
          aria-label={showComponentDrawer ? 'Close component library' : 'Open component library'}
        >
          {showComponentDrawer ? <X size={15} /> : <LayoutGrid size={15} />}
          {showComponentDrawer ? 'Close' : 'Resources'}
        </button>

        {/* ── Category bar + per-category popovers ──────────────────────── */}
        {showComponentDrawer && (
          <div className={styles.categoryBar}>
            {componentCategories.map(cat => {
              const catComponents = drawerComponents.filter(c => c.category === cat.id);
              const isOpen = selectedCategory === cat.id;
              return (
                <div key={cat.id} className={styles.categoryBtnWrapper}>
                  {/* Per-category popover */}
                  {isOpen && (
                    <div className={styles.categoryPopover}>
                      <div className={styles.popoverHeader}>{cat.name}</div>
                      {catComponents.length === 0
                        ? <p className={styles.popoverEmpty}>No components</p>
                        : catComponents.map(comp => (
                          <div
                            key={comp.id}
                            className={styles.popoverItem}
                            draggable
                            onDragStart={e => handlePopoverDragStart(e, comp)}
                            title={comp.shortDescription}
                          >
                            <span className={styles.popoverItemIcon}>{getCatIcon(comp.category)}</span>
                            <span className={styles.popoverItemName}>{comp.name}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                  {/* Category pill */}
                  <button
                    className={`${styles.categoryBtn} ${isOpen ? styles.categoryBtnActive : ''}`}
                    onClick={() => setSelectedCategory(prev => prev === cat.id ? null : cat.id)}
                    aria-expanded={isOpen}
                    aria-label={`${cat.name} components`}
                  >
                    {getCatIcon(cat.id)}
                    <span>{cat.name}</span>
                    {catComponents.length > 0 && (
                      <span className={styles.catCount}>{catComponents.length}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

            <div className={styles.reactFlowWrapper} ref={canvasRef}>
              <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {
              // Track user interactions for node changes (move, select, delete, etc.)
              const userActionChanges = changes.filter(change => 
                change.type === 'position' || change.type === 'remove' || change.type === 'select'
              );
              
              if (userActionChanges.length > 0) {
                setHasUserInteracted(true);
                setLastUserActionTimestamp(Date.now());
                console.log('👤 User modified nodes - marking for validation');
              }
              
              dispatch(onNodesChange(changes));
            }}
            onEdgesChange={(changes) => {
              // Track user interactions for edge changes (delete, select, etc.)
              const userActionChanges = changes.filter(change => 
                change.type === 'remove' || change.type === 'select'
              );
              
              if (userActionChanges.length > 0) {
                setHasUserInteracted(true);
                setLastUserActionTimestamp(Date.now());
                console.log('👤 User modified edges - marking for validation');
              }
              
              dispatch(onEdgesChange(changes));
            }}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            connectionLineComponent={MultiConnectionLine}
            multiSelectionKeyCode={["Meta", "Control"]}
            colorMode={theme}
            defaultViewport={{ x: 0, y: 0, zoom: 1.0 }}
            minZoom={0.2}
            maxZoom={2.5}
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
          
        </div>

        {/* Requirements — left sidebar */}
        {missionStageData && showRequirements && (
          <div className={styles.floatingRequirements}>
            <Requirements
              onTestSystem={handleRunTest}
              className={styles.bottomRequirements}
            />
          </div>
        )}

        {/* Cost estimate — compact HUD top-right */}
        {missionStageData && (
          <div className={styles.costHud}>
            <CostEstimation
              userScale={
                ((missionStageData as any)?.stage_number || 1) <= 2 ? 200 :
                ((missionStageData as any)?.stage_number || 1) === 3 ? 2000 :
                ((missionStageData as any)?.stage_number || 1) === 4 ? 10000 : 50000
              }
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
                ? missionStageData.problem_description
                : notificationStep === 2
                ? "Check the Requirements panel on the left — it shows exactly what your architecture needs to satisfy. Once all requirements are green, you're ready to run the simulation."
                : "Drag components from the Resources bar at the top onto the canvas, then connect them by dragging from a node's output handle to another node's input handle."
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

        {/* ── Debug Widget ─────────────────────────────────────────────── */}
        {/* FAB */}
        <button
          onClick={() => setIsDebugOpen(o => !o)}
          title="Canvas debug"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '1.5rem',
            zIndex: 9999,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 'none',
            background: isDebugOpen ? '#6366f1' : '#1e293b',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            transition: 'background 0.15s',
          }}
        >
          {isDebugOpen ? <X size={16} /> : <Settings size={16} />}
        </button>

        {/* Panel */}
        {isDebugOpen && (() => {
          const debugData = {
            viewport: { x: Math.round(viewport.x * 10) / 10, y: Math.round(viewport.y * 10) / 10, zoom: Math.round(viewport.zoom * 1000) / 1000 },
            nodeCount: nodes.length,
            connectionCount: edges.length,
            nodes: nodes.map(n => ({
              id: n.id,
              type: (n as any).type ?? 'custom',
              label: (n as any).data?.label ?? (n as any).data?.name ?? n.id,
              position: { x: Math.round((n.position?.x ?? 0) * 10) / 10, y: Math.round((n.position?.y ?? 0) * 10) / 10 },
              category: (n as any).data?.category ?? '—',
              status: (n as any).data?.status ?? '—',
            })),
            connections: edges.map(e => ({
              id: e.id,
              source: e.source,
              target: e.target,
              sourceHandle: e.sourceHandle ?? '—',
              targetHandle: e.targetHandle ?? '—',
            })),
          };

          const handleCopy = () => {
            navigator.clipboard.writeText(JSON.stringify(debugData, null, 2)).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          };

          const handleCopyLogs = () => {
            const cutoff = Date.now() - 5000;
            const recent = consoleLogBuffer.current.filter(e => e.ts >= cutoff);
            const text = recent.map(e => {
              const t = new Date(e.ts);
              const ts = `${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}:${t.getSeconds().toString().padStart(2,'0')}.${t.getMilliseconds().toString().padStart(3,'0')}`;
              return `[${ts}] [${e.level.toUpperCase()}] ${e.msg}`;
            }).join('\n') || '(no logs in last 5s)';
            navigator.clipboard.writeText(text).then(() => {
              setCopiedLogs(true);
              setTimeout(() => setCopiedLogs(false), 2000);
            });
          };

          const recentPositions = [...positionLog.current].reverse().slice(0, 8);

          return (
            <div style={{
              position: 'fixed',
              bottom: '4.5rem',
              left: '1.5rem',
              zIndex: 9998,
              width: 340,
              maxHeight: 'calc(100vh - 6rem)',
              overflowY: 'auto',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 8,
              boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#94a3b8',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #1e293b', background: '#0d1b2a' }}>
                <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 12 }}>Canvas Debug</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleCopyLogs}
                    title="Copy last 5s of console logs"
                    style={{ background: 'none', border: 'none', color: copiedLogs ? '#4ade80' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                  >
                    {copiedLogs ? <ClipboardCheck size={13} /> : <Clipboard size={13} />}
                    {copiedLogs ? 'Copied!' : '5s logs'}
                  </button>
                  <button
                    onClick={handleCopy}
                    title="Copy canvas state as JSON"
                    style={{ background: 'none', border: 'none', color: copied ? '#4ade80' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                  >
                    {copied ? <ClipboardCheck size={13} /> : <Clipboard size={13} />}
                    {copied ? 'Copied!' : 'JSON'}
                  </button>
                </div>
              </div>

              {/* Viewport (live) */}
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e293b' }}>
                <div style={{ color: '#6366f1', fontWeight: 600, marginBottom: 4 }}>Viewport (live)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '2px 8px' }}>
                  <span style={{ color: '#475569' }}>x:</span><span style={{ color: '#f1f5f9' }}>{debugData.viewport.x}</span>
                  <span style={{ color: '#475569' }}>y:</span><span style={{ color: '#f1f5f9' }}>{debugData.viewport.y}</span>
                  <span style={{ color: '#475569' }}>zoom:</span><span style={{ color: '#f1f5f9' }}>{debugData.viewport.zoom}</span>
                </div>
              </div>

              {/* Position log */}
              {recentPositions.length > 0 && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ color: '#38bdf8', fontWeight: 600, marginBottom: 4 }}>Position log (recent → oldest)</div>
                  {recentPositions.map((p, i) => {
                    const t = new Date(p.ts);
                    const ts = `${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}:${t.getSeconds().toString().padStart(2,'0')}`;
                    return (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: '1px 6px', marginBottom: 3, opacity: 1 - i * 0.1 }}>
                        <span style={{ color: '#334155' }}>{ts}</span>
                        <span style={{ color: '#64748b' }}>x={p.x} y={p.y} z={p.zoom}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Summary */}
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e293b', display: 'flex', gap: 16 }}>
                <span>Resources: <span style={{ color: '#f1f5f9' }}>{debugData.nodeCount}</span></span>
                <span>Connections: <span style={{ color: '#f1f5f9' }}>{debugData.connectionCount}</span></span>
              </div>

              {/* Nodes */}
              {debugData.nodes.length > 0 && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ color: '#22d3ee', fontWeight: 600, marginBottom: 6 }}>Resources ({debugData.nodeCount})</div>
                  {debugData.nodes.map((n, i) => (
                    <div key={n.id} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: i < debugData.nodes.length - 1 ? '1px solid #1e293b' : 'none' }}>
                      <div style={{ color: '#e2e8f0', marginBottom: 2 }}>{n.label}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px 8px' }}>
                        <span style={{ color: '#475569' }}>id:</span><span style={{ color: '#94a3b8', wordBreak: 'break-all' }}>{n.id}</span>
                        <span style={{ color: '#475569' }}>type:</span><span>{n.type}</span>
                        <span style={{ color: '#475569' }}>cat:</span><span>{n.category}</span>
                        <span style={{ color: '#475569' }}>status:</span><span style={{ color: n.status === 'broken' ? '#f87171' : '#94a3b8' }}>{n.status}</span>
                        <span style={{ color: '#475569' }}>x:</span><span style={{ color: '#fbbf24' }}>{n.position.x}</span>
                        <span style={{ color: '#475569' }}>y:</span><span style={{ color: '#fbbf24' }}>{n.position.y}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Connections */}
              {debugData.connections.length > 0 && (
                <div style={{ padding: '8px 12px' }}>
                  <div style={{ color: '#a78bfa', fontWeight: 600, marginBottom: 6 }}>Connections ({debugData.connectionCount})</div>
                  {debugData.connections.map((e, i) => (
                    <div key={e.id} style={{ marginBottom: 6, paddingBottom: 6, borderBottom: i < debugData.connections.length - 1 ? '1px solid #1e293b' : 'none' }}>
                      <div style={{ color: '#94a3b8', wordBreak: 'break-all', marginBottom: 2 }}>{e.source} → {e.target}</div>
                      <div style={{ color: '#475569', fontSize: 10 }}>{e.sourceHandle} / {e.targetHandle}</div>
                    </div>
                  ))}
                </div>
              )}

              {nodes.length === 0 && edges.length === 0 && (
                <div style={{ padding: '16px 12px', textAlign: 'center', color: '#475569' }}>No resources on canvas yet</div>
              )}
            </div>
          );
        })()}

        {/* Component Detail Modal */}
        <ResourceDetailModal
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
export const MissionWhiteboard: React.FC<MissionWhiteboardProps> = (props) => (
  <ReactFlowProvider>
    <MissionWhiteboardInner {...props} />
  </ReactFlowProvider>
);

// Legacy alias
export const CrisisSystemDesignCanvas = MissionWhiteboard;