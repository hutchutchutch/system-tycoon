import React from 'react';
import { useParams } from 'react-router-dom';

export const SystemDesignCanvas: React.FC = () => {
  const { scenarioId } = useParams();

  return (
    <div className="h-full bg-gray-900 text-white">
      <div className="h-full flex">
        {/* Component Drawer */}
        <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <div className="space-y-2">
            <div className="p-3 bg-gray-700 rounded cursor-move">
              Web Server
            </div>
            <div className="p-3 bg-gray-700 rounded cursor-move">
              Database
            </div>
            <div className="p-3 bg-gray-700 rounded cursor-move">
              Load Balancer
            </div>
          </div>
        </div>
        
        {/* Main Canvas */}
        <div className="flex-1 relative">
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <div className="bg-gray-800 px-4 py-2 rounded">
              Timer: 15:00
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded">
              Budget: $0 / $200
            </div>
          </div>
          
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-yellow-300 text-xl">
                🚧 React Flow canvas coming soon!
              </p>
              <p className="text-gray-400 mt-2">
                This will be the drag-and-drop system design interface
              </p>
            </div>
          </div>
        </div>
        
        {/* Mentor Assistant */}
        <div className="w-80 bg-gray-800 p-4 border-l border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Mentor Guidance</h2>
          <p className="text-gray-400">
            Your selected mentor's advice will appear here
          </p>
        </div>
      </div>
    </div>
  );
};