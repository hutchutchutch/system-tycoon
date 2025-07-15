import React, { useState } from 'react';
import { Database, Server, HardDrive, AlertTriangle, CheckCircle, X } from 'lucide-react';
import type { SystemDesignCanvasProps } from './SystemDesignCanvas.types';
import './SystemDesignCanvas.css';

// Simplified component for initial experience
interface Component {
  id: string;
  type: string;
  name: string;
  cost: number;
  position: { x: number; y: number };
}

export const SystemDesignCanvas: React.FC<SystemDesignCanvasProps> = ({
  projectId,
  requirements,
  budget,
  onValidate,
}) => {
  // Initial broken state - Sarah's over-engineered mess
  const [components] = useState<Component[]>([
    { id: '1', type: 'database', name: 'Primary DB', cost: 200, position: { x: 100, y: 100 } },
    { id: '2', type: 'database', name: 'Backup DB', cost: 200, position: { x: 100, y: 200 } },
    { id: '3', type: 'database', name: 'Backup DB 2', cost: 200, position: { x: 100, y: 300 } },
    { id: '4', type: 'server', name: 'Web Server', cost: 100, position: { x: 300, y: 100 } },
    { id: '5', type: 'server', name: 'Web Backup', cost: 100, position: { x: 300, y: 200 } },
    { id: '6', type: 'server', name: 'Web Backup 2', cost: 100, position: { x: 300, y: 300 } },
  ]);

  const totalCost = components.reduce((sum, comp) => sum + comp.cost, 0);

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database size={24} />;
      case 'server':
        return <Server size={24} />;
      case 'storage':
        return <HardDrive size={24} />;
      default:
        return <Server size={24} />;
    }
  };

  return (
    <div className="system-design-canvas">
      <div className="system-design-canvas__sidebar">
        <div className="system-design-canvas__requirements">
          <h3>Requirements</h3>
          {requirements.map(req => (
            <div key={req.id} className="requirement">
              {req.met ? (
                <CheckCircle size={16} className="requirement__icon requirement__icon--met" />
              ) : (
                <X size={16} className="requirement__icon requirement__icon--unmet" />
              )}
              <span className={req.met ? 'requirement--met' : 'requirement--unmet'}>
                {req.name}
              </span>
            </div>
          ))}
        </div>

        <div className="system-design-canvas__budget">
          <h3>Cost Analysis</h3>
          <div className="budget-item">
            <span>Monthly Cost:</span>
            <span className={totalCost > budget.monthly ? 'budget-item--over' : ''}>
              ${totalCost}/mo
            </span>
          </div>
          <div className="budget-item">
            <span>Budget:</span>
            <span>${budget.monthly}/mo</span>
          </div>
          {totalCost > budget.monthly && (
            <div className="budget-warning">
              <AlertTriangle size={16} />
              <span>${totalCost - budget.monthly} over budget!</span>
            </div>
          )}
        </div>

        <div className="system-design-canvas__errors">
          <h3>Issues</h3>
          <ul>
            <li>⚠️ No storage for images</li>
            <li>⚠️ Databases not connected</li>
            <li>⚠️ Excessive redundancy</li>
          </ul>
        </div>
      </div>

      <div className="system-design-canvas__main">
        <div className="system-design-canvas__canvas">
          {components.map(component => (
            <div
              key={component.id}
              className="canvas-component"
              style={{
                left: component.position.x,
                top: component.position.y,
              }}
            >
              <div className="canvas-component__icon">
                {getComponentIcon(component.type)}
              </div>
              <div className="canvas-component__name">{component.name}</div>
              <div className="canvas-component__cost">${component.cost}/mo</div>
            </div>
          ))}
          
          <div className="system-design-canvas__hint">
            <p>💡 Hint: This seems way too complex for a simple bakery blog!</p>
            <p>Try clearing the canvas and starting with just the essentials:</p>
            <ul>
              <li>• One web server</li>
              <li>• One database</li>
              <li>• File storage for images</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};