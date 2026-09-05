import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailSidebar, EmailToolbar } from '../../components/molecules';
import { EmailCard } from '../../components/molecules/EmailCard';
import type { EmailFolder, EmailTab } from '../../components/organisms/EmailClient/EmailClient.types';
import { fetchEmails, markEmailAsRead, type EmailData } from '../../services/emailService';
import type { Email } from '../../types/email.types';
import styles from './EmailClientWrapper.module.css';

type EmailCardData = Email & { content: string };

// Convert service EmailData to component EmailCardData
const convertToEmailCardData = (email: EmailData): EmailCardData => {
  const validTriggerTypes: Email['triggerType'][] = [
    'mission_start',
    'stage_complete',
    'performance_based',
    'manual',
  ];
  const triggerType = validTriggerTypes.find((type) => type === email.trigger_type) ?? 'manual';

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
    triggerType,
    isAccessible: true,
    hasAttachments: email.has_attachments,
    attachments: email.has_attachments ? [] : undefined,
    isImportant: email.priority === 'high' || email.priority === 'urgent',
    isUrgent: email.priority === 'urgent',
    canReply: true,
    canForward: true,
    requiresAction: false,
    tags: email.tags,
    // Include mission-related fields
    missionId: email.mission_id,
    stageId: email.stage_id,
  };
};

export const EmailClientWrapper: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<EmailCardData[]>([]);
  const selectedEmails: string[] = [];
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [showEmailDetail, setShowEmailDetail] = useState(false);
  const [selectedTab, setSelectedTab] = useState('primary');
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  // Function to load emails
  const loadEmails = async () => {
    try {
      setLoading(true);
      
      // Fetch the authenticated user's Worker-backed inbox.
      const emailData = await fetchEmails();
      console.log('Raw email data from service:', emailData);
      const convertedEmails = emailData.map(convertToEmailCardData);
      console.log('Converted emails:', convertedEmails);
      
      setEmails(convertedEmails);
    } catch (error) {
      console.error('Error loading emails:', error);
      // Fallback to empty array on error
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function globally for other components to trigger
  useEffect(() => {
    window.refreshEmailInbox = loadEmails;
    return () => {
      delete window.refreshEmailInbox;
    };
  }, []);

  // Handle opening system design canvas
  const handleOpenSystemDesign = (emailId: string) => {
    console.log('Opening system design canvas for email:', emailId);
    // Navigate to crisis design route with email ID
    navigate(`/whiteboard/${emailId}`);
  };

  useEffect(() => {
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
    
    // Scroll to top of content area when email is selected
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    
    // Mark as read in database and local state
    const success = await markEmailAsRead(emailId);
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

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    setShowEmailDetail(false);
    setSelectedEmailId(null);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Compose/reply aren't part of the game loop yet — outgoing mail happens
  // through the News contact flow (EmailComposer). The sidebar hides its
  // Compose button when no handler is passed.

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
    console.log('Starting filter with emails:', emails.length, 'selectedFolder:', selectedFolder, 'selectedTab:', selectedTab);

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
      console.log('After inbox filter:', filtered.length, filtered.map(e => ({ id: e.id, category: e.category, status: e.status })));
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
      const tabFiltered = filtered.filter(email => email.category === selectedTab);
      console.log('After tab filter for', selectedTab, ':', tabFiltered.length);
      return tabFiltered;
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
    <div className={styles.wrapper} data-theme="dark">
      {/* Fixed Sidebar */}
      <EmailSidebar
        folders={folders}
        selectedFolder={selectedFolder}
        onFolderSelect={handleFolderSelect}
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
        <div className={styles.content} ref={contentRef}>
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
                <div style={{ whiteSpace: 'pre-wrap' }}>{selectedEmail.body || ''}</div>
                
                {/* Check if this is a mission email and show the system design button */}
                {(selectedEmail.missionId || 
                 selectedEmail.stageId ||
                 selectedEmail.triggerType === 'mission_start' ||
                 selectedEmail.triggerType === 'stage_complete' ||
                 selectedEmail.triggerType === 'performance_based' ||
                 selectedEmail.tags?.includes('mission') ||
                 selectedEmail.tags?.includes('crisis') || 
                 selectedEmail.tags?.includes('system-design') || 
                 selectedEmail.tags?.includes('healthcare') ||
                 selectedEmail.body?.toLowerCase().includes('system design') ||
                 selectedEmail.body?.toLowerCase().includes('crisis') ||
                 selectedEmail.subject?.toLowerCase().includes('urgent')) && (
                  <div className={styles.missionActionSection}>
                    <hr className={styles.divider} />
                    <h3 className={styles.missionActionTitle}>🔧 Whiteboard Required</h3>
                    <p className={styles.missionActionDescription}>
                      This mission requires you to design a system solution. Click below to open the Whiteboard.
                    </p>
                    <button
                      className={styles.openSystemDesignButton}
                      onClick={() => handleOpenSystemDesign(selectedEmail.id)}
                    >
                      <span className={styles.buttonIcon}>🚀</span>
                      Open Whiteboard
                    </button>
                  </div>
                )}
                
                {selectedEmail.body?.includes('/?crisis=true') && (
                  <div className={styles.systemDesignPrompt}>
                    <p>This email mentions a crisis situation that requires immediate system design attention.</p>
                    <button 
                      className={styles.systemDesignButton}
                      onClick={() => handleOpenSystemDesign(selectedEmail.id)}
                    >
                      Open Whiteboard
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
