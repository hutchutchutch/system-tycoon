import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Reply } from 'lucide-react';
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
  const [showMentorSuggestions, setShowMentorSuggestions] = useState(false);
  const [mentorQuery, setMentorQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedMentorIndex, setSelectedMentorIndex] = useState(0);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleReplyToMentor = (mentorName: string) => {
    setNewMessage(`@${mentorName} `);
    setTimeout(() => {
      const input = document.querySelector('.chatTextInput') as HTMLInputElement;
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  };

  const handleMessageChange = (value: string) => {
    setNewMessage(value);
    
    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = value.slice(lastAtIndex + 1);
      const spaceIndex = textAfterAt.indexOf(' ');
      const query = spaceIndex === -1 ? textAfterAt : textAfterAt.slice(0, spaceIndex);
      
      if (spaceIndex === -1 && query.length >= 0) {
        setMentorQuery(query.toLowerCase());
        setShowMentorSuggestions(true);
        setCursorPosition(lastAtIndex);
        setSelectedMentorIndex(0);
      } else {
        setShowMentorSuggestions(false);
        setSelectedMentorIndex(0);
      }
    } else {
      setShowMentorSuggestions(false);
      setSelectedMentorIndex(0);
    }
  };

  const handleMentorSelect = (mentorName: string) => {
    const beforeAt = newMessage.slice(0, cursorPosition);
    const afterQuery = newMessage.slice(cursorPosition + 1 + mentorQuery.length);
    const newText = `${beforeAt}@${mentorName} ${afterQuery}`;
    setNewMessage(newText);
    setShowMentorSuggestions(false);
    setSelectedMentorIndex(0);
    
    setTimeout(() => {
      const input = document.querySelector('.chatTextInput') as HTMLInputElement;
      if (input) {
        input.focus();
        const newCursorPos = beforeAt.length + mentorName.length + 2;
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentorSuggestions && filteredMentors.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentorIndex(prev => 
          prev < filteredMentors.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentorIndex(prev => 
          prev > 0 ? prev - 1 : filteredMentors.length - 1
        );
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const selectedMentor = filteredMentors[selectedMentorIndex];
        if (selectedMentor) {
          handleMentorSelect(selectedMentor.name);
        }
      } else if (e.key === 'Escape') {
        setShowMentorSuggestions(false);
        setSelectedMentorIndex(0);
      }
    } else if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Filter mentors for suggestions
  const filteredMentors = React.useMemo(() => {
    if (!mentorQuery) return Object.values(mentors);
    return Object.values(mentors).filter(mentor =>
      mentor.name.toLowerCase().includes(mentorQuery)
    );
  }, [mentors, mentorQuery]);

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
                    const isUserMessage = message.sender_type === 'user';
                    const mentor = isUserMessage ? null : mentors[message.sender_id];
                    
                    return (
                      <div key={message.id} className={`${styles.chatMessage} ${isUserMessage ? styles.userMessage : ''}`}>
                        <div className={styles.chatAvatar}>
                          {isUserMessage 
                            ? 'You'.substring(0, 2).toUpperCase()
                            : mentor?.name?.substring(0, 2)?.toUpperCase() || 'AI'
                          }
                        </div>
                        <div className={styles.chatContent}>
                          <div className={styles.chatMessageHeader}>
                            <div className={styles.chatSender}>
                              {isUserMessage ? 'You' : mentor?.name || 'AI Mentor'}
                            </div>
                          </div>
                          <div className={styles.chatText}>{message.message_content}</div>
                          <div className={styles.chatTime}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {!isUserMessage && (
                            <button
                              className={styles.chatReplyButton}
                              onClick={() => handleReplyToMentor(mentor?.name || 'AI Mentor')}
                              title={`Reply to ${mentor?.name || 'AI Mentor'}`}
                            >
                              <Reply size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              <div className={styles.chatInputSection}>
                <div className={styles.chatInputContainer}>
                  {showMentorSuggestions && filteredMentors.length > 0 && (
                    <div className={styles.mentorSuggestions}>
                      {filteredMentors.map((mentor, index) => (
                        <div
                          key={mentor.id}
                          className={`${styles.mentorSuggestion} ${
                            index === selectedMentorIndex ? styles.highlighted : ''
                          }`}
                          onClick={() => handleMentorSelect(mentor.name)}
                        >
                          <div className={styles.mentorSuggestionAvatar}>
                            {mentor.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className={styles.mentorSuggestionInfo}>
                            <div className={styles.mentorSuggestionName}>{mentor.name}</div>
                            <div className={styles.mentorSuggestionTitle}>{mentor.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className={styles.chatInput}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      placeholder="Type your message... (use @ to mention mentors)"
                      className={`${styles.chatInputField} chatTextInput`}
                      onKeyDown={handleKeyDown}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowMentorSuggestions(false);
                          setSelectedMentorIndex(0);
                        }, 200);
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
                
                {/* Handle collaboration invitations */}
                {selectedEmailDetail.body && selectedEmailDetail.body.includes('Open System Builder') && (
                  <div 
                    className={styles.emailHtmlContent}
                    dangerouslySetInnerHTML={{ __html: selectedEmailDetail.body }}
                  />
                )}
                
                {/* Show system design button for mission emails or crisis emails */}
                {((selectedEmailDetail.missionId && selectedEmailDetail.stageId && 
                   (selectedEmailDetail.triggerType === 'mission_start' || selectedEmailDetail.deliveryReason === 'mission_start')) ||
                  selectedEmailDetail.content?.includes('/?crisis=true')) && (
                  <div className={styles.systemDesignPrompt}>
                    <p>This email contains a critical mission that requires your system design expertise.</p>
                    <button 
                      className={styles.systemDesignButton}
                      onClick={onOpenSystemDesign}
                    >
                      Open System Design Canvas
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