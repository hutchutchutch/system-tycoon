import { useState, useEffect } from 'react';
import { mentorChatService } from '../services/mentorChatService';

const SESSION_STORAGE_KEY = 'system-tycoon:mentor-session';
let globalSessionId: string | null = sessionStorage.getItem(SESSION_STORAGE_KEY);
let listeners: ((sessionId: string) => void)[] = [];

// Function to get or create the global session ID
const getOrCreateSessionId = (): string => {
  if (!globalSessionId) {
    globalSessionId = mentorChatService.generateSessionId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, globalSessionId);
    // Notify all listeners
    listeners.forEach(listener => listener(globalSessionId!));
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
