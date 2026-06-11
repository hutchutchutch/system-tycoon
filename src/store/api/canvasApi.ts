import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SerializableNode, SerializableEdge, CanvasViewport } from '../slices/canvasSlice';

interface CanvasStateData {
  nodes: SerializableNode[];
  edges: SerializableEdge[];
  viewport: CanvasViewport;
  timestamp: string;
}

interface SaveCanvasStateRequest {
  missionId: string;
  stageId: string;
  canvasState: CanvasStateData;
}

interface LoadCanvasStateResponse {
  canvasState: CanvasStateData | null;
  lastSaved: string | null;
}



export const canvasApi = createApi({
  reducerPath: 'canvasApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/canvas',
    credentials: 'include',
  }),
  tagTypes: ['CanvasState', 'UserProgress'],
  endpoints: (builder) => ({
    // Load Canvas State
    loadCanvasState: builder.query<LoadCanvasStateResponse, { stageId: string }>({
      query: ({ stageId }) => `/${stageId}`,
      providesTags: (_result, _error, { stageId }) => [
        { type: 'CanvasState', id: stageId },
      ],
    }),

    // Save Canvas State
    saveCanvasState: builder.mutation<void, SaveCanvasStateRequest>({
      query: ({ missionId, stageId, canvasState }) => ({
        // NOTE: '' not '/' — Hono's strict routing 404s on /api/canvas/
        url: '',
        method: 'PUT',
        body: { missionId, stageId, canvasState },
      }),
      invalidatesTags: (_result, _error, { stageId }) => [
        { type: 'CanvasState', id: stageId },
        'UserProgress',
      ],
    }),

    // Delete Canvas State
    deleteCanvasState: builder.mutation<void, { stageId: string }>({
      query: ({ stageId }) => ({
        url: `/${stageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { stageId }) => [
        { type: 'CanvasState', id: stageId },
      ],
    }),

    // Get all saved canvas states for the current user
    getUserCanvasStates: builder.query<Record<string, CanvasStateData>, void>({
      query: () => '/user/all',
      providesTags: [{ type: 'CanvasState', id: 'all' }],
    }),
  }),
});

export const {
  useLoadCanvasStateQuery,
  useSaveCanvasStateMutation,
  useDeleteCanvasStateMutation,
  useGetUserCanvasStatesQuery,
} = canvasApi;
