import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchScenarios, fetchUserProgress } from '../../features/game/gameSlice';
import { CareerMapGame } from '../../components/organisms/CareerMap/CareerMap';
import { PhaseHeader } from '../../components/molecules/PhaseHeader';
import { Progress } from '../../components/atoms/Progress';
import { Badge } from '../../components/atoms/Badge';

export const CareerMapScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { scenarios, progress, isLoading } = useAppSelector((state) => state.game);
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.profile);

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

  const currentLevel = profile?.current_level || 1;
  const reputationPoints = profile?.reputation_points || 0;
  const careerTitle = profile?.career_title || 'Junior Developer';
  const completedScenarios = progress?.filter(p => p.status === 'completed').length || 0;
  const totalScenarios = scenarios?.length || 0;
  const progressPercentage = totalScenarios > 0 ? (completedScenarios / totalScenarios) * 100 : 0;

  return (
    <div className="career-map career-map--fullscreen">
      <PhaseHeader
        title="Career Map"
        subtitle={`Level ${currentLevel} - ${careerTitle}`}
        variant="career-map"
        rightContent={
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm opacity-80">Progress</div>
              <div className="text-lg font-semibold">{completedScenarios}/{totalScenarios}</div>
            </div>
            <Progress 
              value={progressPercentage} 
              max={100} 
              variant="success"
              className="w-24"
            />
            <Badge variant="primary" size="md">
              {reputationPoints.toLocaleString()} Rep
            </Badge>
          </div>
        }
      />
      <CareerMapGame 
        scenarios={scenarios} 
        progress={progress} 
        onScenarioClick={handleScenarioClick}
      />
    </div>
  );
};