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
        styles.browserTab,
        {
          [styles['browserTab--active']]: active,
          [styles['browserTab--loading']]: loading,
        },
        className
      )}
      onClick={handleClick}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
    >
      <div className={styles['browserTab__content']}>
        <div className={styles['browserTab__icon']}>
          {favicon ? (
            <img 
              src={favicon} 
              alt="" 
              className={styles['browserTab__favicon']} 
            />
          ) : (
            <Icon name="globe" size="sm" />
          )}
          {loading && <div className={styles['browserTab__spinner']} />}
        </div>
        
        <span 
          className={styles['browserTab__title']}
          title={title}
        >
          {getDisplayTitle()}
        </span>
        
        {modified && (
          <span className={styles['browserTab__modified']} aria-label="Modified">
            ●
          </span>
        )}
        
        {hasNotification && (
          <div 
            className={styles['browserTab__notification']}
            aria-label="Has notification"
          />
        )}
      </div>
      
      {showClose && (
        <button
          className={styles['browserTab__close']}
          onClick={handleClose}
          aria-label={`Close ${title} tab`}
          type="button"
        >
          <Icon name="x" size="sm" />
        </button>
      )}
    </div>
  );
};

export default BrowserTab; 