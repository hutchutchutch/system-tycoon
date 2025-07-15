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
import { Search, ChevronDown, Minimize2, ChevronsRight } from 'lucide-react';
import { Input } from '../../components/atoms/Input';
import { Icon } from '../../components/atoms/Icon';
import '@xyflow/react/dist/style.css';
import '../../styles/design-system/index.css';

// Ensure React Flow container has proper styling
const reactFlowStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#1f2937'
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

const initialNodes: Node[] = [
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

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export const SystemDesignCanvas: React.FC = () => {
  const { scenarioId } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [mentorContext, setMentorContext] = useState<any>(null);
  
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
    const contextData = localStorage.getItem('mentorContext');
    
    if (mentorData && !selectedMentor) {
      try {
        const mentor = JSON.parse(mentorData);
        setSelectedMentor(mentor);
        console.log(`👨‍🏫 Loaded mentor: ${mentor.name}`);
      } catch (error) {
        console.error('Failed to parse mentor data:', error);
      }
    }
    
    if (contextData && !mentorContext) {
      try {
        const context = JSON.parse(contextData);
        setMentorContext(context);
        console.log(`📋 Loaded mentor context:`, context);
        console.log(`🎯 Component type from context: ${context.componentType}`);
        console.log(`🎯 Scenario ID from context: ${context.scenarioId}`);
      } catch (error) {
        console.error('Failed to parse mentor context:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array for mount-only effect

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
    <div style={containerStyle} className="bg-gray-900 text-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={reactFlowStyle}
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

            {/* Expanded Mentor - Right Side */}
            {!isMentorCollapsed && (
              <Panel position="top-right" className="pointer-events-auto">
                <div style={{ width: '320px', maxHeight: '70vh', backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div className="border-b border-gray-700 pb-4 mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Mentor Guidance</h2>
                    <button
                      onClick={() => setIsMentorCollapsed(true)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Collapse mentor guidance"
                    >
                      <Minimize2 size={16} />
                    </button>
                  </div>
                  
                  <div style={{ flex: 1, overflow: 'auto' }}>
                    <div className="space-y-4">
                      {/* Mentor Info */}
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{selectedMentor.name}</h3>
                            <p className="text-gray-400 text-sm">{selectedMentor.title}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm italic">"{selectedMentor.quote}"</p>
                      </div>

                      {/* Context */}
                      {mentorContext && (
                        <div className="bg-gray-700 p-3 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Design Focus</h4>
                          <p className="text-gray-300 text-sm">
                            Designing <span className="text-blue-400">{mentorContext.componentType || 'system'}</span> components
                          </p>
                        </div>
                      )}

                      {/* Mentor Specialties */}
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {selectedMentor.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-300 text-sm">{selectedMentor.tagline}</p>
                      </div>

                      {/* Sample Guidance */}
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Guidance</h4>
                        <p className="text-gray-300 text-sm">
                          <span className="text-blue-400">{selectedMentor.name.split(' ')[0]}</span> suggests: 
                          "Start with the fundamentals and build incrementally. Focus on {mentorContext?.componentType || 'system'} scalability patterns."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            )}
          </>
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