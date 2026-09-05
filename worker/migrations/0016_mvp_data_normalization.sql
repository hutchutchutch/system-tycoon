-- Normalize the original frontend mentor identifier to the canonical seeded ID.
UPDATE user
SET preferred_mentor_id = 'dr-linda-wu'
WHERE preferred_mentor_id = 'linda-wu';

CREATE INDEX IF NOT EXISTS idx_user_mission_progress_current_stage
  ON user_mission_progress(user_id, current_stage_id);
