import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../../services/supabase';
import type { SerializableNode, SerializableEdge, CanvasViewport } from '../slices/canvasSlice';

interface CanvasStateData {
  nodes: SerializableNode[];
  edges: SerializableEdge[];
  viewport: CanvasViewport;
  timestamp: string;
}

interface SaveCanvasStateRequest {
  userId: string;
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
  baseQuery: fakeBaseQuery(),
  tagTypes: ['CanvasState', 'UserProgress'],
  endpoints: (builder) => ({
    // Load Canvas State
    loadCanvasState: builder.query<LoadCanvasStateResponse, {
      userId: string;
      stageId: string;
    }>({
      queryFn: async ({ userId, stageId }) => {
        try {
          const { data, error } = await supabase
            .from('user_mission_progress')
            .select('canvas_state, updated_at')
            .eq('user_id', userId)
            .eq('stage_id', stageId)
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              // No record found
              return { data: { canvasState: null, lastSaved: null } };
            }
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          return {
            data: {
              canvasState: data?.canvas_state || null,
              lastSaved: data?.updated_at || null,
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
      providesTags: (result, error, { userId, stageId }) => [
        { type: 'CanvasState', id: `${userId}-${stageId}` },
      ],
    }),
    
    // Save Canvas State
    saveCanvasState: builder.mutation<void, SaveCanvasStateRequest>({
      queryFn: async ({ userId, missionId, stageId, canvasState }) => {
        try {
          // First check if record exists
          const { data: existing } = await supabase
            .from('user_mission_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('stage_id', stageId)
            .maybeSingle();

          if (existing) {
            // Update existing record - only update canvas_state and updated_at
            const { error } = await supabase
              .from('user_mission_progress')
              .update({
                canvas_state: canvasState,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId)
              .eq('stage_id', stageId);

            if (error) {
              console.error('Supabase canvas update error:', error);
              return { error: { status: 'CUSTOM_ERROR', error: error.message } };
            }
          } else {
            // Insert new record with all required fields
            const { error } = await supabase
              .from('user_mission_progress')
              .insert({
                user_id: userId,
                mission_id: missionId,
                stage_id: stageId,
                canvas_state: canvasState,
                status: 'in_progress',
                current_stage_id: stageId,
                started_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (error) {
              console.error('Supabase canvas insert error:', error);
              return { error: { status: 'CUSTOM_ERROR', error: error.message } };
            }
          }

          return { data: undefined };
        } catch (error) {
          console.error('Canvas save error:', error);
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { userId, stageId }) => [
        { type: 'CanvasState', id: `${userId}-${stageId}` },
        'UserProgress'
      ],
    }),
    
    // Delete Canvas State
    deleteCanvasState: builder.mutation<void, {
      userId: string;
      stageId: string;
    }>({
      queryFn: async ({ userId, stageId }) => {
        try {
          // Clear canvas_state from user_mission_progress
          const { error } = await supabase
            .from('user_mission_progress')
            .update({ 
              canvas_state: {},
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('stage_id', stageId);

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      invalidatesTags: (result, error, { userId, stageId }) => [
        { type: 'CanvasState', id: `${userId}-${stageId}` },
      ],
    }),
    
    // Get all saved canvas states for a user
    getUserCanvasStates: builder.query<Record<string, CanvasStateData>, string>({
      queryFn: async (userId) => {
        try {
          const { data, error } = await supabase
            .from('user_mission_progress')
            .select('stage_id, canvas_state')
            .eq('user_id', userId)
            .not('canvas_state', 'is', null)
            .neq('canvas_state', '{}');

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          const canvasStates: Record<string, CanvasStateData> = {};
          data?.forEach((record) => {
            if (record.canvas_state && record.stage_id && Object.keys(record.canvas_state).length > 0) {
              canvasStates[record.stage_id] = record.canvas_state;
            }
          });

          return { data: canvasStates };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      providesTags: (result, error, userId) => [
        { type: 'CanvasState', id: `${userId}-all` },
      ],
    }),
  }),
});

export const {
  useLoadCanvasStateQuery,
  useSaveCanvasStateMutation,
  useDeleteCanvasStateMutation,
  useGetUserCanvasStatesQuery,
} = canvasApi; 