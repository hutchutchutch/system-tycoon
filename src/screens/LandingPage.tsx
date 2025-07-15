import React, { useCallback, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { Button } from '../components/atoms/Button';
import { Card, CardBody } from '../components/atoms/Card';
import { ReactFlow, useNodesState, useEdgesState, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node components following the design system structure
const SystemNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className={`react-flow__node-component react-flow__node-component--${data.category}`}>
      <Handle type="target" position={Position.Top} className="react-flow__handle react-flow__handle-target" />
      <div className="react-flow__node-component__header">
        <div className="react-flow__node-component__icon">
          {data.icon}
        </div>
        <div className="react-flow__node-component__title">
          {data.label}
        </div>
      </div>
      <div className="react-flow__node-component__body">
        <div className="react-flow__node-component__metrics">
          <div className="react-flow__node-component__metric">
            <div className="react-flow__node-component__metric-label">Load</div>
            <div className="react-flow__node-component__metric-value">{data.load}%</div>
          </div>
          <div className="react-flow__node-component__metric">
            <div className="react-flow__node-component__metric-label">Status</div>
            <div className="react-flow__node-component__metric-value">{data.status}</div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="react-flow__handle react-flow__handle-source" />
    </div>
  );
};

// Requirements node component
const RequirementsNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="react-flow__node-requirements">
      <div className="react-flow__node-requirements__header">
        <div className="react-flow__node-requirements__icon">✅</div>
        <div className="react-flow__node-requirements__title">{data.label}</div>
      </div>
      <div className="react-flow__node-requirements__body">
        {data.requirements.map((req: string, index: number) => (
          <div key={index} className="react-flow__node-requirements__item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="react-flow__node-requirements__check">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{req}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Define nodeTypes outside component following best practices
const nodeTypes = {
  system: SystemNode,
  requirements: RequirementsNode,
};

// Initial nodes and edges for the demo - following design system categories
const initialNodes = [
  {
    id: 'cdn',
    type: 'system',
    position: { x: 100, y: 50 },
    data: {
      label: 'CDN',
      icon: '🌍',
      category: 'networking',
      load: 15,
      status: 'Healthy'
    },
  },
  {
    id: 'loadbalancer',
    type: 'system',
    position: { x: 300, y: 100 },
    data: {
      label: 'Load Balancer',
      icon: '⚖️',
      category: 'networking',
      load: 45,
      status: 'Active'
    },
  },
  {
    id: 'frontend',
    type: 'system',
    position: { x: 500, y: 50 },
    data: {
      label: 'Frontend',
      icon: '🌐',
      category: 'compute',
      load: 35,
      status: 'Healthy'
    },
  },
  {
    id: 'api',
    type: 'system',
    position: { x: 500, y: 200 },
    data: {
      label: 'API Gateway',
      icon: '🚪',
      category: 'networking',
      load: 52,
      status: 'Active'
    },
  },
  {
    id: 'backend',
    type: 'system',
    position: { x: 300, y: 300 },
    data: {
      label: 'Backend',
      icon: '⚙️',
      category: 'compute',
      load: 68,
      status: 'Active'
    },
  },
  {
    id: 'cache',
    type: 'system',
    position: { x: 700, y: 250 },
    data: {
      label: 'Cache',
      icon: '💾',
      category: 'storage',
      load: 40,
      status: 'Optimal'
    },
  },
  {
    id: 'database',
    type: 'system',
    position: { x: 500, y: 400 },
    data: {
      label: 'Database',
      icon: '🗄️',
      category: 'storage',
      load: 23,
      status: 'Optimal'
    },
  },
  {
    id: 'queue',
    type: 'system',
    position: { x: 100, y: 350 },
    data: {
      label: 'Message Queue',
      icon: '📬',
      category: 'operations',
      load: 12,
      status: 'Healthy'
    },
  },
  {
    id: 'requirements',
    type: 'requirements',
    position: { x: 900, y: 200 },
    data: {
      label: 'Requirements',
      requirements: [
        'User Authentication',
        'Image Sharing',
        'Recommendation System'
      ]
    },
  },
];

const initialEdges = [
  {
    id: 'cdn-loadbalancer',
    source: 'cdn',
    target: 'loadbalancer',
    animated: true,
    className: 'react-flow__edge--high-traffic',
  },
  {
    id: 'loadbalancer-frontend',
    source: 'loadbalancer',
    target: 'frontend',
    animated: true,
    className: 'react-flow__edge--high-traffic',
  },
  {
    id: 'loadbalancer-api',
    source: 'loadbalancer',
    target: 'api',
    animated: true,
    className: 'react-flow__edge--medium-traffic',
  },
  {
    id: 'api-backend',
    source: 'api',
    target: 'backend',
    animated: false,
    className: 'react-flow__edge--medium-traffic',
  },
  {
    id: 'api-cache',
    source: 'api',
    target: 'cache',
    animated: true,
    className: 'react-flow__edge--medium-traffic',
  },
  {
    id: 'backend-database',
    source: 'backend',
    target: 'database',
    animated: true,
    className: 'react-flow__edge--low-traffic',
  },
  {
    id: 'backend-queue',
    source: 'backend',
    target: 'queue',
    animated: false,
    className: 'react-flow__edge--low-traffic',
  },
  {
    id: 'cache-database',
    source: 'cache',
    target: 'database',
    animated: false,
    className: 'react-flow__edge--low-traffic',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  
  // Slider state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/career');
    } else {
      navigate('/auth/signup');
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);
  
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-page__nav">
        <div className="landing-page__nav-container">
          <div className="landing-page__logo">System Design Tycoon</div>
          <div className="landing-page__nav-actions">
            {!isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth/signin')}
                  className="landing-page__nav-button"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/auth/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button
                variant="secondary"
                onClick={() => navigate('/career')}
              >
                Continue Playing
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="landing-page__hero">
        <div className="landing-page__hero-container">
          <div className="landing-page__hero-content">
            <h1 className="landing-page__hero-title">
              Transform Problems into Solutions
            </h1>
            <p className="landing-page__hero-subtitle">
              Master system design through engaging visual gameplay
            </p>
            <p className="landing-page__hero-description">
              Drag the slider to see how we transform complex problems into scalable solutions
            </p>
            
            {/* Image Comparison Slider */}
            <div 
              className="landing-page__comparison-container"
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onTouchMove={handleTouchMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
            >
              {/* ProblemVille Layer */}
              <div className="landing-page__world-layer landing-page__world-layer--problem">
                <div className="landing-page__world-content">
                  <div className="landing-page__world-header">
                    <h2 className="landing-page__world-title">ProblemVille</h2>
                    <p className="landing-page__world-subtitle">Where real-world challenges await</p>
                  </div>
                  <div className="landing-page__world-scene landing-page__world-scene--green">
                    <img src="/assets/tree_pine.png" alt="Pine Tree" className="landing-page__scene-asset landing-page__scene-asset--tree-pine-1" />
                    <img src="/assets/tree_round.png" alt="Round Tree" className="landing-page__scene-asset landing-page__scene-asset--tree-round-1" />
                    <img src="/assets/tree_pine.png" alt="Pine Tree" className="landing-page__scene-asset landing-page__scene-asset--tree-pine-2" />
                    <img src="/assets/rock_small.png" alt="Small Rock" className="landing-page__scene-asset landing-page__scene-asset--rock" />
                    <img src="/assets/boulder.png" alt="Boulder" className="landing-page__scene-asset landing-page__scene-asset--boulder" />
                    <img src="/assets/tree_round.png" alt="Round Tree" className="landing-page__scene-asset landing-page__scene-asset--tree-round-2" />
                    <div className="landing-page__problem-bubbles">
                      <div className="landing-page__bubble">Scale to millions</div>
                      <div className="landing-page__bubble">Handle traffic spikes</div>
                      <div className="landing-page__bubble">Reduce latency</div>
                      <div className="landing-page__bubble">Real-time sync</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* DataWorld Layer */}
              <div 
                className="landing-page__world-layer landing-page__world-layer--data"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
              >
                <div className="landing-page__world-content">
                  <div className="landing-page__world-header">
                    <h2 className="landing-page__world-title">DataWorld</h2>
                    <p className="landing-page__world-subtitle">Build elegant system architectures</p>
                  </div>
                  <div className="landing-page__world-scene landing-page__world-scene--blue">
                    <div className="landing-page__react-flow-container">
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.1 }}
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable={false}
                        panOnDrag={false}
                        zoomOnScroll={false}
                        zoomOnPinch={false}
                        zoomOnDoubleClick={false}
                        proOptions={{ hideAttribution: true }}
                        className="landing-page__hero-flow"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slider Handle */}
              <div 
                className="landing-page__slider-handle"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="landing-page__slider-track" />
                <div className="landing-page__slider-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 4l-4 8 4 8M16 4l4 8-4 8" />
                  </svg>
                </div>
              </div>
              
              {/* Labels */}
              <div className="landing-page__world-labels">
                <span className="landing-page__world-label landing-page__world-label--left">ProblemVille</span>
                <span className="landing-page__world-label landing-page__world-label--right">DataWorld</span>
              </div>
            </div>
            
            <div className="landing-page__hero-actions">
              <Button
                size="large"
                onClick={handleGetStarted}
                className="landing-page__hero-cta"
              >
                Start Your Journey
              </Button>
              <p className="landing-page__hero-hint">
                Join thousands of developers mastering system design
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture Demo Section */}
      <div className="landing-page__demo-section">
        <div className="landing-page__demo-section-container">
          <h2 className="landing-page__demo-section-title">
            See Your Architecture Come to Life
          </h2>
          <p className="landing-page__demo-section-subtitle">
            Watch how data flows through your system design in real-time
          </p>
          <div className="landing-page__demo-flow-container">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={true}
              panOnDrag={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={false}
              className="landing-page__demo-flow"
            />
          </div>
        </div>
      </div>

      {/* Value Proposition Cards */}
      <div className="landing-page__features">
        <div className="landing-page__features-container">
          <h2 className="landing-page__features-title">
            Learn System Design the Fun Way
          </h2>
          <div className="landing-page__features-grid">
            {valueProps.map((prop, index) => (
              <Card
                key={index}
                interactive
                className="landing-page__feature-card"
              >
                <CardBody>
                  <div className="landing-page__feature-icon">{prop.icon}</div>
                  <h3 className="landing-page__feature-title">{prop.title}</h3>
                  <p className="landing-page__feature-description">{prop.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="landing-page__social-proof">
        <div className="landing-page__social-proof-container">
          <div className="landing-page__stats-grid">
            <div className="landing-page__stat">
              <div className="landing-page__stat-value landing-page__stat-value--primary">10K+</div>
              <div className="landing-page__stat-label">Active Players</div>
            </div>
            <div className="landing-page__stat">
              <div className="landing-page__stat-value landing-page__stat-value--secondary">50K+</div>
              <div className="landing-page__stat-label">Systems Designed</div>
            </div>
            <div className="landing-page__stat">
              <div className="landing-page__stat-value landing-page__stat-value--premium">4.8/5</div>
              <div className="landing-page__stat-label">Player Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const valueProps = [
  {
    icon: '🎮',
    title: 'Visual Learning',
    description: 'Watch data packets flow through your architecture like theme park visitors',
  },
  {
    icon: '💼',
    title: 'Real Scenarios',
    description: 'Design systems for Netflix, Uber, and other real companies',
  },
  {
    icon: '👥',
    title: 'Expert Mentors',
    description: 'Get guidance from virtual industry experts with different specializations',
  },
  {
    icon: '📈',
    title: 'Career Growth',
    description: 'Progress from consultant to industry expert through referrals',
  },
];