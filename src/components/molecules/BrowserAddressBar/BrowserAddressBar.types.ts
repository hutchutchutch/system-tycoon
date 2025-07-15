export interface BrowserAddressBarProps {
  /** Current URL displayed in the address bar */
  url: string;
  
  /** Whether the page is currently loading */
  loading?: boolean;
  
  /** Whether the current page is secure (HTTPS) */
  secure?: boolean;
  
  /** Whether navigation buttons are enabled */
  canGoBack?: boolean;
  canGoForward?: boolean;
  
  /** Navigation handlers */
  onGoBack?: () => void;
  onGoForward?: () => void;
  onRefresh?: () => void;
  onHome?: () => void;
  
  /** URL change handler */
  onUrlChange?: (url: string) => void;
  
  /** Navigation handler when user presses Enter */
  onNavigate?: (url: string) => void;
  
  /** Whether the address bar is focused/editable */
  editable?: boolean;
  
  /** Optional bookmark button */
  onBookmark?: () => void;
  isBookmarked?: boolean;
  
  /** Optional CSS class name */
  className?: string;
} 