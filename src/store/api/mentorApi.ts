import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../../services/supabase';
import type { ChatMessage } from '../slices/mentorSlice';

interface LoadChatHistoryRequest {
  conversationSessionId: string;
}

interface LoadChatHistoryResponse {
  messages: ChatMessage[];
  lastLoaded: string;
}

interface SaveMessageRequest {
  userId: string;
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

export const mentorApi = createApi({
  reducerPath: 'mentorApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['ChatHistory', 'MentorSession'],
  endpoints: (builder) => ({
    // Load chat history for a conversation session
    loadChatHistory: builder.query<LoadChatHistoryResponse, LoadChatHistoryRequest>({
      queryFn: async ({ conversationSessionId }) => {
        try {
          const { data, error } = await supabase
            .from('mentor_chat_messages')
            .select('*')
            .eq('conversation_session_id', conversationSessionId)
            .order('created_at', { ascending: true });

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          const messages: ChatMessage[] = (data || []).map(msg => ({
            id: msg.id,
            content: msg.message_content,
            timestamp: new Date(msg.created_at),
            sender: msg.sender_type as 'user' | 'mentor' | 'system',
            mentorId: msg.mentor_id,
          }));

          return {
            data: {
              messages,
              lastLoaded: new Date().toISOString(),
            },
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      providesTags: (result, error, { conversationSessionId }) => [
        { type: 'ChatHistory', id: conversationSessionId },
      ],
    }),

    // Save a single message
    saveMessage: builder.mutation<SaveMessageResponse, SaveMessageRequest>({
      queryFn: async ({
        userId,
        mentorId,
        conversationSessionId,
        messageContent,
        senderType,
        missionStageId,
      }) => {
        try {
          const { data, error } = await supabase
            .from('mentor_chat_messages')
            .insert({
              user_id: userId,
              mentor_id: mentorId,
              conversation_session_id: conversationSessionId,
              message_content: messageContent,
              sender_type: senderType,
              mission_stage_id: missionStageId,
              created_at: new Date().toISOString(),
            })
            .select('id, created_at')
            .single();

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          return {
            data: {
              messageId: data.id,
              createdAt: data.created_at,
            },
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      invalidatesTags: (result, error, { conversationSessionId }) => [
        { type: 'ChatHistory', id: conversationSessionId },
      ],
    }),

    // Get conversation sessions for a user
    getUserConversationSessions: builder.query<
      Array<{
        sessionId: string;
        mentorId: string;
        missionStageId?: string;
        lastActivity: string;
        messageCount: number;
      }>,
      { userId: string }
    >({
      queryFn: async ({ userId }) => {
        try {
          const { data, error } = await supabase
            .from('mentor_chat_messages')
            .select(`
              conversation_session_id,
              mentor_id,
              mission_stage_id,
              created_at
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          // Group by conversation session ID
          const sessionsMap = new Map();
          (data || []).forEach(msg => {
            const sessionId = msg.conversation_session_id;
            if (!sessionsMap.has(sessionId)) {
              sessionsMap.set(sessionId, {
                sessionId,
                mentorId: msg.mentor_id,
                missionStageId: msg.mission_stage_id,
                lastActivity: msg.created_at,
                messageCount: 0,
              });
            }
            sessionsMap.get(sessionId).messageCount++;
          });

          return {
            data: Array.from(sessionsMap.values()),
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      providesTags: (result, error, { userId }) => [
        { type: 'MentorSession', id: userId },
      ],
    }),
  }),
});

export const {
  useLoadChatHistoryQuery,
  useSaveMessageMutation,
  useGetUserConversationSessionsQuery,
} = mentorApi; 