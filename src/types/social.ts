// =============================================
// Social Feed System Types
// Twitter-style mission discovery for System Design Tycoon
// =============================================

// NPC (Non-Player Character) Types
export type NPCRole = 
  | 'startup_founder' 
  | 'enterprise_cto' 
  | 'indie_dev' 
  | 'agency_lead' 
  | 'nonprofit_director';

export interface NPCPersonality {
  style: 'enthusiastic' | 'formal' | 'casual' | 'professional' | 'warm' | 'cautious' | 'creative' | 'serious';
  patience: 'low' | 'medium' | 'high';
  technical_depth: 'low' | 'medium' | 'high' | 'expert';
}

export interface NPC {
  id: string;
  name: string;
  handle: string; // @handle format
  avatar_url?: string;
  company?: string;
  role: NPCRole;
  bio?: string;
  follower_count: number;
  verified: boolean;
  personality: NPCPersonality;
  difficulty_modifier: number;
  unlock_level: number;
  created_at: string;
  updated_at: string;
}

// Social Feed Post Types
export type PostType = 
  | 'help_request' 
  | 'announcement' 
  | 'industry_news' 
  | 'success_story' 
  | 'tip';

export type DifficultyHint = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced' 
  | 'expert';

export type Urgency = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'critical';

export interface FeedPost {
  id: string;
  npc_id: string;
  content: string;
  post_type: PostType;
  mission_id?: string;
  media_url?: string;
  likes: number;
  reposts: number;
  replies_count: number;
  is_visible: boolean;
  is_pinned: boolean;
  difficulty_hint?: DifficultyHint;
  tech_tags: string[];
  budget_range?: string;
  urgency?: Urgency;
  scheduled_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  npc?: NPC;
  mission?: MissionSummary; // Mission data if this is a help_request
  // Player-specific data
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

// Lightweight mission data for feed display
export interface MissionSummary {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  difficulty: number;
  estimated_duration_minutes?: number;
  min_level: number;
}

// Player-NPC Interaction Types
export interface PlayerNPCInteraction {
  id: string;
  player_id: string;
  npc_id: string;
  relationship_level: number; // -100 to 100
  interaction_count: number;
  projects_completed: number;
  projects_failed: number;
  total_revenue_earned: number;
  is_following: boolean;
  is_muted: boolean;
  first_interaction_at?: string;
  last_interaction_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Conversation Types
export type ConversationStatus = 
  | 'active' 
  | 'archived' 
  | 'project_offered' 
  | 'project_accepted' 
  | 'project_declined' 
  | 'completed';

export interface ConversationContext {
  phase: ConversationPhase;
  questionsAsked: string[];
  requirementsRevealed: string[];
  projectDetails?: ProjectOffer;
}

export type ConversationPhase = 
  | 'initial_contact'
  | 'problem_explanation'
  | 'questions'
  | 'project_offer'
  | 'negotiation'
  | 'accepted'
  | 'declined'
  | 'working'
  | 'completed';

export interface Conversation {
  id: string;
  player_id: string;
  npc_id: string;
  status: ConversationStatus;
  initiated_from_post_id?: string;
  mission_id?: string;
  context: ConversationContext;
  unread_count: number;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  npc?: NPC;
  messages?: Message[];
}

// Message Types
export type MessageType = 
  | 'text' 
  | 'project_offer' 
  | 'project_acceptance' 
  | 'project_decline' 
  | 'requirement_question' 
  | 'system';

export type SenderType = 'player' | 'npc';

export interface ProjectOffer {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  requirements: ProjectRequirement[];
  difficulty: DifficultyHint;
  techStack: string[];
}

export interface ProjectRequirement {
  id: string;
  type: 'functional' | 'performance' | 'scalability' | 'security' | 'cost';
  description: string;
  target?: number;
  unit?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  revealed: boolean; // Whether the player has discovered this through conversation
}

export interface MessageMetadata {
  projectOffer?: ProjectOffer;
  requirement?: ProjectRequirement;
  [key: string]: any;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  content: string;
  message_type: MessageType;
  metadata: MessageMetadata;
  is_read: boolean;
  created_at: string;
}

// Feed Interaction Types
export type InteractionType = 
  | 'view' 
  | 'click' 
  | 'like' 
  | 'reply' 
  | 'dismiss';

export interface FeedImpression {
  id: string;
  player_id: string;
  post_id: string;
  interaction_type: InteractionType;
  duration_ms?: number;
  created_at: string;
}

// UI State Types
export interface SocialFeedFilters {
  postTypes: PostType[];
  difficulties: DifficultyHint[];
  urgencies: Urgency[];
  techTags: string[];
  showLikedOnly: boolean;
  showBookmarkedOnly: boolean;
}

export interface FeedSortOption {
  field: 'created_at' | 'likes' | 'urgency';
  direction: 'asc' | 'desc';
}

// Response Types (for NPC conversation AI)
export interface NPCResponseContext {
  npc: NPC;
  conversation: Conversation;
  playerMessage: string;
  playerProfile: {
    level: number;
    reputation: number;
    completedProjects: number;
  };
}

export interface NPCResponse {
  content: string;
  messageType: MessageType;
  metadata?: MessageMetadata;
  advancePhase?: ConversationPhase;
  relationshipDelta?: number;
}

// Notification Types
export interface SocialNotification {
  id: string;
  type: 'new_message' | 'project_offer' | 'project_deadline' | 'npc_mention' | 'achievement';
  title: string;
  body: string;
  conversation_id?: string;
  post_id?: string;
  npc_id?: string;
  read: boolean;
  created_at: string;
}

// =============================================
// Mission Discovery Flow Types
// Feed Post → Conversation → Project
// =============================================

export type MissionDiscoverySource = 'feed' | 'email' | 'referral' | 'direct';

// When player clicks "Offer to Help" on a help_request post
export interface MissionDiscoveryContext {
  source: MissionDiscoverySource;
  post_id?: string;      // The feed post they clicked
  npc_id: string;        // The NPC they'll chat with
  mission_id?: string;   // The mission this leads to (if known)
  referrer_npc_id?: string; // If another NPC referred them
}

// The active project after accepting a mission through conversation
export interface ActiveProject {
  id: string;
  player_id: string;
  mission_id: string;
  npc_id: string;
  conversation_id: string;
  
  // Status tracking
  status: ProjectStatus;
  current_stage: number;
  
  // Design state (React Flow canvas)
  design_state?: {
    nodes: any[];
    edges: any[];
  };
  
  // Metrics and progress
  requirements_met: string[];
  score: number;
  revenue_earned: number;
  
  // Timing
  started_at: string;
  deadline?: string;
  completed_at?: string;
  
  // Joined data
  mission?: MissionSummary;
  npc?: NPC;
}

export type ProjectStatus = 
  | 'negotiating'    // Still in conversation
  | 'designing'      // Working on system design
  | 'simulating'     // Running simulation
  | 'deployed'       // Live and earning
  | 'completed'      // Successfully finished
  | 'failed'         // Failed requirements or deadline
  | 'abandoned';     // Player quit

// Project event for realtime updates
export interface ProjectEvent {
  id: string;
  project_id: string;
  event_type: 'alert' | 'milestone' | 'traffic_spike' | 'failure' | 'success' | 'payment';
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  metadata?: Record<string, any>;
  acknowledged: boolean;
  created_at: string;
}

// Project metrics for simulation
export interface ProjectMetrics {
  project_id: string;
  current_rps: number;
  error_rate: number;
  latency_p99: number;
  uptime_percentage: number;
  revenue_earned: number;
  revenue_delta: number;
  updated_at: string;
}
