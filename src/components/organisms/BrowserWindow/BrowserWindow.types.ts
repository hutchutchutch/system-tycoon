import React from 'react';

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  component: React.ComponentType<any>;
  hasNotification?: boolean;
  closable?: boolean; // Whether the tab can be closed (defaults to true)
  // Allow additional props to be passed to the component
  [key: string]: any;
}

export interface BrowserWindowProps {
  activeTab: string;
  tabs: BrowserTab[];
  className?: string;
  children?: React.ReactNode;
  bookmarks?: any[];
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTab?: () => void;
  onEmailClick?: () => void;
} 