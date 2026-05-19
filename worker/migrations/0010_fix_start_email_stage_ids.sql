-- Migration: Link mission start emails to their stage 1
-- The *-start emails were seeded without a stage_id because they represent
-- the initial client contact. The Whiteboard uses stage_id to load the
-- correct mission stage, so point each start email at stage 1.

UPDATE mission_emails SET stage_id = 'stage-m2-001', trigger_type = 'mission_start'
WHERE id = 'email-m2-start';

UPDATE mission_emails SET stage_id = 'stage-m3-001', trigger_type = 'mission_start'
WHERE id = 'email-m3-start';

UPDATE mission_emails SET stage_id = 'stage-m4-001', trigger_type = 'mission_start'
WHERE id = 'email-m4-start';

UPDATE mission_emails SET stage_id = 'stage-m5-001', trigger_type = 'mission_start'
WHERE id = 'email-m5-start';

-- Mission 1 start email (health-tracker-crisis) — check and fix if present
UPDATE mission_emails SET stage_id = 'bcd0760f-c920-44e8-b658-1674341ea1d8', trigger_type = 'mission_start'
WHERE mission_id = '550e8400-e29b-41d4-a716-446655440000'
  AND stage_id IS NULL
  AND trigger_type IN ('mission_start', 'manual');
