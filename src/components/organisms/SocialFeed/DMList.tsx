import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from '../../../utils/relativeTime';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchConversations,
  setActiveConversation,
  selectConversationsList,
  selectConversationsLoading,
  selectActiveConversationId,
  selectUnreadCount,
} from '../../../features/social/socialSlice';
import type { Conversation } from '../../../types/social';
import styles from './DMList.module.css';

export const DMList = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversationsList);
  const loading = useAppSelector(selectConversationsLoading);
  const activeId = useAppSelector(selectActiveConversationId);
  
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);
  
  const handleSelectConversation = (id: string) => {
    dispatch(setActiveConversation(id));
  };
  
  return (
    <div className={styles.dmList}>
      <header className={styles.header}>
        <h2 className={styles.title}>Messages</h2>
        <button className={styles.newButton} title="Start new conversation">
          <NewMessageIcon />
        </button>
      </header>
      
      <div className={styles.conversations}>
        {loading && conversations.length === 0 && (
          <div className={styles.loading}>
            <span className={styles.spinner} />
            Loading conversations...
          </div>
        )}
        
        {!loading && conversations.length === 0 && (
          <div className={styles.empty}>
            <MessageIcon />
            <p>No conversations yet</p>
            <span>Reply to a post to start chatting!</span>
          </div>
        )}
        
        <AnimatePresence mode="popLayout">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeId}
              onSelect={handleSelectConversation}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
}

const ConversationItem = ({ conversation, isActive, onSelect }: ConversationItemProps) => {
  const unreadCount = useAppSelector(selectUnreadCount(conversation.id));
  const npc = conversation.npc;
  
  const lastMessageTime = conversation.last_message_at 
    ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: false })
    : null;
  
  const statusColor = getStatusColor(conversation.status);
  
  return (
    <motion.div
      className={`${styles.conversationItem} ${isActive ? styles.active : ''}`}
      onClick={() => onSelect(conversation.id)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    >
      <div className={styles.avatar}>
        {npc?.avatar_url ? (
          <img src={npc.avatar_url} alt={npc.name} />
        ) : (
          <span className={styles.avatarFallback}>
            {npc?.name.charAt(0) || '?'}
          </span>
        )}
        <span 
          className={styles.statusIndicator} 
          style={{ backgroundColor: statusColor }}
          title={conversation.status}
        />
      </div>
      
      <div className={styles.conversationInfo}>
        <div className={styles.topRow}>
          <span className={styles.name}>
            {npc?.name || 'Unknown'}
            {npc?.verified && <span className={styles.verified}>✓</span>}
          </span>
          {lastMessageTime && (
            <span className={styles.time}>{lastMessageTime}</span>
          )}
        </div>
        <div className={styles.bottomRow}>
          <span className={styles.company}>
            {npc?.company || `@${npc?.handle}`}
          </span>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>
        <div className={styles.statusLabel}>
          {getStatusLabel(conversation.status)}
        </div>
      </div>
    </motion.div>
  );
};

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: '#22c55e',
    project_offered: '#eab308',
    project_accepted: '#6366f1',
    working: '#3b82f6',
    completed: '#8b5cf6',
    archived: '#666',
    project_declined: '#ef4444',
  };
  return colors[status] || '#666';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: '💬 Chatting',
    project_offered: '📋 Project Offered',
    project_accepted: '🤝 Project Accepted',
    project_declined: '❌ Declined',
    working: '🔨 In Progress',
    completed: '✅ Completed',
    archived: '📁 Archived',
  };
  return labels[status] || status;
}

const NewMessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const MessageIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default DMList;
