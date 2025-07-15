import type { EmailData } from '../../molecules/EmailCard/EmailCard.types';

export interface EmailFolder {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface EmailClientProps {
  emails: EmailData[];
  folders: EmailFolder[];
  selectedEmails: string[];
  selectedFolder: string;
  searchQuery: string;
  onEmailSelect: (emailId: string) => void;
  onEmailToggleSelect: (emailId: string) => void;
  onFolderSelect: (folderId: string) => void;
  onSearchChange: (query: string) => void;
  onEmailCompose: () => void;
  onEmailReply: (emailId: string) => void;
  className?: string;
} 