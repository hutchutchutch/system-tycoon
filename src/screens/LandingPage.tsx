import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
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

// Define nodeTypes outside component following best practices
const nodeTypes = {
  system: SystemNode,
};

// Initial nodes and edges for the demo - following design system categories
const initialNodes = [
  {
    id: 'frontend',
    type: 'system',
    position: { x: 50, y: 50 },
    data: {
      label: 'Frontend',
      icon: '🌐',
      category: 'compute',
      load: 45,
      status: 'Healthy'
    },
  },
  {
    id: 'backend',
    type: 'system',
    position: { x: 200, y: 200 },
    data: {
      label: 'Backend',
      icon: '⚙️',
      category: 'compute',
      load: 68,
      status: 'Active'
    },
  },
  {
    id: 'database',
    type: 'system',
    position: { x: 350, y: 350 },
    data: {
      label: 'Database',
      icon: '🗄️',
      category: 'storage',
      load: 23,
      status: 'Optimal'
    },
  },
];

const initialEdges = [
  {
    id: 'frontend-backend',
    source: 'frontend',
    target: 'backend',
    animated: false,
    className: 'react-flow__edge--medium-traffic',
  },
  {
    id: 'backend-database',
    source: 'backend',
    target: 'database',
    animated: true,
    className: 'react-flow__edge--low-traffic',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/career');
    } else {
      navigate('/auth/signup');
    }
  };

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
          {/* Left side - Hero text */}
          <div className="landing-page__hero-content">
            <h1 className="landing-page__hero-title">
              Build the Digital World
            </h1>
            <p className="landing-page__hero-subtitle">
              Where every line of code flows like a theme park ride
            </p>
            <p className="landing-page__hero-description">
              Master system design through engaging visual gameplay. Design architectures 
              for real companies, watch data flow through your systems, and learn from 
              industry experts.
            </p>
            <Button
              size="large"
              onClick={handleGetStarted}
              className="landing-page__hero-cta"
            >
              Start Your Journey
            </Button>
          </div>

          {/* Right side - React Flow diagram */}
          <div className="landing-page__hero-demo">
            <div className="landing-page__demo-container">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                className="landing-page__demo-flow"
              />
            </div>
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