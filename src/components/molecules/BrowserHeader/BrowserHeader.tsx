import React from 'react';
import { clsx } from 'clsx';
import { BrowserTab } from '../../atoms/BrowserTab';
import { Icon } from '../../atoms/Icon';
import type { IconName } from '../../atoms/Icon';
import styles from './BrowserHeader.module.css';
import type { BrowserHeaderProps } from './BrowserHeader.types';

export const BrowserHeader: React.FC<BrowserHeaderProps> = ({
  tabs,
  activeTabIndex,
  onTabSelect,
  onTabClose,
  onNewTab,
  bookmarks = [],
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

  const handleBookmarkClick = (bookmark: any) => {
    bookmark.onClick?.();
  };

  return (
    <div className={clsx(styles.browserHeader, className)}>
      {/* Window controls (left side on macOS style) */}
      {showWindowControls && (
        <div className={clsx(styles.windowControls, styles['windowControls--left'])}>
          <button
            className={clsx(styles.control, styles['control--close'])}
            onClick={onClose}
            aria-label="Close window"
          >
            <div className={styles.controlDot} />
          </button>
          <button
            className={clsx(styles.control, styles['control--minimize'])}
            onClick={onMinimize}
            aria-label="Minimize window"
          >
            <div className={styles.controlDot} />
          </button>
          <button
            className={clsx(styles.control, styles['control--maximize'])}
            onClick={onMaximize}
            aria-label={isMaximized ? "Restore window" : "Maximize window"}
          >
            <div className={styles.controlDot} />
          </button>
        </div>
      )}

      {/* Tab container */}
      <div className={styles.tabs}>
        <div className={styles.tabList}>
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
            className={styles.newTab}
            onClick={handleNewTab}
            aria-label="Open new tab"
          >
            <Icon name="plus" size="sm" />
          </button>
        )}
      </div>

      {/* Bookmarks bar */}
      {bookmarks.length > 0 && (
        <div className={styles.bookmarks}>
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              className={clsx(
                styles.bookmark,
                bookmark.hasNotification && styles['bookmark--notification']
              )}
              onClick={() => handleBookmarkClick(bookmark)}
              title={bookmark.title}
            >
              {bookmark.icon && <Icon name={bookmark.icon as IconName} size="sm" />}
              <span className={styles.bookmarkTitle}>{bookmark.title}</span>
              {bookmark.hasNotification && (
                <div className={styles.notificationDot} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Right side window controls (Windows/Linux style) */}
      {showWindowControls && (
        <div className={clsx(styles.windowControls, styles['windowControls--right'])}>
          <button
            className={clsx(styles.control, styles['control--minimize'])}
            onClick={onMinimize}
            aria-label="Minimize window"
          >
            <Icon name="minus" size="xs" />
          </button>
          <button
            className={clsx(styles.control, styles['control--maximize'])}
            onClick={onMaximize}
            aria-label={isMaximized ? "Restore window" : "Maximize window"}
          >
            <Icon name={isMaximized ? "minimize" : "maximize"} size="xs" />
          </button>
          <button
            className={clsx(styles.control, styles['control--close'])}
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