import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Email, EmailFilter, EmailSearchResult } from '../../types/email.types';
import type { RootState } from '../index';

// Types for API responses
export interface EmailProgressionResponse {
  newEmails: Email[];
  updatedProgress: Record<string, {
    missionId: string;
    currentStage: number;
    maxStageCompleted: number;
    deliveredEmails: string[];
    nextEligibleEmail: string | null;
  }>;
  totalAvailableEmails: number;
}

export interface UserEmailsResponse {
  emails: Email[];
  missionProgress: Record<string, {
    missionId: string;
    currentStage: number;
    maxStageCompleted: number;
    deliveredEmails: string[];
    nextEligibleEmail: string | null;
  }>;
  availableEmails: string[];
  unreadCount: number;
}

export interface StageCompletionRequest {
  playerId: string;
  missionId: string;
  stageNumber: number;
  completionData: {
    score: number;
    timeSpent: number;
    design?: any;
    metricsAchieved?: Record<string, number>;
  };
}

export const emailApi = createApi({
  reducerPath: 'emailApi',
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/emails',
    prepareHeaders: (headers, { getState }) => {
      // Note: Auth token handling would need to be implemented based on your specific auth slice structure
      // const state = getState() as RootState;
      // Add auth header based on your auth implementation
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Email', 'EmailProgress', 'MissionEmails'],
  endpoints: (builder) => ({
    // Load user emails with progression state
    getUserEmails: builder.query<UserEmailsResponse, string>({
      query: (playerId) => `/user/${playerId}`,
      providesTags: (result, error, playerId) => [
        { type: 'Email', id: 'LIST' },
        { type: 'EmailProgress', id: playerId },
      ],
    }),

    // Check for new emails after stage completion
    checkEmailProgression: builder.mutation<EmailProgressionResponse, StageCompletionRequest>({
      query: (stageCompletion) => ({
        url: '/check-progression',
        method: 'POST',
        body: stageCompletion,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Email', id: 'LIST' },
        { type: 'EmailProgress', id: arg.playerId },
        { type: 'MissionEmails', id: arg.missionId },
      ],
    }),

    // Get specific email details (only if accessible)
    getEmail: builder.query<Email, { emailId: string; playerId: string }>({
      query: ({ emailId, playerId }) => `/email/${emailId}?playerId=${playerId}`,
      providesTags: (result, error, arg) => [{ type: 'Email', id: arg.emailId }],
    }),

    // Mark email as read
    markEmailAsRead: builder.mutation<void, { emailId: string; playerId: string }>({
      query: ({ emailId, playerId }) => ({
        url: `/email/${emailId}/read`,
        method: 'POST',
        body: { playerId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Email', id: arg.emailId },
        { type: 'Email', id: 'LIST' },
      ],
    }),

    // Get emails for a specific mission (filtered by progression)
    getMissionEmails: builder.query<Email[], { missionId: string; playerId: string }>({
      query: ({ missionId, playerId }) => `/mission/${missionId}?playerId=${playerId}`,
      providesTags: (result, error, arg) => [
        { type: 'MissionEmails', id: arg.missionId },
      ],
    }),

    // Search emails (only searches accessible emails)
    searchEmails: builder.query<EmailSearchResult, { playerId: string; filter: EmailFilter }>({
      query: ({ playerId, filter }) => ({
        url: `/search`,
        method: 'POST',
        body: { playerId, filter },
      }),
      providesTags: [{ type: 'Email', id: 'SEARCH' }],
    }),

    // Archive email
    archiveEmail: builder.mutation<void, { emailId: string; playerId: string }>({
      query: ({ emailId, playerId }) => ({
        url: `/email/${emailId}/archive`,
        method: 'POST',
        body: { playerId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Email', id: arg.emailId },
        { type: 'Email', id: 'LIST' },
      ],
    }),

    // Delete email (soft delete)
    deleteEmail: builder.mutation<void, { emailId: string; playerId: string }>({
      query: ({ emailId, playerId }) => ({
        url: `/email/${emailId}`,
        method: 'DELETE',
        body: { playerId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Email', id: arg.emailId },
        { type: 'Email', id: 'LIST' },
      ],
    }),

    // Get email progression status for debugging
    getEmailProgressionStatus: builder.query<{
      missionId: string;
      currentStage: number;
      maxStageCompleted: number;
      availableEmails: Email[];
      nextEmail: Email | null;
      totalEmails: number;
    }, { playerId: string; missionId: string }>({
      query: ({ playerId, missionId }) => `/debug/progression?playerId=${playerId}&missionId=${missionId}`,
      providesTags: (result, error, arg) => [
        { type: 'EmailProgress', id: arg.playerId },
        { type: 'MissionEmails', id: arg.missionId },
      ],
    }),

    // Trigger manual email delivery (admin/testing only)
    triggerManualEmail: builder.mutation<void, {
      playerId: string;
      emailId: string;
      force?: boolean;
    }>({
      query: (params) => ({
        url: '/trigger-manual',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Email', id: 'LIST' },
        { type: 'EmailProgress', id: arg.playerId },
      ],
    }),

    // Get mission stage data from email
    getMissionStageFromEmail: builder.query<{
      missionId: string;
      stageId: string;
      stageNumber: number;
      stageTitle: string;
      problemDescription: string;
      systemRequirements: any[];
    }, { emailId: string; playerId: string }>({
      query: ({ emailId, playerId }) => `/email/${emailId}/mission-stage?playerId=${playerId}`,
      providesTags: (result, error, arg) => [
        { type: 'Email', id: arg.emailId },
        { type: 'MissionEmails', id: result?.missionId },
      ],
    }),

    // Complete stage and check for emails (combined operation)
    completeStageAndCheckEmails: builder.mutation<{
      stageCompleted: boolean;
      newEmails: Email[];
      updatedProgress: any;
    }, StageCompletionRequest>({
      query: (stageCompletion) => ({
        url: '/complete-stage',
        method: 'POST',
        body: stageCompletion,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Email', id: 'LIST' },
        { type: 'EmailProgress', id: arg.playerId },
        { type: 'MissionEmails', id: arg.missionId },
      ],
    }),
  }),
});

export const {
  useGetUserEmailsQuery,
  useCheckEmailProgressionMutation,
  useGetEmailQuery,
  useMarkEmailAsReadMutation,
  useGetMissionEmailsQuery,
  useSearchEmailsQuery,
  useArchiveEmailMutation,
  useDeleteEmailMutation,
  useGetEmailProgressionStatusQuery,
  useTriggerManualEmailMutation,
  useCompleteStageAndCheckEmailsMutation,
  useGetMissionStageFromEmailQuery,
} = emailApi; 