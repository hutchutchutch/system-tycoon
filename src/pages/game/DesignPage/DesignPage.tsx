import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { DesignPhaseTemplate } from '../../../components/templates/DesignPhaseTemplate';
import { ComponentDrawer } from '../../../components/organisms/ComponentDrawer';
import { MetricsDashboard } from '../../../components/organisms/MetricsDashboard';
import { SystemDesignCanvas } from '../../../components/organisms/SystemDesignCanvas';
import { CollaborationPanel } from '../../../components/organisms/CollaborationPanel';
import type { DrawerComponent } from '../../../components/organisms/ComponentDrawer';

/**
 * DesignPage
 * 
 * Purpose: System architecture design phase page with realtime collaboration
 * 
 * State Management:
 * - Connects to Redux design slice for nodes/edges
 * - Local state for UI concerns (search, drag state, collaboration)
 * - Manages design validation and metrics
 * - Orchestrates between drawer, canvas, metrics, and collaboration
 * 
 * Redux connections:
 * - Reads: design.nodes, design.edges, design.totalCost, design.isValidDesign
 * - Writes: addNode, deleteNode, addEdge, updateNode
 */

export const DesignPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  
  // Local UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showCollaboration, setShowCollaboration] = useState(false);
  
  // Redux state selectors
  const designState = useAppSelector(state => state.design);
  const gameState = useAppSelector(state => state.game);
  const scenarioId = useAppSelector(state => state.mission.currentMission?.id) || 'default';
  
  // Check for session ID in URL on mount
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId) {
      setCurrentSessionId(sessionId);
      setShowCollaboration(true);
    }
  }, [searchParams]);
  
  const handleComponentDragStart = (component: any, event: React.DragEvent) => {
    setIsDragging(true);
    event.dataTransfer.setData('component-type', component.type);
    event.dataTransfer.setData('component-data', JSON.stringify(component));
    console.log('Dragging component:', component);
  };
  
  const handleComponentDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleSessionChange = (sessionId: string | null) => {
    setCurrentSessionId(sessionId);
    if (sessionId) {
      // Update URL with session ID
      const url = new URL(window.location.href);
      url.searchParams.set('session', sessionId);
      window.history.pushState({}, '', url);
    } else {
      // Remove session ID from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('session');
      window.history.pushState({}, '', url);
    }
  };
  
  const handleCanvasValidate = (isValid: boolean) => {
    console.log('Design validation:', isValid);
    // Dispatch validation result to Redux if needed
  };
  
  // Mock data for now - replace with actual component data
  const availableComponents: DrawerComponent[] = [
    { 
      id: '1', 
      name: 'Web Server', 
      type: 'web-server', 
      category: 'compute', 
      cost: 100,
      icon: '🖥️',
      color: '#1976d2',
      shortDescription: 'Handles HTTP requests and serves web content'
    },
    { 
      id: '2', 
      name: 'Database', 
      type: 'database', 
      category: 'storage', 
      cost: 200,
      icon: '🗄️',
      color: '#7b1fa2',
      shortDescription: 'Stores and manages application data'
    },
    { 
      id: '3', 
      name: 'Cache', 
      type: 'cache', 
      category: 'storage', 
      cost: 50,
      icon: '⚡',
      color: '#f57c00',
      shortDescription: 'High-speed data storage for quick access'
    },
    { 
      id: '4', 
      name: 'Load Balancer', 
      type: 'load-balancer', 
      category: 'network', 
      cost: 150,
      icon: '⚖️',
      color: '#388e3c',
      shortDescription: 'Distributes traffic across multiple servers'
    },
    { 
      id: '5', 
      name: 'Message Queue', 
      type: 'message-queue', 
      category: 'compute', 
      cost: 80,
      icon: '📬',
      color: '#c2185b',
      shortDescription: 'Enables async communication between services'
    },
    { 
      id: '6', 
      name: 'CDN', 
      type: 'cdn', 
      category: 'network', 
      cost: 120,
      icon: '🌐',
      color: '#00897b',
      shortDescription: 'Delivers content from edge locations'
    },
  ];
  
  const categories = [
    { id: 'compute', name: 'Compute', icon: 'server' },
    { id: 'storage', name: 'Storage', icon: 'database' },
    { id: 'network', name: 'Network', icon: 'globe' },
  ];
  
  // Mock requirements and budget for now
  const requirements = [
    { id: '1', name: 'Handle 1000 concurrent users', met: false },
    { id: '2', name: 'Sub-second response time', met: false },
    { id: '3', name: '99.9% uptime', met: false },
  ];
  
  const budget = { monthly: 10000, setup: 5000 };
  
  const metrics = [
    { label: 'Total Cost', value: `$${designState.totalCost || 0}/mo`, trend: 'up' as const },
    { label: 'Components', value: (designState.nodes?.length || 0).toString(), trend: 'neutral' as const },
    { label: 'Connections', value: (designState.edges?.length || 0).toString(), trend: 'neutral' as const },
    { label: 'Validation', value: designState.isValidDesign ? 'Valid' : 'Invalid', trend: designState.isValidDesign ? 'up' as const : 'down' as const },
  ];
  
  return (
    <DesignPhaseTemplate
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1>System Design Phase</h1>
          <button
            onClick={() => setShowCollaboration(!showCollaboration)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: showCollaboration ? '#3b82f6' : 'white',
              color: showCollaboration ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            {showCollaboration ? 'Hide' : 'Show'} Collaboration
          </button>
        </div>
      }
      sidebar={
        <>
          <ComponentDrawer
            components={availableComponents}
            categories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onComponentDragStart={handleComponentDragStart}
            onComponentDragEnd={handleComponentDragEnd}
          />
          {showCollaboration && (
            <div style={{ marginTop: '16px' }}>
              <CollaborationPanel
                scenarioId={scenarioId}
                onSessionChange={handleSessionChange}
                currentSessionId={currentSessionId}
              />
            </div>
          )}
        </>
      }
      canvas={
        <SystemDesignCanvas
          projectId={scenarioId}
          requirements={requirements}
          budget={budget}
          onValidate={handleCanvasValidate}
          sessionId={currentSessionId || undefined}
          isCollaborative={!!currentSessionId}
        />
      }
      metrics={
        <MetricsDashboard
          metrics={metrics}
          requirements={requirements}
          budget={budget.monthly}
        />
      }
    />
  );
};