// import type { EmailData } from '../../molecules/EmailCard/EmailCard.types'; // Not exported
import type { EmailCategory, EmailStatus, EmailPriority } from '../../../types/email.types';

// Temporary placeholder type matching Email interface
interface EmailData {
  id: string;
  subject: string;
  from: string;
  body: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  preview: string;
  category: EmailCategory;
  status: EmailStatus;
  content: string;
  attachments?: any[];
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  labels?: string[];
  priority: EmailPriority;
  sentAt: string;
  isAccessible: boolean;
  triggerType: 'manual' | 'mission_start' | 'stage_complete' | 'performance_based';
  missionId?: string;
  stageId?: string;
  unlockCondition?: string;
  responses?: any[];
  actions?: any[];
  hasAttachments: boolean;
  isUrgent: boolean;
  canReply: boolean;
  canForward: boolean;
  requiresAction: boolean;
}

export interface EmailFolder {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface EmailTab {
  id: string;
  name: string;
  count?: number;
}

export interface GroupChatMessage {
  id: string;
  sender_id: string;
  sender_type: 'user' | 'mentor';
  message_content: string;
  timestamp: string;
}

export interface MentorInfo {
  id: string;
  name: string;
  title: string;
  bio?: string;
  tags?: string[];
  tagline?: string;
  quote?: string;
  signature?: {
    legacy: string;
    knownFor: string;
  };
  personality?: {
    style: string;
    traits: string;
  };
  specialty?: {
    tools: string[];
    domains: string[];
  };
  lore?: string;
}

export interface EmailClientProps {
  emails: EmailData[];
  folders: EmailFolder[];
  selectedEmails: string[];
  selectedFolder: string;
  searchQuery: string;
  onEmailSelect: (emailId: string) => void;
  onFolderSelect: (folderId: string) => void;
  onSearchChange: (query: string) => void;
  onEmailCompose: () => void;
  onEmailReply: (emailId: string) => void;
  className?: string;
  showEmailDetail?: boolean;
  selectedEmailDetail?: EmailData;
  onBackToList?: () => void;
  onOpenSystemDesign?: () => void;
  // Tab-related props
  tabs?: EmailTab[];
  selectedTab?: string;
  onTabSelect?: (tabId: string) => void;
  // Chat-related props
  chatMessages?: GroupChatMessage[];
  mentors?: Record<string, MentorInfo>;
  chatLoading?: boolean;
} 