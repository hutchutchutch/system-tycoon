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
          <div className="browser-window__navigation">
            <Button
              variant="ghost"
              size="small"
              icon={<ArrowLeft size={16} />}
              disabled
              aria-label="Go back"
            />
            <Button
              variant="ghost"
              size="small"
              icon={<ArrowRight size={16} />}
              disabled
              aria-label="Go forward"
            />
            <Button
              variant="ghost"
              size="small"
              icon={<RotateCcw size={16} />}
              aria-label="Refresh"
            />
          </div>

          {activeTabData && (
                         <BrowserAddressBar
               url={activeTabData.url}
               secure={activeTabData.url.startsWith('https://')}
             />
          )}
        </div>
      </div>

      <div className="browser-window__content">
        {ActiveComponent ? <ActiveComponent /> : children}
      </div>
    </div>
  );
}; 