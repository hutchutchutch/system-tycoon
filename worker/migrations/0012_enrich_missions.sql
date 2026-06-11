-- Migration: Enrich missions for the social-feed / NPC-chat flow
-- Adds the narrative + discovery fields the revived feature expects, then backfills
-- all six seeded missions. (mission_stages.initial_system_state already exists from 0009.)

ALTER TABLE missions ADD COLUMN tagline TEXT;
ALTER TABLE missions ADD COLUMN emotional_hook TEXT;
ALTER TABLE missions ADD COLUMN difficulty INTEGER DEFAULT 1;
ALTER TABLE missions ADD COLUMN tech_tags TEXT DEFAULT '[]';            -- JSON array
ALTER TABLE missions ADD COLUMN estimated_duration_minutes INTEGER DEFAULT 30;
ALTER TABLE missions ADD COLUMN min_level INTEGER DEFAULT 1;

-- ------------------------------------------------------------
-- Backfill (ids from 0002 / 0008)
-- ------------------------------------------------------------
UPDATE missions SET
  tagline = 'Save 200+ families'' health data before the next crash',
  emotional_hook = 'Emma and 200+ neighborhood kids are counting on this data to prove what''s making them sick.',
  difficulty = 1,
  tech_tags = '["healthcare","database","reliability","data-integrity"]',
  estimated_duration_minutes = 30,
  min_level = 1
WHERE id = '550e8400-e29b-41d4-a716-446655440000'; -- health-tracker-crisis

UPDATE missions SET
  tagline = 'Document an outbreak before the evidence is lost',
  emotional_hook = 'Parents are racing to document symptoms and prove environmental contamination — and the site keeps losing their data.',
  difficulty = 1,
  tech_tags = '["healthcare","database","reliability"]',
  estimated_duration_minutes = 30,
  min_level = 1
WHERE id = '660e8400-e29b-41d4-a716-446655440001'; -- outbreak-documentation-site

UPDATE missions SET
  tagline = 'Keep 15,000 students enrolled when the SIS buckles',
  emotional_hook = 'During peak enrollment, 15,000 students across three campuses can''t register and families have lost their kids'' records.',
  difficulty = 2,
  tech_tags = '["database","scaling","reliability","education"]',
  estimated_duration_minutes = 45,
  min_level = 2
WHERE id = '770e8400-e29b-41d4-a716-446655440002'; -- school-district-crisis

UPDATE missions SET
  tagline = 'Turn raw sensor data into proof of contamination',
  emotional_hook = 'Air quality sensors produce data nobody can process in time — while neighborhood kids'' asthma rates keep climbing.',
  difficulty = 3,
  tech_tags = '["data-pipeline","real-time","analytics","iot"]',
  estimated_duration_minutes = 45,
  min_level = 2
WHERE id = '880e8400-e29b-41d4-a716-446655440003'; -- environmental-monitoring

UPDATE missions SET
  tagline = 'Modernize a 40-year family business for e-commerce',
  emotional_hook = 'Wrong inventory counts and late orders are pushing a 40-year family hardware store toward closing for good.',
  difficulty = 2,
  tech_tags = '["e-commerce","inventory","database","payments"]',
  estimated_duration_minutes = 45,
  min_level = 3
WHERE id = '990e8400-e29b-41d4-a716-446655440004'; -- inventory-crisis

UPDATE missions SET
  tagline = 'Replace paper systems for 1,200 community members',
  emotional_hook = 'Paper sign-ups and a whiteboard mean volunteers slip through the cracks — and 200+ kids depend on this center after school.',
  difficulty = 2,
  tech_tags = '["scheduling","notifications","database","coordination"]',
  estimated_duration_minutes = 40,
  min_level = 2
WHERE id = 'aa0e8400-e29b-41d4-a716-446655440005'; -- community-center-upgrade
