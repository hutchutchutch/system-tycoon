import React from 'react';

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  component: React.ComponentType<any>;
  hasNotification?: boolean;
  // Allow additional props to be passed to the component
  [key: string]: any;
}

export interface BrowserWindowProps {
  activeTab: string;
  tabs: BrowserTab[];
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab?: () => void;
  className?: string;
  children?: React.ReactNode;
} 