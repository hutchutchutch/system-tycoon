-- One progress row per user and mission. Keep the most recently updated row if
-- pre-MVP data contains duplicates created under the old stage-scoped key.
DELETE FROM user_mission_progress
WHERE EXISTS (
  SELECT 1
  FROM user_mission_progress AS newer
  WHERE newer.user_id = user_mission_progress.user_id
    AND newer.mission_id = user_mission_progress.mission_id
    AND (
      COALESCE(newer.updated_at, '') > COALESCE(user_mission_progress.updated_at, '')
      OR (
        COALESCE(newer.updated_at, '') = COALESCE(user_mission_progress.updated_at, '')
        AND newer.rowid > user_mission_progress.rowid
      )
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_mission_progress_user_mission
  ON user_mission_progress(user_id, mission_id);

-- Durable record of accepted completion commands. The stage key prevents two
-- concurrent requests with different idempotency keys from awarding twice.
CREATE TABLE IF NOT EXISTS mission_stage_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  stage_id TEXT NOT NULL REFERENCES mission_stages(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  next_stage_id TEXT REFERENCES mission_stages(id),
  mission_completed INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT NOT NULL,
  UNIQUE(user_id, stage_id),
  UNIQUE(user_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_mission_stage_completions_user
  ON mission_stage_completions(user_id, completed_at);
