import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from '../../../utils/relativeTime';
import { useNPCConversation } from '../../../hooks/useNPCConversation';
import type { ConversationMessage } from '../../../services/npcChatService';
import styles from './ConversationView.module.css';

interface ConversationViewProps {
  conversationId: string;
  onClose?: () => void;
  onProjectCreated?: (projectId: string) => void;
}

export function ConversationView({ 
  conversationId, 
  onClose,
  onProjectCreated 
}: ConversationViewProps) {
  const {
    conversation,
    messages,
    isLoading,
    isSending,
    error,
    isOfferPending,
    canSendMessage,
    remainingMessages,
    messageCount,
    maxMessages,
    isNPCTyping,
    acceptOffer,
    declineOffer,
    sendMessage,
  } = useNPCConversation(conversationId, { onProjectCreated });

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (canSendMessage) {
      inputRef.current?.focus();
    }
  }, [canSendMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !canSendMessage || isSending) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Get NPC info from conversation
  const npc = (conversation as any)?.npc;

  if (isLoading && !conversation) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingDots}>
            <span /><span /><span />
          </div>
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={onClose}>
            <BackIcon />
          </button>
          <div className={styles.npcInfo}>
            <div className={styles.avatar}>
              {npc?.avatar_url ? (
                <img src={npc.avatar_url} alt={npc.name} />
              ) : (
                <span>{npc?.name?.charAt(0) || '?'}</span>
              )}
              <span className={styles.onlineIndicator} />
            </div>
            <div className={styles.npcDetails}>
              <span className={styles.npcName}>{npc?.name || 'NPC'}</span>
              <span className={styles.npcHandle}>@{npc?.handle}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <MessageCounter current={messageCount} max={maxMessages} />
        </div>
      </header>

      {/* Messages */}
      <div className={styles.messages}>
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              npc={npc}
              isLatest={index === messages.length - 1}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isNPCTyping && (
          <motion.div
            className={styles.typingIndicator}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.typingAvatar}>
              {npc?.avatar_url ? (
                <img src={npc.avatar_url} alt={npc.name} />
              ) : (
                <span>{npc?.name?.charAt(0) || '?'}</span>
              )}
            </div>
            <div className={styles.typingBubble}>
              <div className={styles.typingDots}>
                <span /><span /><span />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.error}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Offer Decision UI */}
      {isOfferPending && conversation?.status !== 'accepted' && conversation?.status !== 'declined' && (
        <motion.div 
          className={styles.offerSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.offerHeader}>
            <span className={styles.offerIcon}>🎯</span>
            <h3>Project Offer</h3>
          </div>
          <p className={styles.offerText}>
            {npc?.name} would like you to help with their project. Are you ready to take this on?
          </p>
          <div className={styles.offerButtons}>
            <motion.button
              className={styles.acceptButton}
              onClick={acceptOffer}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckIcon />
              <span>Accept Project</span>
            </motion.button>
            <motion.button
              className={styles.declineButton}
              onClick={declineOffer}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <XIcon />
              <span>Not Right Now</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Accepted/Declined State */}
      {(conversation?.status === 'accepted' || conversation?.status === 'declined') && (
        <div className={styles.closedState}>
          {conversation.status === 'accepted' ? (
            <div className={styles.acceptedBanner}>
              <span>✅</span>
              <p>Project accepted! Redirecting to your workspace...</p>
            </div>
          ) : (
            <div className={styles.declinedBanner}>
              <span>👋</span>
              <p>Conversation closed. You can start a new one anytime.</p>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      {canSendMessage && (
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              disabled={isSending}
            />
            <motion.button
              type="submit"
              className={styles.sendButton}
              disabled={!inputValue.trim() || isSending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSending ? (
                <div className={styles.sendingSpinner} />
              ) : (
                <SendIcon />
              )}
            </motion.button>
          </div>
          <div className={styles.inputHint}>
            <span className={remainingMessages === 1 ? styles.lastMessage : ''}>
              {remainingMessages} message{remainingMessages !== 1 ? 's' : ''} remaining
            </span>
            {remainingMessages === 1 && (
              <span className={styles.hintWarning}>• Make it count!</span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

// Message Bubble Component
interface MessageBubbleProps {
  message: ConversationMessage;
  npc?: any;
  isLatest: boolean;
}

function MessageBubble({ message, npc, isLatest }: MessageBubbleProps) {
  const isPlayer = message.sender_type === 'player';
  const isOffer = message.message_type === 'project_offer';
  
  return (
    <motion.div
      className={`${styles.messageBubble} ${isPlayer ? styles.player : styles.npc} ${isOffer ? styles.offer : ''}`}
      initial={isLatest ? { opacity: 0, y: 10, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {!isPlayer && (
        <div className={styles.messageAvatar}>
          {npc?.avatar_url ? (
            <img src={npc.avatar_url} alt={npc.name} />
          ) : (
            <span>{npc?.name?.charAt(0) || '?'}</span>
          )}
        </div>
      )}
      
      <div className={styles.messageContent}>
        {isOffer && (
          <div className={styles.offerBadge}>
            <span>🎯</span> Project Offer
          </div>
        )}
        <p>{message.content}</p>
        <span className={styles.messageTime}>
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </span>
      </div>
    </motion.div>
  );
}

// Message Counter Component
function MessageCounter({ current, max }: { current: number; max: number }) {
  const remaining = max - current;
  const percentage = (current / max) * 100;
  
  return (
    <div className={styles.messageCounter}>
      <div className={styles.counterBar}>
        <motion.div 
          className={styles.counterFill}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          style={{
            background: remaining === 0 
              ? 'linear-gradient(90deg, #10b981, #059669)' 
              : remaining === 1 
                ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                : 'linear-gradient(90deg, #6366f1, #8b5cf6)'
          }}
        />
      </div>
      <span className={styles.counterText}>
        {current}/{max}
      </span>
    </div>
  );
}

// Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default ConversationView;
