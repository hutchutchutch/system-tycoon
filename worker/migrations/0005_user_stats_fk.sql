-- Migration: Point user_stats foreign key at the Better Auth `user` table
-- instead of the legacy `profiles` table. SQLite can't alter a foreign
-- key in place — we have to recreate the table. Safe to drop here because
-- the app is pre-prod and user_stats contains no meaningful data yet.

DROP TABLE IF EXISTS user_stats;

CREATE TABLE user_stats (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES user(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
