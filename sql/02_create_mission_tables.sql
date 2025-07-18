-- Migration: Create mission-related tables
-- Description: Creates tables for missions, stages, and mission emails

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  crisis_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mission_stages table
CREATE TABLE IF NOT EXISTS mission_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  problem_description TEXT,
  required_components JSONB DEFAULT '[]'::jsonb,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mission_id, stage_number)
);

-- Create mission_emails table
CREATE TABLE IF NOT EXISTS mission_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES mission_stages(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_avatar TEXT,
  subject TEXT NOT NULL,
  preview TEXT,
  body TEXT,
  status TEXT CHECK (status IN ('read', 'unread', 'archived')) DEFAULT 'unread',
  priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  has_attachments BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  category TEXT CHECK (category IN ('primary', 'projects', 'news', 'promotions')) DEFAULT 'primary',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mission_stages_mission_id ON mission_stages(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_stages_stage_number ON mission_stages(stage_number);
CREATE INDEX IF NOT EXISTS idx_mission_emails_mission_id ON mission_emails(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_emails_stage_id ON mission_emails(stage_id);

-- Insert test mission
INSERT INTO missions (id, slug, title, description, crisis_description) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'health-tracker-crisis', 'Community Health Tracker Overload', 'Help a parent save critical health data for 200+ families', 'Database crashes every few hours, no backups, 200+ families depending on the data')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  crisis_description = EXCLUDED.crisis_description;

-- Insert test mission stage
INSERT INTO mission_stages (id, mission_id, stage_number, title, problem_description, required_components) VALUES 
('bcd0760f-c920-44e8-b658-1674341ea1d8', '550e8400-e29b-41d4-a716-446655440000', 1, 'Separate Concerns', 'Alex''s laptop is crashing from running both web server and database', '[{"id": "web_server", "name": "Web Server", "category": "compute"}, {"id": "database", "name": "Database", "category": "database"}]'::jsonb)
ON CONFLICT (mission_id, stage_number) DO UPDATE SET
  id = EXCLUDED.id,
  title = EXCLUDED.title,
  problem_description = EXCLUDED.problem_description,
  required_components = EXCLUDED.required_components;

-- Insert test mission email with specific IDs from user's issue
INSERT INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category) VALUES 
('4c9569fb-89a4-4439-80c4-8e3944990d7c', '550e8400-e29b-41d4-a716-446655440000', 'bcd0760f-c920-44e8-b658-1674341ea1d8', 'Alex Chen', 'alex.chen@example.com', 'URGENT: Health Crisis - System Down', 'Our community health tracker is completely down...', 'Hi there,

I''m writing to you because I''m desperate and don''t know where else to turn. My name is Alex Chen, and I''ve been running a community health tracking website that helps families in our neighborhood document symptoms and potential environmental health issues.

The problem is that my system is completely falling apart. I built it on my laptop using a simple setup, but now:

- The database keeps crashing every few hours
- When families try to submit their health reports, the website becomes unresponsive
- I''ve lost critical data twice this week
- Over 200 families are depending on this system

I think the issue is that I''m running both the web server and database on the same machine, but I don''t know how to fix it. Can you help me design a better system architecture?

The families are getting sicker, and we need this data to prove there''s environmental contamination in our area. Time is running out.

Please help,
Alex Chen

P.S. I can provide more technical details if needed. Right now I''m using a basic Node.js server with SQLite on my MacBook.', 'urgent', '{"crisis", "system-design", "healthcare"}', 'primary')
ON CONFLICT (id) DO UPDATE SET
  mission_id = EXCLUDED.mission_id,
  stage_id = EXCLUDED.stage_id,
  sender_name = EXCLUDED.sender_name,
  sender_email = EXCLUDED.sender_email,
  subject = EXCLUDED.subject,
  preview = EXCLUDED.preview,
  body = EXCLUDED.body,
  priority = EXCLUDED.priority,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category;

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_missions_updated_at ON missions;
CREATE TRIGGER update_missions_updated_at 
    BEFORE UPDATE ON missions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mission_stages_updated_at ON mission_stages;
CREATE TRIGGER update_mission_stages_updated_at 
    BEFORE UPDATE ON mission_stages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mission_emails_updated_at ON mission_emails;
CREATE TRIGGER update_mission_emails_updated_at 
    BEFORE UPDATE ON mission_emails 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 