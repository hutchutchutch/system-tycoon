-- Migration: Add password_hash column and Google OAuth fields to profiles
ALTER TABLE profiles ADD COLUMN password_hash TEXT;
ALTER TABLE profiles ADD COLUMN google_id TEXT;
ALTER TABLE profiles ADD COLUMN auth_provider TEXT DEFAULT 'email';

CREATE INDEX IF NOT EXISTS idx_profiles_google_id ON profiles(google_id);
