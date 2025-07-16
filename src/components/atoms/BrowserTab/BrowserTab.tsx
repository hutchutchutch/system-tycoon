import React from 'react';
import { clsx } from 'clsx';
import { Icon } from '../Icon';
import type { BrowserTabProps } from './BrowserTab.types';
import styles from './BrowserTab.module.css';

export const BrowserTab: React.FC<BrowserTabProps> = ({
  title,
  url,
  active,
  favicon,
  loading = false,
  modified = false,
  hasNotification = false,
  onClick,
  onClose,
  showClose = true,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose?.();
  };

  const getDisplayTitle = () => {
    if (title.length > 20) {
      return title.substring(0, 20) + '...';
    }
    return title;
  };

  return (
    <div
      className={clsx(
        styles['browser-tab'],
        {
          [styles['browser-tab--active']]: active,
          [styles['browser-tab--loading']]: loading,
        },
        className
      )}
      onClick={handleClick}
      role="tab"
      aria-selected={active}
      tabIndex={0}
    >
      <div className={styles['browser-tab__content']}>
        {/* Favicon or loading indicator */}
        <div className={styles['browser-tab__icon']}>
          {loading ? (
            <div className={styles['browser-tab__spinner']} />
          ) : favicon ? (
            <img 
              src={favicon} 
              alt="" 
              className={styles['browser-tab__favicon']}
              onError={(e) => {
                // Fallback to generic icon if favicon fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Icon name="globe" size="sm" />
          )}
        </div>

        {/* Tab title */}
        <span className={styles['browser-tab__title']}>
          {getDisplayTitle()}
          {modified && <span className={styles['browser-tab__modified']}>•</span>}
        </span>

        {/* Notification indicator */}
        {hasNotification && (
          <div className={styles['browser-tab__notification']} />
        )}
      </div>

      {/* Close button */}
      {showClose && (
        <button
          className={styles['browser-tab__close']}
          onClick={handleClose}
          aria-label={`Close ${title}`}
          tabIndex={-1}
        >
          <Icon name="x" size="xs" />
        </button>
      )}
    </div>
  );
};

export default BrowserTab; 