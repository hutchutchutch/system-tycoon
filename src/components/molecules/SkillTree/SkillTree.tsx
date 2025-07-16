import React from 'react';
import clsx from 'clsx';
import { Check, Lock, Loader } from 'lucide-react';
import styles from './SkillTree.module.css';

interface Module {
  name: string;
  completed?: boolean;
  inProgress?: boolean;
  locked?: boolean;
}

interface SkillTreeProps {
  modules: Module[];
}

export const SkillTree: React.FC<SkillTreeProps> = ({ modules }) => {
  return (
    <div className={styles.container}>
      {modules.map((module, index) => (
        <div key={index} className={styles.module}>
          <div className={clsx(
            styles.indicator,
            {
              [styles['indicator--completed']]: module.completed,
              [styles['indicator--inProgress']]: module.inProgress,
              [styles['indicator--locked']]: !module.completed && !module.inProgress
            }
          )}>
            {module.completed ? (
              <Check className={clsx(styles.icon, styles['icon--check'])} />
            ) : module.inProgress ? (
              <Loader className={clsx(styles.icon, styles['icon--loader'])} />
            ) : (
              <Lock className={styles['icon--lock']} />
            )}
          </div>
          <div className={styles.moduleInfo}>
            <p className={clsx(
              styles.moduleName,
              {
                [styles['moduleName--active']]: module.completed || module.inProgress,
                [styles['moduleName--locked']]: module.locked
              }
            )}>
              {module.name}
            </p>
          </div>
        </div>
      ))}
      {/* Connecting lines */}
      <svg className={styles.connectingLine}>
        <line 
          x1="0" 
          y1="20" 
          x2="0" 
          y2="calc(100% - 20px)" 
          className={styles.connectingLinePath}
        />
      </svg>
    </div>
  );
};