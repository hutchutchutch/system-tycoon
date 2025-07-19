import React, { useState, useEffect } from 'react';
import { Reply } from 'lucide-react';
import { EmailSidebar, EmailToolbar, MessageRecommendations } from '../../components/molecules';
import { EmailCard } from '../../components/molecules/EmailCard';
import type { EmailFolder, EmailTab } from '../../components/organisms/EmailClient/EmailClient.types';
import { fetchEmails, updateEmailStatus, type EmailData } from '../../services/emailService';
import { supabase } from '../../services/supabase';
import type { GroupChatMessage, MentorInfo } from '../../components/organisms/EmailClient/EmailClient.types';
import styles from './EmailClientWrapper.module.css';

interface EmailClientWrapperProps {
  onOpenSystemDesign?: (emailId?: string) => void;
}

// Convert service EmailData to component EmailCardData
const convertToEmailCardData = (email: EmailData) => {
  return {
    id: email.id,
    sender: {
      id: email.sender_email,
      name: email.sender_name,
      email: email.sender_email,
      avatar: email.sender_avatar,
    },
    subject: email.subject,
    preview: email.preview,
    body: email.content, // Map content to body 
    content: email.content, // Keep content for backwards compatibility
    category: email.category,
    status: email.status,
    priority: email.priority,
    sentAt: email.timestamp, // Keep as string for Email interface
    triggerType: 'manual', // Default trigger type
    isAccessible: true,
    hasAttachments: email.has_attachments,
    attachments: email.has_attachments ? [] : undefined,
    isImportant: email.priority === 'high' || email.priority === 'urgent',
    isUrgent: email.priority === 'urgent',
    canReply: true,
    canForward: true,
    requiresAction: false,
    tags: email.tags,
  };
};

export const EmailClientWrapper: React.FC<EmailClientWrapperProps> = ({ onOpenSystemDesign }) => {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<any[]>([]);
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
    { 
      id: 'inbox', 
      name: 'Inbox', 
      count: emails.filter(e => e.status !== 'draft' && e.status !== 'sent' && e.category !== 'drafts' && e.category !== 'sent').length, 
      icon: 'inbox' 
    },
    { 
      id: 'sent', 
      name: 'Sent', 
      count: emails.filter(e => e.status === 'sent' || e.category === 'sent').length, 
      icon: 'send' 
    },
    { 
      id: 'drafts', 
      name: 'Drafts', 
      count: emails.filter(e => e.status === 'draft' || e.category === 'drafts').length, 
      icon: 'edit' 
    },
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
    setShowEmailDetail(false);
    setSelectedEmailId(null);
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

  const handleBackToList = () => {
    setShowEmailDetail(false);
    setSelectedEmailId(null);
  };

  const selectedEmail = selectedEmailId ? emails.find(e => e.id === selectedEmailId) : null;

  // Filter emails
  const filteredEmails = React.useMemo(() => {
    let filtered = [...emails];

    // Filter by folder
    if (selectedFolder === 'sent') {
      filtered = filtered.filter(email => email.status === 'sent' || email.category === 'sent');
    } else if (selectedFolder === 'drafts') {
      filtered = filtered.filter(email => email.status === 'draft' || email.category === 'drafts');
    } else if (selectedFolder === 'inbox') {
      // Inbox shows emails that are not drafts or sent
      filtered = filtered.filter(email => 
        email.status !== 'draft' && 
        email.status !== 'sent' && 
        email.category !== 'drafts' && 
        email.category !== 'sent'
      );
    } else if (selectedFolder !== 'trash') {
      filtered = filtered.filter(email => email.category === selectedFolder);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email =>
        email.sender.name.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
      );
    }

    // Only apply tab filtering for inbox and other non-special folders
    if (selectedFolder === 'inbox' || (selectedFolder !== 'sent' && selectedFolder !== 'drafts' && selectedFolder !== 'trash')) {
      return filtered.filter(email => email.category === selectedTab);
    }

    return filtered;
  }, [emails, selectedFolder, searchQuery, selectedTab]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Fixed Sidebar */}
      <EmailSidebar
        folders={folders}
        selectedFolder={selectedFolder}
        onFolderSelect={handleFolderSelect}
        onEmailCompose={handleEmailCompose}
      />

      <div className={styles.main}>
        {/* Fixed Toolbar */}
        <EmailToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          tabs={tabs}
          selectedTab={selectedTab}
          onTabSelect={handleTabSelect}
          searchPlaceholder="Search emails..."
        />

        {/* Scrollable Content */}
        <div className={styles.content}>
          {showEmailDetail && selectedEmail ? (
            <div className={styles.emailDetail}>
              <div className={styles.emailDetailHeader}>
                <button 
                  className={styles.emailDetailBack}
                  onClick={handleBackToList}
                >
                  ← Back to Inbox
                </button>
                <h2 className={styles.emailDetailSubject}>{selectedEmail.subject}</h2>
              </div>
              
              <div className={styles.emailDetailMeta}>
                <strong>From:</strong> {selectedEmail.sender.name} &lt;{selectedEmail.sender.email}&gt;<br />
                <strong>To:</strong> Me<br />
                <strong>Date:</strong> {selectedEmail.sentAt ? new Date(selectedEmail.sentAt).toLocaleString() : 'N/A'}
              </div>
              
              <div className={styles.emailDetailContent}>
                {/* Render email content with markdown formatting */}
                <div 
                  dangerouslySetInnerHTML={{
                    __html: selectedEmail.body
                      .replace(/\n/g, '<br />')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/---/g, '<hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />')
                  }}
                />
                
                {/* Check if this is a mission email and show the system design button */}
                {(selectedEmail.tags.includes('crisis') || 
                  selectedEmail.tags.includes('system-design') || 
                  selectedEmail.tags.includes('healthcare') ||
                  selectedEmail.body?.toLowerCase().includes('system design') ||
                  selectedEmail.body?.toLowerCase().includes('crisis') ||
                  selectedEmail.subject?.toLowerCase().includes('urgent')) && (
                  <div className={styles.missionActionSection}>
                    <hr className={styles.divider} />
                    <h3 className={styles.missionActionTitle}>🔧 System Design Required</h3>
                    <p className={styles.missionActionDescription}>
                      This mission requires you to design a system solution. Click below to open the System Design Canvas.
                    </p>
                    <button 
                      className={styles.openSystemDesignButton}
                      onClick={() => onOpenSystemDesign?.(selectedEmail.id)}
                    >
                      <span className={styles.buttonIcon}>🚀</span>
                      Open System Design Canvas
                    </button>
                  </div>
                )}
                
                {selectedEmail.body?.includes('/?crisis=true') && (
                  <div className={styles.systemDesignPrompt}>
                    <p>This email mentions a crisis situation that requires immediate system design attention.</p>
                    <button 
                      className={styles.systemDesignButton}
                      onClick={() => onOpenSystemDesign?.(selectedEmail.id)}
                    >
                      Open Crisis System Design Canvas
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emailList}>
              {filteredEmails.length === 0 ? (
                <div className={styles.empty}>
                  <p>No emails found</p>
                  {searchQuery && (
                    <p>Try adjusting your search query</p>
                  )}
                </div>
              ) : (
                filteredEmails.map(email => (
                  <EmailCard
                    key={email.id}
                    email={email}
                    onClick={() => handleEmailSelect(email.id)}
                    selected={selectedEmails.includes(email.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};