import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { EmailCard } from '../../molecules/EmailCard';
import { EmailSidebar } from '../../molecules/EmailSidebar';
import { EmailToolbar } from '../../molecules/EmailToolbar';
import styles from './EmailClient.module.css';
import type { EmailClientProps } from './EmailClient.types';

export const EmailClient: React.FC<EmailClientProps> = ({
  emails,
  folders,
  selectedEmails,
  selectedFolder,
  searchQuery,
  onEmailSelect,
  onEmailToggleSelect,
  onFolderSelect,
  onSearchChange,
  onEmailCompose,
  onEmailReply,
  className,
  showEmailDetail = false,
  selectedEmailDetail,
  onBackToList,
  onOpenSystemDesign,
  tabs = [],
  selectedTab = 'primary',
  onTabSelect,
  chatMessages = [],
  mentors = {},
  chatLoading = false,
}) => {
  const [newMessage, setNewMessage] = useState('');

  const filteredEmails = useMemo(() => {
    let filtered = [...emails];

    // Filter by folder
    if (selectedFolder !== 'inbox') {
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

    return filtered;
  }, [emails, selectedFolder, searchQuery]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className={clsx(styles.emailClient, className)}>
      <EmailSidebar
        folders={folders}
        selectedFolder={selectedFolder}
        onFolderSelect={onFolderSelect}
        onEmailCompose={onEmailCompose}
      />

      <div className={styles.main}>
        <EmailToolbar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          tabs={tabs}
          selectedTab={selectedTab}
          onTabSelect={onTabSelect || (() => {})}
        />

        <div className={styles.content}>
          {selectedFolder === 'mentorchat' ? (
            <div className={styles.chatInterface}>
              <div className={styles.chatHeader}>
                <h3>Mentor Group Chat</h3>
                <span className={styles.chatOnline}>{Object.keys(mentors).length} mentors online</span>
              </div>
              
              <div className={styles.chatMessages}>
                {chatLoading ? (
                  <div className={styles.chatLoading}>Loading messages...</div>
                ) : chatMessages.length === 0 ? (
                  <div className={styles.chatEmpty}>No messages yet</div>
                ) : (
                  chatMessages.map(message => {
                    const mentor = mentors[message.sender_id];
                    return (
                      <div key={message.id} className={styles.chatMessage}>
                        <div className={styles.chatAvatar}>
                          {mentor?.name?.substring(0, 2)?.toUpperCase() || 'AI'}
                        </div>
                        <div className={styles.chatContent}>
                          <div className={styles.chatSender}>
                            {mentor?.name || 'AI Mentor'} ({mentor?.title || 'AI'})
                          </div>
                          <div className={styles.chatText}>{message.message_content}</div>
                          <div className={styles.chatTime}>
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              <div className={styles.chatInput}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={styles.chatTextInput}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button 
                  className={styles.chatSendButton}
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          ) : showEmailDetail && selectedEmailDetail ? (
            <div className={styles.emailDetail}>
              <div className={styles.emailDetailHeader}>
                <button 
                  className={styles.emailDetailBack}
                  onClick={onBackToList}
                >
                  ← Back to Inbox
                </button>
                <h2 className={styles.emailDetailSubject}>{selectedEmailDetail.subject}</h2>
              </div>
              
              <div className={styles.emailDetailMeta}>
                <strong>From:</strong> {selectedEmailDetail.sender.name} &lt;{selectedEmailDetail.sender.email}&gt;<br />
                <strong>To:</strong> Me<br />
                <strong>Date:</strong> {selectedEmailDetail.timestamp.toLocaleString()}
              </div>
              
              <div className={styles.emailDetailContent}>
                {selectedEmailDetail.content}
                
                {selectedEmailDetail.content?.includes('/?crisis=true') && (
                  <div className={styles.systemDesignPrompt}>
                    <p>This email mentions a crisis situation that requires immediate system design attention.</p>
                    <button 
                      className={styles.systemDesignButton}
                      onClick={onOpenSystemDesign}
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
                    onClick={() => onEmailSelect(email.id)}
                    onToggleSelect={() => onEmailToggleSelect(email.id)}
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