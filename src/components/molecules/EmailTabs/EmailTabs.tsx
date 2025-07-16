import React from 'react';
import clsx from 'clsx';
import styles from './EmailTabs.module.css';

export interface EmailTab {
  id: string;
  name: string;
  count?: number;
}

interface EmailTabsProps {
  tabs: EmailTab[];
  selectedTab: string;
  onTabSelect: (tabId: string) => void;
}

export const EmailTabs: React.FC<EmailTabsProps> = ({
  tabs,
  selectedTab,
  onTabSelect
}) => {
  if (tabs.length === 0) return null;

  return (
    <div className={styles.tabs}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={clsx(styles.tab, {
            [styles['tab--active']]: selectedTab === tab.id
          })}
          onClick={() => onTabSelect(tab.id)}
        >
          {tab.name}
          {tab.count !== undefined && tab.count > 0 && (
            <span className={styles.tabCount}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}; 