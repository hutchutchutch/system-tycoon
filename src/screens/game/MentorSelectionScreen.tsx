import React from 'react';
import { useParams } from 'react-router-dom';

export const MentorSelectionScreen: React.FC = () => {
  const { scenarioId } = useParams();

  return (
    <div className="h-full bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Choose Your Mentor</h1>
        <p className="text-gray-400 mb-8">
          Select an expert to guide you through this challenge
        </p>
        
        <div className="p-6 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300">
            🚧 Mentor Selection screen is coming soon!
          </p>
          <p className="text-yellow-300 mt-2">
            Available mentors will include:
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-300">
            <li>Dr. Linda Wu - Senior Systems Architect</li>
            <li>Sam Okafor - Performance Engineer</li>
            <li>Maya Patel - Cloud Solutions Architect</li>
            <li>Chen Zhang - Security Architect</li>
            <li>And more...</li>
          </ul>
        </div>
      </div>
    </div>
  );
};