import { createSlice } from '@reduxjs/toolkit';
import { mentorChatService } from '../../services/mentorChatService';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'mentor' | 'system';
  mentorId?: string;
}

interface MentorState {
  // Session Management
  activeConversationSessionId: string | null;
  conversationSessions: Record<string, {
    sessionId: string;
    mentorId: string;
    missionStageId?: string;
    missionTitle?: string;
    problemDescription?: string;
    createdAt: string;
    lastActivity: string;
  }>;
  
  // Chat State
  messages: Record<string, ChatMessage[]>; // sessionId -> messages
  messageHistory: Record<string, ChatMessage[]>; // Normalized message storage
  
  // UI State
  isExpanded: boolean;
  selectedMentorId: string;
  isLoading: boolean;
  
  // Real-time Connection Management
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  subscriptionChannels: string[];
  
  // Error Handling
  error: string | null;
}

const initialState: MentorState = {
  activeConversationSessionId: null,
  conversationSessions: {},
  messages: {},
  messageHistory: {},
  isExpanded: false,
  selectedMentorId: '',
  isLoading: false,
  connectionStatus: 'disconnected',
  subscriptionChannels: [],
  error: null,
};

export const mentorSlice = createSlice({
  name: 'mentor',
  initialState,
  reducers: {
    // Session Management
    createConversationSession: (state, action) => {
      const { missionStageId, missionTitle, problemDescription } = action.payload;
      const sessionId = mentorChatService.generateSessionId();
      
      state.conversationSessions[sessionId] = {
        sessionId,
        mentorId: state.selectedMentorId,
        missionStageId,
        missionTitle,
        problemDescription,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      
      state.activeConversationSessionId = sessionId;
    },

    setActiveConversationSession: (state, action) => {
      state.activeConversationSessionId = action.payload;
    },

    // Message Management
    addMessage: (state, action) => {
      const { sessionId, message } = action.payload;
      if (!state.messages[sessionId]) {
        state.messages[sessionId] = [];
      }
      
      // Prevent duplicate messages
      const exists = state.messages[sessionId].some(msg => 
        msg.id === message.id || 
        (msg.content === message.content && Math.abs(msg.timestamp.getTime() - message.timestamp.getTime()) < 1000)
      );
      
      if (!exists) {
        state.messages[sessionId].push(message);
        
        // Update session activity
        if (state.conversationSessions[sessionId]) {
          state.conversationSessions[sessionId].lastActivity = new Date().toISOString();
        }
      }
    },

    setMessages: (state, action) => {
      const { sessionId, messages } = action.payload;
      state.messages[sessionId] = messages;
    },

    // UI State Management
    setExpanded: (state, action) => {
      state.isExpanded = action.payload;
    },

    setSelectedMentor: (state, action) => {
      state.selectedMentorId = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Connection Management
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },

    addSubscriptionChannel: (state, action) => {
      const channel = action.payload;
      if (!state.subscriptionChannels.includes(channel)) {
        state.subscriptionChannels.push(channel);
      }
    },

    removeSubscriptionChannel: (state, action) => {
      const channel = action.payload;
      state.subscriptionChannels = state.subscriptionChannels.filter(ch => ch !== channel);
    },

    // Error Handling
    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Reset State
    resetMentorState: () => initialState,
  },
});

export const {
  createConversationSession,
  setActiveConversationSession,
  addMessage,
  setMessages,
  setExpanded,
  setSelectedMentor,
  setLoading,
  setConnectionStatus,
  addSubscriptionChannel,
  removeSubscriptionChannel,
  setError,
  clearError,
  resetMentorState,
} = mentorSlice.actions;

// Selectors
export const selectActiveConversationSessionId = (state: { mentor: MentorState }) => 
  state.mentor.activeConversationSessionId;

export const selectConversationSessions = (state: { mentor: MentorState }) => 
  state.mentor.conversationSessions;

export const selectMessagesForSession = (sessionId: string) => (state: { mentor: MentorState }) => 
  state.mentor.messages[sessionId] || [];

export const selectSelectedMentorId = (state: { mentor: MentorState }) => 
  state.mentor.selectedMentorId;

export const selectIsExpanded = (state: { mentor: MentorState }) => 
  state.mentor.isExpanded;

export const selectConnectionStatus = (state: { mentor: MentorState }) => 
  state.mentor.connectionStatus;

export const selectMentorError = (state: { mentor: MentorState }) => 
  state.mentor.error;

export const selectIsLoading = (state: { mentor: MentorState }) => 
  state.mentor.isLoading;

export default mentorSlice.reducer; 