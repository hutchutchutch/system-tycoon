import type { EmailStatusType } from '../../atoms/EmailStatus';
import type { Email } from '../../../types/email.types';

// Export the Email type for convenience
export type { Email };

export interface EmailCardProps {
  /** Email data to display */
  email: Email;
  
  /** Whether this email is selected */
  selected?: boolean;
  
  /** Click handler for email selection */
  onClick?: (email: Email) => void;
  
  /** Handler for status change (mark as read/unread) */
  onStatusChange?: (emailId: string, status: EmailStatusType) => void;
  
  /** Whether to show a condensed view */
  compact?: boolean;
  
  /** Optional CSS class name */
  className?: string;
} 