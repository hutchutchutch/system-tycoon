export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  ENVIRONMENT: string;
  JWT_SECRET: string; // used by Better Auth as its signing secret
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BETTER_AUTH_URL: string;
  SENDGRID_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  DESIGN_SESSION: DurableObjectNamespace;
}

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
