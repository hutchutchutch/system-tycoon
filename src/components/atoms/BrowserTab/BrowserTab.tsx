import React from 'react';
import { Icon } from '../Icon';
import type { BrowserTabProps } from './BrowserTab.types';

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
      className={`browser-tab ${active ? 'browser-tab--active' : ''} ${className}`}
      onClick={handleClick}
      role="tab"
      aria-selected={active}
      tabIndex={0}
    >
      {/* Favicon or loading indicator */}
      <div className="browser-tab__icon">
        {loading ? (
          <div className="browser-tab__spinner" />
        ) : favicon ? (
          <img 
            src={favicon} 
            alt="" 
            className="browser-tab__favicon"
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
      <span className="browser-tab__title">
        {getDisplayTitle()}
        {modified && <span className="browser-tab__modified">•</span>}
      </span>

      {/* Notification indicator */}
      {hasNotification && (
        <div className="browser-tab__notification" />
      )}

      {/* Close button */}
      {showClose && (
        <button
          className="browser-tab__close"
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