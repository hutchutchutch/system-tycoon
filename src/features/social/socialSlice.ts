import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  NPC,
  FeedPost,
  Conversation,
  Message,
  PlayerNPCInteraction,
  SocialFeedFilters,
  FeedSortOption,
  ConversationPhase,
  SocialNotification,
} from '../../types/social';
import { socialFeedService } from '../../services/socialFeedService';

// =============================================
// State Interface
// =============================================
interface SocialState {
  // Feed State
  feed: FeedPost[];
  feedLoading: boolean;
  feedError: string | null;
  feedHasMore: boolean;
  feedCursor: string | null;
  
  // NPCs
  npcs: Record<string, NPC>;
  npcsLoading: boolean;
  
  // Conversations
  conversations: Record<string, Conversation>;
  conversationsLoading: boolean;
  activeConversationId: string | null;
  
  // Messages (by conversation_id)
  messages: Record<string, Message[]>;
  messagesLoading: Record<string, boolean>;
  
  // Player Interactions
  interactions: Record<string, PlayerNPCInteraction>; // keyed by npc_id
  
  // UI State
  filters: SocialFeedFilters;
  sort: FeedSortOption;
  unreadCounts: Record<string, number>; // conversation_id -> count
  totalUnread: number;
  
  // Notifications
  notifications: SocialNotification[];
  
  // Realtime connection status
  isConnected: boolean;
}

const initialFilters: SocialFeedFilters = {
  postTypes: [],
  difficulties: [],
  urgencies: [],
  techTags: [],
  showLikedOnly: false,
  showBookmarkedOnly: false,
};

const initialState: SocialState = {
  feed: [],
  feedLoading: false,
  feedError: null,
  feedHasMore: true,
  feedCursor: null,
  
  npcs: {},
  npcsLoading: false,
  
  conversations: {},
  conversationsLoading: false,
  activeConversationId: null,
  
  messages: {},
  messagesLoading: {},
  
  interactions: {},
  
  filters: initialFilters,
  sort: { field: 'created_at', direction: 'desc' },
  unreadCounts: {},
  totalUnread: 0,
  
  notifications: [],
  
  isConnected: false,
};

// =============================================
// Async Thunks
// =============================================

export const fetchFeed = createAsyncThunk(
  'social/fetchFeed',
  async ({ refresh = false }: { refresh?: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { social: SocialState };
      const cursor = refresh ? null : state.social.feedCursor;
      const { filters, sort } = state.social;
      
      const result = await socialFeedService.getFeed({
        cursor,
        limit: 20,
        filters,
        sort,
      });
      
      return { posts: result.posts, cursor: result.nextCursor, refresh };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch feed');
    }
  }
);

export const fetchNPCs = createAsyncThunk(
  'social/fetchNPCs',
  async (_, { rejectWithValue }) => {
    try {
      const npcs = await socialFeedService.getNPCs();
      return npcs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch NPCs');
    }
  }
);

export const fetchConversations = createAsyncThunk(
  'social/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const conversations = await socialFeedService.getConversations();
      return conversations;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'social/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const messages = await socialFeedService.getMessages(conversationId);
      return { conversationId, messages };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch messages');
    }
  }
);

export const startConversation = createAsyncThunk(
  'social/startConversation',
  async ({ npcId, postId }: { npcId: string; postId?: string }, { rejectWithValue }) => {
    try {
      const conversation = await socialFeedService.startConversation(npcId, postId);
      return conversation;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'social/sendMessage',
  async ({ conversationId, content }: { conversationId: string; content: string }, { rejectWithValue }) => {
    try {
      const message = await socialFeedService.sendMessage(conversationId, content);
      return { conversationId, message };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  'social/toggleLikePost',
  async (postId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { social: SocialState };
      const post = state.social.feed.find(p => p.id === postId);
      const isCurrentlyLiked = post?.is_liked || false;
      
      await socialFeedService.toggleLike(postId, !isCurrentlyLiked);
      return { postId, isLiked: !isCurrentlyLiked };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle like');
    }
  }
);

export const toggleBookmarkPost = createAsyncThunk(
  'social/toggleBookmarkPost',
  async (postId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { social: SocialState };
      const post = state.social.feed.find(p => p.id === postId);
      const isCurrentlyBookmarked = post?.is_bookmarked || false;
      
      await socialFeedService.toggleBookmark(postId, !isCurrentlyBookmarked);
      return { postId, isBookmarked: !isCurrentlyBookmarked };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle bookmark');
    }
  }
);

export const followNPC = createAsyncThunk(
  'social/followNPC',
  async ({ npcId, follow }: { npcId: string; follow: boolean }, { rejectWithValue }) => {
    try {
      await socialFeedService.toggleFollow(npcId, follow);
      return { npcId, isFollowing: follow };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to follow NPC');
    }
  }
);

// =============================================
// Slice
// =============================================
const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    // Feed management
    setFeed: (state, action: PayloadAction<FeedPost[]>) => {
      state.feed = action.payload;
    },
    
    addPost: (state, action: PayloadAction<FeedPost>) => {
      // Add to top of feed
      state.feed.unshift(action.payload);
    },
    
    updatePost: (state, action: PayloadAction<FeedPost>) => {
      const idx = state.feed.findIndex(p => p.id === action.payload.id);
      if (idx >= 0) {
        state.feed[idx] = action.payload;
      }
    },
    
    removePost: (state, action: PayloadAction<string>) => {
      state.feed = state.feed.filter(p => p.id !== action.payload);
    },
    
    // NPC management
    setNPC: (state, action: PayloadAction<NPC>) => {
      state.npcs[action.payload.id] = action.payload;
    },
    
    // Conversation management
    setConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations[action.payload.id] = action.payload;
    },
    
    updateConversationPhase: (state, action: PayloadAction<{ conversationId: string; phase: ConversationPhase }>) => {
      const conv = state.conversations[action.payload.conversationId];
      if (conv) {
        conv.context.phase = action.payload.phase;
      }
    },
    
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      // Clear unread count when opening conversation
      if (action.payload) {
        const prevUnread = state.unreadCounts[action.payload] || 0;
        state.unreadCounts[action.payload] = 0;
        state.totalUnread = Math.max(0, state.totalUnread - prevUnread);
      }
    },
    
    // Message management
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
      
      // Update unread count if not active conversation
      if (conversationId !== state.activeConversationId && message.sender_type === 'npc') {
        state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
        state.totalUnread += 1;
      }
      
      // Update conversation last_message_at
      if (state.conversations[conversationId]) {
        state.conversations[conversationId].last_message_at = message.created_at;
      }
    },
    
    markMessagesRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        messages.forEach(m => { m.is_read = true; });
      }
      const prevUnread = state.unreadCounts[conversationId] || 0;
      state.unreadCounts[conversationId] = 0;
      state.totalUnread = Math.max(0, state.totalUnread - prevUnread);
    },
    
    // Interactions
    setInteraction: (state, action: PayloadAction<PlayerNPCInteraction>) => {
      state.interactions[action.payload.npc_id] = action.payload;
    },
    
    updateRelationship: (state, action: PayloadAction<{ npcId: string; delta: number }>) => {
      const interaction = state.interactions[action.payload.npcId];
      if (interaction) {
        interaction.relationship_level = Math.max(-100, Math.min(100, 
          interaction.relationship_level + action.payload.delta
        ));
      }
    },
    
    // Filters
    setFilters: (state, action: PayloadAction<Partial<SocialFeedFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    
    setSort: (state, action: PayloadAction<FeedSortOption>) => {
      state.sort = action.payload;
    },
    
    // Notifications
    addNotification: (state, action: PayloadAction<SocialNotification>) => {
      state.notifications.unshift(action.payload);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications.pop();
      }
    },
    
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Connection status
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    
    // Reset state
    resetSocialState: () => initialState,
  },
  
  extraReducers: (builder) => {
    // Fetch Feed
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feedLoading = false;
        if (action.payload.refresh) {
          state.feed = action.payload.posts;
        } else {
          state.feed = [...state.feed, ...action.payload.posts];
        }
        state.feedCursor = action.payload.cursor;
        state.feedHasMore = !!action.payload.cursor;
        
        // Index NPCs from posts
        action.payload.posts.forEach(post => {
          if (post.npc) {
            state.npcs[post.npc.id] = post.npc;
          }
        });
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload as string;
      });
    
    // Fetch NPCs
    builder
      .addCase(fetchNPCs.pending, (state) => {
        state.npcsLoading = true;
      })
      .addCase(fetchNPCs.fulfilled, (state, action) => {
        state.npcsLoading = false;
        action.payload.forEach(npc => {
          state.npcs[npc.id] = npc;
        });
      })
      .addCase(fetchNPCs.rejected, (state) => {
        state.npcsLoading = false;
      });
    
    // Fetch Conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.conversationsLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversationsLoading = false;
        let total = 0;
        action.payload.forEach(conv => {
          state.conversations[conv.id] = conv;
          state.unreadCounts[conv.id] = conv.unread_count;
          total += conv.unread_count;
          if (conv.npc) {
            state.npcs[conv.npc.id] = conv.npc;
          }
        });
        state.totalUnread = total;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.conversationsLoading = false;
      });
    
    // Fetch Messages
    builder
      .addCase(fetchMessages.pending, (state, action) => {
        state.messagesLoading[action.meta.arg] = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.messagesLoading[conversationId] = false;
        state.messages[conversationId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading[action.meta.arg] = false;
      });
    
    // Start Conversation
    builder
      .addCase(startConversation.fulfilled, (state, action) => {
        state.conversations[action.payload.id] = action.payload;
        state.activeConversationId = action.payload.id;
        state.messages[action.payload.id] = action.payload.messages || [];
      });
    
    // Send Message
    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message);
      });
    
    // Toggle Like
    builder
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, isLiked } = action.payload;
        const post = state.feed.find(p => p.id === postId);
        if (post) {
          post.is_liked = isLiked;
          post.likes = isLiked ? post.likes + 1 : post.likes - 1;
        }
      });
    
    // Toggle Bookmark
    builder
      .addCase(toggleBookmarkPost.fulfilled, (state, action) => {
        const { postId, isBookmarked } = action.payload;
        const post = state.feed.find(p => p.id === postId);
        if (post) {
          post.is_bookmarked = isBookmarked;
        }
      });
    
    // Follow NPC
    builder
      .addCase(followNPC.fulfilled, (state, action) => {
        const { npcId, isFollowing } = action.payload;
        const interaction = state.interactions[npcId];
        if (interaction) {
          interaction.is_following = isFollowing;
        }
      });
  },
});

export const {
  setFeed,
  addPost,
  updatePost,
  removePost,
  setNPC,
  setConversation,
  updateConversationPhase,
  setActiveConversation,
  addMessage,
  markMessagesRead,
  setInteraction,
  updateRelationship,
  setFilters,
  resetFilters,
  setSort,
  addNotification,
  markNotificationRead,
  clearNotifications,
  setConnected,
  resetSocialState,
} = socialSlice.actions;

export default socialSlice.reducer;

// =============================================
// Selectors
// =============================================
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export const selectFeed = (state: RootState) => state.social.feed;
export const selectFeedLoading = (state: RootState) => state.social.feedLoading;
export const selectFeedError = (state: RootState) => state.social.feedError;
export const selectFeedHasMore = (state: RootState) => state.social.feedHasMore;

export const selectNPCs = (state: RootState) => state.social.npcs;
export const selectNPCById = (npcId: string) => (state: RootState) => state.social.npcs[npcId];

export const selectConversations = (state: RootState) => state.social.conversations;
export const selectConversationsLoading = (state: RootState) => state.social.conversationsLoading;
export const selectActiveConversationId = (state: RootState) => state.social.activeConversationId;
export const selectActiveConversation = (state: RootState) => {
  const id = state.social.activeConversationId;
  return id ? state.social.conversations[id] : null;
};

export const selectMessages = (conversationId: string) => (state: RootState) => 
  state.social.messages[conversationId] || [];

export const selectTotalUnread = (state: RootState) => state.social.totalUnread;
export const selectUnreadCount = (conversationId: string) => (state: RootState) => 
  state.social.unreadCounts[conversationId] || 0;

export const selectFilters = (state: RootState) => state.social.filters;
export const selectSort = (state: RootState) => state.social.sort;

export const selectNotifications = (state: RootState) => state.social.notifications;
export const selectUnreadNotifications = createSelector(
  selectNotifications,
  (notifications) => notifications.filter(n => !n.read)
);

export const selectIsConnected = (state: RootState) => state.social.isConnected;

// Derived selectors
export const selectHelpRequestPosts = createSelector(
  selectFeed,
  (feed) => feed.filter(p => p.post_type === 'help_request')
);

export const selectConversationsList = createSelector(
  selectConversations,
  (conversations) => Object.values(conversations).sort((a, b) => 
    new Date(b.last_message_at || b.created_at).getTime() - 
    new Date(a.last_message_at || a.created_at).getTime()
  )
);

export const selectNPCInteraction = (npcId: string) => (state: RootState) => 
  state.social.interactions[npcId];
