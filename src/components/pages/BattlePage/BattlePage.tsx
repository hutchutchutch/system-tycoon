import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { BattleTemplate } from '../../templates/BattleTemplate';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';
import { Progress } from '../../atoms/Progress';
import styles from './BattlePage.module.css';

/**
 * BattlePage - System architecture battle page
 * 
 * Redux State Management:
 * - battle.isActive: Whether a battle is in progress
 * - battle.playerActions: Available player actions this turn
 * - battle.enemyActions: Enemy's queued actions
 * - battle.turnTimer: Time remaining for current turn
 * - battle.rewards: Potential rewards for winning
 */
export const BattlePage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const battle = useAppSelector((state) => state.battle);
  const playerActions = useAppSelector((state) => state.battle.playerActions);
  const turnTimer = useAppSelector((state) => state.battle.turnTimer);

  const handleAction = (actionId: string) => {
    // Dispatch battle action
    dispatch({ type: 'battle/executeAction', payload: actionId });
  };

  return (
    <BattleTemplate>
      <div className={styles.battleControls}>
        <Card className={styles.actionPanel}>
          <h3>System Actions</h3>
          <div className={styles.actions}>
            {playerActions.map((action) => (
              <Button
                key={action.id}
                onClick={() => handleAction(action.id)}
                variant={action.type === 'attack' ? 'destructive' : 'default'}
                disabled={!action.available}
              >
                {action.name}
              </Button>
            ))}
          </div>
        </Card>
        
        <Card className={styles.statusPanel}>
          <h3>Battle Status</h3>
          <div className={styles.timer}>
            <span>Turn Timer</span>
            <Progress value={turnTimer} max={30} />
          </div>
        </Card>
      </div>
    </BattleTemplate>
  );
};

export default BattlePage;