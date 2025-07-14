import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const ResultsScreen: React.FC = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Results</h1>
          
          <div className="mb-8">
            <p className="text-6xl font-bold text-yellow-400 mb-2">85%</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-3xl ${star <= 4 ? 'text-yellow-400' : 'text-gray-600'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm">Requirements Met</p>
              <p className="text-xl font-bold">34/40</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm">Performance</p>
              <p className="text-xl font-bold">26/30</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm">Cost Efficiency</p>
              <p className="text-xl font-bold">15/20</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm">Architecture</p>
              <p className="text-xl font-bold">10/10</p>
            </div>
          </div>
          
          <div className="p-6 bg-yellow-900 border border-yellow-700 rounded-lg mb-8">
            <p className="text-yellow-300">
              🚧 Full results analysis coming soon!
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/career')}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Return to Map
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};