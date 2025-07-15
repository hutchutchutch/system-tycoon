import React from 'react';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
  number: number;
}

export const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  example,
  number
}) => {
  return (
    <Card className="relative p-8 hover:shadow-xl transition-shadow duration-300">
      <Badge 
        variant="primary" 
        className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center"
      >
        {number}
      </Badge>
      
      <div className="flex justify-center mb-6 text-blue-600">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-700 italic">
          <span className="font-semibold">Example:</span> {example}
        </p>
      </div>
    </Card>
  );
};