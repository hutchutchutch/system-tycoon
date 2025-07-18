export type EmailStatus = 'unread' | 'read' | 'archived' | 'deleted' | 'draft' | 'sent';

export type EmailCategory = 'inbox' | 'sent' | 'drafts' | 'archive' | 'urgent' | 'primary' | 'projects' | 'news' | 'promotions';

export type EmailPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface EmailAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface EmailSender {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  organization?: string;
}

export interface Email {
  id: string;
  missionId?: string; // Mission this email belongs to
  stageId?: string; // Stage that triggers this email
  
  // Sender Information
  sender: EmailSender;
  
  // Content
  subject: string;
  preview: string; // Short preview text
  body: string; // Full email content (HTML or plain text)
  
  // Metadata
  category: EmailCategory;
  status: EmailStatus;
  priority: EmailPriority;
  
  // Timestamps
  sentAt: string;
  readAt?: string;
  archivedAt?: string;
  
  // Mission Progression
  isAccessible: boolean; // Whether the user can see this email
  triggerType: 'mission_start' | 'stage_complete' | 'performance_based' | 'manual';
  stageNumber?: number; // What stage completion triggers this email
  
  // Features
  hasAttachments: boolean;
  attachments?: EmailAttachment[];
  isImportant: boolean;
  isUrgent: boolean;
  
  // UI State
  isExpanded?: boolean;
  
  // Responses/Actions
  canReply: boolean;
  canForward: boolean;
  requiresAction: boolean;
  actionType?: 'accept_mission' | 'review_design' | 'schedule_meeting' | 'acknowledge';
  
  // Threading
  threadId?: string;
  parentId?: string;
  
  // Tags/Labels
  tags?: string[];
  labels?: string[];
}

export interface EmailThread {
  id: string;
  subject: string;
  participantIds: string[];
  emailIds: string[];
  lastActivity: string;
  unreadCount: number;
  isArchived: boolean;
}

export interface EmailFilter {
  category?: EmailCategory;
  status?: EmailStatus;
  priority?: EmailPriority;
  senderId?: string;
  missionId?: string;
  hasAttachments?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}

export interface EmailSearchResult {
  emails: Email[];
  totalCount: number;
  hasMore: boolean;
  query: string;
  filters: EmailFilter;
} 