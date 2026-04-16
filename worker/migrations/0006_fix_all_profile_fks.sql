-- Migration: Repoint every foreign key from the legacy `profiles` table
-- to the Better Auth `user` table. SQLite can't alter FKs in place, so
-- each affected table is dropped and recreated. All of these tables are
-- either empty (new feature tables) or contain only transient pre-prod
-- test data, so DROP + CREATE is safe.

-- ============================================================
-- user_email_inbox (blocks sending email → this was reported)
-- ============================================================
DROP TABLE IF EXISTS user_email_inbox;
CREATE TABLE user_email_inbox (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  mission_email_id TEXT NOT NULL REFERENCES mission_emails(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('read', 'unread', 'archived')) DEFAULT 'unread',
  delivered_at TEXT DEFAULT (datetime('now')),
  read_at TEXT,
  UNIQUE(user_id, mission_email_id)
);
CREATE INDEX IF NOT EXISTS idx_user_email_inbox_user_id ON user_email_inbox(user_id);

-- ============================================================
-- user_mission_progress
-- ============================================================
DROP TABLE IF EXISTS user_mission_progress;
CREATE TABLE user_mission_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
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
-- mentor_chat_messages
-- ============================================================
DROP TABLE IF EXISTS mentor_chat_messages;
CREATE TABLE mentor_chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
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
-- scenario_progress
-- ============================================================
DROP TABLE IF EXISTS scenario_progress;
CREATE TABLE scenario_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
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
-- scenario_attempts
-- ============================================================
DROP TABLE IF EXISTS scenario_attempts;
CREATE TABLE scenario_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
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
-- user_achievements
-- ============================================================
DROP TABLE IF EXISTS user_achievements;
CREATE TABLE user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  progress REAL DEFAULT 0,
  unlocked_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, achievement_id)
);

-- ============================================================
-- component_mastery
-- ============================================================
DROP TABLE IF EXISTS component_mastery;
CREATE TABLE component_mastery (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL,
  mastery_level TEXT DEFAULT 'novice',
  times_used INTEGER DEFAULT 0,
  successful_uses INTEGER DEFAULT 0,
  last_used_at TEXT,
  unlocked_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, component_id)
);

-- ============================================================
-- collaboration_invitations
-- ============================================================
DROP TABLE IF EXISTS collaboration_invitations;
CREATE TABLE collaboration_invitations (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  invited_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  mission_stage_id TEXT NOT NULL REFERENCES mission_stages(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'expired')) DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT,
  UNIQUE(sender_id, invited_id, mission_stage_id)
);

-- ============================================================
-- design_sessions
-- ============================================================
DROP TABLE IF EXISTS design_sessions;
CREATE TABLE design_sessions (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  session_name TEXT,
  is_active INTEGER DEFAULT 1,
  max_collaborators INTEGER DEFAULT 4,
  canvas_state TEXT DEFAULT '{"nodes":[],"edges":[]}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- design_session_participants
-- ============================================================
DROP TABLE IF EXISTS design_session_participants;
CREATE TABLE design_session_participants (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES design_sessions(id) ON DELETE CASCADE,
  consultant_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'collaborator',
  joined_at TEXT DEFAULT (datetime('now')),
  UNIQUE(session_id, consultant_id)
);

-- ============================================================
-- canvas_components
-- ============================================================
DROP TABLE IF EXISTS canvas_components;
CREATE TABLE canvas_components (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES design_sessions(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL,
  component_type TEXT NOT NULL,
  position TEXT DEFAULT '{"x":0,"y":0}',
  data TEXT DEFAULT '{}',
  style TEXT DEFAULT '{}',
  created_by TEXT NOT NULL REFERENCES user(id),
  last_modified_by TEXT NOT NULL REFERENCES user(id),
  is_selected INTEGER DEFAULT 0,
  selected_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- canvas_connections
-- ============================================================
DROP TABLE IF EXISTS canvas_connections;
CREATE TABLE canvas_connections (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES design_sessions(id) ON DELETE CASCADE,
  connection_id TEXT NOT NULL,
  source_component_id TEXT NOT NULL,
  target_component_id TEXT NOT NULL,
  connection_type TEXT DEFAULT 'default',
  style TEXT DEFAULT '{}',
  created_by TEXT NOT NULL REFERENCES user(id),
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- collaboration_logs
-- ============================================================
DROP TABLE IF EXISTS collaboration_logs;
CREATE TABLE collaboration_logs (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES design_sessions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user(id),
  action_type TEXT NOT NULL,
  action_data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- user_canvas_states
-- ============================================================
DROP TABLE IF EXISTS user_canvas_states;
CREATE TABLE user_canvas_states (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  canvas_name TEXT,
  canvas_state TEXT DEFAULT '{"nodes":[],"edges":[]}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_user_canvas_states_user_id ON user_canvas_states(user_id);

-- ============================================================
-- Drop the legacy `profiles` table — fully replaced by `user`
-- ============================================================
DROP TABLE IF EXISTS profiles;
