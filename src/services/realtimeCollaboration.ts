import { api } from './cloudflareApi';
import type { Node, Edge } from '@xyflow/react';

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
  async createSession(scenarioId: string, sessionName: string) {
    return api.post<DesignSession>('/collaboration/sessions', {
      scenarioId,
      sessionName,
    });
  },

  async joinSession(sessionId: string) {
    await api.post(`/collaboration/sessions/${sessionId}/join`);
    // Return session details - fetch from the active sessions list
    const sessions = await api.get<DesignSession[]>(`/collaboration/sessions/${sessionId}`);
    return sessions[0] || null;
  },

  async leaveSession(sessionId: string) {
    await api.delete(`/collaboration/sessions/${sessionId}/leave`);
  },

  async getActiveSessions(scenarioId: string) {
    return api.get<DesignSession[]>(`/collaboration/sessions/${scenarioId}`);
  },

  async updateCanvasState(sessionId: string, nodes: Node[], edges: Edge[]) {
    await api.put(`/collaboration/sessions/${sessionId}/canvas`, { nodes, edges });
  },

  // Component and connection operations use the collaboration API
  // These are simplified since the Worker handles user identity
  async upsertComponent(component: Partial<CanvasComponent>) {
    // TODO: Add dedicated component upsert endpoint if needed
    // For now, canvas state updates handle this via updateCanvasState
    console.warn('upsertComponent: use updateCanvasState instead');
    return component as CanvasComponent;
  },

  async updateComponentSelection(_sessionId: string, _componentId: string, _isSelected: boolean) {
    // TODO: Add dedicated selection endpoint for real-time collaboration (Phase 5)
    console.warn('updateComponentSelection: not yet implemented for Cloudflare backend');
  },

  async upsertConnection(connection: Partial<CanvasConnection>) {
    // TODO: Add dedicated connection upsert endpoint if needed
    console.warn('upsertConnection: use updateCanvasState instead');
    return connection as CanvasConnection;
  },

  async deleteConnection(_sessionId: string, _connectionId: string) {
    // TODO: Add dedicated connection delete endpoint if needed
    console.warn('deleteConnection: use updateCanvasState instead');
  },

  async logAction(_sessionId: string, _actionType: string, _actionData: any) {
    // Collaboration logging is deferred to Phase 5 (Durable Objects)
    // The Worker doesn't have a dedicated logging endpoint yet
  }
};
