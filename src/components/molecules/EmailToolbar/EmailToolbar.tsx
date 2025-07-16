import React from 'react';
import { EmailSearchBar } from '../../atoms/EmailSearchBar';
import { EmailTabs, type EmailTab } from '../EmailTabs';
import styles from './EmailToolbar.module.css';

interface EmailToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tabs: EmailTab[];
  selectedTab: string;
  onTabSelect: (tabId: string) => void;
  searchPlaceholder?: string;
}

export const EmailToolbar: React.FC<EmailToolbarProps> = ({
  searchQuery,
  onSearchChange,
  tabs,
  selectedTab,
  onTabSelect,
  searchPlaceholder
}) => {
  return (
    <div className={styles.toolbar}>
      <EmailSearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />

      <EmailTabs
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelect={onTabSelect}
      />
    </div>
  );
}; 