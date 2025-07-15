import React from 'react';
import { Badge } from '../../../atoms/Badge';

export const HeroContent: React.FC = () => {
  return (
    <div className="text-center pt-32">
      <Badge variant="primary" className="mb-4">
        🚨 URGENT: 2,500+ active missions worldwide
      </Badge>
      
      <h1 className="text-6xl font-bold text-gray-900 mb-6">
        Software as a Service,
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
          the game
        </span>
      </h1>
      
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Join thousands of developers using their skills to solve real humanitarian 
        crises. Every line of code you write makes an actual difference.
      </p>
    </div>
  );
};