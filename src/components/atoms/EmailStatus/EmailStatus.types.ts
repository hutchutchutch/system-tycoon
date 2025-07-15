export type EmailStatusType = 'unread' | 'read' | 'replied' | 'forwarded' | 'draft';

export interface EmailStatusProps {
  /** Email status type */
  status: EmailStatusType;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether to show text label alongside icon */
  showLabel?: boolean;
  
  /** Optional CSS class name */
  className?: string;
} 