import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, Handle, Position } from '@xyflow/react';
import type { Connection, Node, Edge, NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { completeStep, updateMetrics } from '../../features/mission/missionSlice';
import { Requirements } from '../../components/molecules';
import { useTheme } from '../../contexts/ThemeContext';
import './SystemDesignCanvasWrapper.css';

interface CrisisSystemDesignCanvasProps {
  missionId: string;
  onMissionComplete?: () => void;
}

interface CrisisMetrics {
  reportsSaved: number;
  familiesHelped: number;
  uptimePercent: number;
  dataLost: number;
  currentLoad: number;
  systemHealth: 'critical' | 'degraded' | 'healthy';
}

const initialNodes: Node[] = [
  {
    id: 'laptop',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Alex\'s Laptop\n(Web + Database)',
      status: 'critical',
      load: 98,
      errors: ['Database blocking web requests', 'Memory at 95%']
    },
    style: {
      background: '#ffebee',
      border: '2px solid #f44336',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '14px',
      fontWeight: '500',
    }
  },
  {
    id: 'families',
    type: 'default',
    position: { x: 50, y: 100 },
    data: { label: '200+ Families\nTrying to Report' },
    style: {
      background: '#e3f2fd',
      border: '2px solid #2196f3',
      borderRadius: '8px',
      padding: '10px',
    }
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1',
    source: 'families',
    target: 'laptop',
    animated: true,
    style: { stroke: '#f44336', strokeWidth: 3 },
  },
];

export const CrisisSystemDesignCanvas: React.FC<CrisisSystemDesignCanvasProps> = ({ 
  missionId, 
  onMissionComplete
}) => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const currentMission = useAppSelector((state) => state.mission.currentMission);
  const unlockedComponents = useAppSelector((state) => state.mission.unlockedComponents);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [metrics, setMetrics] = useState<CrisisMetrics>({
    reportsSaved: 0,
    familiesHelped: 0,
    uptimePercent: 42,
    dataLost: 47,
    currentLoad: 98,
    systemHealth: 'critical'
  });
  // Use unlocked components from Redux state
  const availableComponents = unlockedComponents;
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Update Redux state when dataLost changes
  useEffect(() => {
    dispatch(updateMetrics({
      totalDataLost: metrics.dataLost,
    }));
  }, [metrics.dataLost, dispatch]);

  // Requirements for the mission
  const requirements = [
    {
      id: 'separate_web_db',
      description: 'Separate web server from database',
      completed: nodes.some(n => n.id === 'web_server') && nodes.some(n => n.id === 'database')
    },
    {
      id: 'connect_web_db',
      description: 'Connect web server to database',
      completed: edges.some(e => e.source === 'web_server' && e.target === 'database')
    },
    {
      id: 'connect_families_web',
      description: 'Connect families to web server',
      completed: edges.some(e => e.source === 'families' && e.target === 'web_server')
    }
  ];

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Alex's System is Crashing!",
      content: "The laptop is running both the web server AND database. They're fighting for resources! Drag the components from the left panel to separate them.",
      highlight: ['laptop'],
      objective: "Separate the web server from the database"
    },
    {
      title: "Connect the Components",
      content: "Great! Now connect the web server to the database so they can communicate.",
      highlight: ['web_server', 'database'],
      objective: "Connect web server to database"
    },
    {
      title: "Route Traffic Properly",
      content: "Finally, make sure families connect to the web server, not directly to the database.",
      highlight: ['families', 'web_server'],
      objective: "Connect families to web server"
    }
  ];

  const onConnect = useCallback((params: Connection) => {
    // Add connection validation
    if (params.source === params.target) return; // Prevent self-connections
    
    const newEdge = {
      ...params,
      animated: true,
      style: { strokeWidth: 2 },
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  // Connection validation function
  const isValidConnection = useCallback((connection: Edge | Connection) => {
    // Prevent self-connections
    if (connection.source === connection.target) return false;
    
    // Allow all other connections for this tutorial
    return true;
  }, []);

  // Check mission objectives
  useEffect(() => {
    const checkObjectives = () => {
      const hasWebServer = nodes.some(n => n.id === 'web_server');
      const hasDatabase = nodes.some(n => n.id === 'database');
      const hasProperConnections = edges.some(e => 
        e.source === 'web_server' && e.target === 'database'
      ) && edges.some(e => 
        e.source === 'families' && e.target === 'web_server'
      );

      if (hasWebServer && hasDatabase && hasProperConnections && missionId === 'separate_concerns') {
        // Mission complete!
        setMetrics({
          reportsSaved: 153,
          familiesHelped: 153,
          uptimePercent: 94,
          dataLost: 0,
          currentLoad: 45,
          systemHealth: 'healthy'
        });
        setShowSuccessMessage(true);
        setShowTutorial(false);
        
        // Update Redux state
        dispatch(updateMetrics({
          totalReportsSaved: 153,
          familiesHelped: 153,
          systemUptime: 94,
          totalDataLost: 0,
        }));
        
        // Complete the mission step
        dispatch(completeStep(missionId));
        
        // Notify parent after delay
        setTimeout(() => {
          onMissionComplete?.();
        }, 3000);
      }
    };

    checkObjectives();
  }, [nodes, edges, missionId, onMissionComplete, dispatch]);

  // Simulate real-time metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        if (prev.systemHealth === 'critical') {
          return {
            ...prev,
            dataLost: prev.dataLost + Math.floor(Math.random() * 3),
            uptimePercent: Math.max(20, prev.uptimePercent - Math.random() * 2),
          };
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left - 75,
      y: event.clientY - reactFlowBounds.top - 20,
    };

    const newNode: Node = {
      id: type,
      type: 'default',
      position,
      data: { 
        label: type === 'web_server' ? 'Web Server' : 'Database',
        status: 'healthy'
      },
      style: {
        background: '#e8f5e9',
        border: '2px solid #4caf50',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        fontWeight: '500',
      }
    };

    setNodes((nds) => nds.concat(newNode));

    // Remove laptop if both components are placed
    if (type === 'database' && nodes.some(n => n.id === 'web_server')) {
      setNodes((nds) => nds.filter(n => n.id !== 'laptop'));
      setEdges((eds) => eds.filter(e => e.source !== 'laptop' && e.target !== 'laptop'));
      setCurrentStep(1);
    }
  };

  const handleRunTest = () => {
    // Run test logic - for now just check if all requirements are met
    const allCompleted = requirements.every(req => req.completed);
    if (allCompleted) {
      // Mission complete!
      setMetrics({
        reportsSaved: 153,
        familiesHelped: 153,
        uptimePercent: 94,
        dataLost: 0,
        currentLoad: 45,
        systemHealth: 'healthy'
      });
      setShowSuccessMessage(true);
      setShowTutorial(false);
      
      // Update Redux state
      dispatch(updateMetrics({
        totalReportsSaved: 153,
        familiesHelped: 153,
        systemUptime: 94,
        totalDataLost: 0,
      }));
      
      // Complete the mission step
      dispatch(completeStep(missionId));
      
      // Notify parent after delay
      setTimeout(() => {
        onMissionComplete?.();
      }, 3000);
    }
  };

  return (
    <div className="crisis-canvas-wrapper">
      {/* Component Drawer */}
      <div className="component-drawer">
        <h3>Available Components</h3>
        <div className="component-list">
          {availableComponents.map(comp => (
            <div
              key={comp}
              className="component-item"
              draggable
              onDragStart={(e) => handleDragStart(e, comp)}
            >
              <div className="component-icon">
                {comp === 'web_server' ? '🖥️' : '💾'}
              </div>
              <span>{comp === 'web_server' ? 'Web Server' : 'Database'}</span>
            </div>
          ))}
        </div>
        <div className="component-hint">
          Drag components to the canvas to fix Alex's system!
        </div>
      </div>

      {/* System Canvas */}
      <div className="system-canvas" onDragOver={handleDragOver} onDrop={handleDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          fitView
          colorMode={theme}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Requirements Panel */}
      <div className="requirements-panel">
        <Requirements 
          requirements={requirements}
          onRunTest={handleRunTest}
        />
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h3>{tutorialSteps[currentStep].title}</h3>
            <p>{tutorialSteps[currentStep].content}</p>
            <div className="tutorial-objective">
              <strong>Objective:</strong> {tutorialSteps[currentStep].objective}
            </div>
            <button 
              className="tutorial-close"
              onClick={() => setShowTutorial(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-overlay">
          <div className="success-card">
            <h2>🎉 System Stabilized!</h2>
            <p>You did it! The reports are flowing in smoothly now.</p>
            <div className="success-metrics">
              <div>✅ {metrics.reportsSaved} Reports Saved</div>
              <div>✅ {metrics.uptimePercent}% Uptime Restored</div>
              <div>✅ No More Data Loss</div>
            </div>
            <p className="success-message">
              Alex: "Thank you! The city council can see the contamination pattern now. You're saving lives!"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};