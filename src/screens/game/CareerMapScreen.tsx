import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchScenarios, fetchUserProgress } from '../../features/game/gameSlice';

export const CareerMapScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { scenarios, progress, isLoading } = useAppSelector((state) => state.game);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchScenarios());
    if (user?.id) {
      dispatch(fetchUserProgress(user.id));
    }
  }, [dispatch, user?.id]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Career Map</h1>
        <p className="text-gray-400 mb-8">
          Your journey from aspiring consultant to industry expert begins here.
        </p>
        
        {/* Temporary scenario list - will be replaced with Phaser.js canvas */}
        <div className="grid gap-4">
          {scenarios.map((scenario) => {
            const scenarioProgress = progress.find(p => p.scenarioId === scenario.id);
            const isLocked = scenario.level > 1 && !scenarioProgress;
            const isCompleted = scenarioProgress?.status === 'completed';
            
            return (
              <div
                key={scenario.id}
                className={`p-6 rounded-lg border ${
                  isLocked 
                    ? 'bg-gray-800 border-gray-700 opacity-50' 
                    : isCompleted
                    ? 'bg-green-900 border-green-700'
                    : 'bg-blue-900 border-blue-700 hover:bg-blue-800 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{scenario.title}</h3>
                    <p className="text-gray-400">Client: {scenario.clientName}</p>
                    <p className="text-sm text-gray-500">Level {scenario.level}</p>
                  </div>
                  {isCompleted && (
                    <div className="text-green-400">
                      <span className="text-2xl">✓</span>
                      <p className="text-sm">Score: {scenarioProgress?.bestScore}%</p>
                    </div>
                  )}
                  {isLocked && (
                    <div className="text-gray-500">
                      <span className="text-2xl">🔒</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 p-6 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300">
            🚧 Career Map visualization with Phaser.js is coming soon! 
            For now, you can see your available scenarios above.
          </p>
        </div>
      </div>
    </div>
  );
};