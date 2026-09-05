-- Durable per-stage drafts and immutable accepted designs.
CREATE TABLE canvas_drafts (
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  stage_id TEXT NOT NULL REFERENCES mission_stages(id) ON DELETE CASCADE,
  canvas_state TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, stage_id)
);
INSERT OR IGNORE INTO canvas_drafts (user_id, stage_id, canvas_state, revision, updated_at)
SELECT user_id, current_stage_id, canvas_state, 0, COALESCE(updated_at, datetime('now'))
FROM user_mission_progress WHERE current_stage_id IS NOT NULL AND canvas_state IS NOT NULL;
ALTER TABLE mission_stage_completions ADD COLUMN accepted_canvas TEXT;
ALTER TABLE mission_stage_completions ADD COLUMN validation_result TEXT;

-- Match catalog identity, not cosmetic labels or interchangeable categories.
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["web_server"],"min_instances":1}' WHERE id = 'req-s1-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["database"],"min_instances":1}' WHERE id = 'req-s1-002';
UPDATE mission_stage_requirements SET validation_config = '{"target_components":["web_server"],"source_types":["client"]}' WHERE id = 'req-s1-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["web_server"],"target_components":["database"]}' WHERE id = 'req-s1-004';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["backup"],"min_instances":1}' WHERE id = 'req-s2-001';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["database"],"target_components":["backup"]}' WHERE id = 'req-s2-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["web_server","database"],"min_instances":1}' WHERE id = 'req-s2-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["load_balancer"],"min_instances":1}' WHERE id = 'req-s3-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["cache"],"min_instances":1}' WHERE id = 'req-s3-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["load_balancer"],"target_components":["web_server"]}' WHERE id = 'req-s3-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["cache"],"target_components":["database"]}' WHERE id = 'req-s3-004';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["auth_service"],"min_instances":1}' WHERE id = 'req-s4-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["firewall"],"min_instances":1}' WHERE id = 'req-s4-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["logging"],"min_instances":1}' WHERE id = 'req-s4-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["monitoring"],"min_instances":1}' WHERE id = 'req-s5-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["cdn"],"min_instances":1}' WHERE id = 'req-s5-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["api_gateway"],"min_instances":1}' WHERE id = 'req-s5-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["web_server"],"min_instances":1}' WHERE id = 'req-m2-s1-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["app_server"],"min_instances":1}' WHERE id = 'req-m2-s1-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["database"],"min_instances":1}' WHERE id = 'req-m2-s1-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["web_server"],"target_components":["database"]}' WHERE id = 'req-m2-s1-004';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["cache"],"min_instances":1}' WHERE id = 'req-m2-s2-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["worker"],"min_instances":1}' WHERE id = 'req-m2-s2-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["load_balancer"],"min_instances":1}' WHERE id = 'req-m2-s2-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["load_balancer"],"target_components":["web_server"]}' WHERE id = 'req-m2-s2-004';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["database"],"min_instances":1,"max_instances":1}' WHERE id = 'req-m2-s3-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["app_server"],"min_instances":1}' WHERE id = 'req-m2-s3-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["app_server"],"target_components":["database"]}' WHERE id = 'req-m2-s3-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["monitoring"],"min_instances":1}' WHERE id = 'req-m2-s4-001';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["monitoring"],"target_components":["web_server"]}' WHERE id = 'req-m2-s4-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["web_server","database"],"min_instances":1}' WHERE id = 'req-m2-s4-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["load_balancer"],"min_instances":1}' WHERE id = 'req-m2-s5-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["cdn"],"min_instances":1}' WHERE id = 'req-m2-s5-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["monitoring"],"min_instances":1}' WHERE id = 'req-m2-s5-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["cdn"],"target_components":["web_server"]}' WHERE id = 'req-m2-s5-004';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["web_server"],"min_instances":1}' WHERE id = 'req-m3-s1-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["worker"],"min_instances":1}' WHERE id = 'req-m3-s1-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["database"],"min_instances":1}' WHERE id = 'req-m3-s1-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["worker"],"target_components":["database"]}' WHERE id = 'req-m3-s1-004';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["app_server"],"min_instances":1}' WHERE id = 'req-m3-s2-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["cache"],"min_instances":1}' WHERE id = 'req-m3-s2-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["app_server"],"target_components":["cache"]}' WHERE id = 'req-m3-s2-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["object_storage"],"min_instances":1}' WHERE id = 'req-m3-s3-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["backup"],"min_instances":1}' WHERE id = 'req-m3-s3-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["database"],"target_components":["object_storage"]}' WHERE id = 'req-m3-s3-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["database"],"target_components":["backup"]}' WHERE id = 'req-m3-s3-004';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["api_gateway"],"min_instances":1}' WHERE id = 'req-m3-s4-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["cache"],"min_instances":1}' WHERE id = 'req-m3-s4-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["api_gateway"],"target_components":["app_server"]}' WHERE id = 'req-m3-s4-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["logging"],"min_instances":1}' WHERE id = 'req-m3-s5-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["auth_service"],"min_instances":1}' WHERE id = 'req-m3-s5-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["firewall"],"min_instances":1}' WHERE id = 'req-m3-s5-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["logging"],"target_components":["database"]}' WHERE id = 'req-m3-s5-004';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["web_server"],"min_instances":1}' WHERE id = 'req-m4-s1-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["database"],"min_instances":1}' WHERE id = 'req-m4-s1-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["web_server"],"target_components":["database"]}' WHERE id = 'req-m4-s1-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["app_server"],"min_instances":1}' WHERE id = 'req-m4-s2-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["cache"],"min_instances":1}' WHERE id = 'req-m4-s2-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["app_server"],"target_components":["database"]}' WHERE id = 'req-m4-s2-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["worker"],"min_instances":1}' WHERE id = 'req-m4-s3-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["monitoring"],"min_instances":1}' WHERE id = 'req-m4-s3-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["worker"],"target_components":["database"]}' WHERE id = 'req-m4-s3-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["load_balancer"],"min_instances":1}' WHERE id = 'req-m4-s4-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["worker"],"min_instances":1}' WHERE id = 'req-m4-s4-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["cache"],"min_instances":1}' WHERE id = 'req-m4-s4-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["load_balancer"],"target_components":["web_server"]}' WHERE id = 'req-m4-s4-004';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["api_gateway"],"min_instances":1}' WHERE id = 'req-m4-s5-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["auth_service"],"min_instances":1}' WHERE id = 'req-m4-s5-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["api_gateway"],"target_components":["app_server"]}' WHERE id = 'req-m4-s5-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["web_server"],"min_instances":1}' WHERE id = 'req-m5-s1-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["database"],"min_instances":1}' WHERE id = 'req-m5-s1-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["web_server"],"target_components":["database"]}' WHERE id = 'req-m5-s1-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["app_server"],"min_instances":1}' WHERE id = 'req-m5-s2-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["cache"],"min_instances":1}' WHERE id = 'req-m5-s2-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["app_server"],"target_components":["database"]}' WHERE id = 'req-m5-s2-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["worker"],"min_instances":1}' WHERE id = 'req-m5-s3-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["app_server"],"min_instances":1}' WHERE id = 'req-m5-s3-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["worker"],"target_components":["app_server"]}' WHERE id = 'req-m5-s3-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["monitoring"],"min_instances":1}' WHERE id = 'req-m5-s4-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["app_server"],"min_instances":1}' WHERE id = 'req-m5-s4-002';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["monitoring"],"target_components":["database"]}' WHERE id = 'req-m5-s4-003';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["api_gateway"],"min_instances":1}' WHERE id = 'req-m5-s5-001';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["auth_service"],"min_instances":1}' WHERE id = 'req-m5-s5-002';
UPDATE mission_stage_requirements SET validation_config = '{"component_ids":["load_balancer"],"min_instances":1}' WHERE id = 'req-m5-s5-003';
UPDATE mission_stage_requirements SET validation_config = '{"source_components":["api_gateway"],"target_components":["app_server"]}' WHERE id = 'req-m5-s5-004';

-- Every stage builds on a working client-to-database path.
INSERT INTO mission_stage_requirements (id,stage_id,title,description,requirement_type,validation_config,points,unlock_order,hint)
SELECT 'path-' || id,id,'Keep users connected to data','Maintain a directed path from users to the database.','path_required',
'{"source_types":["client"],"target_components":["database"]}',0,90,'Connect Users → Web Server → Database; intermediate services may sit on that path.'
FROM mission_stages;
INSERT INTO mission_stage_requirements (id,stage_id,title,description,requirement_type,validation_config,points,unlock_order,hint)
SELECT 'replace-' || id,id,'Retire the broken system','Remove the original failed system after replacing it.','remove_broken','{}',0,91,
'Select the broken starting component and delete it after connecting its replacement.'
FROM mission_stages WHERE stage_number=1;
INSERT INTO mission_stage_requirements (id,stage_id,title,description,requirement_type,validation_config,points,unlock_order,hint)
SELECT 'budget-' || id,id,'Stay within the stage budget','Keep the monthly game cost within the budget.','cost_constraint',
json_object('max_monthly_cost',CASE stage_number WHEN 3 THEN 550 WHEN 4 THEN 750 ELSE 900 END),0,92,
'Remove unused infrastructure or choose fewer instances while preserving the required paths.'
FROM mission_stages WHERE stage_number>=3;
UPDATE user SET current_level = 1 + CAST(MAX(0,reputation_score) / 250 AS INTEGER);

-- A disconnected security/cache/monitoring box is not an integrated design.
INSERT INTO mission_stage_requirements (id,stage_id,title,description,requirement_type,validation_config,points,unlock_order,hint)
SELECT 'connected-' || id,id,'Integrate every working component','Connect all working infrastructure into the same system as the traffic source.',
'connected_system','{}',0,93,'Connect isolated components to the system. Monitoring and logging connections may point toward the services they observe.'
FROM mission_stages;

-- Teach real instance identity: one load balancer must connect to two distinct replicas.
INSERT INTO mission_stage_requirements (id,stage_id,title,description,requirement_type,validation_config,points,unlock_order,hint)
SELECT 'replicas-' || ms.id,ms.id,'Balance across two web server instances','Connect a load balancer to two separate web server nodes.',
'fanout_required','{"source_components":["load_balancer"],"target_components":["web_server"],"min_instances":2}',0,94,
'Place a second Web Server, then draw a directed edge from the same Load Balancer to each Web Server.'
FROM mission_stages ms JOIN missions m ON m.id=ms.mission_id
WHERE (m.slug='health-tracker-crisis' AND ms.stage_number=3)
   OR (m.slug='school-district-crisis' AND ms.stage_number=5)
   OR (m.slug='inventory-crisis' AND ms.stage_number=4)
   OR (m.slug='community-center-upgrade' AND ms.stage_number=5);
