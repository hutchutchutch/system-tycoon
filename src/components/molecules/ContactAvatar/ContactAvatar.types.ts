export type ContactSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type OnlineStatus = 'online' | 'away' | 'busy' | 'offline';

export interface ContactAvatarProps {
  /** Contact name for fallback initials */
  name?: string;
  
  /** Optional avatar image URL */
  src?: string;
  
  /** Size variant */
  size?: ContactSize;
  
  /** Online status indicator */
  status?: OnlineStatus;
  
  /** Whether to show online status indicator */
  showStatus?: boolean;
  
  /** Alt text for accessibility */
  alt?: string;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Whether the avatar is clickable */
  clickable?: boolean;
  
  /** Optional CSS class name */
  className?: string;
} 