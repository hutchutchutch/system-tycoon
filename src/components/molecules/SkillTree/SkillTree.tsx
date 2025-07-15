import React from 'react';
import { Check, Lock, Loader } from 'lucide-react';

interface Module {
  name: string;
  completed?: boolean;
  inProgress?: boolean;
  locked?: boolean;
}

interface SkillTreeProps {
  modules: Module[];
}

export const SkillTree: React.FC<SkillTreeProps> = ({ modules }) => {
  return (
    <div className="relative">
      {modules.map((module, index) => (
        <div key={index} className="flex items-center mb-4">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center z-10
            ${module.completed ? 'bg-green-500' : 
              module.inProgress ? 'bg-yellow-500 animate-pulse' : 
              'bg-gray-300'}
          `}>
            {module.completed ? (
              <Check size={20} className="text-white" />
            ) : module.inProgress ? (
              <Loader size={20} className="text-white animate-spin" />
            ) : (
              <Lock size={16} className="text-gray-600" />
            )}
          </div>
          <div className="ml-4 flex-1">
            <p className={`text-sm ${module.locked ? 'text-gray-400' : 'text-gray-700'}`}>
              {module.name}
            </p>
          </div>
        </div>
      ))}
      {/* Connecting lines */}
      <svg className="absolute top-0 left-5 h-full w-px pointer-events-none">
        <line 
          x1="0" 
          y1="20" 
          x2="0" 
          y2="calc(100% - 20px)" 
          stroke="#e5e7eb" 
          strokeWidth="2" 
        />
      </svg>
    </div>
  );
};