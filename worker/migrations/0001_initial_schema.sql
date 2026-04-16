-- Migration: Initial D1 Schema
-- Translates all Supabase PostgreSQL tables to D1-compatible SQLite
-- Key changes: UUID -> TEXT with app-generated IDs, TIMESTAMPTZ -> TEXT, JSONB -> TEXT, TEXT[] -> TEXT (JSON)

-- ============================================================
-- PROFILES (replaces Supabase auth.users + profiles)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  current_level INTEGER DEFAULT 1,
  reputation_score INTEGER DEFAULT 0,
  career_title TEXT DEFAULT 'Aspiring Developer',
  preferred_mentor_id TEXT,
  onboarding_completed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ============================================================
-- MISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS missions (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  crisis_description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- MISSION STAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS mission_stages (
  id TEXT PRIMARY KEY,
  mission_id TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  problem_description TEXT,
  required_components TEXT DEFAULT '[]',
  validation_rules TEXT DEFAULT '{}',
  system_requirements TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(mission_id, stage_number)
);

CREATE INDEX IF NOT EXISTS idx_mission_stages_mission_id ON mission_stages(mission_id);

-- ============================================================
-- MISSION STAGE REQUIREMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS mission_stage_requirements (
  id TEXT PRIMARY KEY,
  stage_id TEXT NOT NULL REFERENCES mission_stages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirement_type TEXT NOT NULL,
  validation_config TEXT DEFAULT '{}',
  priority INTEGER DEFAULT 1,
  unlock_order INTEGER DEFAULT 1,
  initially_visible INTEGER DEFAULT 1,
  points INTEGER DEFAULT 10,
  hint TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mission_stage_requirements_stage_id ON mission_stage_requirements(stage_id);

-- ============================================================
-- MISSION EMAILS
-- ============================================================
CREATE TABLE IF NOT EXISTS mission_emails (
  id TEXT PRIMARY KEY,
  mission_id TEXT REFERENCES missions(id) ON DELETE CASCADE,
  stage_id TEXT REFERENCES mission_stages(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_avatar TEXT,
  recipient_email TEXT,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  preview TEXT,
  body TEXT,
  content TEXT,
  status TEXT CHECK (status IN ('read', 'unread', 'archived', 'draft', 'sent')) DEFAULT 'unread',
  priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  has_attachments INTEGER DEFAULT 0,
  tags TEXT DEFAULT '[]',
  category TEXT CHECK (category IN ('primary', 'projects', 'news', 'promotions', 'drafts', 'sent')) DEFAULT 'primary',
  trigger_type TEXT,
  character_id TEXT,
  character_name TEXT,
  character_email TEXT,
  character_avatar_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mission_emails_mission_id ON mission_emails(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_emails_stage_id ON mission_emails(stage_id);
CREATE INDEX IF NOT EXISTS idx_mission_emails_status ON mission_emails(status);
CREATE INDEX IF NOT EXISTS idx_mission_emails_category ON mission_emails(category);
CREATE INDEX IF NOT EXISTS idx_mission_emails_trigger_type ON mission_emails(trigger_type);

-- ============================================================
-- USER EMAIL INBOX (tracks which emails are delivered to each user)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_email_inbox (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_email_id TEXT NOT NULL REFERENCES mission_emails(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('read', 'unread', 'archived')) DEFAULT 'unread',
  delivered_at TEXT DEFAULT (datetime('now')),
  read_at TEXT,
  UNIQUE(user_id, mission_email_id)
);

CREATE INDEX IF NOT EXISTS idx_user_email_inbox_user_id ON user_email_inbox(user_id);

-- ============================================================
-- NEWS ARTICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  mission_id TEXT NOT NULL,
  headline TEXT NOT NULL,
  subheadline TEXT,
  preview_text TEXT NOT NULL,
  full_text TEXT NOT NULL,
  hero_image_url TEXT,
  thumbnail_url TEXT,
  image_alt_text TEXT,
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  publication_name TEXT NOT NULL,
  urgency_level TEXT CHECK (urgency_level IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
  impact_stats TEXT DEFAULT '{}',
  location TEXT,
  category_slug TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  grid_size TEXT CHECK (grid_size IN ('small', 'medium', 'large', 'featured')) DEFAULT 'medium',
  sort_weight INTEGER DEFAULT 0,
  article_status TEXT CHECK (article_status IN ('draft', 'active', 'in_progress', 'success', 'partial_success', 'expired')) DEFAULT 'active',
  success_headline TEXT,
  success_text TEXT,
  success_stats TEXT,
  success_published_at TEXT,
  view_count INTEGER DEFAULT 0,
  contact_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  meta_description TEXT,
  social_image_url TEXT,
  published_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_news_articles_category_slug ON news_articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_news_articles_urgency_level ON news_articles(urgency_level);
CREATE INDEX IF NOT EXISTS idx_news_articles_article_status ON news_articles(article_status);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_sort_weight ON news_articles(sort_weight);

-- ============================================================
-- COMPONENTS (system design components available in the game)
-- ============================================================
CREATE TABLE IF NOT EXISTS components (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_name TEXT,
  color TEXT,
  short_description TEXT,
  detailed_description TEXT,
  concepts TEXT DEFAULT '[]',
  use_cases TEXT DEFAULT '[]',
  compatible_with TEXT DEFAULT '[]',
  cost INTEGER DEFAULT 50,
  capacity INTEGER DEFAULT 100,
  min_level INTEGER DEFAULT 1,
  unlock_level INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);

-- ============================================================
-- MENTORS
-- ============================================================
CREATE TABLE IF NOT EXISTS mentors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  tagline TEXT,
  quote TEXT,
  signature TEXT DEFAULT '{}',
  personality TEXT DEFAULT '{}',
  specialty TEXT DEFAULT '{}',
  lore TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- USER MISSION PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_mission_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  stage_id TEXT REFERENCES mission_stages(id),
  status TEXT DEFAULT 'in_progress',
  current_stage_id TEXT REFERENCES mission_stages(id),
  canvas_state TEXT,
  started_at TEXT,
  completed_at TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, mission_id, stage_id)
);

CREATE INDEX IF NOT EXISTS idx_user_mission_progress_user_id ON user_mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_mission_id ON user_mission_progress(mission_id);

-- ============================================================
-- MENTOR CHAT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS mentor_chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_id TEXT NOT NULL,
  conversation_session_id TEXT NOT NULL,
  message_content TEXT NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('user', 'mentor', 'system')) NOT NULL,
  mission_stage_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mentor_chat_session ON mentor_chat_messages(conversation_session_id);
CREATE INDEX IF NOT EXISTS idx_mentor_chat_user ON mentor_chat_messages(user_id);

-- ============================================================
-- SCENARIOS (legacy game scenarios)
-- ============================================================
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  level INTEGER NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT,
  description TEXT,
  budget_limit INTEGER,
  time_limit_seconds INTEGER,
  base_requirements TEXT DEFAULT '[]',
  available_questions TEXT DEFAULT '{}',
  available_components TEXT DEFAULT '[]',
  available_mentors TEXT DEFAULT '[]',
  success_criteria TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- SCENARIO PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS scenario_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'locked',
  best_score INTEGER,
  attempts INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, scenario_id)
);

-- ============================================================
-- SCENARIO ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS scenario_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  architecture_snapshot TEXT DEFAULT '{}',
  questions_asked TEXT DEFAULT '[]',
  mentor_selected TEXT,
  components_used TEXT DEFAULT '[]',
  total_cost INTEGER DEFAULT 0,
  performance_metrics TEXT DEFAULT '{}',
  final_score INTEGER DEFAULT 0,
  requirements_met TEXT DEFAULT '[]',
  completed_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- USER STATS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_stats (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_projects_completed INTEGER DEFAULT 0,
  total_components_used INTEGER DEFAULT 0,
  average_score REAL DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  total_time_played INTEGER DEFAULT 0,
  favorite_component_id TEXT,
  last_played_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  category TEXT,
  criteria TEXT DEFAULT '{}',
  reward_type TEXT,
  reward_value TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- USER ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  progress REAL DEFAULT 0,
  unlocked_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, achievement_id)
);

-- ============================================================
-- COMPONENT MASTERY
-- ============================================================
CREATE TABLE IF NOT EXISTS component_mastery (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL,
  mastery_level TEXT DEFAULT 'novice',
  times_used INTEGER DEFAULT 0,
  successful_uses INTEGER DEFAULT 0,
  last_used_at TEXT,
  unlocked_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, component_id)
);

-- ============================================================
-- COLLABORATION INVITATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS collaboration_invitations (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invited_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_stage_id TEXT NOT NULL REFERENCES mission_stages(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'expired')) DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT,
  UNIQUE(sender_id, invited_id, mission_stage_id)
);

-- ============================================================
-- DESIGN SESSIONS (realtime collaboration)
-- ============================================================
CREATE TABLE IF NOT EXISTS design_sessions (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_name TEXT,
  is_active INTEGER DEFAULT 1,
  max_collaborators INTEGER DEFAULT 4,
  canvas_state TEXT DEFAULT '{"nodes":[],"edges":[]}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- DESIGN SESSION PARTICIPANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS design_session_participants (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES design_sessions(id) ON DELETE CASCADE,
  consultant_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'collaborator',
  joined_at TEXT DEFAULT (datetime('now')),
  UNIQUE(session_id, consultant_id)
);

-- ============================================================
-- CANVAS COMPONENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS canvas_components (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES design_sessions(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL,
  component_type TEXT NOT NULL,
  position TEXT DEFAULT '{"x":0,"y":0}',
  data TEXT DEFAULT '{}',
  style TEXT DEFAULT '{}',
  created_by TEXT NOT NULL REFERENCES profiles(id),
  last_modified_by TEXT NOT NULL REFERENCES profiles(id),
  is_selected INTEGER DEFAULT 0,
  selected_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- CANVAS CONNECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS canvas_connections (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES design_sessions(id) ON DELETE CASCADE,
  connection_id TEXT NOT NULL,
  source_component_id TEXT NOT NULL,
  target_component_id TEXT NOT NULL,
  connection_type TEXT DEFAULT 'default',
  style TEXT DEFAULT '{}',
  created_by TEXT NOT NULL REFERENCES profiles(id),
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- COLLABORATION LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS collaboration_logs (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES design_sessions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id),
  action_type TEXT NOT NULL,
  action_data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- USER CANVAS STATES (standalone canvas, not session-based)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_canvas_states (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  canvas_name TEXT,
  canvas_state TEXT DEFAULT '{"nodes":[],"edges":[]}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_user_canvas_states_user_id ON user_canvas_states(user_id);
