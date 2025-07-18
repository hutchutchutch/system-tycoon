import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MessageCircle, Send, Minimize2, X, Bot, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { MENTORS } from '../../../constants/mentors';
import type { MentorChatProps, ChatMessage } from './MentorChat.types';
import { mentorChatService, type MentorChatSession } from '../../../services/mentorChatService';
import type { RootState } from '../../../store';
import styles from './MentorChat.module.css';

export const MentorChat: React.FC<MentorChatProps> = ({
  missionStageId,
  missionTitle,
  problemDescription,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState('linda-wu');
  const [showMentorSelector, setShowMentorSelector] = useState(false);
  const [conversationSessionId] = useState(() => mentorChatService.generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user from Redux store
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history and add welcome message when component mounts or mentor changes
  useEffect(() => {
    if (missionStageId && selectedMentorId && user && isAuthenticated) {
      loadChatHistory();
    }
  }, [missionStageId, selectedMentorId, user, isAuthenticated]);

  const loadChatHistory = async () => {
    try {
      const history = await mentorChatService.getChatHistory(conversationSessionId);
      
      if (history.length === 0) {
        // Add welcome message if no history exists
        const welcomeMessage: ChatMessage = {
          id: `welcome-${Date.now()}`,
          content: `Hi! I'm ${MENTORS[selectedMentorId]?.name}. I'm here to help you with ${missionTitle || 'this mission'}. ${problemDescription ? `I see you're working on: ${problemDescription}` : ''} Feel free to ask me any questions about system design, architecture patterns, or how to approach this challenge!`,
          timestamp: new Date(),
          sender: 'mentor',
          mentorId: selectedMentorId
        };
        setMessages([welcomeMessage]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Fallback to welcome message
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        content: `Hi! I'm ${MENTORS[selectedMentorId]?.name}. I'm here to help you with ${missionTitle || 'this mission'}. Feel free to ask me any questions!`,
        timestamp: new Date(),
        sender: 'mentor',
        mentorId: selectedMentorId
      };
      setMessages([welcomeMessage]);
    }
  };

  const selectedMentor = MENTORS[selectedMentorId];

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim() || isLoading || !user || !isAuthenticated) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: currentInput.trim(),
      timestamp: new Date(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const session: MentorChatSession = {
        userId: user.id,
        mentorId: selectedMentorId,
        conversationSessionId,
        missionStageId,
        missionTitle,
        problemDescription,
      };

      const mentorResponse = await mentorChatService.sendMessage(session, userMessage.content);
      
      const mentorMessage: ChatMessage = {
        id: `mentor-${Date.now()}`,
        content: mentorResponse,
        timestamp: new Date(),
        sender: 'mentor',
        mentorId: selectedMentorId
      };

      setMessages(prev => [...prev, mentorMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "I'm having trouble responding right now. Could you try again?",
        timestamp: new Date(),
        sender: 'mentor',
        mentorId: selectedMentorId
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentInput, isLoading, selectedMentorId, conversationSessionId, user, isAuthenticated, missionStageId, missionTitle, problemDescription]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMentorChange = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    setShowMentorSelector(false);
    // Clear messages and reload for new mentor
    setMessages([]);
  };

  // Don't render if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  if (!isExpanded) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 99999,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: '3px solid white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
          }}
          title="Open Mentor Chat"
        >
          <MessageCircle size={24} />
          {messages.length > 1 && (
            <div style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              minWidth: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '600',
              border: '2px solid white'
            }}>
              {messages.length - 1}
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 99999,
        width: '360px',
        height: '500px',
        pointerEvents: 'auto'
      }}
    >
      <div className={styles.chatWindow}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.mentorInfo}>
            <div className={styles.mentorAvatarSmall}>
              <Bot size={20} />
            </div>
            <div className={styles.mentorDetails}>
              <button
                onClick={() => setShowMentorSelector(!showMentorSelector)}
                className={styles.mentorSelector}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                  font: 'inherit'
                }}
              >
                <h3 className={styles.mentorName}>
                  {selectedMentor?.name || 'AI Mentor'}
                </h3>
                <ChevronDown size={14} />
              </button>
              <p className={styles.mentorTitle}>
                {selectedMentor?.title || 'System Design Assistant'}
              </p>
              
              {/* Mentor Selector Dropdown */}
              {showMentorSelector && (
                <div className={styles.mentorDropdown}>
                  {Object.values(MENTORS).map((mentor) => (
                    <button
                      key={mentor.id}
                      onClick={() => handleMentorChange(mentor.id)}
                      className={`${styles.mentorOption} ${mentor.id === selectedMentorId ? styles.selected : ''}`}
                    >
                      <div className={styles.mentorOptionContent}>
                        <strong>{mentor.name}</strong>
                        <small>{mentor.specialization}</small>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.chatActions}>
            <button
              onClick={() => setIsExpanded(false)}
              className={styles.minimizeButton}
              aria-label="Minimize chat"
            >
              <Minimize2 size={16} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className={styles.chatMessages}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.mentorMessage
              }`}
            >
              {message.sender === 'mentor' && (
                <div className={styles.messageAvatar}>
                  <Bot size={16} />
                </div>
              )}
              <div className={styles.messageContent}>
                <div className={styles.messageText}>{message.content}</div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.mentorMessage}`}>
              <div className={styles.messageAvatar}>
                <Bot size={16} />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className={styles.chatInput}>
          <div className={styles.inputContainer}>
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about system design, architecture patterns, or this mission..."
              className={styles.messageInput}
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isLoading}
              className={styles.sendButton}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 