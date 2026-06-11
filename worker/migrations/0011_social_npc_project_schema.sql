-- Migration: Social feed + NPC conversations + projects
-- Revives the pre-Cloudflare social-feed/NPC-chat/project feature on the D1 stack.
-- Postgres -> SQLite: UUID->app-generated TEXT, TIMESTAMPTZ->TEXT, BOOLEAN->INTEGER(0/1),
-- JSONB/TEXT[]->TEXT(JSON), DECIMAL->REAL. RLS/triggers/RPCs replaced by Worker route logic.
-- All player_id/user references point at the Better Auth `user` table.

-- ============================================================
-- NPCs — clients who post help requests in the feed
-- ============================================================
CREATE TABLE IF NOT EXISTS npcs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  company TEXT,
  role TEXT CHECK (role IN ('startup_founder', 'enterprise_cto', 'indie_dev', 'agency_lead', 'nonprofit_director')),
  bio TEXT,
  follower_count INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  personality TEXT DEFAULT '{}',          -- JSON: { style, patience, technical_depth, backstory }
  difficulty_modifier REAL DEFAULT 1.0,
  unlock_level INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- Social feed posts
-- ============================================================
CREATE TABLE IF NOT EXISTS social_feed_posts (
  id TEXT PRIMARY KEY,
  npc_id TEXT REFERENCES npcs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT CHECK (post_type IN ('help_request', 'announcement', 'industry_news', 'success_story', 'tip')),
  mission_id TEXT,                         -- FK -> missions(id); nullable for non-mission posts
  media_url TEXT,
  likes INTEGER DEFAULT 0,
  reposts INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  is_pinned INTEGER DEFAULT 0,
  difficulty_hint TEXT CHECK (difficulty_hint IN ('beginner', 'intermediate', 'advanced', 'expert')),
  tech_tags TEXT DEFAULT '[]',             -- JSON array
  budget_range TEXT,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  scheduled_at TEXT,
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- Player <-> NPC relationship tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS player_npc_interactions (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  npc_id TEXT NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
  relationship_level INTEGER DEFAULT 0 CHECK (relationship_level >= -100 AND relationship_level <= 100),
  interaction_count INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  projects_failed INTEGER DEFAULT 0,
  total_revenue_earned REAL DEFAULT 0,
  is_following INTEGER DEFAULT 0,
  is_muted INTEGER DEFAULT 0,
  first_interaction_at TEXT,
  last_interaction_at TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(player_id, npc_id)
);

-- ============================================================
-- Likes / bookmarks
-- ============================================================
CREATE TABLE IF NOT EXISTS post_likes (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES social_feed_posts(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(post_id, player_id)
);

CREATE TABLE IF NOT EXISTS post_bookmarks (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES social_feed_posts(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(post_id, player_id)
);

-- ============================================================
-- Conversations + messages
-- status / message_type left as free TEXT: the chat flow and the social/project
-- flows use overlapping-but-divergent vocabularies; route logic owns the values.
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  npc_id TEXT NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  initiated_from_post_id TEXT REFERENCES social_feed_posts(id),
  mission_id TEXT,
  context TEXT DEFAULT '{}',               -- JSON conversation state machine context
  unread_count INTEGER DEFAULT 0,
  last_message_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(player_id, npc_id)
);

CREATE TABLE IF NOT EXISTS conversation_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('player', 'npc')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  metadata TEXT DEFAULT '{}',              -- JSON: project offer details etc.
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- Projects (accepted missions) + simulation metrics + events
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  npc_id TEXT REFERENCES npcs(id),
  conversation_id TEXT REFERENCES conversations(id),
  status TEXT DEFAULT 'designing',
  current_stage INTEGER DEFAULT 1,
  design_state TEXT,                       -- JSON { nodes, edges }
  requirements_met TEXT DEFAULT '[]',      -- JSON array of requirement ids
  score INTEGER DEFAULT 0,
  revenue_earned REAL DEFAULT 0,
  started_at TEXT DEFAULT (datetime('now')),
  deadline TEXT,
  deployed_at TEXT,
  completed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_metrics (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  current_rps REAL DEFAULT 0,
  error_rate REAL DEFAULT 0,
  latency_p99 REAL DEFAULT 0,
  uptime_percentage REAL DEFAULT 100,
  revenue_earned REAL DEFAULT 0,
  revenue_delta REAL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(project_id)
);

CREATE TABLE IF NOT EXISTS project_events (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  metadata TEXT DEFAULT '{}',              -- JSON
  acknowledged INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_social_feed_posts_npc ON social_feed_posts(npc_id);
CREATE INDEX IF NOT EXISTS idx_social_feed_posts_type ON social_feed_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_social_feed_posts_visible ON social_feed_posts(is_visible, created_at);
CREATE INDEX IF NOT EXISTS idx_social_feed_posts_mission ON social_feed_posts(mission_id);
CREATE INDEX IF NOT EXISTS idx_player_npc_interactions_player ON player_npc_interactions(player_id);
CREATE INDEX IF NOT EXISTS idx_player_npc_interactions_npc ON player_npc_interactions(npc_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_player ON post_likes(player_id);
CREATE INDEX IF NOT EXISTS idx_post_bookmarks_player ON post_bookmarks(player_id);
CREATE INDEX IF NOT EXISTS idx_conversations_player ON conversations(player_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conv ON conversation_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_projects_player ON projects(player_id);
CREATE INDEX IF NOT EXISTS idx_project_events_project ON project_events(project_id, created_at);
