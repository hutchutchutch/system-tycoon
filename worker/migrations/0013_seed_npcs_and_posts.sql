-- Migration: Seed NPCs + social feed posts
-- NPCs are the mission "clients". Each help_request post links to one of main's six
-- real seeded missions so accepting an offer creates a project against a real mission/stage.
-- Idempotent: fixed TEXT ids + INSERT OR IGNORE.

-- ============================================================
-- NPCs
-- ============================================================
INSERT OR IGNORE INTO npcs (id, name, handle, company, role, bio, follower_count, verified, difficulty_modifier, unlock_level, personality) VALUES
  ('npc-alex-chen', 'Alex Chen', 'alexchenhealth', 'Community Health Initiative', 'nonprofit_director',
   'Parent fighting for answers. Building tech to track environmental health impacts. My daughter Emma and 200+ neighborhood kids are counting on this data.',
   4200, 0, 0.8, 1,
   '{"style":"urgent","patience":"high","technical_depth":"low","backstory":"Software engineer turned activist after discovering contamination in the neighborhood"}'),

  ('npc-maya-rivera', 'Maya Rivera', 'mayaenviro', 'Green Future Alliance', 'nonprofit_director',
   'Environmental activist. Turning raw sensor readings into proof so a polluting factory can finally be held accountable.',
   8900, 1, 1.0, 2,
   '{"style":"passionate","patience":"medium","technical_depth":"low","backstory":"Former journalist who quit to fight the local contamination crisis full-time"}'),

  ('npc-lisa-park', 'Lisa Park', 'lisateachertech', 'Educators United Network', 'nonprofit_director',
   'Fighting budget cuts with collaboration. When the student system goes down, 15,000 kids can''t enroll. We can''t wait.',
   5300, 1, 0.9, 2,
   '{"style":"organized","patience":"medium","technical_depth":"low","backstory":"10-year veteran educator who organizes teachers and IT staff across the district"}'),

  ('npc-marcus-thompson', 'Marcus Thompson', 'marcuslocalbiz', 'Main Street Coalition', 'startup_founder',
   'Coffee shop owner turned community organizer. Helping a 40-year family hardware store modernize before the big-box stores win.',
   6700, 1, 1.1, 3,
   '{"style":"practical","patience":"medium","technical_depth":"medium","backstory":"Third-generation business owner fighting to keep Main Street alive through cooperation"}'),

  ('npc-eleanor-wright', 'Eleanor Wright', 'eleanorcommunity', 'Riverside Community Center', 'nonprofit_director',
   'Retired teacher, 40 years in education. Our community center still runs on paper sign-ups and a whiteboard — and 1,200 members deserve better.',
   2100, 0, 0.7, 2,
   '{"style":"warm","patience":"high","technical_depth":"low","backstory":"After retiring, found purpose keeping a community center the neighborhood depends on running"}'),

  ('npc-marcus-arch', 'Marcus Williams', 'marcus_arch', 'Enterprise Solutions Inc', 'enterprise_cto',
   'CTO @ ESI. 20+ years in distributed systems. I do pro bono architecture reviews for nonprofits.',
   45200, 1, 1.2, 3,
   '{"style":"formal","patience":"medium","technical_depth":"high"}');

-- ============================================================
-- Help-request posts (each linked to a real mission)
-- ============================================================
INSERT OR IGNORE INTO social_feed_posts
  (id, npc_id, content, post_type, mission_id, difficulty_hint, tech_tags, budget_range, urgency) VALUES
  ('post-health-tracker', 'npc-alex-chen',
   'Hey everyone. I don''t usually ask for help like this, but I''m desperate. My daughter Emma and 200+ families rely on a health tracker I built — and it crashes every few hours with no backups. We''ve lost data twice this week. Is anyone willing to help design something that won''t lose our children''s health records? #healthcare #systemdesign',
   'help_request', '550e8400-e29b-41d4-a716-446655440000', 'beginner',
   '["healthcare","database","reliability","data-integrity"]', '$5K-$15K', 'critical'),

  ('post-outbreak-docs', 'npc-alex-chen',
   'A mysterious illness is affecting kids in our neighborhood. Parents are documenting symptoms to find a pattern and prove contamination — but the site keeps falling over and losing entries. An environmental lawyer says this data matters. Can a system architect help us make it reliable? #healthcare #help',
   'help_request', '660e8400-e29b-41d4-a716-446655440001', 'beginner',
   '["healthcare","database","reliability"]', '$5K-$15K', 'critical'),

  ('post-school-district', 'npc-lisa-park',
   'Our student information system crashes during peak enrollment. 15,000 students across three campuses can''t register, schedules break, and families who moved have no records. Budget is tight but kids can''t wait. Anyone able to help us design something that scales? #education #systemdesign',
   'help_request', '770e8400-e29b-41d4-a716-446655440002', 'intermediate',
   '["database","scaling","reliability","education"]', '$15K-$50K', 'high'),

  ('post-environmental', 'npc-maya-rivera',
   'We have air quality sensors all over the city generating data we can''t process in real time — so we can''t prove the factory is polluting while kids'' asthma rates climb. I need someone who can architect a data pipeline that actually keeps up. This is urgent. #data #environment',
   'help_request', '880e8400-e29b-41d4-a716-446655440003', 'advanced',
   '["data-pipeline","real-time","analytics","iot"]', '$50K-$100K', 'high'),

  ('post-inventory', 'npc-marcus-thompson',
   'A 40-year family hardware store is expanding to e-commerce, but inventory counts are wrong, orders ship late, and they''re losing customers to big-box stores. We''re bakers and mechanics, not tech companies. Anyone design inventory + order systems for small business? #ecommerce #smallbiz',
   'help_request', '990e8400-e29b-41d4-a716-446655440004', 'intermediate',
   '["e-commerce","inventory","database","payments"]', '$15K-$50K', 'medium'),

  ('post-community-center', 'npc-eleanor-wright',
   'I never expected to need tech help at 72! Our community center serves 1,200 members on paper sign-ups, phone trees, and a whiteboard. Volunteers slip through the cracks and events get double-booked — and 200+ kids depend on us after school. Can someone help this old teacher? I''ll make cookies. #community',
   'help_request', 'aa0e8400-e29b-41d4-a716-446655440005', 'intermediate',
   '["scheduling","notifications","database","coordination"]', '$10K-$30K', 'medium');

-- ============================================================
-- Non-mission posts for feed variety
-- ============================================================
INSERT OR IGNORE INTO social_feed_posts (id, npc_id, content, post_type, tech_tags) VALUES
  ('post-tip-nonprofit', 'npc-alex-chen',
   'Quick tip for anyone building systems for nonprofits: start with reliability over features, plan for 10x growth (viral moments happen), keep costs predictable, and document everything. We learned these the hard way.',
   'tip', '["architecture","nonprofits","best-practices"]'),

  ('post-success-health', 'npc-alex-chen',
   'UPDATE: someone from this community helped us redesign our health tracker. Zero data loss in 3 months, handles 1000+ concurrent users, and the city council finally took our data seriously — an investigation has started! Tech really can change lives.',
   'success_story', '["success","healthcare","community"]'),

  ('post-tip-arch', 'npc-marcus-arch',
   'Seeing a lot of failing-system posts lately. The pattern is always the same: single point of failure, no monitoring until it''s too late, scaling as an afterthought, no backup strategy. These are fundamentals, not advanced concepts. DM me — I do pro bono reviews for nonprofits.',
   'tip', '["architecture","reliability","fundamentals"]');
