import React, { useState, useEffect } from 'react';
import { EmailClient } from '../../components/organisms/EmailClient';
import type { EmailFolder, EmailTab } from '../../components/organisms/EmailClient/EmailClient.types';
import type { EmailData as EmailCardData } from '../../components/molecules/EmailCard/EmailCard.types';
import { fetchEmails, updateEmailStatus, type EmailData } from '../../services/emailService';
// CSS now handled by design system at src/styles/design-system/layout/browser-windows.css

interface EmailClientWrapperProps {
  onOpenSystemDesign?: () => void;
}

// Convert service EmailData to component EmailCardData
const convertToEmailCardData = (email: EmailData): EmailCardData => ({
  id: email.id,
  sender: {
    name: email.sender_name,
    email: email.sender_email,
    avatar: email.sender_avatar,
  },
  subject: email.subject,
  preview: email.preview,
  content: email.content,
  timestamp: new Date(email.timestamp),
  status: email.status,
  priority: email.priority === 'urgent' ? 'high' : email.priority,
  hasAttachments: email.has_attachments,
  tags: email.tags,
  category: email.category,
});

export const EmailClientWrapper: React.FC<EmailClientWrapperProps> = ({ onOpenSystemDesign }) => {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<EmailCardData[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [showEmailDetail, setShowEmailDetail] = useState(false);
  const [selectedTab, setSelectedTab] = useState('primary');

  useEffect(() => {
    const loadEmails = async () => {
      try {
        setLoading(true);
        
        // Fetch emails from Supabase (with fallback to hardcoded data)
        const emailData = await fetchEmails();
        const convertedEmails = emailData.map(convertToEmailCardData);
        
        setEmails(convertedEmails);
      } catch (error) {
        console.error('Error loading emails:', error);
        // Fallback to empty array on error
        setEmails([]);
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, []);

  const folders: EmailFolder[] = [
    { id: 'inbox', name: 'Inbox', count: 5, icon: 'inbox' },
    { id: 'sent', name: 'Sent', count: 0, icon: 'send' },
    { id: 'drafts', name: 'Drafts', count: 0, icon: 'file-text' },
    { id: 'trash', name: 'Trash', count: 0, icon: 'trash' },
  ];

  const tabs: EmailTab[] = [
    { id: 'primary', name: 'Primary', count: emails.filter(e => e.category === 'primary').length },
    { id: 'projects', name: 'Projects', count: emails.filter(e => e.category === 'projects').length },
    { id: 'news', name: 'News', count: emails.filter(e => e.category === 'news').length },
    { id: 'promotions', name: 'Promotions', count: emails.filter(e => e.category === 'promotions').length },
  ];

  const handleEmailSelect = async (emailId: string) => {
    setSelectedEmailId(emailId);
    setShowEmailDetail(true);
    
    // Mark as read in database and local state
    const success = await updateEmailStatus(emailId, 'read');
    if (success) {
      setEmails(emails => emails.map(email => 
        email.id === emailId ? { ...email, status: 'read' } : email
      ));
    }

    // Special handling for crisis email (check for system design link in content)
    const selectedEmail = emails.find(e => e.id === emailId);
    if (selectedEmail?.content?.includes('/?crisis=true')) {
      // This email contains a link to the system design canvas
      console.log('Crisis email selected - system design link available');
    }
  };

  const handleEmailToggleSelect = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleEmailCompose = () => {
    console.log('Compose new email');
  };

  const handleEmailReply = (emailId: string) => {
    console.log('Reply to email:', emailId);
  };

  const handleTabSelect = (tabId: string) => {
    setSelectedTab(tabId);
  };

  const selectedEmail = selectedEmailId ? emails.find(e => e.id === selectedEmailId) : null;

  if (loading) {
    return (
      <div className="email-client-wrapper">
        <div className="email-client-loading">
          <div className="email-client-loading__spinner"></div>
          <p>Loading your emails...</p>
        </div>
      </div>
    );
  }

  const handleBackToList = () => {
    setShowEmailDetail(false);
    setSelectedEmailId(null);
  };

  return (
    <div className="email-client-wrapper">
      <EmailClient
        emails={emails.filter(email => email.category === selectedTab)}
        folders={folders}
        selectedEmails={selectedEmails}
        selectedFolder={selectedFolder}
        searchQuery={searchQuery}
        onEmailSelect={handleEmailSelect}
        onEmailToggleSelect={handleEmailToggleSelect}
        onFolderSelect={handleFolderSelect}
        onSearchChange={handleSearchChange}
        onEmailCompose={handleEmailCompose}
        onEmailReply={handleEmailReply}
        showEmailDetail={showEmailDetail}
        selectedEmailDetail={selectedEmail || undefined}
        onBackToList={handleBackToList}
        onOpenSystemDesign={onOpenSystemDesign}
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelect={handleTabSelect}
      />
    </div>
  );
};