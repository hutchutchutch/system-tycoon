import React from 'react';
import { CheckCircle, Circle, Play } from 'lucide-react';

interface Requirement {
  id: string;
  description: string;
  completed: boolean;
}

interface RequirementsProps {
  requirements: Requirement[];
  onRunTest: () => void;
  className?: string;
}

export const Requirements: React.FC<RequirementsProps> = ({ 
  requirements, 
  onRunTest, 
  className = '' 
}) => {
  const completedCount = requirements.filter(req => req.completed).length;
  const allCompleted = completedCount === requirements.length;

  return (
    <div className={`requirements ${className}`}>
      <div className="requirements__header">
        <h3 className="requirements__title">Requirements</h3>
        <div className="requirements__progress">
          {completedCount}/{requirements.length}
        </div>
      </div>
      
      <div className="requirements__list">
        {requirements.map((requirement) => (
          <div 
            key={requirement.id} 
            className={`requirements__item ${requirement.completed ? 'requirements__item--completed' : ''}`}
          >
            <div className="requirements__icon">
              {requirement.completed ? (
                <CheckCircle size={16} className="requirements__check" />
              ) : (
                <Circle size={16} className="requirements__circle" />
              )}
            </div>
            <span className="requirements__text">{requirement.description}</span>
          </div>
        ))}
      </div>
      
      <button 
        className={`requirements__test-button ${allCompleted ? 'requirements__test-button--ready' : ''}`}
        onClick={onRunTest}
        disabled={!allCompleted}
      >
        <Play size={16} />
        Run Test
      </button>
    </div>
  );
}; 