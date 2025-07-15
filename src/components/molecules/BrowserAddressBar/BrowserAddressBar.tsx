import React, { useState, useEffect } from 'react';
import { Icon } from '../../atoms/Icon';
import { Input } from '../../atoms/Input';
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
      return <Icon name="loader" size="sm" className="browser-address-bar__security-icon--loading" />;
    }
    if (secure) {
      return <Icon name="lock" size="sm" className="browser-address-bar__security-icon--secure" />;
    }
    return <Icon name="unlock" size="sm" className="browser-address-bar__security-icon--insecure" />;
  };

  return (
    <div className={`browser-address-bar ${className}`}>
      {/* Navigation controls */}
      <div className="browser-address-bar__navigation">
        <button
          className="browser-address-bar__nav-button"
          onClick={onGoBack}
          disabled={!canGoBack}
          aria-label="Go back"
        >
          <Icon name="arrow-left" size="sm" />
        </button>
        
        <button
          className="browser-address-bar__nav-button"
          onClick={onGoForward}
          disabled={!canGoForward}
          aria-label="Go forward"
        >
          <Icon name="arrow-right" size="sm" />
        </button>
        
        <button
          className="browser-address-bar__nav-button"
          onClick={onRefresh}
          aria-label="Refresh page"
        >
          <Icon name="refresh" size="sm" />
        </button>

        {onHome && (
          <button
            className="browser-address-bar__nav-button"
            onClick={onHome}
            aria-label="Go home"
          >
            <Icon name="grid" size="sm" />
          </button>
        )}
      </div>

      {/* URL input area */}
      <div className="browser-address-bar__url-container">
        {/* Security indicator */}
        <div className="browser-address-bar__security">
          {getSecurityIcon()}
        </div>

        {/* URL input */}
        <div className="browser-address-bar__input-wrapper">
          {editable ? (
            <Input
              value={getDisplayUrl()}
              onChange={handleUrlChange}
              onKeyPress={handleKeyPress}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="browser-address-bar__input"
              placeholder="Enter URL or search term"
            />
          ) : (
            <div className="browser-address-bar__url-display">
              {getDisplayUrl()}
            </div>
          )}
        </div>

        {/* Bookmark button */}
        {onBookmark && (
          <button
            className={`browser-address-bar__bookmark ${isBookmarked ? 'browser-address-bar__bookmark--active' : ''}`}
            onClick={onBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Icon name="star" size="sm" />
          </button>
        )}
      </div>

      {/* Additional controls */}
      <div className="browser-address-bar__controls">
        <button
          className="browser-address-bar__control"
          aria-label="Settings"
        >
          <Icon name="settings" size="sm" />
        </button>
      </div>
    </div>
  );
};

export default BrowserAddressBar; 