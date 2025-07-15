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

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Set initial emails with late bills and Sarah's offer
      setEmails([
        {
          id: '1',
          sender: {
            name: 'Chase Bank',
            email: 'alerts@chase.com',
            avatar: '',
          },
          subject: 'Your account balance is $0.00',
          preview: 'Your account is now overdrawn. Fees may apply...',
          timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
          status: 'unread',
          priority: 'high',
          hasAttachments: false,
          tags: ['urgent', 'bills'],
        },
        {
          id: '2',
          sender: {
            name: 'Visa',
            email: 'noreply@visa.com',
            avatar: '',
          },
          subject: 'Payment Failed - Action Required',
          preview: 'Your automatic payment of $847.23 could not be...',
          timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          status: 'unread',
          priority: 'high',
          hasAttachments: false,
          tags: ['urgent', 'bills'],
        },
        {
          id: '3',
          sender: {
            name: 'State Farm',
            email: 'billing@statefarm.com',
            avatar: '',
          },
          subject: 'Final Notice - Policy Canceling',
          preview: 'Your auto insurance will be cancelled in 48 hours...',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          status: 'read',
          priority: 'high',
          hasAttachments: false,
          tags: ['urgent', 'bills'],
        },
        {
          id: '4',
          sender: {
            name: 'Apartment Complex',
            email: 'management@skyviewapts.com',
            avatar: '',
          },
          subject: 'Rent Past Due - $1,450',
          preview: 'This is your final notice before we begin eviction...',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          status: 'read',
          priority: 'high',
          hasAttachments: true,
          tags: ['urgent', 'bills'],
        },
        {
          id: '5',
          sender: {
            name: 'Sarah Chen',
            email: 'sarah@sweetrisesbakery.com',
            avatar: '',
          },
          subject: 'Quick favor? (I can pay!)',
          preview: 'Hey! I know things have been rough since the layoff...',
          timestamp: new Date(Date.now() - 1 * 60 * 1000), // just now
          status: 'unread',
          priority: 'normal',
          hasAttachments: false,
          tags: ['opportunity'],
        },
      ]);
      setLoading(false);
    }, 2000); // 2 second loading time

    return () => clearTimeout(timer);
  }, []);

  const folders: EmailFolder[] = [
    { id: 'inbox', name: 'Inbox', count: 5, icon: 'inbox' },
    { id: 'sent', name: 'Sent', count: 0, icon: 'send' },
    { id: 'drafts', name: 'Drafts', count: 0, icon: 'file-text' },
    { id: 'trash', name: 'Trash', count: 0, icon: 'trash' },
  ];

  const handleEmailSelect = (emailId: string) => {
    // If Sarah's email is clicked, open system design tab
    if (emailId === '5' && onOpenSystemDesign) {
      // Simulate a small delay to show email opening
      setTimeout(() => {
        onOpenSystemDesign();
      }, 500);
    }
  };

  const handleEmailToggleSelect = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

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
        onFolderSelect={setSelectedFolder}
        onSearchChange={setSearchQuery}
        onEmailCompose={() => {}}
        onEmailReply={() => {}}
      />
    </div>
  );
};