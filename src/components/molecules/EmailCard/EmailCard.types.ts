import type { EmailStatusType } from '../../atoms/EmailStatus';

export interface EmailData {
  /** Unique email identifier */
  id: string;
  
  /** Sender information */
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  
  /** Email subject line */
  subject: string;
  
  /** Email preview text (first few lines) */
  preview: string;
  
  /** Timestamp when email was received */
  timestamp: Date;
  
  /** Email status */
  status: EmailStatusType;
  
  /** Whether email has attachments */
  hasAttachments?: boolean;
  
  /** Priority level */
  priority?: 'low' | 'normal' | 'high';
  
  /** Email tags/labels */
  tags?: string[];
}

export interface EmailCardProps {
  /** Email data to display */
  email: EmailData;
  
  /** Whether this email is selected */
  selected?: boolean;
  
  /** Click handler for email selection */
  onClick?: (email: EmailData) => void;
  
  /** Handler for status change (mark as read/unread) */
  onStatusChange?: (emailId: string, status: EmailStatusType) => void;
  
  /** Whether to show a condensed view */
  compact?: boolean;
  
  /** Optional CSS class name */
  className?: string;
} 