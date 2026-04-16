import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ChatMessage } from '../slices/mentorSlice';

interface LoadChatHistoryRequest {
  conversationSessionId: string;
}

interface LoadChatHistoryResponse {
  messages: ChatMessage[];
  lastLoaded: string;
}

interface SaveMessageRequest {
  mentorId: string;
  conversationSessionId: string;
  messageContent: string;
  senderType: 'user' | 'mentor' | 'system';
  missionStageId?: string;
}

interface SaveMessageResponse {
  messageId: string;
  createdAt: string;
}

function addAuthHeaders(headers: Headers) {
  const token = localStorage.getItem('auth_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

export const mentorApi = createApi({
  reducerPath: 'mentorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/mentors',
    prepareHeaders: (headers) => {
      return addAuthHeaders(headers);
    },
  }),
  tagTypes: ['ChatHistory', 'MentorSession'],
  endpoints: (builder) => ({
    // Load chat history for a conversation session
    loadChatHistory: builder.query<LoadChatHistoryResponse, LoadChatHistoryRequest>({
      query: ({ conversationSessionId }) => `/chat/${conversationSessionId}`,
      providesTags: (_result, _error, { conversationSessionId }) => [
        { type: 'ChatHistory', id: conversationSessionId },
      ],
    }),

    // Save a single message
    saveMessage: builder.mutation<SaveMessageResponse, SaveMessageRequest>({
      query: ({ mentorId, conversationSessionId, messageContent, senderType, missionStageId }) => ({
        url: '/chat',
        method: 'POST',
        body: { mentorId, conversationSessionId, messageContent, senderType, missionStageId },
      }),
      invalidatesTags: (_result, _error, { conversationSessionId }) => [
        { type: 'ChatHistory', id: conversationSessionId },
      ],
    }),

    // Get conversation sessions for the current user
    getUserConversationSessions: builder.query<
      Array<{
        sessionId: string;
        mentorId: string;
        missionStageId?: string;
        lastActivity: string;
        messageCount: number;
      }>,
      void
    >({
      query: () => '/sessions',
      providesTags: [{ type: 'MentorSession', id: 'LIST' }],
    }),
  }),
});

export const {
  useLoadChatHistoryQuery,
  useSaveMessageMutation,
  useGetUserConversationSessionsQuery,
} = mentorApi;
