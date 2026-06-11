export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  ASSETS: Fetcher; // static asset binding — serves ./dist for non-API paths
  ENVIRONMENT: string;
  JWT_SECRET: string; // used by Better Auth as its signing secret
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BETTER_AUTH_URL: string;
  RESEND_API_KEY: string; // transactional email (verification, reset, alerts)
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  DESIGN_SESSION: DurableObjectNamespace;
  OPENAI_API_KEY: string; // NPC chat generation (set via `wrangler secret put`)
}

// Hono app environment: bindings + per-request context variables
// (set by authMiddleware / optionalAuth in middleware/auth.ts)
export type AppEnv = {
  Bindings: Env;
  Variables: {
    user: AuthUser;
    profile: Profile;
  };
};

// Auth types — shape matches Better Auth session user
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
}

// Profile — now the `user` table from Better Auth with additionalFields
export interface Profile {
  id: string;
  email: string;
  name: string;
  emailVerified: number;
  image: string | null;
  // additionalFields
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  current_level: number;
  reputation_score: number;
  career_title: string | null;
  preferred_mentor_id: string | null;
  onboarding_completed: number;
  createdAt: string;
  updatedAt: string;
}

// Mission types
export interface Mission {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  crisis_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface MissionStage {
  id: string;
  mission_id: string;
  stage_number: number;
  title: string;
  problem_description: string | null;
  required_components: string; // JSON string
  validation_rules: string; // JSON string
  system_requirements: string; // JSON string
  initial_system_state: string | null; // JSON string — broken starting state for the Whiteboard
  created_at: string;
  updated_at: string;
}

// Email types
export interface MissionEmail {
  id: string;
  mission_id: string;
  stage_id: string | null;
  sender_name: string;
  sender_email: string;
  sender_avatar: string | null;
  subject: string;
  preview: string | null;
  body: string | null;
  status: string;
  priority: string;
  has_attachments: number;
  tags: string; // JSON array string
  category: string;
  trigger_type: string | null;
  character_id: string | null;
  character_name: string | null;
  character_email: string | null;
  character_avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// News types
export interface NewsArticle {
  id: string;
  mission_id: string;
  headline: string;
  subheadline: string | null;
  preview_text: string;
  full_text: string;
  hero_image_url: string | null;
  thumbnail_url: string | null;
  image_alt_text: string | null;
  author_name: string;
  author_avatar_url: string | null;
  publication_name: string;
  urgency_level: string;
  impact_stats: string; // JSON string
  location: string | null;
  category_slug: string;
  tags: string; // JSON array string
  grid_size: string;
  sort_weight: number;
  article_status: string;
  success_headline: string | null;
  success_text: string | null;
  success_stats: string | null; // JSON string
  success_published_at: string | null;
  view_count: number;
  contact_count: number;
  completion_count: number;
  meta_description: string | null;
  social_image_url: string | null;
  published_at: string;
  updated_at: string;
  expires_at: string | null;
  created_at: string;
}

// Mentor types
export interface Mentor {
  id: string;
  name: string;
  title: string;
  tags: string; // JSON array string
  tagline: string;
  quote: string;
  signature: string; // JSON string
  personality: string; // JSON string
  specialty: string; // JSON string
  lore: string | null;
  created_at: string;
  updated_at: string;
}

// Canvas types
export interface UserMissionProgress {
  id: string;
  user_id: string;
  mission_id: string;
  stage_id: string;
  status: string;
  current_stage_id: string | null;
  canvas_state: string | null; // JSON string
  started_at: string | null;
  updated_at: string;
}

// Chat types
export interface MentorChatMessage {
  id: string;
  user_id: string;
  mentor_id: string;
  conversation_session_id: string;
  message_content: string;
  sender_type: string;
  mission_stage_id: string | null;
  created_at: string;
}

// ============================================================
// Social feed / NPC conversations / projects
// (JSON columns are stored as TEXT strings; parse with parseJson)
// ============================================================
export interface Npc {
  id: string;
  name: string;
  handle: string;
  avatar_url: string | null;
  company: string | null;
  role: string;
  bio: string | null;
  follower_count: number;
  verified: number;
  personality: string; // JSON
  difficulty_modifier: number;
  unlock_level: number;
  created_at: string;
  updated_at: string;
}

export interface SocialFeedPost {
  id: string;
  npc_id: string | null;
  content: string;
  post_type: string;
  mission_id: string | null;
  media_url: string | null;
  likes: number;
  reposts: number;
  replies_count: number;
  is_visible: number;
  is_pinned: number;
  difficulty_hint: string | null;
  tech_tags: string; // JSON array
  budget_range: string | null;
  urgency: string | null;
  scheduled_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerNpcInteraction {
  id: string;
  player_id: string;
  npc_id: string;
  relationship_level: number;
  interaction_count: number;
  projects_completed: number;
  projects_failed: number;
  total_revenue_earned: number;
  is_following: number;
  is_muted: number;
  first_interaction_at: string | null;
  last_interaction_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  player_id: string;
  npc_id: string;
  status: string;
  initiated_from_post_id: string | null;
  mission_id: string | null;
  context: string; // JSON
  unread_count: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  sender_type: string;
  content: string;
  message_type: string;
  metadata: string; // JSON
  is_read: number;
  created_at: string;
}

export interface Project {
  id: string;
  player_id: string;
  mission_id: string;
  npc_id: string | null;
  conversation_id: string | null;
  status: string;
  current_stage: number;
  design_state: string | null; // JSON { nodes, edges }
  requirements_met: string; // JSON array
  score: number;
  revenue_earned: number;
  started_at: string;
  deadline: string | null;
  deployed_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMetrics {
  id: string;
  project_id: string;
  current_rps: number;
  error_rate: number;
  latency_p99: number;
  uptime_percentage: number;
  revenue_earned: number;
  revenue_delta: number;
  updated_at: string;
}

export interface ProjectEvent {
  id: string;
  project_id: string;
  event_type: string;
  message: string;
  severity: string;
  metadata: string; // JSON
  acknowledged: number;
  created_at: string;
}

// Collaboration types
export interface CollaborationInvitation {
  id: string;
  sender_id: string;
  invited_id: string;
  mission_stage_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
}
