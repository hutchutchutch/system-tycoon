-- Migration: Create news articles table and related functions
-- Description: Creates table for news articles and increment functions for view/contact counts

-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  impact_stats JSONB DEFAULT '{}',
  location TEXT,
  category_slug TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  grid_size TEXT CHECK (grid_size IN ('small', 'medium', 'large', 'featured')) DEFAULT 'medium',
  sort_weight INTEGER DEFAULT 0,
  article_status TEXT CHECK (article_status IN ('draft', 'active', 'in_progress', 'success', 'partial_success', 'expired')) DEFAULT 'active',
  success_headline TEXT,
  success_text TEXT,
  success_stats JSONB,
  success_published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  contact_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  meta_description TEXT,
  social_image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_articles_category_slug ON news_articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_news_articles_urgency_level ON news_articles(urgency_level);
CREATE INDEX IF NOT EXISTS idx_news_articles_article_status ON news_articles(article_status);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_sort_weight ON news_articles(sort_weight DESC);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE news_articles 
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment contact count
CREATE OR REPLACE FUNCTION increment_contact_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE news_articles 
  SET contact_count = contact_count + 1,
      updated_at = NOW()
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
CREATE TRIGGER update_news_articles_updated_at 
    BEFORE UPDATE ON news_articles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample news articles
INSERT INTO news_articles (
  id, mission_id, headline, preview_text, full_text, author_name, 
  author_avatar_url, publication_name, urgency_level, impact_stats, 
  location, category_slug, tags, grid_size, sort_weight
) VALUES 
(
  gen_random_uuid(),
  'mission_1',
  'Community Health Initiative Needs Tech Help',
  'Local health organization needs system design support for patient tracking',
  'A community health organization is looking for help with building a patient tracking system to serve 5000+ community members.',
  'Dr. Sarah Johnson',
  '👩‍⚕️',
  'Community Health Network',
  'high',
  '{"people": 5000, "metric": "patients served"}',
  'Seattle, WA',
  'healthcare',
  '{"healthcare", "databases", "privacy", "api"}',
  'medium',
  100
),
(
  gen_random_uuid(),
  'mission_2',
  'School District Database Crisis',
  'Student information system failing during enrollment period',
  'The local school district needs urgent help with their student information system that is crashing during peak enrollment.',
  'Maria Rodriguez',
  '👩‍🏫',
  'Metro School District',
  'critical',
  '{"people": 15000, "metric": "students affected"}',
  'Portland, OR',
  'education',
  '{"education", "databases", "scalability", "crisis"}',
  'large',
  200
),
(
  gen_random_uuid(),
  'mission_3',
  'Environmental Monitoring Project',
  'Sensor network needs data processing pipeline',
  'Environmental advocacy group needs help building a data processing pipeline for their sensor network monitoring air quality.',
  'James Chen',
  '🌱',
  'Green Future Coalition',
  'medium',
  '{"people": 2000, "metric": "community members"}',
  'San Francisco, CA',
  'environment',
  '{"environment", "iot", "data-processing", "real-time"}',
  'medium',
  80
),
(
  gen_random_uuid(),
  'mission_4',
  'Small Business Inventory Crisis',
  'Local business needs inventory management system',
  'A growing small business needs help with their inventory management system that cannot keep up with their expansion.',
  'Lisa Thompson',
  '🏪',
  'Thompson Hardware',
  'high',
  '{"people": 50, "metric": "employees"}',
  'Austin, TX',
  'small-business',
  '{"small-business", "inventory", "scaling", "ecommerce"}',
  'small',
  60
),
(
  gen_random_uuid(),
  'mission_5',
  'Community Center Tech Upgrade',
  'Non-profit needs volunteer management platform',
  'A community center serving underserved populations needs a volunteer management and event coordination platform.',
  'Marcus Washington',
  '🏘️',
  'Unity Community Center',
  'medium',
  '{"people": 1200, "metric": "community members served"}',
  'Detroit, MI',
  'community',
  '{"community", "non-profit", "volunteer-management", "events"}',
  'medium',
  70
)
ON CONFLICT (id) DO NOTHING; 