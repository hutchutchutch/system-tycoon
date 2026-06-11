-- Migration: Re-key stage_complete emails to the stage they brief
--
-- Each `*-sK-complete` / `*-stageK-complete` email is delivered when stage K
-- completes, but its body is the BRIEF for stage K+1. The Whiteboard resolves
-- its stage from email.stage_id (see fetchMissionStageFromEmail), so these
-- emails must point at the NEXT stage — otherwise "Open Whiteboard" reloads
-- the stage the user just finished. Same bug class 0010 fixed for start emails.
--
-- Delivery convention after this migration:
--   on completing stage N → deliver emails WHERE stage_id = stage(N+1).id
--                            AND trigger_type = 'stage_complete'
--   on completing the final stage → deliver emails WHERE mission_id = ?
--                            AND trigger_type = 'mission_complete'

-- ============================================================
-- Mission 1: health-tracker-crisis (UUID stage ids)
-- ============================================================
UPDATE mission_emails SET stage_id = 'a1b2c3d4-1111-4111-a111-111111111112'
WHERE id = 'email-stage1-complete';

UPDATE mission_emails SET stage_id = 'a1b2c3d4-2222-4222-a222-222222222223'
WHERE id = 'email-stage2-complete';

UPDATE mission_emails SET stage_id = 'a1b2c3d4-3333-4333-a333-333333333334'
WHERE id = 'email-stage3-complete';

UPDATE mission_emails SET stage_id = 'a1b2c3d4-4444-4444-a444-444444444445'
WHERE id = 'email-stage4-complete';

-- ============================================================
-- Mission 2: school enrollment
-- ============================================================
UPDATE mission_emails SET stage_id = 'stage-m2-002' WHERE id = 'email-m2-s1-complete';
UPDATE mission_emails SET stage_id = 'stage-m2-003' WHERE id = 'email-m2-s2-complete';
UPDATE mission_emails SET stage_id = 'stage-m2-004' WHERE id = 'email-m2-s3-complete';
UPDATE mission_emails SET stage_id = 'stage-m2-005' WHERE id = 'email-m2-s4-complete';

-- ============================================================
-- Mission 3
-- ============================================================
UPDATE mission_emails SET stage_id = 'stage-m3-002' WHERE id = 'email-m3-s1-complete';
UPDATE mission_emails SET stage_id = 'stage-m3-003' WHERE id = 'email-m3-s2-complete';
UPDATE mission_emails SET stage_id = 'stage-m3-004' WHERE id = 'email-m3-s3-complete';
UPDATE mission_emails SET stage_id = 'stage-m3-005' WHERE id = 'email-m3-s4-complete';

-- ============================================================
-- Mission 4
-- ============================================================
UPDATE mission_emails SET stage_id = 'stage-m4-002' WHERE id = 'email-m4-s1-complete';
UPDATE mission_emails SET stage_id = 'stage-m4-003' WHERE id = 'email-m4-s2-complete';
UPDATE mission_emails SET stage_id = 'stage-m4-004' WHERE id = 'email-m4-s3-complete';
UPDATE mission_emails SET stage_id = 'stage-m4-005' WHERE id = 'email-m4-s4-complete';

-- ============================================================
-- Mission 5
-- ============================================================
UPDATE mission_emails SET stage_id = 'stage-m5-002' WHERE id = 'email-m5-s1-complete';
UPDATE mission_emails SET stage_id = 'stage-m5-003' WHERE id = 'email-m5-s2-complete';
UPDATE mission_emails SET stage_id = 'stage-m5-004' WHERE id = 'email-m5-s3-complete';
UPDATE mission_emails SET stage_id = 'stage-m5-005' WHERE id = 'email-m5-s4-complete';

-- ============================================================
-- Normalize mission-complete emails to trigger_type='mission_complete'
-- (mission 1's email-mission-complete already uses it; m2–m5 were seeded
-- as 'stage_complete' with NULL stage_id, which the delivery query above
-- would never match)
-- ============================================================
UPDATE mission_emails SET trigger_type = 'mission_complete'
WHERE id IN ('email-m2-complete', 'email-m3-complete', 'email-m4-complete', 'email-m5-complete');
