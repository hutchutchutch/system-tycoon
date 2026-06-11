import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from '../../../utils/relativeTime';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchMessages,
  sendMessage,
  markMessagesRead,
  setActiveConversation,
  addMessage,
  selectActiveConversation,
  selectMessages,
  selectNPCById,
} from '../../../features/social/socialSlice';
import { socialFeedService } from '../../../services/socialFeedService';
import type { Message, NPC } from '../../../types/social';
import styles from './DMConversation.module.css';

export const DMConversation = () => {
  const dispatch = useAppDispatch();
  const conversation = useAppSelector(selectActiveConversation);
  const messages = useAppSelector(selectMessages(conversation?.id || ''));
  const npc = useAppSelector(selectNPCById(conversation?.npc_id || ''));
  
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Fetch messages when conversation changes
  useEffect(() => {
    if (conversation?.id) {
      dispatch(fetchMessages(conversation.id));
      dispatch(markMessagesRead(conversation.id));
    }
  }, [dispatch, conversation?.id]);
  
  // Subscribe to realtime messages
  useEffect(() => {
    if (!conversation?.id) return;
    
    const channel = socialFeedService.subscribeConversation(
      conversation.id,
      (newMessage) => {
        dispatch(addMessage({ conversationId: conversation.id, message: newMessage }));
      }
    );
    
    return () => {
      socialFeedService.unsubscribe(channel);
    };
  }, [dispatch, conversation?.id]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || !conversation?.id || isSending) return;
    
    const content = inputValue.trim();
    setInputValue('');
    setIsSending(true);
    
    try {
      await dispatch(sendMessage({ conversationId: conversation.id, content })).unwrap();
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
      setInputValue(content); // Restore on error
    } finally {
      setIsSending(false);
    }
  }, [dispatch, conversation?.id, inputValue, isSending]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleClose = () => {
    dispatch(setActiveConversation(null));
  };
  
  if (!conversation) {
    return (
      <div className={styles.emptyState}>
        <MessageIcon />
        <h3>Select a conversation</h3>
        <p>Choose a conversation from the list or reply to a post to start chatting.</p>
      </div>
    );
  }
  
  return (
    <div className={styles.conversation}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleClose}>
          <BackIcon />
        </button>
        
        <div className={styles.npcInfo}>
          <div className={styles.avatar}>
            {npc?.avatar_url ? (
              <img src={npc.avatar_url} alt={npc.name} />
            ) : (
              <span className={styles.avatarFallback}>
                {npc?.name.charAt(0) || '?'}
              </span>
            )}
          </div>
          <div className={styles.npcDetails}>
            <span className={styles.name}>
              {npc?.name || 'Unknown'}
              {npc?.verified && <span className={styles.verified}>✓</span>}
            </span>
            <span className={styles.handle}>@{npc?.handle}</span>
          </div>
        </div>
        
        <button className={styles.infoButton}>
          <InfoIcon />
        </button>
      </header>
      
      {/* Messages */}
      <div className={styles.messages}>
        {/* NPC Intro */}
        {npc && (
          <div className={styles.npcIntro}>
            <div className={styles.introAvatar}>
              {npc.avatar_url ? (
                <img src={npc.avatar_url} alt={npc.name} />
              ) : (
                <span>{npc.name.charAt(0)}</span>
              )}
            </div>
            <h4>{npc.name}</h4>
            <p>{npc.bio}</p>
            {npc.company && <span className={styles.company}>{npc.company}</span>}
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              npc={npc}
              showAvatar={shouldShowAvatar(messages, index)}
            />
          ))}
        </AnimatePresence>
        
        {isSending && (
          <div className={styles.sendingIndicator}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className={styles.inputContainer}>
        <textarea
          ref={inputRef}
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={isSending}
        />
        <button 
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!inputValue.trim() || isSending}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  npc?: NPC;
  showAvatar: boolean;
}

const MessageBubble = ({ message, npc, showAvatar }: MessageBubbleProps) => {
  const isPlayer = message.sender_type === 'player';
  const time = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
  
  return (
    <motion.div
      className={`${styles.messageBubble} ${isPlayer ? styles.player : styles.npc}`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {!isPlayer && showAvatar && (
        <div className={styles.messageAvatar}>
          {npc?.avatar_url ? (
            <img src={npc.avatar_url} alt={npc.name} />
          ) : (
            <span>{npc?.name.charAt(0) || '?'}</span>
          )}
        </div>
      )}
      
      <div className={styles.messageContent}>
        {message.message_type === 'project_offer' && message.metadata?.projectOffer && (
          <ProjectOfferCard offer={message.metadata.projectOffer} />
        )}
        
        {message.message_type !== 'project_offer' && (
          <p>{message.content}</p>
        )}
        
        <span className={styles.messageTime}>{time}</span>
      </div>
    </motion.div>
  );
};

const ProjectOfferCard = ({ offer }: { offer: any }) => (
  <div className={styles.projectOffer}>
    <div className={styles.offerHeader}>
      <span className={styles.offerIcon}>📋</span>
      <span className={styles.offerTitle}>Project Offer</span>
    </div>
    <h4>{offer.title}</h4>
    <p>{offer.description}</p>
    <div className={styles.offerDetails}>
      <span>💰 ${offer.budget?.toLocaleString()}</span>
      <span>📅 {offer.deadline}</span>
      <span>⚡ {offer.difficulty}</span>
    </div>
    <div className={styles.offerActions}>
      <button className={styles.acceptButton}>Accept Project</button>
      <button className={styles.declineButton}>Decline</button>
    </div>
  </div>
);

// Helper to determine if avatar should be shown
function shouldShowAvatar(messages: Message[], index: number): boolean {
  if (index === 0) return true;
  const current = messages[index];
  const previous = messages[index - 1];
  return current.sender_type !== previous.sender_type;
}

// Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const MessageIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default DMConversation;
