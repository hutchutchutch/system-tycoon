import { supabase } from './supabase';
import type { Node, Edge } from 'reactflow';

export interface DesignSession {
  id: string;
  scenario_id: string;
  created_by: string;
  session_name: string;
  is_active: boolean;
  max_collaborators: number;
  canvas_state: {
    nodes: Node[];
    edges: Edge[];
  };
  created_at: string;
  updated_at: string;
  design_session_participants?: Array<{
    consultant_id: string;
    role: string;
    joined_at: string;
  }>;
}

export interface CanvasComponent {
  id: string;
  session_id: string;
  component_id: string;
  component_type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  style: Record<string, any>;
  created_by: string;
  last_modified_by: string;
  is_selected: boolean;
  selected_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CanvasConnection {
  id: string;
  session_id: string;
  connection_id: string;
  source_component_id: string;
  target_component_id: string;
  connection_type: string;
  style: Record<string, any>;
  created_by: string;
  created_at: string;
}

export const realtimeCollaborationService = {
  // Create a new design session
  async createSession(scenarioId: string, sessionName: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('design_sessions')
      .insert({
        scenario_id: scenarioId,
        created_by: user.id,
        session_name: sessionName,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Join an existing session
  async joinSession(sessionId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if already a participant
    const { data: existing } = await supabase
      .from('design_session_participants')
      .select()
      .eq('session_id', sessionId)
      .eq('consultant_id', user.id)
      .single();

    if (!existing) {
      // Add as participant
      const { error } = await supabase
        .from('design_session_participants')
        .insert({
          session_id: sessionId,
          consultant_id: user.id,
          role: 'collaborator',
          joined_at: new Date().toISOString()
        });

      if (error) throw error;
    }

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('design_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;
    return session;
  },

  // Leave a session
  async leaveSession(sessionId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('design_session_participants')
      .delete()
      .eq('session_id', sessionId)
      .eq('consultant_id', user.id);

    if (error) throw error;
  },

  // Get active sessions for a scenario
  async getActiveSessions(scenarioId: string) {
    const { data, error } = await supabase
      .from('design_sessions')
      .select(`
        *,
        design_session_participants!inner(
          consultant_id,
          role,
          joined_at
        )
      `)
      .eq('scenario_id', scenarioId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update canvas state
  async updateCanvasState(sessionId: string, nodes: Node[], edges: Edge[]) {
    const { error } = await supabase
      .from('design_sessions')
      .update({
        canvas_state: { nodes, edges },
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  },

  // Add or update a component
  async upsertComponent(component: Partial<CanvasComponent>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('canvas_components')
      .upsert({
        ...component,
        last_modified_by: user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update component selection
  async updateComponentSelection(sessionId: string, componentId: string, isSelected: boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('canvas_components')
      .update({
        is_selected: isSelected,
        selected_by: isSelected ? user.id : null,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .eq('component_id', componentId);

    if (error) throw error;
  },

  // Add or update a connection
  async upsertConnection(connection: Partial<CanvasConnection>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('canvas_connections')
      .upsert({
        ...connection,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a connection
  async deleteConnection(sessionId: string, connectionId: string) {
    const { error } = await supabase
      .from('canvas_connections')
      .delete()
      .eq('session_id', sessionId)
      .eq('connection_id', connectionId);

    if (error) throw error;
  },

  // Log collaboration action
  async logAction(sessionId: string, actionType: string, actionData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Don't throw, just skip logging

    await supabase
      .from('collaboration_logs')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        action_type: actionType,
        action_data: actionData
      });
  }
}; 