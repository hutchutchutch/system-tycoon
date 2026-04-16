-- Migration: Seed Data
-- Pre-generated UUIDs for deterministic seeding

-- ============================================================
-- SEED MISSIONS
-- ============================================================
INSERT OR REPLACE INTO missions (id, slug, title, description, crisis_description) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'health-tracker-crisis', 'Community Health Tracker Overload', 'Help a parent save critical health data for 200+ families', 'Database crashes every few hours, no backups, 200+ families depending on the data'),
  ('660e8400-e29b-41d4-a716-446655440001', 'outbreak-documentation-site', 'The Outbreak Documentation Site', 'Help track a mysterious illness affecting neighborhood children', 'A mysterious illness is affecting children in the neighborhood. Parents are desperately trying to document symptoms to find patterns and prove environmental contamination.');

-- ============================================================
-- SEED MISSION STAGES
-- ============================================================
INSERT OR REPLACE INTO mission_stages (id, mission_id, stage_number, title, problem_description, required_components) VALUES
  ('bcd0760f-c920-44e8-b658-1674341ea1d8', '550e8400-e29b-41d4-a716-446655440000', 1, 'Separate Concerns', 'Alex''s laptop is crashing from running both web server and database', '[{"id": "web_server", "name": "Web Server", "category": "compute"}, {"id": "database", "name": "Database", "category": "database"}]');

-- ============================================================
-- SEED MISSION EMAILS
-- ============================================================
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type) VALUES
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

P.S. I can provide more technical details if needed. Right now I''m using a basic Node.js server with SQLite on my MacBook.', 'urgent', '["crisis", "system-design", "healthcare"]', 'primary', 'mission_start');

-- ============================================================
-- SEED NEWS ARTICLES
-- ============================================================
INSERT OR REPLACE INTO news_articles (id, mission_id, headline, preview_text, full_text, author_name, author_avatar_url, publication_name, urgency_level, impact_stats, location, category_slug, tags, grid_size, sort_weight) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'mission_1', 'Community Health Initiative Needs Tech Help', 'Local health organization needs system design support for patient tracking', 'A community health organization is looking for help with building a patient tracking system to serve 5000+ community members.', 'Dr. Sarah Johnson', '👩‍⚕️', 'Community Health Network', 'high', '{"people": 5000, "metric": "patients served"}', 'Seattle, WA', 'healthcare', '["healthcare", "databases", "privacy", "api"]', 'medium', 100),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'mission_2', 'School District Database Crisis', 'Student information system failing during enrollment period', 'The local school district needs urgent help with their student information system that is crashing during peak enrollment.', 'Maria Rodriguez', '👩‍🏫', 'Metro School District', 'critical', '{"people": 15000, "metric": "students affected"}', 'Portland, OR', 'education', '["education", "databases", "scalability", "crisis"]', 'large', 200),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'mission_3', 'Environmental Monitoring Project', 'Sensor network needs data processing pipeline', 'Environmental advocacy group needs help building a data processing pipeline for their sensor network monitoring air quality.', 'James Chen', '🌱', 'Green Future Coalition', 'medium', '{"people": 2000, "metric": "community members"}', 'San Francisco, CA', 'environment', '["environment", "iot", "data-processing", "real-time"]', 'medium', 80),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'mission_4', 'Small Business Inventory Crisis', 'Local business needs inventory management system', 'A growing small business needs help with their inventory management system that cannot keep up with their expansion.', 'Lisa Thompson', '🏪', 'Thompson Hardware', 'high', '{"people": 50, "metric": "employees"}', 'Austin, TX', 'small-business', '["small-business", "inventory", "scaling", "ecommerce"]', 'small', 60),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'mission_5', 'Community Center Tech Upgrade', 'Non-profit needs volunteer management platform', 'A community center serving underserved populations needs a volunteer management and event coordination platform.', 'Marcus Washington', '🏘️', 'Unity Community Center', 'medium', '{"people": 1200, "metric": "community members served"}', 'Detroit, MI', 'community', '["community", "non-profit", "volunteer-management", "events"]', 'medium', 70);
