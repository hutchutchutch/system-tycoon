import React, { useState, useEffect } from 'react';
import { Code } from 'lucide-react';

interface CursorProps {
  position: { x: number; y: number };
  color: string;
  label: string;
}

const Cursor: React.FC<CursorProps> = ({ position, color, label }) => {
  return (
    <div 
      className="absolute pointer-events-none z-20"
      style={{ left: position.x, top: position.y }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path 
          d="M0,0 L0,15 L5,12 L8,20 L10,19 L7,11 L15,11 Z" 
          fill={color}
        />
      </svg>
      <span 
        className="absolute top-5 left-5 text-xs font-semibold px-2 py-1 rounded"
        style={{ backgroundColor: color, color: 'white' }}
      >
        {label}
      </span>
    </div>
  );
};

export const CollaborationDemo: React.FC = () => {
  const [cursor1Pos, setCursor1Pos] = useState({ x: 100, y: 100 });
  const [cursor2Pos, setCursor2Pos] = useState({ x: 200, y: 150 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCursor1Pos(prev => ({
        x: 150 + Math.sin(Date.now() / 1000) * 50,
        y: 100 + Math.cos(Date.now() / 1000) * 30
      }));
      setCursor2Pos(prev => ({
        x: 200 - Math.sin(Date.now() / 1000) * 40,
        y: 150 - Math.cos(Date.now() / 1000) * 40
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 relative h-96 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center text-gray-600">
        <div className="text-center">
          <Code className="w-12 h-12 mx-auto mb-2" />
          <p>System Design Canvas</p>
        </div>
      </div>
      
      {/* Animated cursors */}
      <Cursor 
        position={cursor1Pos} 
        color="#3b82f6" 
        label="Sarah"
      />
      <Cursor 
        position={cursor2Pos} 
        color="#10b981" 
        label="You"
      />
      
      {/* Sample components */}
      <div className="absolute top-8 left-8 bg-blue-600 text-white px-3 py-2 rounded text-sm">
        Load Balancer
      </div>
      <div className="absolute bottom-8 right-8 bg-green-600 text-white px-3 py-2 rounded text-sm">
        Database
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-3 py-2 rounded text-sm">
        API Gateway
      </div>
    </div>
  );
};