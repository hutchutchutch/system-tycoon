import React from 'react';
import { ReactFlow, Background, ReactFlowProvider, useReactFlow, Position, MarkerType, useNodesState, useEdgesState, Handle } from '@xyflow/react';
import type { Node, Edge, NodeProps } from '@xyflow/react';
import { useNavigate } from 'react-router-dom';
import '@xyflow/react/dist/style.css';

// Custom node for hero text
function HeroTextNode({ data }: NodeProps) {
  return (
    <div style={{
      background: 'transparent',
      border: 'none',
      textAlign: 'left',
      pointerEvents: 'none',
    }}>
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
  );
}

// Custom node for CTA button
function CTANode({ data }: NodeProps) {
  const navigate = useNavigate();

  const handleStartOnboarding = () => {
    navigate('/auth');
  };

  return (
    <div className="nodrag nopan" style={{
      background: 'transparent',
      border: 'none',
      textAlign: 'center',
      pointerEvents: 'auto',
    }}>
      <button 
        className="nodrag nopan"
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
          overflow: 'hidden',
          pointerEvents: 'auto',
          zIndex: 10
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
  );
}

// Custom node with only bottom handle (for "Good People Need Help")
function SourceNode({ data }: NodeProps) {
  return (
    <div style={{
      background: '#1f2937',
      border: '2px solid #374151',
      borderRadius: '8px',
      color: '#f3f4f6',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 16px',
      width: '160px',
      textAlign: 'center',
    }}>
      {data.label}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#6b7280' }}
      />
    </div>
  );
}

// Custom node with top and bottom handles (for "You Learn System Design")
function ProcessNode({ data }: NodeProps) {
  return (
    <div style={{
      background: '#1f2937',
      border: '2px solid #374151',
      borderRadius: '8px',
      color: '#f3f4f6',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 16px',
      width: '160px',
      textAlign: 'center',
    }}>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#6b7280' }}
      />
      {data.label}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#6b7280' }}
      />
    </div>
  );
}

// Custom node with only top handle (for "The World Gets Better")
function TargetNode({ data }: NodeProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1f2937, #374151)',
      border: '2px solid #3b82f6',
      boxShadow: '0 0 8px rgba(59, 130, 246, 0.3), 0 0 16px rgba(59, 130, 246, 0.15), 0 0 24px rgba(59, 130, 246, 0.05)',
      borderRadius: '8px',
      color: '#f3f4f6',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 16px',
      width: '160px',
      textAlign: 'center',
    }}>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#6b7280' }}
      />
      {data.label}
    </div>
  );
}

// Node types mapping
const nodeTypes = {
  heroText: HeroTextNode,
  ctaButton: CTANode,
  sourceNode: SourceNode,
  processNode: ProcessNode,
  targetNode: TargetNode,
};

// Calculate positions based on viewport
const getNodePositions = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const centerX = vw / 2;
  const centerY = vh / 2;

  return {
    // Hero text on the left side
    heroText: { x: vw * 0.15, y: vh * 0.3 },
    
    // Flow nodes on the right side
    source: { x: vw * 0.65, y: vh * 0.25 },
    process: { x: vw * 0.65, y: vh * 0.45 },
    target: { x: vw * 0.8, y: vh * 0.35 },
    
    // CTA button centered near bottom
    cta: { x: centerX - 100, y: vh * 0.75 }
  };
};

// Initial nodes with proper positioning
const createInitialNodes = (): Node[] => {
  const positions = getNodePositions();
  
  return [
    {
      id: 'hero',
      type: 'heroText',
      position: positions.heroText,
      data: {},
      draggable: false,
      selectable: false,
    },
    {
      id: 'cta',
      type: 'ctaButton',
      position: positions.cta,
      data: {},
      draggable: false,
      selectable: false,
    },
    {
      id: '1',
      type: 'sourceNode',
      position: positions.source,
      data: { 
        label: (
          <div style={{ textAlign: 'center' }}>
            <div>Good People</div>
            <div>Need Help</div>
          </div>
        )
      },
    },
    {
      id: '2',
      type: 'processNode',
      position: positions.process,
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
    },
    {
      id: '3',
      type: 'targetNode',
      position: positions.target,
      data: { 
        label: (
          <div style={{ textAlign: 'center' }}>
            <div>The World</div>
            <div>Gets Better</div>
          </div>
        )
      },
    },
  ];
};

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
function SimpleLandingFlow() {
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    // Set viewport to show all content nicely
    const timer = setTimeout(() => {
      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [reactFlowInstance]);

  // Update positions on window resize
  React.useEffect(() => {
    const handleResize = () => {
      const positions = getNodePositions();
      setNodes((nds) => nds.map((node) => {
        switch (node.id) {
          case 'hero':
            return { ...node, position: positions.heroText };
          case 'cta':
            return { ...node, position: positions.cta };
          case '1':
            return { ...node, position: positions.source };
          case '2':
            return { ...node, position: positions.process };
          case '3':
            return { ...node, position: positions.target };
          default:
            return node;
        }
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView={false}
      attributionPosition="bottom-left"
      proOptions={{ hideAttribution: true }}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      panOnDrag={false}
      panOnScroll={false}
      nodesDraggable={true}
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
      <Background 
        color="#374151" 
        gap={20} 
        size={1}
        style={{ opacity: 0.3 }}
      />
    </ReactFlow>
  );
}

// Main landing page component
export function SimpleLanding() {
  return (
    <div style={{ 
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <ReactFlowProvider>
        <SimpleLandingFlow />
      </ReactFlowProvider>
    </div>
  );
}