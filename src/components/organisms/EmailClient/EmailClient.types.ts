import type { EmailData } from '../../molecules/EmailCard/EmailCard.types';

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