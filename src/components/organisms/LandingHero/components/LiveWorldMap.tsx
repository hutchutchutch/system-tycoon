import React, { useState, useEffect } from 'react';

interface MissionPoint {
  id: string;
  lat: number;
  lng: number;
  city: string;
  active: boolean;
}

export const LiveWorldMap: React.FC = () => {
  const [missions, setMissions] = useState<MissionPoint[]>([
    { id: '1', lat: 23.8103, lng: 90.4125, city: 'Dhaka', active: true },
    { id: '2', lat: -1.2921, lng: 36.8219, city: 'Nairobi', active: true },
    { id: '3', lat: 14.5995, lng: 120.9842, city: 'Manila', active: false },
    { id: '4', lat: -23.5505, lng: -46.6333, city: 'São Paulo', active: true },
    { id: '5', lat: 19.0760, lng: 72.8777, city: 'Mumbai', active: true }
  ]);

  // Simple placeholder for world map - in production would use react-simple-maps or mapbox
  return (
    <div className="mt-16 mb-8">
      <div className="bg-gray-900 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            {/* Simplified world map outline */}
            <path
              d="M 200,250 Q 300,200 400,250 T 600,250 Q 700,200 800,250"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              opacity="0.3"
            />
          </svg>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-white text-center mb-4 text-lg font-semibold">
            Live Mission Activity
          </h3>
          <div className="flex justify-center gap-8 text-white text-sm">
            {missions.filter(m => m.active).map(mission => (
              <div key={mission.id} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>{mission.city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};