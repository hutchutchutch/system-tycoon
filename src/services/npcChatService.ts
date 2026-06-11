import { api } from './cloudflareApi';

// =============================================
// NPC Chat Service
// AI-powered NPC conversations (3-message limit) via the Cloudflare Worker.
// =============================================

export interface NPCChatResponse {
  message: string;
  message_type: 'text' | 'project_offer';
  is_project_offer: boolean;
  can_continue: boolean;
  npc_message_id: string;
}

export interface ConversationState {
  id: string;
  npc_id: string;
  mission_id?: string;
  status: 'active' | 'offer_pending' | 'accepted' | 'declined' | 'archived';
  message_count: number;
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  sender_type: 'player' | 'npc';
  content: string;
  message_type: 'text' | 'project_offer' | 'acceptance' | 'decline';
  metadata?: Record<string, any>;
  created_at: string;
}

export const npcChatService = {
  /** Start (or resume) a conversation with an NPC. */
  async startConversation(npcId: string, postId?: string, missionId?: string): Promise<ConversationState> {
    return api.post<ConversationState>('/conversations', { npcId, postId, missionId });
  },

  /** Send a player message and get the AI NPC reply. */
  async sendMessage(
    conversationId: string,
    _npcId: string,
    playerMessage: string,
    _missionId?: string
  ): Promise<NPCChatResponse> {
    return api.post<NPCChatResponse>(`/conversations/${conversationId}/messages`, { playerMessage });
  },

  /** Accept a project offer — creates the project server-side. */
  async acceptOffer(conversationId: string): Promise<{ success: boolean; project_id?: string }> {
    return api.post(`/conversations/${conversationId}/accept`);
  },

  /** Decline a project offer. */
  async declineOffer(conversationId: string): Promise<void> {
    await api.post(`/conversations/${conversationId}/decline`);
  },

  async getMessages(conversationId: string): Promise<ConversationMessage[]> {
    return api.get<ConversationMessage[]>(`/conversations/${conversationId}/messages`);
  },

  async getConversation(conversationId: string): Promise<ConversationState | null> {
    return api.get<ConversationState>(`/conversations/${conversationId}`);
  },

  async getConversations(): Promise<ConversationState[]> {
    return api.get<ConversationState[]>('/conversations');
  },

  /** Poll for new messages (replaces Supabase Realtime). Returns an unsubscribe fn. */
  subscribeToConversation(
    conversationId: string,
    onNewMessage: (message: ConversationMessage) => void
  ): () => void {
    const seen = new Set<string>();
    let primed = false;
    const tick = async () => {
      const messages = await this.getMessages(conversationId);
      for (const m of messages) {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          if (primed) onNewMessage(m);
        }
      }
      primed = true;
    };
    void tick();
    const timer = setInterval(() => void tick(), 4000);
    return () => clearInterval(timer);
  },
};

export default npcChatService;
