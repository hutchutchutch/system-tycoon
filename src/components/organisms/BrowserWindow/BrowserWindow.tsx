import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { Plus, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { BrowserTab } from '../../atoms/BrowserTab';
import { Button } from '../../atoms/Button';
import { BrowserAddressBar } from '../../molecules/BrowserAddressBar';
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
    <div className={clsx('browser-window', className)}>
      <div className="browser-window__chrome">
        <div className="browser-window__tab-bar">
          <div className="browser-window__tabs">
            {tabs.map(tab => (
              <BrowserTab
                key={tab.id}
                title={tab.title}
                url={tab.url}
                active={tab.id === activeTab}
                hasNotification={tab.hasNotification}
                onClick={() => onTabChange(tab.id)}
                onClose={tabs.length > 1 ? () => onTabClose(tab.id) : undefined}
              />
            ))}
            
            {onNewTab && (
              <button
                className="browser-window__new-tab"
                onClick={onNewTab}
                aria-label="New tab"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="browser-window__controls">
          {activeTabData && (
            <BrowserAddressBar
              url={activeTabData.url}
              secure={activeTabData.url.startsWith('https://')}
            />
          )}
        </div>
      </div>

      <div className="browser-window__content">
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