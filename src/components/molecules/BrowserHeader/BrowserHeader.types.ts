import type { BrowserTabProps } from '../../atoms/BrowserTab';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  hasNotification?: boolean;
  onClick?: () => void;
}

export interface BrowserHeaderProps {
  /** Array of browser tabs */
  tabs: BrowserTabProps[];
  
  /** Index of the currently active tab */
  activeTabIndex: number;
  
  /** Handler for tab selection */
  onTabSelect?: (index: number) => void;
  
  /** Handler for tab close */
  onTabClose?: (index: number) => void;
  
  /** Handler for new tab creation */
  onNewTab?: () => void;
  
  /** Array of bookmarks */
  bookmarks?: Bookmark[];
  
  /** Whether to show window controls (minimize, maximize, close) */
  showWindowControls?: boolean;
  
  /** Window control handlers */
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  
  /** Whether the window is maximized */
  isMaximized?: boolean;
  
  /** Optional CSS class name */
  className?: string;
} 