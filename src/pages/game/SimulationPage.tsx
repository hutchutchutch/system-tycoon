import React from 'react';
import { useParams } from 'react-router-dom';

export const SimulationScreen: React.FC = () => {
  const { scenarioId } = useParams();

  return (
    <div className="h-full bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Simulation</h1>
        
        <div className="p-6 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300">
            🚧 Simulation visualization with Phaser.js is coming soon!
          </p>
          <p className="text-yellow-300 mt-2">
            This screen will show:
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-300">
            <li>Animated data packets flowing through your system</li>
            <li>Real-time performance metrics</li>
            <li>Component stress visualization</li>
            <li>Traffic spike simulations</li>
          </ul>
        </div>
        
        {/* Mock Metrics Dashboard */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Response Time</p>
            <p className="text-2xl font-bold">0ms</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Throughput</p>
            <p className="text-2xl font-bold">0 req/s</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Error Rate</p>
            <p className="text-2xl font-bold">0%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Uptime</p>
            <p className="text-2xl font-bold">100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};