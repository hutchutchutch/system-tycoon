import React from 'react';
import { ReactFlow, Background, ReactFlowProvider, useReactFlow, Position, MarkerType, useNodesState, useEdgesState } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { useNavigate } from 'react-router-dom';
import '@xyflow/react/dist/style.css';

// Initial nodes with proper styling - shifted down for better centering
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 0, y: 60 },
    data: { 
      label: (
        <div style={{ textAlign: 'center' }}>
          <div>Good People</div>
          <div>Need Help</div>
        </div>
      )
    },
    style: {
      background: '#1f2937',
      border: '2px solid #374151',
      borderRadius: '8px',
      color: '#f3f4f6',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 16px',
      width: '160px',
      height: 'auto',
      textAlign: 'center',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: '2',
    type: 'default',
    position: { x: 0, y: 180 },
    data: { 
      label: (
        <div style={{ textAlign: 'center' }}>
          <div>You Learn</div>
          <div style={{
            background: 'linear-gradient(to right, #60A5FA, #A855F7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            System Design
          </div>
        </div>
      )
    },
    style: {
      background: '#1f2937',
      border: '2px solid #374151',
      borderRadius: '8px',
      color: '#f3f4f6',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 16px',
      width: '160px',
      height: 'auto',
      textAlign: 'center',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: '3',
    type: 'default',
    position: { x: 220, y: 140 },
    data: { 
      label: (
        <div style={{ textAlign: 'center' }}>
          <div>The World</div>
          <div>Gets Better</div>
        </div>
      )
     },
    style: {
      background: 'linear-gradient(135deg, #1f2937, #374151)',
      border: '2px solid #3b82f6',
      boxShadow: '0 0 8px rgba(59, 130, 246, 0.3), 0 0 16px rgba(59, 130, 246, 0.15), 0 0 24px rgba(59, 130, 246, 0.05)',
      borderRadius: '8px',
      color: '#f3f4f6',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 16px',
      width: '160px',
      height: 'auto',
      textAlign: 'center',
    },
    targetPosition: Position.Top,
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    style: { stroke: '#6b7280', strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#6b7280',
    },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    style: { stroke: '#6b7280', strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#6b7280',
    },
  },
];

// Inner component that uses React Flow hooks
function FlowCanvasInner() {
  console.log('🏁 FlowCanvasInner component rendered');
  
  const reactFlowInstance = useReactFlow();
  
  console.log('reactFlowInstance:', !!reactFlowInstance);
  
  // ✅ SIMPLE: Use basic React Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  console.log('=== SimpleLanding State ===');
  console.log('nodes from state:', nodes);
  console.log('edges from state:', edges);
  console.log('nodes length:', nodes?.length || 0);
  console.log('edges length:', edges?.length || 0);
  
  // Debug node positions
  nodes.forEach((node, index) => {
    console.log(`Node ${index + 1}:`, {
      id: node.id,
      position: node.position,
      type: node.type,
      width: node.width,
      height: node.height,
      measured: node.measured,
      label: typeof node.data?.label === 'string' ? node.data.label : 'JSX Element',
      hasStyle: !!node.style,
      styleKeys: node.style ? Object.keys(node.style) : []
    });
  });
  
  console.log('================================');

  React.useEffect(() => {
    // Backup fitView call after a delay
    const timer = setTimeout(() => {
      console.log('Calling fitView with nodes:', nodes.length);
      console.log('Current viewport:', reactFlowInstance.getViewport());
      console.log('React Flow bounds:', reactFlowInstance.getNodes().map(n => ({
        id: n.id,
        position: n.position,
        width: n.width || 'auto',
        height: n.height || 'auto',
        measured: n.measured,
        style: n.style ? Object.keys(n.style) : 'no style'
      })));
      console.log('Full React Flow nodes:', reactFlowInstance.getNodes());
      
      // DOM INSPECTION: Check if React Flow elements exist
      const reactFlowWrapper = document.querySelector('.react-flow');
      const reactFlowNodes = document.querySelectorAll('.react-flow__node');
      const reactFlowEdges = document.querySelectorAll('.react-flow__edge');
      
      console.log('🔍 DOM INSPECTION:');
      console.log('React Flow wrapper found:', !!reactFlowWrapper);
      console.log('React Flow wrapper dimensions:', reactFlowWrapper ? {
        width: reactFlowWrapper.clientWidth,
        height: reactFlowWrapper.clientHeight,
        display: getComputedStyle(reactFlowWrapper).display,
        visibility: getComputedStyle(reactFlowWrapper).visibility,
        opacity: getComputedStyle(reactFlowWrapper).opacity
      } : 'N/A');
      console.log('Number of .react-flow__node elements:', reactFlowNodes.length);
      console.log('Number of .react-flow__edge elements:', reactFlowEdges.length);
      
      // Check if nodes are hidden by CSS
      reactFlowNodes.forEach((node, index) => {
        const styles = getComputedStyle(node);
        console.log(`Node ${index + 1} DOM styles:`, {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          width: styles.width,
          height: styles.height,
          transform: styles.transform
        });
      });
      
      reactFlowInstance.fitView({ padding: 0.2 });
      
      console.log('After fitView viewport:', reactFlowInstance.getViewport());
    }, 100);
    
    return () => clearTimeout(timer);
  }, [reactFlowInstance, nodes.length]);

  return (
    <ReactFlow
      nodes={nodes}                                          // ✅ Local state
      edges={edges}                                          // ✅ Local state  
      onNodesChange={onNodesChange}                          // ✅ Local state updates
      onEdgesChange={onEdgesChange}                          // ✅ Local state updates
      fitView
      attributionPosition="bottom-left"
      proOptions={{ hideAttribution: true }}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      panOnDrag={true}
      panOnScroll={false}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      minZoom={0.5}
      maxZoom={2}
      style={{ 
        backgroundColor: '#000000',
        width: '100%',
        height: '100%'
      }}
    >
      <Background color="#374151" gap={20} size={1} />
      
      {/* CSS OVERRIDE to force nodes visible */}
      <style>{`
        .react-flow__node {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .react-flow__edge {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>
    </ReactFlow>
  );
}

// Wrapper component with provider
function FlowCanvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      console.log('FlowCanvas container dimensions:', {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        visible: rect.width > 0 && rect.height > 0
      });
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#000000',
        borderRadius: '8px',
        position: 'relative'
      }}
    >
      <ReactFlowProvider>
        <FlowCanvasInner />
      </ReactFlowProvider>
    </div>
  );
}

export function SimpleLanding() {
  const navigate = useNavigate();

  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };

  return (
    <div style={{ 
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Full page grid background */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3,
          backgroundImage: `radial-gradient(circle at center, rgba(55, 65, 81, 0.8) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: 'center center',
          pointerEvents: 'none'
        }}
      />
      
      {/* Content container */}
      <div style={{ 
        position: 'relative',
        height: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
          gap: '48px',
          alignItems: 'center',
          height: 'calc(100% - 200px)'
        }}>
          {/* Left side - Text content */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ 
                fontSize: window.innerWidth >= 1024 ? '4.5rem' : '3rem',
                fontWeight: 'bold',
                letterSpacing: '-0.025em',
                margin: 0,
                marginBottom: '8px',
                color: 'white'
              }}>
                Worldly Problems
              </h1>
              <h2 style={{ 
                fontSize: window.innerWidth >= 1024 ? '4.5rem' : '3rem',
                fontWeight: 'bold',
                letterSpacing: '-0.025em',
                margin: 0,
                background: 'linear-gradient(to right, #60A5FA, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                Software Solutions
              </h2>
            </div>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#D1D5DB',
              maxWidth: '32rem',
              lineHeight: 1.75
            }}>
              Transform real-world challenges into meaningful impact through thoughtful system design and innovative software solutions.
            </p>
          </div>

          {/* Right side - React Flow Canvas */}
          <div style={{ 
            height: window.innerWidth >= 1024 ? '500px' : '384px',
            width: '100%',
            position: 'relative'
          }}>
            <FlowCanvas />
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ 
          textAlign: 'center',
          marginTop: '64px'
        }}>
          <button 
            onClick={handleStartOnboarding}
            style={{
              position: 'relative',
              padding: '16px 32px',
              background: 'linear-gradient(to right, #3B82F6, #A855F7)',
              color: 'white',
              fontWeight: '600',
              fontSize: '1.125rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
          >
            <span style={{ position: 'relative', zIndex: 10 }}>Let's Do This</span>
          </button>
        </div>
      </div>
    </div>
  );
}