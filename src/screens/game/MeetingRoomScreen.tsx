import React from 'react';
import { useParams } from 'react-router-dom';

export const MeetingRoomScreen: React.FC = () => {
  const { scenarioId } = useParams();

  return (
    <div className="h-full bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meeting Room</h1>
        <p className="text-gray-400 mb-8">
          Scenario ID: {scenarioId}
        </p>
        
        <div className="p-6 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300">
            🚧 Meeting Room with dialogue system is under construction!
          </p>
          <p className="text-yellow-300 mt-2">
            This screen will feature:
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-300">
            <li>Interactive character conversations</li>
            <li>Question selection system</li>
            <li>Requirements gathering</li>
            <li>Dynamic narrative based on your choices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};