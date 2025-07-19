import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { BrowserHeader } from '../../molecules/BrowserHeader';
import { BrowserAddressBar } from '../../molecules/BrowserAddressBar';
import styles from './BrowserWindow.module.css';
import type { BrowserWindowProps } from './BrowserWindow.types';

export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  activeTab,
  tabs,
  onTabChange,
  onTabClose,
  onNewTab,
  bookmarks = [],
  onEmailClick,
  className,
  children,
}) => {
  const activeTabData = useMemo(() => 
    tabs.find(tab => tab.id === activeTab),
    [tabs, activeTab]
  );

  const activeTabIndex = useMemo(() => 
    tabs.findIndex(tab => tab.id === activeTab),
    [tabs, activeTab]
  );

  const ActiveComponent = activeTabData?.component;

  const handleTabSelect = (index: number) => {
    const selectedTab = tabs[index];
    if (selectedTab) {
      onTabChange(selectedTab.id);
    }
  };

  const handleTabClose = (index: number) => {
    const tabToClose = tabs[index];
    if (tabToClose) {
      onTabClose(tabToClose.id);
    }
  };

  // Convert tabs to BrowserHeader format
  const browserTabs = tabs.map(tab => ({
    title: tab.title,
    url: tab.url,
    active: tab.id === activeTab,
    hasNotification: tab.hasNotification,
    closable: tab.closable !== false,
  }));

  return (
    <div className={clsx(styles.browserWindow, className)}>
      <div className={styles.chrome}>
        <BrowserHeader
          tabs={browserTabs}
          activeTabIndex={activeTabIndex}
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
          onNewTab={onNewTab}
          bookmarks={bookmarks}
          showWindowControls={true}
        />

        <div className={styles.controls}>
          <div className={styles.addressBarContainer}>
            {activeTabData && (
              <BrowserAddressBar
                url={activeTabData.url}
                secure={activeTabData.url.startsWith('https://')}
                onEmailClick={onEmailClick}
              />
            )}
          </div>
        </div>
      </div>

      <div className={clsx(
        styles.content,
        activeTabData?.component?.name === 'EmailClientWrapper' && styles['content--emailClient']
      )}>
        {ActiveComponent ? (
          <ActiveComponent 
            {...(activeTabData && Object.fromEntries(
              Object.entries(activeTabData).filter(([key]) => 
                !['id', 'title', 'url', 'component', 'hasNotification'].includes(key)
              )
            ))}
          />
        ) : children}
      </div>
    </div>
  );
}; 