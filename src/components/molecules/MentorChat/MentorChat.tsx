import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MessageCircle, Send, Minimize2, X, Bot } from 'lucide-react';
import { MENTORS } from '../../../constants/mentors';
import type { MentorChatProps, ChatMessage } from './MentorChat.types';
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
  const [selectedMentorId] = useState('linda-wu'); // Default mentor
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message when component mounts or mission changes
  useEffect(() => {
    if (missionStageId && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        content: `Hi! I'm here to help you with ${missionTitle || 'this mission'}. ${problemDescription ? `I see you're working on: ${problemDescription}` : ''} Feel free to ask me any questions about system design, architecture patterns, or how to approach this challenge!`,
        timestamp: new Date(),
        sender: 'mentor',
        mentorId: selectedMentorId
      };
      setMessages([welcomeMessage]);
    }
  }, [missionStageId, missionTitle, problemDescription, selectedMentorId, messages.length]);

  const selectedMentor = MENTORS[selectedMentorId];

  const generateMentorResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call to LLM service
    // In a real implementation, this would call your LLM backend
    setIsLoading(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Mock response based on mentor's personality and message content
      const responses = [
        `${selectedMentor?.signatureAdvice || 'Let me help you with that...'} Based on what you're describing, I'd recommend starting with the fundamentals. Have you considered how this component fits into the larger system architecture?`,
        `Great question! In my experience, this kind of challenge often comes down to understanding the data flow. Can you walk me through how information moves through your current design?`,
        `This reminds me of a similar pattern I've seen before. The key is to think about separation of concerns - what's the core responsibility of each component you're adding?`,
        `I like your thinking! One thing to consider is scalability. How do you expect this system to grow over time? Planning for that now will save you refactoring later.`,
        `That's a common challenge in system design. Have you thought about the trade-offs between consistency and availability here? Sometimes the answer depends on your specific requirements.`
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    } catch (error) {
      return "I'm having trouble processing that right now. Could you try rephrasing your question?";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: currentInput.trim(),
      timestamp: new Date(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');

    // Generate mentor response
    const mentorResponse = await generateMentorResponse(userMessage.content);
    
    const mentorMessage: ChatMessage = {
      id: `mentor-${Date.now()}`,
      content: mentorResponse,
      timestamp: new Date(),
      sender: 'mentor',
      mentorId: selectedMentorId
    };

    setMessages(prev => [...prev, mentorMessage]);
  }, [currentInput, isLoading, selectedMentorId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              <h3 className={styles.mentorName}>
                {selectedMentor?.name || 'AI Mentor'}
              </h3>
              <p className={styles.mentorTitle}>
                {selectedMentor?.title || 'System Design Assistant'}
              </p>
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