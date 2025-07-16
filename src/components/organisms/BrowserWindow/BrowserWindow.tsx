import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { Plus } from 'lucide-react';
import { BrowserTab } from '../../atoms/BrowserTab';
import { BrowserAddressBar } from '../../molecules/BrowserAddressBar';
import styles from './BrowserWindow.module.css';
import type { BrowserWindowProps } from './BrowserWindow.types';

export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  activeTab,
  tabs,
  onTabChange,
  onTabClose,
  onNewTab,
  className,
  children,
}) => {
  const activeTabData = useMemo(() => 
    tabs.find(tab => tab.id === activeTab),
    [tabs, activeTab]
  );

  const ActiveComponent = activeTabData?.component;

  return (
    <div className={clsx(styles.browserWindow, className)}>
      <div className={styles.chrome}>
        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            {tabs.map(tab => (
              <BrowserTab
                key={tab.id}
                title={tab.title}
                url={tab.url}
                active={tab.id === activeTab}
                hasNotification={tab.hasNotification}
                onClick={() => onTabChange(tab.id)}
                onClose={tab.closable !== false ? () => onTabClose(tab.id) : undefined}
                showClose={tab.closable !== false}
              />
            ))}
            
            {onNewTab && (
              <button
                className={styles.newTabButton}
                onClick={onNewTab}
                aria-label="New tab"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.addressBarContainer}>
            {activeTabData && (
              <BrowserAddressBar
                url={activeTabData.url}
                secure={activeTabData.url.startsWith('https://')}
              />
            )}
          </div>

          <div className={styles.windowControls}>
            <button className={styles['windowControl--close']} aria-label="Close" />
            <button className={styles['windowControl--minimize']} aria-label="Minimize" />
            <button className={styles['windowControl--maximize']} aria-label="Maximize" />
          </div>
        </div>
      </div>

      <div className={styles.content}>
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