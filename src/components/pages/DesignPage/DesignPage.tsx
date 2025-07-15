import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { DesignPhaseTemplate } from '../../templates/DesignPhaseTemplate';
import { ComponentDrawer } from '../../organisms/ComponentDrawer';
import { MetricsDashboard } from '../../organisms/MetricsDashboard';
import styles from './DesignPage.module.css';

/**
 * DesignPage
 * 
 * Purpose: System architecture design phase page
 * 
 * State Management:
 * - Connects to Redux design slice for nodes/edges
 * - Local state for UI concerns (search, drag state)
 * - Manages design validation and metrics
 * - Orchestrates between drawer, canvas, and metrics
 * 
 * Redux connections:
 * - Reads: design.nodes, design.edges, design.totalCost, design.isValidDesign
 * - Writes: addNode, deleteNode, addEdge, updateNode
 */

export const DesignPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Local UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Redux state selectors
  const designState = useAppSelector(state => state.design);
  const requirements = useAppSelector(state => state.meeting.modifiedRequirements);
  const budget = useAppSelector(state => state.meeting.budget);
  
  const handleComponentDragStart = (component: any) => {
    setIsDragging(true);
    console.log('Dragging component:', component);
  };
  
  const handleComponentDragEnd = () => {
    setIsDragging(false);
  };
  
  // Mock data for now
  const availableComponents = [
    { id: '1', name: 'Web Server', category: 'compute', cost: 100 },
    { id: '2', name: 'Database', category: 'storage', cost: 200 },
  ];
  
  const categories = [
    { id: 'compute', name: 'Compute', icon: 'server' },
    { id: 'storage', name: 'Storage', icon: 'database' },
  ];
  
  const metrics = {
    totalCost: designState.totalCost || 0,
    totalCapacity: 0,
    estimatedLatency: 0,
    reliability: 0,
  };
  
  return (
    <DesignPhaseTemplate
      header={<h1>System Design Phase</h1>}
      sidebar={
        <ComponentDrawer
          components={availableComponents}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onComponentDragStart={handleComponentDragStart}
          onComponentDragEnd={handleComponentDragEnd}
        />
      }
      canvas={
        <div className={styles.canvasPlaceholder}>
          Design canvas (React Flow) will be implemented here
        </div>
      }
      metrics={
        <MetricsDashboard
          metrics={metrics}
          requirements={requirements || []}
          budget={budget || 10000}
        />
      }
    />
  );
};