import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import styles from './BattleTemplate.module.css';

interface BattleTemplateProps {
  children?: React.ReactNode;
}

/**
 * BattleTemplate - Template for system architecture battles
 * 
 * Redux State Management:
 * - battle.currentBattle: Active battle state and participants
 * - battle.playerHealth: Player's system health/integrity
 * - battle.enemyHealth: Opponent's system health
 * - battle.turnOrder: Current turn and action queue
 * - battle.availableActions: Player's available moves
 * - battle.battleLog: History of battle actions
 */
export const BattleTemplate: React.FC<BattleTemplateProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const currentBattle = useAppSelector((state) => state.battle.currentBattle);
  const playerHealth = useAppSelector((state) => state.battle.playerHealth);
  const enemyHealth = useAppSelector((state) => state.battle.enemyHealth);
  const turnOrder = useAppSelector((state) => state.battle.turnOrder);
  const battleLog = useAppSelector((state) => state.battle.battleLog);

  return (
    <div className={styles.battleTemplate}>
      <div className={styles.battleArena}>
        <div className={styles.playerSide}>
          {/* Player system visualization */}
        </div>
        <div className={styles.enemySide}>
          {/* Enemy system visualization */}
        </div>
      </div>
      <div className={styles.battleInterface}>
        {children}
      </div>
    </div>
  );
};

export default BattleTemplate;