export interface BrowserTabProps {
  /** Tab title displayed to user */
  title: string;
  
  /** Full URL of the tab */
  url: string;
  
  /** Whether this tab is currently active */
  active: boolean;
  
  /** Optional favicon URL for the site */
  favicon?: string;
  
  /** Whether the tab is loading */
  loading?: boolean;
  
  /** Whether the tab has unsaved changes */
  modified?: boolean;
  
  /** Handler for tab click */
  onClick?: () => void;
  
  /** Handler for tab close button */
  onClose?: () => void;
  
  /** Whether the close button should be shown */
  showClose?: boolean;
  
  /** Optional CSS class name */
  className?: string;
} 