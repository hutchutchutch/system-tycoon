import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import type { Mentor } from '../../components/molecules/MentorCard';
import { Search, ChevronDown, Minimize2, ChevronsRight, Users } from 'lucide-react';
import { Input } from '../../components/atoms/Input';
import { Icon } from '../../components/atoms/Icon';
import { useAppSelector } from '../../hooks/redux';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  selectSelectedComponent, 
  selectIsCollaborationMode, 
  selectComponentRequirements, 
  selectComponentInitialNodes,
  selectCollaborationSettings 
} from '../../features/game/gameSlice';
import '@xyflow/react/dist/style.css';
import '../../styles/design-system/index.css';

// Ensure React Flow container has proper styling
const reactFlowStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--color-neutral-50)'
};

const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden'
};

const mainLayoutStyle = {
  flex: 1,
  display: 'flex',
  minHeight: 0
};

// Component categories and data
const componentCategories = [
  { id: 'compute', name: 'Compute', icon: 'cpu' as const },
  { id: 'storage', name: 'Storage', icon: 'database' as const },
  { id: 'networking', name: 'Networking', icon: 'globe' as const },
  { id: 'security', name: 'Security', icon: 'shield' as const },
];

const availableComponents = [
  { id: 'web-server', name: 'Web Server', category: 'compute', cost: 50, capacity: 1000, description: 'Handle HTTP requests', icon: 'server' as const },
  { id: 'database', name: 'Database', category: 'storage', cost: 100, capacity: 500, description: 'Store and retrieve data', icon: 'database' as const },
  { id: 'load-balancer', name: 'Load Balancer', category: 'networking', cost: 75, capacity: 2000, description: 'Distribute traffic', icon: 'globe' as const },
  { id: 'api-gateway', name: 'API Gateway', category: 'networking', cost: 25, capacity: 5000, description: 'Manage API requests', icon: 'external-link' as const },
  { id: 'cache', name: 'Cache', category: 'storage', cost: 30, capacity: 10000, description: 'Speed up data access', icon: 'activity' as const },
  { id: 'compute', name: 'Compute Instance', category: 'compute', cost: 80, capacity: 800, description: 'General computation', icon: 'cpu' as const },
];

// Default nodes when no specific component is selected
const defaultInitialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Load Balancer' },
    position: { x: 100, y: 100 },
    style: { background: '#4f46e5', color: 'white' },
  },
  {
    id: '2',
    data: { label: 'Web Server' },
    position: { x: 300, y: 100 },
    style: { background: '#059669', color: 'white' },
  },
  {
    id: '3',
    data: { label: 'Database' },
    position: { x: 500, y: 100 },
    style: { background: '#dc2626', color: 'white' },
  },
];

const defaultInitialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export const SystemDesignPage: React.FC = () => {
  const { scenarioId } = useParams();
  
  // Theme context
  const { theme } = useTheme();
  
  // Redux selectors
  const selectedComponent = useAppSelector(selectSelectedComponent);
  const isCollaborationMode = useAppSelector(selectIsCollaborationMode);
  const componentRequirements = useAppSelector(selectComponentRequirements);
  const componentInitialNodes = useAppSelector(selectComponentInitialNodes);
  const collaborationSettings = useAppSelector(selectCollaborationSettings);
  
  // Get initial nodes from Redux or use defaults
  const initialNodes = componentInitialNodes.length > 0 ? componentInitialNodes : defaultInitialNodes;
  const initialEdges = defaultInitialEdges;
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  
  // Component drawer state
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['compute', 'storage', 'networking'])
  );
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  
  // Mentor panel state
  const [isMentorCollapsed, setIsMentorCollapsed] = useState(true);

  useEffect(() => {
    // Load selected mentor from localStorage only once
    const mentorData = localStorage.getItem('selectedMentor');
    
    if (mentorData && !selectedMentor) {
      try {
        const mentor = JSON.parse(mentorData);
        setSelectedMentor(mentor);
        console.log(`👨‍🏫 Loaded mentor: ${mentor.name}`);
      } catch (error) {
        console.error('Failed to parse mentor data:', error);
      }
    }
    
    // Log Redux component selection state
    if (selectedComponent) {
      console.log(`📋 Component selection from Redux:`, selectedComponent);
      console.log(`🎯 Component type: ${selectedComponent.componentType}`);
      console.log(`🎯 Mode: ${selectedComponent.mode}`);
      console.log(`🎯 Scenario ID: ${selectedComponent.scenarioId}`);
      console.log(`📋 Requirements:`, componentRequirements);
      
      if (isCollaborationMode) {
        console.log(`👥 Collaboration mode active:`, collaborationSettings);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent, componentRequirements, isCollaborationMode, collaborationSettings]); // Dependencies for Redux state

  // Update nodes when component selection changes
  useEffect(() => {
    if (componentInitialNodes.length > 0) {
      console.log(`🔄 Updating canvas with component-specific nodes:`, componentInitialNodes);
      setNodes(componentInitialNodes);
    }
  }, [componentInitialNodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Component drawer functions
  const filteredComponents = React.useMemo(() => {
    if (!searchQuery) return availableComponents;
    const query = searchQuery.toLowerCase();
    return availableComponents.filter(component => 
      component.name.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query) ||
      component.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedComponents = React.useMemo(() => {
    return componentCategories.reduce((acc, category) => {
      acc[category.id] = filteredComponents.filter(
        component => component.category === category.id
      );
      return acc;
    }, {} as Record<string, typeof availableComponents>);
  }, [filteredComponents]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  return (
    <div style={{ ...containerStyle, backgroundColor: 'var(--color-neutral-50)' }} className="text-gray-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={reactFlowStyle}
        colorMode={theme}
      >
        {/* Game HUD Panel - Top Center */}
        <Panel position="top-center" className="pointer-events-none">
          <div className="flex gap-4 pointer-events-auto">
            <div className="bg-gray-800 px-4 py-2 rounded shadow-lg text-white">
              Timer: 15:00
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded shadow-lg text-white">
              Budget: $0 / $200
            </div>
            {isCollaborationMode && (
              <div className="bg-green-600 px-4 py-2 rounded shadow-lg text-white flex items-center gap-2">
                <Users size={16} />
                <span>Collaboration Mode</span>
              </div>
            )}
          </div>
        </Panel>

        {/* Component Drawer Panel - Left Side */}
        {!isDrawerCollapsed && (
          <Panel position="top-left" className="pointer-events-auto">
            <div className="component-drawer" style={{ width: '320px', maxHeight: '70vh' }}>
              <div className="component-drawer__header">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">Components</h2>
                  <button
                    onClick={() => setIsDrawerCollapsed(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Collapse drawer"
                  >
                    <Minimize2 size={16} />
                  </button>
                </div>
                <div className="component-drawer__search">
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search components..."
                    leftIcon={<Search size={16} />}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="component-drawer__categories">
                {componentCategories.map(category => {
                  const categoryComponents = groupedComponents[category.id] || [];
                  const isExpanded = expandedCategories.has(category.id);
                  
                  return (
                    <div key={category.id} className="component-category">
                      <button
                        className="component-category__header"
                        onClick={() => toggleCategory(category.id)}
                        aria-expanded={isExpanded}
                      >
                        <Icon name={category.icon} size="md" className="component-category__icon" />
                        <span className="component-category__title">{category.name}</span>
                        <span className="component-category__count">
                          {categoryComponents.length}
                        </span>
                        <ChevronDown 
                          className={`component-category__chevron ${isExpanded ? 'component-category--expanded' : ''}`}
                          size={16}
                        />
                      </button>
                      
                      {isExpanded && (
                        <div className="component-category__items">
                          {categoryComponents.length === 0 ? (
                            <p className="text-gray-400 text-sm p-2">
                              No components found
                            </p>
                          ) : (
                            categoryComponents.map(component => (
                              <div
                                key={component.id}
                                className="component-item"
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('application/reactflow', JSON.stringify(component));
                                }}
                              >
                                <div className="component-item__icon">
                                  <Icon name={component.icon} size="md" />
                                </div>
                                <div className="component-item__content">
                                  <div className="component-item__name">{component.name}</div>
                                  <div className="component-item__cost">${component.cost}/mo</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
        )}

        {/* Collapsed Drawer Toggle */}
        {isDrawerCollapsed && (
          <Panel position="top-left" className="pointer-events-auto">
            <button
              onClick={() => setIsDrawerCollapsed(false)}
              className="bg-gray-800 p-4 rounded-lg shadow-lg text-white hover:bg-gray-700 transition-colors flex flex-col items-center justify-center min-w-[80px] min-h-[80px]"
              aria-label="Expand resources drawer"
            >
              <ChevronsRight size={20} className="mb-1" />
              <span className="text-xs font-medium">Resources</span>
            </button>
          </Panel>
        )}

        {/* Mentor Assistant Panel */}
        {selectedMentor && (
          <>
            {/* Collapsed Mentor - Bottom Left Avatar */}
            {isMentorCollapsed && (
              <Panel position="bottom-left" className="pointer-events-auto">
                <button
                  onClick={() => setIsMentorCollapsed(false)}
                  className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:bg-blue-700 transition-colors border-2 border-white"
                  aria-label={`Open guidance from ${selectedMentor.name}`}
                  title={`${selectedMentor.name} - ${selectedMentor.title}`}
                >
                  {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                </button>
              </Panel>
            )}

            {/* Expanded Mentor - Bottom Left Chat Window */}
            {!isMentorCollapsed && (
              <Panel position="bottom-left" className="pointer-events-auto">
                <div className="mentor-chat" style={{ 
                  width: '350px', 
                  height: '420px', 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid var(--color-neutral-200)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  overflow: 'hidden'
                }}>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--color-primary-500)', color: 'white' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
                        {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{selectedMentor.name}</h3>
                        <p className="text-white/80 text-xs flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          {selectedMentor.title}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMentorCollapsed(true)}
                      className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                      aria-label="Close mentor chat"
                    >
                      <Minimize2 size={16} />
                    </button>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                    {/* Welcome Message */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: 'var(--color-primary-500)', flexShrink: 0 }}>
                        {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col gap-1 max-w-[240px]">
                        <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                          <p className="mb-1">👋 Hi! I'm {selectedMentor.name.split(' ')[0]}.</p>
                          <p className="text-xs text-gray-600 italic">"{selectedMentor.quote}"</p>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">just now</span>
                      </div>
                    </div>

                    {/* Context Message */}
                    {selectedComponent && (
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: 'var(--color-primary-500)', flexShrink: 0 }}>
                          {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col gap-1 max-w-[240px]">
                          <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                            <p>I'll help you design <span style={{ color: 'var(--color-primary-600)' }} className="font-medium">{selectedComponent.componentType || 'system'}</span> components{isCollaborationMode ? ' in collaboration mode' : ''}.</p>
                          </div>
                          <span className="text-xs text-gray-400 ml-2">just now</span>
                        </div>
                      </div>
                    )}

                    {/* Expertise Tags */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: 'var(--color-primary-500)', flexShrink: 0 }}>
                        {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col gap-1 max-w-[240px]">
                        <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                          <p className="mb-2">My expertise areas:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedMentor.tags.slice(0, 3).map((tag) => (
                              <span key={tag} style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)' }} className="text-xs px-2 py-1 rounded-full font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">just now</span>
                      </div>
                    </div>

                    {/* Guidance Message */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: 'var(--color-primary-500)', flexShrink: 0 }}>
                        {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                                              <div className="flex flex-col gap-1 max-w-[240px]">
                          <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                            <p>💡 <span className="font-medium">Pro tip:</span> Start with the fundamentals and build incrementally. Focus on {selectedComponent?.componentType || 'system'} scalability patterns.</p>
                          </div>
                          <span className="text-xs text-gray-400 ml-2">just now</span>
                        </div>
                    </div>
                  </div>
                  
                  {/* Chat Input (Placeholder for future) */}
                  <div className="p-4 bg-white border-t" style={{ borderColor: 'var(--color-neutral-200)' }}>
                                         <div style={{ backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)', borderColor: 'var(--color-neutral-300)' }} className="text-sm p-3 rounded-lg text-center border-2 border-dashed">
                      💬 Interactive chat coming soon...
                    </div>
                  </div>
                </div>
              </Panel>
            )}
          </>
        )}


        
        {/* Requirements Panel - Top Right */}
        {componentRequirements.length > 0 && (
          <Panel position="top-right" className="pointer-events-auto">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-[300px]" style={{ border: '1px solid var(--color-neutral-200)' }}>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="activity" size="md" />
                Requirements
              </h3>
              <div className="space-y-2">
                {componentRequirements.map((req: any) => (
                  <div key={req.id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        req.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        req.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {req.priority}
                      </span>
                      <span className="text-gray-600 font-medium">
                        {req.target} {req.unit}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{req.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        )}

        {/* React Flow MiniMap */}
        <MiniMap 
          className="react-flow__minimap"
          nodeColor="#4f46e5"
          maskColor="rgba(0, 0, 0, 0.5)"
        />
        
        {/* React Flow Background */}
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          className="react-flow__background"
        />
      </ReactFlow>
    </div>
  );
};