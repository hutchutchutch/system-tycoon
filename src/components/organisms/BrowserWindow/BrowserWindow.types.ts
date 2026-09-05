import React from 'react';

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  component: React.ComponentType<unknown>;
  hasNotification?: boolean;
  closable?: boolean; // Whether the tab can be closed (defaults to true)
  // Allow additional props to be passed to the component
  [key: string]: unknown;
}

export interface BrowserWindowProps {
  activeTab: string;
  tabs: BrowserTab[];
  className?: string;
  children?: React.ReactNode;
  bookmarks?: unknown[];
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTab?: () => void;
  onEmailClick?: () => void;
} 