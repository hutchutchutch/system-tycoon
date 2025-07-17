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
  onOpenSystemDesign?: () => void;
}

// Convert service EmailData to component EmailCardData
const convertToEmailCardData = (email: EmailData) => {
  return {
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
  const [chatMessages, setChatMessages] = useState<GroupChatMessage[]>([]);
  const [mentors, setMentors] = useState<Record<string, MentorInfo>>({});
  const [fullMentors, setFullMentors] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showMentorSuggestions, setShowMentorSuggestions] = useState(false);
  const [mentorQuery, setMentorQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedMentorIndex, setSelectedMentorIndex] = useState(0);
  const [expandedMentor, setExpandedMentor] = useState<string | null>(null);

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

    const loadChatData = async () => {
      try {
        setChatLoading(true);
        
        // Fetch group chat messages
        const { data: messages, error: messagesError } = await supabase
          .from('group_chat_messages')
          .select('*')
          .order('timestamp', { ascending: true });

        if (messagesError) {
          console.error('Error fetching chat messages:', messagesError);
          return;
        }

        // Fetch mentor info with all fields for rich mentor cards
        const { data: mentorData, error: mentorsError } = await supabase
          .from('mentors')
          .select('id, name, title, tags, tagline, quote, signature, personality, specialty, lore');

        if (mentorsError) {
          console.error('Error fetching mentors:', mentorsError);
          return;
        }

        // Fetch full mentor data for recommendations
        const { data: fullMentorData, error: fullMentorsError } = await supabase
          .from('mentors')
          .select('id, name, signature, specialty');

        if (fullMentorsError) {
          console.error('Error fetching full mentor data:', fullMentorsError);
        }

        // Create mentors lookup
        const mentorsLookup = mentorData?.reduce((acc, mentor) => {
          acc[mentor.id] = mentor;
          return acc;
        }, {} as Record<string, MentorInfo>) || {};

        console.log('Loaded mentors:', mentorsLookup);
        setChatMessages(messages || []);
        setMentors(mentorsLookup);
        setFullMentors(fullMentorData || []);
      } catch (error) {
        console.error('Error loading chat data:', error);
      } finally {
        setChatLoading(false);
      }
    };

    loadEmails();
    loadChatData();
  }, []);

  const folders: EmailFolder[] = [
    { id: 'inbox', name: 'Inbox', count: 5, icon: 'inbox' },
    { id: 'sent', name: 'Sent', count: 0, icon: 'send' },
    { id: 'mentorchat', name: 'Mentor Chat', count: 3, icon: 'message-circle' },
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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Create a user message
      const userMessage: GroupChatMessage = {
        id: `user-${Date.now()}`,
        sender_id: 'current-user',
        sender_type: 'user',
        message_content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      // Add to chat messages
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Scroll to bottom after message is added
      setTimeout(() => {
        const messagesContainer = document.querySelector(`.${styles.chatMessages}`);
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    }
  };

  const handleRecommendationClick = (message: string) => {
    setNewMessage(message);
  };

  const handleReplyToMentor = (mentorName: string) => {
    setNewMessage(`@${mentorName} `);
    // Focus the input after setting the message
    setTimeout(() => {
      const input = document.querySelector('.chatTextInput') as HTMLInputElement;
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  };

  const handleToggleMentorCard = (mentorId: string) => {
    console.log('Toggling mentor card for:', mentorId);
    console.log('Current expandedMentor:', expandedMentor);
    console.log('Mentor data:', mentors[mentorId]);
    setExpandedMentor(expandedMentor === mentorId ? null : mentorId);
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
        setSelectedMentorIndex(0); // Reset to first mentor when showing suggestions
      } else {
        setShowMentorSuggestions(false);
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
    
    // Focus input and set cursor position
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

  const selectedEmail = selectedEmailId ? emails.find(e => e.id === selectedEmailId) : null;

  // Filter mentors for suggestions
  const filteredMentors = React.useMemo(() => {
    if (!mentorQuery) return Object.values(mentors);
    return Object.values(mentors).filter(mentor =>
      mentor.name.toLowerCase().includes(mentorQuery)
    );
  }, [mentors, mentorQuery]);

  // Filter emails
  const filteredEmails = React.useMemo(() => {
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

    return filtered.filter(email => email.category === selectedTab);
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
          searchPlaceholder={selectedFolder === 'mentorchat' ? 'Search messages...' : 'Search emails...'}
        />

        {/* Scrollable Content */}
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
                        <div className={styles.chatAvatarSection}>
                          <div 
                            className={styles.chatAvatar}
                            title={isUserMessage ? undefined : mentor?.name || 'AI Mentor'}
                            onClick={!isUserMessage ? () => handleToggleMentorCard(message.sender_id) : undefined}
                            style={!isUserMessage ? { cursor: 'pointer' } : undefined}
                          >
                            {isUserMessage 
                              ? 'You'.substring(0, 2).toUpperCase()
                              : mentor?.name?.substring(0, 2)?.toUpperCase() || 'AI'
                            }
                          </div>
                          {!isUserMessage && (
                            <div 
                              className={styles.mentorName}
                              onClick={() => handleToggleMentorCard(message.sender_id)}
                              style={{ cursor: 'pointer' }}
                            >
                              {mentor?.name || 'AI Mentor'}
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.chatMessageContent}>
                          {/* Expandable Mentor Card */}
                          {!isUserMessage && expandedMentor === message.sender_id && (
                            <div className={styles.mentorCardExpanded}>
                              <div className={styles.mentorCardInfo}>
                                <h3 className={styles.mentorCardName}>
                                  {mentor?.name || 'AI Mentor'}
                                </h3>
                                <p className={styles.mentorCardTitle}>
                                  {mentor?.title || 'AI Assistant'}
                                </p>
                                {mentor?.tagline && (
                                  <p className={styles.mentorCardTagline}>
                                    "{mentor.tagline}"
                                  </p>
                                )}
                              </div>

                              {mentor?.quote && (
                                <div className={styles.mentorCardQuote}>
                                  "{mentor.quote}"
                                </div>
                              )}

                              {mentor?.signature && (
                                <div className={styles.mentorCardSection}>
                                  <h4 className={styles.mentorCardSectionTitle}>Legacy</h4>
                                  <p className={styles.mentorCardText}>{mentor.signature.legacy}</p>
                                  {mentor.signature.knownFor && (
                                    <p className={styles.mentorCardKnownFor}>
                                      <strong>Known for:</strong> {mentor.signature.knownFor}
                                    </p>
                                  )}
                                </div>
                              )}

                              {mentor?.specialty && (
                                <div className={styles.mentorCardSection}>
                                  <h4 className={styles.mentorCardSectionTitle}>Expertise</h4>
                                  {mentor.specialty.domains && mentor.specialty.domains.length > 0 && (
                                    <div className={styles.mentorCardDomains}>
                                      <strong>Domains:</strong> {mentor.specialty.domains.join(', ')}
                                    </div>
                                  )}
                                  {mentor.specialty.tools && mentor.specialty.tools.length > 0 && (
                                    <div className={styles.mentorCardTools}>
                                      <strong>Tools:</strong> {mentor.specialty.tools.join(', ')}
                                    </div>
                                  )}
                                </div>
                              )}

                              {mentor?.personality && (
                                <div className={styles.mentorCardPersonality}>
                                  <h4 className={styles.mentorCardSectionTitle}>Personality</h4>
                                  {mentor.personality.style && (
                                    <p className={styles.mentorCardText}>{mentor.personality.style}</p>
                                  )}
                                  {mentor.personality.traits && (
                                    <p className={styles.mentorCardTraits}>
                                      <strong>Traits:</strong> {mentor.personality.traits}
                                    </p>
                                  )}
                                </div>
                              )}

                              {mentor?.lore && (
                                <div className={styles.mentorCardLore}>
                                  <strong>Legend:</strong> {mentor.lore}
                                </div>
                              )}

                              {mentor?.tags && mentor.tags.length > 0 && (
                                <div className={styles.mentorCardTags}>
                                  {mentor.tags.map((tag: string, index: number) => (
                                    <span key={index} className={styles.mentorCardTag}>
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className={styles.chatContent}>
                            <div className={styles.chatText}>{message.message_content}</div>
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
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message... (use @ to mention mentors)"
                      className={`${styles.chatTextInput} chatTextInput`}
                      onBlur={() => {
                        // Delay hiding suggestions to allow click events
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
                
                <MessageRecommendations
                  mentors={fullMentors}
                  onRecommendationClick={handleRecommendationClick}
                />
              </div>
            </div>
          ) : showEmailDetail && selectedEmail ? (
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
                <strong>Date:</strong> {selectedEmail.timestamp.toLocaleString()}
              </div>
              
              <div className={styles.emailDetailContent}>
                {/* Render email content with markdown formatting */}
                <div 
                  dangerouslySetInnerHTML={{
                    __html: selectedEmail.content
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
                  selectedEmail.content?.toLowerCase().includes('system design') ||
                  selectedEmail.content?.toLowerCase().includes('crisis') ||
                  selectedEmail.subject?.toLowerCase().includes('urgent')) && (
                  <div className={styles.missionActionSection}>
                    <hr className={styles.divider} />
                    <h3 className={styles.missionActionTitle}>🔧 System Design Required</h3>
                    <p className={styles.missionActionDescription}>
                      This mission requires you to design a system solution. Click below to open the System Design Canvas.
                    </p>
                    <button 
                      className={styles.openSystemDesignButton}
                      onClick={onOpenSystemDesign}
                    >
                      <span className={styles.buttonIcon}>🚀</span>
                      Open System Design Canvas
                    </button>
                  </div>
                )}
                
                {selectedEmail.content?.includes('/?crisis=true') && (
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