import React, { useState, useEffect } from 'react';
import { EmailClient } from '../../components/organisms/EmailClient';
import type { EmailFolder } from '../../components/organisms/EmailClient/EmailClient.types';
import type { EmailData } from '../../components/molecules/EmailCard/EmailCard.types';
import './EmailClientWrapper.css';

interface EmailClientWrapperProps {
  onOpenSystemDesign?: () => void;
}

export const EmailClientWrapper: React.FC<EmailClientWrapperProps> = ({ onOpenSystemDesign }) => {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [showEmailDetail, setShowEmailDetail] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Set initial emails for the health crisis mission
      setEmails([
        {
          id: 'crisis-1',
          sender: {
            name: 'Alex Chen',
            email: 'alexchen.neighbor@gmail.com',
            avatar: '',
          },
          subject: 'URGENT - Need your help NOW',
          preview: 'I know this is out of nowhere, but I desperately need help. My daughter Emma and 12 other kids...',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          status: 'unread',
          priority: 'high',
          hasAttachments: false,
          tags: ['urgent', 'crisis'],
        },
        {
          id: '2',
          sender: {
            name: 'Mom',
            email: 'mom@family.com',
            avatar: '',
          },
          subject: 'Are you okay?',
          preview: 'Haven\'t heard from you in a while. Just checking in...',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          status: 'read',
          priority: 'normal',
          hasAttachments: false,
          tags: ['personal'],
        },
        {
          id: '3',
          sender: {
            name: 'LinkedIn',
            email: 'notifications@linkedin.com',
            avatar: '',
          },
          subject: 'Your profile was viewed 3 times',
          preview: 'See who\'s been looking at your profile this week...',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          status: 'read',
          priority: 'low',
          hasAttachments: false,
          tags: ['social'],
        },
      ]);
      setLoading(false);
    }, 2000); // 2 second loading time

    return () => clearTimeout(timer);
  }, []);

  const folders: EmailFolder[] = [
    { id: 'inbox', name: 'Inbox', count: 3, icon: 'inbox' },
    { id: 'sent', name: 'Sent', count: 0, icon: 'send' },
    { id: 'drafts', name: 'Drafts', count: 0, icon: 'file-text' },
    { id: 'trash', name: 'Trash', count: 0, icon: 'trash' },
  ];

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
    setShowEmailDetail(true);
    
    // Mark as read
    setEmails(emails => emails.map(email => 
      email.id === emailId ? { ...email, status: 'read' } : email
    ));

    // If Alex's crisis email is clicked, we'll show the detail view
    if (emailId === 'crisis-1') {
      // Email detail will show the link to system builder
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

  // Show email detail view for Alex's crisis email
  if (showEmailDetail && selectedEmail && selectedEmail.id === 'crisis-1') {
    return (
      <div className="email-client-wrapper">
        <div className="email-detail-view">
          <div className="email-detail-header">
            <button 
              className="email-detail-back"
              onClick={() => setShowEmailDetail(false)}
            >
              ← Back to Inbox
            </button>
            <h2>{selectedEmail.subject}</h2>
          </div>
          
          <div className="email-detail-meta">
            <strong>From:</strong> {selectedEmail.sender.name} &lt;{selectedEmail.sender.email}&gt;<br />
            <strong>To:</strong> Me<br />
            <strong>Date:</strong> {selectedEmail.timestamp.toLocaleString()}
          </div>
          
          <div className="email-detail-content">
            <p>I know this is out of nowhere, but I desperately need help.</p>
            
            <p>My daughter Emma and 12 other kids in our neighborhood got sick last week with identical symptoms - rash, fatigue, joint pain. Doctors are baffled. But we're finding more cases when people search online.</p>
            
            <p>I built a simple website on my home computer where families can report symptoms and locations. We're starting to see patterns - it might be environmental. Maybe the old factory site they're building the new playground on?</p>
            
            <p><strong>But my laptop keeps crashing!</strong> 200+ families are trying to access it. Some can't submit their reports. If we can't collect this data, we can't prove anything to the city.</p>
            
            <p>I know you don't have a CS background, but you've always been smart and pick things up fast. Could you look at this?</p>
            
            <p>I found this tool: <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onOpenSystemDesign?.();
              }}
              className="email-link crisis-link"
            >systembuilder.tech/emergency/alexsite</a></p>
            
            <p className="email-urgent">Please. Emma's getting worse. We need this data to save these kids.</p>
            
            <p>- Alex</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="email-client-wrapper">
      <EmailClient
        emails={emails}
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
      />
    </div>
  );
};