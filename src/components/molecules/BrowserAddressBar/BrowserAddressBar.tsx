import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Input } from '../../atoms/Input';
import styles from './BrowserAddressBar.module.css';
import type { BrowserAddressBarProps } from './BrowserAddressBar.types';

export const BrowserAddressBar: React.FC<BrowserAddressBarProps> = ({
  url,
  loading = false,
  secure = false,
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
  onRefresh,
  onHome,
  onUrlChange,
  onNavigate,
  editable = true,
  onBookmark,
  isBookmarked = false,
  className = '',
}) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  const handleUrlChange = (newUrl: string) => {
    setCurrentUrl(newUrl);
    onUrlChange?.(newUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNavigate?.(currentUrl);
      setIsFocused(false);
      e.currentTarget.blur();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Reset to actual URL if user didn't submit
    setCurrentUrl(url);
  };

  const getDisplayUrl = () => {
    if (isFocused) {
      return currentUrl;
    }
    // Show clean domain for display when not focused
    try {
      const urlObj = new URL(currentUrl);
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return currentUrl;
    }
  };

  const getSecurityIcon = () => {
    if (loading) {
      return <Icon name="loader" size="sm" className={styles['securityIcon--loading']} />;
    }
    if (secure) {
      return <Icon name="lock" size="sm" className={styles['securityIcon--secure']} />;
    }
    return <Icon name="unlock" size="sm" className={styles['securityIcon--insecure']} />;
  };

  return (
    <div className={clsx(styles.browserAddressBar, className)}>
      {/* Navigation controls */}
      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={onGoBack}
          disabled={!canGoBack}
          aria-label="Go back"
        >
          <Icon name="arrow-left" size="sm" />
        </button>
        
        <button
          className={styles.navButton}
          onClick={onGoForward}
          disabled={!canGoForward}
          aria-label="Go forward"
        >
          <Icon name="arrow-right" size="sm" />
        </button>
        
        <button
          className={styles.navButton}
          onClick={onRefresh}
          aria-label="Refresh page"
        >
          <Icon name="refresh" size="sm" />
        </button>

        {onHome && (
          <button
            className={styles.navButton}
            onClick={onHome}
            aria-label="Go home"
          >
            <Icon name="grid" size="sm" />
          </button>
        )}
      </div>

      {/* URL input area */}
      <div className={styles.urlContainer}>
        {/* Security indicator */}
        <div className={styles.security}>
          {getSecurityIcon()}
        </div>

        {/* URL input */}
        <div className={styles.inputWrapper}>
          {editable ? (
            <input
              value={getDisplayUrl()}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={styles.input}
              placeholder="Enter URL or search term"
            />
          ) : (
            <div className={styles.urlDisplay}>
              {getDisplayUrl()}
            </div>
          )}
        </div>

        {/* Bookmark button */}
        {onBookmark && (
          <button
            className={clsx(styles.bookmark, {
              [styles['bookmark--active']]: isBookmarked
            })}
            onClick={onBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Icon name="star" size="sm" />
          </button>
        )}
      </div>

      {/* Additional controls */}
      <div className={styles.controls}>
        <button
          className={styles.control}
          aria-label="Settings"
        >
          <Icon name="settings" size="sm" />
        </button>
      </div>
    </div>
  );
};

export default BrowserAddressBar; 