export interface MentorNotificationProps {
  title: string;
  message: string;
  onClose?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  targetElement?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  showArrow?: boolean;
  autoHideDuration?: number; // milliseconds, 0 for no auto-hide
  className?: string;
}

export interface HighlightOverlayProps {
  targetSelector: string;
  onClick?: () => void;
  padding?: number;
}