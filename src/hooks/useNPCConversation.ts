import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { useNavigate } from 'react-router-dom';
import { setActiveConversation } from '../features/social/socialSlice';
import { setActiveProject } from '../features/project/projectSlice';
import { npcChatService } from '../services/npcChatService';
import type { ConversationState, ConversationMessage } from '../services/npcChatService';

const MAX_PLAYER_MESSAGES = 3;

interface UseNPCConversationOptions {
  autoSubscribe?: boolean;
  onProjectCreated?: (projectId: string) => void;
}

export function useNPCConversation(
  conversationId: string | null,
  options: UseNPCConversationOptions = {}
) {
  const { autoSubscribe = true, onProjectCreated } = options;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Local state
  const [conversation, setConversation] = useState<ConversationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track if offer is pending
  const isOfferPending = conversation?.status === 'offer_pending' || 
    (conversation?.message_count || 0) >= MAX_PLAYER_MESSAGES;
  
  // Can still send messages?
  const canSendMessage = !isOfferPending && 
    (conversation?.message_count || 0) < MAX_PLAYER_MESSAGES &&
    conversation?.status === 'active';
  
  // Remaining messages
  const remainingMessages = Math.max(0, MAX_PLAYER_MESSAGES - (conversation?.message_count || 0));
  
  // Load conversation
  const loadConversation = useCallback(async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await npcChatService.getConversation(conversationId);
      setConversation(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);
  
  // Initial load
  useEffect(() => {
    loadConversation();
  }, [loadConversation]);
  
  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId || !autoSubscribe) return;
    
    const unsubscribe = npcChatService.subscribeToConversation(
      conversationId,
      (newMessage) => {
        setConversation(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            message_count: newMessage.sender_type === 'player' 
              ? prev.message_count + 1 
              : prev.message_count,
          };
        });
      }
    );
    
    return unsubscribe;
  }, [conversationId, autoSubscribe]);
  
  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!conversation || !conversationId || isSending) return;
    if (!canSendMessage) {
      setError('You need to respond to the offer before continuing.');
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    // Optimistically add player message
    const optimisticMessage: ConversationMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_type: 'player',
      content,
      message_type: 'text',
      created_at: new Date().toISOString(),
    };
    
    setConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, optimisticMessage],
        message_count: prev.message_count + 1,
      };
    });
    
    try {
      const response = await npcChatService.sendMessage(
        conversationId,
        conversation.npc_id,
        content,
        conversation.mission_id
      );
      
      // Update conversation status if offer made
      if (response.is_project_offer) {
        setConversation(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            status: 'offer_pending',
          };
        });
      }
      
      // Reload to get the NPC response with proper ID
      await loadConversation();
      
    } catch (err: any) {
      setError(err.message);
      // Rollback optimistic update
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.filter(m => m.id !== optimisticMessage.id),
          message_count: prev.message_count - 1,
        };
      });
    } finally {
      setIsSending(false);
    }
  }, [conversation, conversationId, canSendMessage, isSending, loadConversation]);
  
  // Accept the project offer
  const acceptOffer = useCallback(async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await npcChatService.acceptOffer(conversationId);
      
      if (result.success && result.project_id) {
        // Update local state
        setConversation(prev => prev ? { ...prev, status: 'accepted' } : prev);
        
        // Set active project in Redux
        dispatch(setActiveProject(result.project_id));
        
        // Callback
        onProjectCreated?.(result.project_id);
        
        // Navigate to project workspace
        navigate(`/project/${result.project_id}`);
      }
      
      // Reload to get thank you message
      await loadConversation();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, dispatch, navigate, onProjectCreated, loadConversation]);
  
  // Decline the project offer
  const declineOffer = useCallback(async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await npcChatService.declineOffer(conversationId);
      
      // Update local state
      setConversation(prev => prev ? { ...prev, status: 'declined' } : prev);
      
      // Reload to get response
      await loadConversation();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, loadConversation]);
  
  // Get the last message (for showing typing indicator position)
  const lastMessage = conversation?.messages[conversation.messages.length - 1];
  const isNPCTyping = isSending; // NPC "types" while we're waiting for response
  
  return {
    // State
    conversation,
    messages: conversation?.messages || [],
    isLoading,
    isSending,
    error,
    
    // Computed
    isOfferPending,
    canSendMessage,
    remainingMessages,
    messageCount: conversation?.message_count || 0,
    maxMessages: MAX_PLAYER_MESSAGES,
    lastMessage,
    isNPCTyping,
    
    // NPC info
    npcId: conversation?.npc_id,
    missionId: conversation?.mission_id,
    status: conversation?.status,
    
    // Actions
    sendMessage,
    acceptOffer,
    declineOffer,
    reload: loadConversation,
  };
}

/**
 * Hook to start a new conversation from a feed post
 */
export function useStartConversation() {
  const dispatch = useAppDispatch();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const startConversation = useCallback(async (
    npcId: string,
    postId?: string,
    missionId?: string
  ): Promise<string | null> => {
    setIsStarting(true);
    setError(null);
    
    try {
      const conversation = await npcChatService.startConversation(npcId, postId, missionId);
      
      // Set as active conversation in Redux
      dispatch(setActiveConversation(conversation.id));
      
      return conversation.id;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsStarting(false);
    }
  }, [dispatch]);
  
  return {
    startConversation,
    isStarting,
    error,
  };
}

/**
 * Hook to list all conversations
 */
export function useConversationList() {
  const [conversations, setConversations] = useState<ConversationState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await npcChatService.getConversations();
      setConversations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);
  
  // Separate by status
  const activeConversations = conversations.filter(c => 
    c.status === 'active' || c.status === 'offer_pending'
  );
  const acceptedConversations = conversations.filter(c => c.status === 'accepted');
  const declinedConversations = conversations.filter(c => c.status === 'declined');
  
  return {
    conversations,
    activeConversations,
    acceptedConversations,
    declinedConversations,
    isLoading,
    error,
    reload: loadConversations,
  };
}

export default useNPCConversation;
