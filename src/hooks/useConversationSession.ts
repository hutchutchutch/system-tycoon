import { useState, useEffect } from 'react';
import { mentorChatService } from '../services/mentorChatService';

// Global session state
let globalSessionId: string | null = null;
let listeners: ((sessionId: string) => void)[] = [];

// Function to get or create the global session ID
const getOrCreateSessionId = (): string => {
  if (!globalSessionId) {
    globalSessionId = mentorChatService.generateSessionId();
    console.log('🆔 useConversationSession: Created new global session ID:', globalSessionId);
    // Notify all listeners
    listeners.forEach(listener => listener(globalSessionId!));
  } else {
    console.log('🆔 useConversationSession: Using existing global session ID:', globalSessionId);
  }
  return globalSessionId;
};

// Function to subscribe to session ID changes
const subscribeToSessionId = (callback: (sessionId: string) => void): (() => void) => {
  listeners.push(callback);
  
  // If session already exists, call immediately
  if (globalSessionId) {
    callback(globalSessionId);
  }
  
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter(listener => listener !== callback);
  };
};

/**
 * Hook to get a shared conversation session ID across all components
 */
export const useConversationSession = () => {
  const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());

  useEffect(() => {
    const unsubscribe = subscribeToSessionId(setSessionId);
    return unsubscribe;
  }, []);

  return sessionId;
}; 