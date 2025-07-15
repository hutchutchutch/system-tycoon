import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchScenarios, fetchUserProgress } from '../../features/game/gameSlice';
import { CareerMapGame } from '../../components/organisms/CareerMap/CareerMap';

export const CareerMapScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { scenarios, progress, isLoading } = useAppSelector((state) => state.game);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchScenarios());
    if (user?.id) {
      dispatch(fetchUserProgress(user.id));
    }
  }, [dispatch, user?.id]);

  const handleScenarioClick = (scenarioId: string) => {
    // Navigate to the scenario or meeting room
    navigate(`/simulation/${scenarioId}`);
  };

  if (isLoading) {
    return (
      <div className="career-map__loading">
        <div className="career-map__spinner"></div>
      </div>
    );
  }

  return (
    <div className="career-map career-map--fullscreen">
      <CareerMapGame 
        scenarios={scenarios} 
        progress={progress} 
        onScenarioClick={handleScenarioClick}
      />
    </div>
  );
};