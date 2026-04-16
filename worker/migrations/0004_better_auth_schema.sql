-- Migration: Replace custom auth with Better Auth schema
-- Better Auth owns the `user`, `session`, `account`, `verification` tables.
-- Our profile fields become additionalFields on the user table.

-- ============================================================
-- Drop custom auth columns from profiles (moving to user table)
-- ============================================================
-- We can't actually DROP columns in SQLite easily, so we'll leave
-- the old profiles table orphaned and create the new user table.
-- Next migration can rename/drop profiles after data migration.

-- ============================================================
-- BETTER AUTH: user
-- ============================================================
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  emailVerified INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  -- additionalFields (our custom profile fields)
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  current_level INTEGER DEFAULT 1,
  reputation_score INTEGER DEFAULT 0,
  career_title TEXT DEFAULT 'Aspiring Developer',
  preferred_mentor_id TEXT,
  onboarding_completed INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_user_email ON user(email);
CREATE INDEX IF NOT EXISTS idx_user_username ON user(username);

-- ============================================================
-- BETTER AUTH: session
-- ============================================================
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expiresAt TEXT NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_session_userId ON session(userId);
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);

-- ============================================================
-- BETTER AUTH: account (OAuth providers + credential auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  accessTokenExpiresAt TEXT,
  refreshTokenExpiresAt TEXT,
  scope TEXT,
  idToken TEXT,
  password TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_account_userId ON account(userId);
CREATE INDEX IF NOT EXISTS idx_account_provider ON account(providerId, accountId);

-- ============================================================
-- BETTER AUTH: verification (email verification, password reset tokens)
-- ============================================================
CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
