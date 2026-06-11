import { api } from './cloudflareApi';
import type {
  NPC,
  FeedPost,
  Conversation,
  Message,
  SocialFeedFilters,
  FeedSortOption,
  ConversationContext,
} from '../types/social';

// =============================================
// Social Feed Service
// Talks to the Cloudflare Worker API (/api/social, /api/conversations).
// Realtime is replaced by lightweight polling (hybrid strategy).
// =============================================

interface FeedQueryOptions {
  cursor?: string | null;
  limit?: number;
  filters?: SocialFeedFilters;
  sort?: FeedSortOption;
}

interface FeedQueryResult {
  posts: FeedPost[];
  nextCursor: string | null;
}

/** Opaque handle returned by subscribe* helpers; pass back to unsubscribe(). */
export interface PollHandle {
  stop: () => void;
}

function poll(fn: () => void | Promise<void>, intervalMs: number): PollHandle {
  void fn(); // fire once immediately
  const timer = setInterval(() => void fn(), intervalMs);
  return { stop: () => clearInterval(timer) };
}

function buildQuery(options: FeedQueryOptions): string {
  const p = new URLSearchParams();
  if (options.cursor) p.set('cursor', options.cursor);
  if (options.limit) p.set('limit', String(options.limit));
  const f = options.filters;
  if (f) {
    if (f.postTypes.length) p.set('postTypes', f.postTypes.join(','));
    if (f.difficulties.length) p.set('difficulties', f.difficulties.join(','));
    if (f.urgencies.length) p.set('urgencies', f.urgencies.join(','));
  }
  const qs = p.toString();
  return qs ? `?${qs}` : '';
}

export const socialFeedService = {
  // ----- Feed -----
  async getFeed(options: FeedQueryOptions = {}): Promise<FeedQueryResult> {
    return api.get<FeedQueryResult>(`/social/feed${buildQuery(options)}`);
  },

  async getPostById(postId: string): Promise<FeedPost | null> {
    return api.get<FeedPost>(`/social/posts/${postId}`);
  },

  // ----- NPCs -----
  async getNPCs(): Promise<NPC[]> {
    return api.get<NPC[]>('/social/npcs');
  },

  async getNPCById(npcId: string): Promise<NPC | null> {
    return api.get<NPC>(`/social/npcs/${npcId}`);
  },

  async getNPCByHandle(handle: string): Promise<NPC | null> {
    return api.get<NPC>(`/social/npcs/handle/${handle}`);
  },

  // ----- Interactions -----
  async toggleLike(postId: string, like: boolean): Promise<void> {
    if (like) await api.post(`/social/posts/${postId}/like`);
    else await api.delete(`/social/posts/${postId}/like`);
  },

  async toggleBookmark(postId: string, bookmark: boolean): Promise<void> {
    if (bookmark) await api.post(`/social/posts/${postId}/bookmark`);
    else await api.delete(`/social/posts/${postId}/bookmark`);
  },

  async toggleFollow(npcId: string, follow: boolean): Promise<void> {
    await api.post(`/social/npcs/${npcId}/follow`, { follow });
  },

  async getInteraction(npcId: string) {
    return api.get(`/social/npcs/${npcId}/interaction`);
  },

  // ----- Conversations -----
  async getConversations(): Promise<Conversation[]> {
    return api.get<Conversation[]>('/conversations');
  },

  async getConversationById(conversationId: string): Promise<Conversation | null> {
    return api.get<Conversation>(`/conversations/${conversationId}`);
  },

  async getConversationWithNPC(npcId: string): Promise<Conversation | null> {
    const all = await this.getConversations();
    return all.find((c) => c.npc_id === npcId) ?? null;
  },

  async startConversation(npcId: string, postId?: string): Promise<Conversation> {
    return api.post<Conversation>('/conversations', { npcId, postId });
  },

  async updateConversationStatus(conversationId: string, status: string): Promise<void> {
    await api.patch(`/conversations/${conversationId}/status`, { status });
  },

  async updateConversationContext(
    conversationId: string,
    context: Partial<ConversationContext>
  ): Promise<void> {
    // Context is advanced server-side during the chat flow; this is a best-effort passthrough.
    await api.patch(`/conversations/${conversationId}/status`, { context });
  },

  // ----- Messages -----
  async getMessages(conversationId: string): Promise<Message[]> {
    return api.get<Message[]>(`/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    // Routes through the AI endpoint; the NPC reply persists server-side and arrives
    // via the conversation poller. We return the player message optimistically.
    await api.post(`/conversations/${conversationId}/messages`, { playerMessage: content });
    return {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      sender_type: 'player',
      content,
      message_type: 'text',
      metadata: {},
      is_read: true,
      created_at: new Date().toISOString(),
    };
  },

  async markMessagesRead(conversationId: string): Promise<void> {
    await api.patch(`/conversations/${conversationId}/read`);
  },

  // ----- Polling (replaces Supabase Realtime) -----
  subscribeFeed(onNewPost: (post: FeedPost) => void, _onUpdatePost: (post: FeedPost) => void): PollHandle {
    const seen = new Set<string>();
    let primed = false;
    return poll(async () => {
      const { posts } = await this.getFeed({ limit: 20 });
      for (const post of posts) {
        if (!seen.has(post.id)) {
          seen.add(post.id);
          if (primed) onNewPost(post);
        }
      }
      primed = true;
    }, 15000);
  },

  subscribeConversation(conversationId: string, onNewMessage: (message: Message) => void): PollHandle {
    const seen = new Set<string>();
    let primed = false;
    return poll(async () => {
      const messages = await this.getMessages(conversationId);
      for (const m of messages) {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          if (primed) onNewMessage(m);
        }
      }
      primed = true;
    }, 4000);
  },

  subscribeConversations(onUpdate: (conversation: Conversation) => void): PollHandle {
    return poll(async () => {
      const convos = await this.getConversations();
      convos.forEach(onUpdate);
    }, 10000);
  },

  unsubscribe(handle: PollHandle): void {
    handle?.stop();
  },
};

export default socialFeedService;
