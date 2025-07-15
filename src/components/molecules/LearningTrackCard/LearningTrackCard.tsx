import React from 'react';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { SkillTree } from '../SkillTree';

interface Module {
  name: string;
  completed?: boolean;
  inProgress?: boolean;
  locked?: boolean;
}

interface LearningTrackCardProps {
  title: string;
  partner: string;
  modules: Module[];
  certification: string;
  careerPath: string;
}

export const LearningTrackCard: React.FC<LearningTrackCardProps> = ({
  title,
  partner,
  modules,
  certification,
  careerPath
}) => {
  const completedCount = modules.filter(m => m.completed).length;
  const progressPercent = (completedCount / modules.length) * 100;
  
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex-1">
        <Badge variant="outline" className="mb-2">
          {partner}
        </Badge>
        
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
        <SkillTree modules={modules} />
        
        <div className="mt-6 space-y-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm font-semibold text-green-800">Certification:</p>
            <p className="text-sm text-green-700">{certification}</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-semibold text-blue-800">Career Path:</p>
            <p className="text-sm text-blue-700">{careerPath}</p>
          </div>
        </div>
      </div>
      
      <Button variant="primary" fullWidth className="mt-6">
        Continue Learning →
      </Button>
    </Card>
  );
};