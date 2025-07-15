import React from 'react';
import { BrowserTab } from '../../atoms/BrowserTab';
import { Icon } from '../../atoms/Icon';
import type { BrowserHeaderProps } from './BrowserHeader.types';

export const BrowserHeader: React.FC<BrowserHeaderProps> = ({
  tabs,
  activeTabIndex,
  onTabSelect,
  onTabClose,
  onNewTab,
  showWindowControls = true,
  onMinimize,
  onMaximize,
  onClose,
  isMaximized = false,
  className = '',
}) => {
  const handleTabClick = (index: number) => {
    onTabSelect?.(index);
  };

  const handleTabClose = (index: number) => {
    onTabClose?.(index);
  };

  const handleNewTab = () => {
    onNewTab?.();
  };

  return (
    <div className={`browser-header ${className}`}>
      {/* Window controls (left side on macOS style) */}
      {showWindowControls && (
        <div className="browser-header__window-controls browser-header__window-controls--left">
          <button
            className="browser-header__control browser-header__control--close"
            onClick={onClose}
            aria-label="Close window"
          >
            <div className="browser-header__control-dot" />
          </button>
          <button
            className="browser-header__control browser-header__control--minimize"
            onClick={onMinimize}
            aria-label="Minimize window"
          >
            <div className="browser-header__control-dot" />
          </button>
          <button
            className="browser-header__control browser-header__control--maximize"
            onClick={onMaximize}
            aria-label={isMaximized ? "Restore window" : "Maximize window"}
          >
            <div className="browser-header__control-dot" />
          </button>
        </div>
      )}

      {/* Tab container */}
      <div className="browser-header__tabs">
        <div className="browser-header__tab-list">
          {tabs.map((tab, index) => (
            <BrowserTab
              key={index}
              {...tab}
              active={index === activeTabIndex}
              onClick={() => handleTabClick(index)}
              onClose={() => handleTabClose(index)}
            />
          ))}
        </div>

        {/* New tab button */}
        {onNewTab && (
          <button
            className="browser-header__new-tab"
            onClick={handleNewTab}
            aria-label="Open new tab"
          >
            <Icon name="plus" size="sm" />
          </button>
        )}
      </div>

      {/* Right side window controls (Windows/Linux style) */}
      {showWindowControls && (
        <div className="browser-header__window-controls browser-header__window-controls--right">
          <button
            className="browser-header__control browser-header__control--minimize"
            onClick={onMinimize}
            aria-label="Minimize window"
          >
            <Icon name="minus" size="xs" />
          </button>
          <button
            className="browser-header__control browser-header__control--maximize"
            onClick={onMaximize}
            aria-label={isMaximized ? "Restore window" : "Maximize window"}
          >
            <Icon name={isMaximized ? "minimize" : "maximize"} size="xs" />
          </button>
          <button
            className="browser-header__control browser-header__control--close"
            onClick={onClose}
            aria-label="Close window"
          >
            <Icon name="x" size="xs" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowserHeader; 