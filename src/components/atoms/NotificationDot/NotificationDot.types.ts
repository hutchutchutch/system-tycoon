export type NotificationVariant = 'primary' | 'danger' | 'warning' | 'success' | 'info';

export interface NotificationDotProps {
  /** Number to display in the notification dot. If 0 or undefined, dot is hidden */
  count?: number;
  
  /** Maximum number to display before showing "99+" */
  max?: number;
  
  /** Visual variant of the notification dot */
  variant?: NotificationVariant;
  
  /** Size of the notification dot */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether to show the dot even when count is 0 */
  showWhenZero?: boolean;
  
  /** Whether to show a pulsing animation */
  pulse?: boolean;
  
  /** Optional CSS class name */
  className?: string;
} 