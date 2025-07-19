import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import styles from './BrowserWindow.module.css';
import type { BrowserWindowProps } from './BrowserWindow.types';

export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  activeTab,
  tabs,
  className,
  children,
  bookmarks,
  onTabChange,
  onTabClose,
  onNewTab,
  onEmailClick,
}) => {
  const activeTabData = useMemo(() => 
    tabs.find(tab => tab.id === activeTab),
    [tabs, activeTab]
  );

  const ActiveComponent = activeTabData?.component;

  // Filter out tab-specific properties and pass through component props
  const componentProps = useMemo(() => {
    if (!activeTabData) return {};
    
    return Object.fromEntries(
      Object.entries(activeTabData).filter(([key]) => 
        !['id', 'title', 'url', 'component', 'hasNotification', 'closable'].includes(key)
      )
    );
  }, [activeTabData]);

  return (
    <div className={clsx(styles.browserWindow, className)}>
      <div className={clsx(
        styles.content,
        activeTabData?.component?.name === 'EmailClientWrapper' && styles['content--emailClient']
      )}>
        {ActiveComponent ? (
          <ActiveComponent 
            {...componentProps}
          />
        ) : children}
      </div>
    </div>
  );
}; 