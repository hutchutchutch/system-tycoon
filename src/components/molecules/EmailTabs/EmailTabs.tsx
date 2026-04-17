import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
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
    <Tabs value={selectedTab} onValueChange={onTabSelect}>
      <TabsList className={styles.tabsList}>
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id} className={styles.tab}>
            {tab.name}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={styles.tabCount}>{tab.count}</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
