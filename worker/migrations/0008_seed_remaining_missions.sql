-- Migration: Seed remaining 4 missions with full content
-- Missions: School District Crisis, Environmental Monitoring, Inventory Crisis, Community Center Upgrade
-- Includes: Mission records, 5 stages each, stage requirements, story-progression emails,
--           and news article linkage fixes.
-- All inserts are idempotent (INSERT OR REPLACE / INSERT OR IGNORE).

-- ============================================================
-- 1. MISSIONS
-- ============================================================

INSERT OR REPLACE INTO missions (id, slug, title, description, crisis_description) VALUES
  ('770e8400-e29b-41d4-a716-446655440002', 'school-district-crisis',
   'School District Database Crisis',
   'Help an IT coordinator save a student information system serving 15,000 students',
   'Student information system crashes during peak enrollment. 15,000 students across three campuses affected. Without this system, students can''t enroll, class schedules don''t work, and families who moved across town have no records of their children''s previous school.'),

  ('880e8400-e29b-41d4-a716-446655440003', 'environmental-monitoring',
   'Environmental Monitoring Project',
   'Help a volunteer engineer build a data pipeline to prove factory contamination',
   'Air quality sensors across the city generate data but can''t process it in real-time. Without analysis, they can''t prove the factory is polluting. Children in the neighborhood have rising asthma rates.'),

  ('990e8400-e29b-41d4-a716-446655440004', 'inventory-crisis',
   'Small Business Inventory Crisis',
   'Help a hardware store owner modernize inventory management for e-commerce expansion',
   'A 50-employee hardware store expanding to e-commerce. Inventory counts are wrong, orders ship late, and they''re losing customers to big-box stores. A family business built over 40 years is at stake.'),

  ('aa0e8400-e29b-41d4-a716-446655440005', 'community-center-upgrade',
   'Community Center Tech Upgrade',
   'Help a community center director replace paper-based systems serving 1,200 members',
   'A community center serving 1,200 members uses paper sign-ups, phone trees, and a whiteboard for scheduling. Volunteers fall through the cracks, events are double-booked, and 200+ kids depend on this center as their only safe after-school space.');


-- ============================================================
-- 2. MISSION STAGES
-- ============================================================

-- ----- School District Crisis (770e8400-e29b-41d4-a716-446655440002) -----
INSERT OR REPLACE INTO mission_stages (id, mission_id, stage_number, title, problem_description, required_components, created_at, updated_at) VALUES
  ('stage-m2-001', '770e8400-e29b-41d4-a716-446655440002', 1,
   'Emergency Triage',
   'The monolithic student information app runs enrollment, grade books, and student records all in one tangled codebase on a single server. When enrollment traffic spikes, the whole system crashes -- including grade lookups that teachers rely on. Separate the enrollment system from the rest.',
   '[{"id": "web_server", "name": "Web Server", "category": "compute"}, {"id": "app_server", "name": "Application Server", "category": "compute"}, {"id": "database", "name": "SQL Database", "category": "database"}]',
   datetime('now'), datetime('now')),

  ('stage-m2-002', '770e8400-e29b-41d4-a716-446655440002', 2,
   'Survive Enrollment Week',
   '3,000 families are trying to enroll in 5 days. The enrollment server collapses under load -- pages time out, forms lose data mid-submission, and parents are driving to schools in person to enroll on paper. Add caching and a queue to handle the burst.',
   '[{"id": "cache", "name": "In-Memory Cache", "category": "cache"}, {"id": "worker", "name": "Background Worker", "category": "compute"}, {"id": "load_balancer", "name": "Load Balancer", "category": "networking"}]',
   datetime('now'), datetime('now')),

  ('stage-m2-003', '770e8400-e29b-41d4-a716-446655440002', 3,
   'One Source of Truth',
   'Three campuses have different student records that conflict. A student who transferred from Lincoln Elementary shows up as "enrolled" at Lincoln and "waitlisted" at Jefferson. Consolidate into a single database with proper schema and data normalization.',
   '[{"id": "database", "name": "SQL Database", "category": "database"}, {"id": "app_server", "name": "Application Server", "category": "compute"}]',
   datetime('now'), datetime('now')),

  ('stage-m2-004', '770e8400-e29b-41d4-a716-446655440002', 4,
   'Keep the Lights On',
   'The superintendent saw the cloud bill: $1,400/month for a district that budgeted $500. The system needs to cost less. Optimize with right-sizing, serverless where possible, and eliminating waste.',
   '[{"id": "monitoring", "name": "Monitoring", "category": "observability"}, {"id": "app_server", "name": "Application Server", "category": "compute"}]',
   datetime('now'), datetime('now')),

  ('stage-m2-005', '770e8400-e29b-41d4-a716-446655440002', 5,
   'Back to School Ready',
   'Fall enrollment is 3 months away and projected at 50,000 concurrent users across expanded districts. The system needs horizontal scaling, load testing, and capacity planning to handle opening day without a meltdown.',
   '[{"id": "load_balancer", "name": "Load Balancer", "category": "networking"}, {"id": "cdn", "name": "CDN", "category": "networking"}, {"id": "monitoring", "name": "Monitoring", "category": "observability"}, {"id": "cache", "name": "In-Memory Cache", "category": "cache"}]',
   datetime('now'), datetime('now'));


-- ----- Environmental Monitoring (880e8400-e29b-41d4-a716-446655440003) -----
INSERT OR REPLACE INTO mission_stages (id, mission_id, stage_number, title, problem_description, required_components, created_at, updated_at) VALUES
  ('stage-m3-001', '880e8400-e29b-41d4-a716-446655440003', 1,
   'Collect the Evidence',
   '50 IoT air quality sensors send readings every 30 seconds, but 70% of readings are dropped. The single-threaded ingestion script can''t keep up. Build a reliable data ingestion pipeline that doesn''t lose a single reading.',
   '[{"id": "web_server", "name": "Web Server", "category": "compute"}, {"id": "worker", "name": "Background Worker", "category": "compute"}, {"id": "database", "name": "SQL Database", "category": "database"}]',
   datetime('now'), datetime('now')),

  ('stage-m3-002', '880e8400-e29b-41d4-a716-446655440003', 2,
   'Process in Real-Time',
   'Raw sensor data is just numbers -- voltage readings, temperature offsets, humidity percentages. Transform and aggregate readings into hourly and daily air quality averages, and flag anomalies when readings spike above safe thresholds.',
   '[{"id": "app_server", "name": "Application Server", "category": "compute"}, {"id": "worker", "name": "Background Worker", "category": "compute"}, {"id": "cache", "name": "In-Memory Cache", "category": "cache"}]',
   datetime('now'), datetime('now')),

  ('stage-m3-003', '880e8400-e29b-41d4-a716-446655440003', 3,
   'Store It Forever',
   'The legal case requires 2 years of historical data. Recent data needs fast queries for dashboards; old data can be slower but must never be deleted. Design hot/warm/cold storage tiers that keep costs manageable.',
   '[{"id": "database", "name": "SQL Database", "category": "database"}, {"id": "object_storage", "name": "Object Storage", "category": "storage"}, {"id": "backup", "name": "Backup Service", "category": "storage"}]',
   datetime('now'), datetime('now')),

  ('stage-m3-004', '880e8400-e29b-41d4-a716-446655440003', 4,
   'Make It Visual',
   'The EPA wants interactive maps and time-series charts, not CSV files emailed weekly. Build an API layer that serves aggregated data to a visualization frontend with proper pagination and filtering.',
   '[{"id": "api_gateway", "name": "API Gateway", "category": "networking"}, {"id": "app_server", "name": "Application Server", "category": "compute"}, {"id": "cache", "name": "In-Memory Cache", "category": "cache"}]',
   datetime('now'), datetime('now')),

  ('stage-m3-005', '880e8400-e29b-41d4-a716-446655440003', 5,
   'Prove It in Court',
   'The legal team needs provably unaltered data with timestamps and chain-of-custody logging. Every reading must be traceable from sensor to database with cryptographic proof it wasn''t tampered with.',
   '[{"id": "logging", "name": "Logging Service", "category": "observability"}, {"id": "auth_service", "name": "Auth Service", "category": "security"}, {"id": "firewall", "name": "Firewall", "category": "security"}]',
   datetime('now'), datetime('now'));


-- ----- Inventory Crisis (990e8400-e29b-41d4-a716-446655440004) -----
INSERT OR REPLACE INTO mission_stages (id, mission_id, stage_number, title, problem_description, required_components, created_at, updated_at) VALUES
  ('stage-m4-001', '990e8400-e29b-41d4-a716-446655440004', 1,
   'Stop the Bleeding',
   'Inventory is tracked in a shared spreadsheet emailed between employees. Two people edited it simultaneously and now the counts are wrong -- the store thinks it has 14 boxes of nails but actually has 3. Build a real database with proper concurrency control.',
   '[{"id": "web_server", "name": "Web Server", "category": "compute"}, {"id": "database", "name": "SQL Database", "category": "database"}]',
   datetime('now'), datetime('now')),

  ('stage-m4-002', '990e8400-e29b-41d4-a716-446655440004', 2,
   'Online and In-Store',
   'Lisa launched an e-commerce site but it has its own inventory count separate from the in-store system. A customer just bought the last drill press online 10 minutes after someone bought it in the store. Unify inventory across both channels.',
   '[{"id": "app_server", "name": "Application Server", "category": "compute"}, {"id": "cache", "name": "In-Memory Cache", "category": "cache"}, {"id": "database", "name": "SQL Database", "category": "database"}]',
   datetime('now'), datetime('now')),

  ('stage-m4-003', '990e8400-e29b-41d4-a716-446655440004', 3,
   'Automate Reordering',
   'Lisa spends 10 hours every week manually checking stock levels and placing orders with suppliers. Items run out before she notices. Automate reordering with background workers that monitor thresholds and trigger purchase orders.',
   '[{"id": "worker", "name": "Background Worker", "category": "compute"}, {"id": "monitoring", "name": "Monitoring", "category": "observability"}]',
   datetime('now'), datetime('now')),

  ('stage-m4-004', '990e8400-e29b-41d4-a716-446655440004', 4,
   'Handle Black Friday',
   'Thompson Hardware is running its first big online sale. Traffic could 10x overnight. The single server that handles both the website and inventory updates will buckle. Add scaling and graceful degradation.',
   '[{"id": "load_balancer", "name": "Load Balancer", "category": "networking"}, {"id": "worker", "name": "Background Worker", "category": "compute"}, {"id": "cache", "name": "In-Memory Cache", "category": "cache"}]',
   datetime('now'), datetime('now')),

  ('stage-m4-005', '990e8400-e29b-41d4-a716-446655440004', 5,
   'Multi-Store Expansion',
   'The business is opening a second location. Inventory, orders, and customer data need to work seamlessly across both stores. A customer should be able to check stock at either location and transfer items between them.',
   '[{"id": "api_gateway", "name": "API Gateway", "category": "networking"}, {"id": "database", "name": "SQL Database", "category": "database"}, {"id": "auth_service", "name": "Auth Service", "category": "security"}]',
   datetime('now'), datetime('now'));


-- ----- Community Center Upgrade (aa0e8400-e29b-41d4-a716-446655440005) -----
INSERT OR REPLACE INTO mission_stages (id, mission_id, stage_number, title, problem_description, required_components, created_at, updated_at) VALUES
  ('stage-m5-001', 'aa0e8400-e29b-41d4-a716-446655440005', 1,
   'Go Digital',
   'Volunteer sign-ups are on paper clipboards that get lost. Last week, a clipboard with 30 volunteer commitments fell behind a filing cabinet and nobody showed up for Saturday''s food drive. Build a digital registration system.',
   '[{"id": "web_server", "name": "Web Server", "category": "compute"}, {"id": "database", "name": "SQL Database", "category": "database"}]',
   datetime('now'), datetime('now')),

  ('stage-m5-002', 'aa0e8400-e29b-41d4-a716-446655440005', 2,
   'Schedule Without Conflicts',
   'The gym is double-booked every Tuesday -- basketball practice and senior yoga at the same time. Volunteer shifts overlap because nobody can see what''s already claimed. Build scheduling with conflict detection and real-time availability.',
   '[{"id": "app_server", "name": "Application Server", "category": "compute"}, {"id": "cache", "name": "In-Memory Cache", "category": "cache"}, {"id": "database", "name": "SQL Database", "category": "database"}]',
   datetime('now'), datetime('now')),

  ('stage-m5-003', 'aa0e8400-e29b-41d4-a716-446655440005', 3,
   'Never Miss a Volunteer',
   'Volunteers sign up but don''t show. Last month, 40% of committed volunteers were no-shows. Nobody sent reminders because the phone tree takes 3 hours. Add automated SMS/email reminders and confirmations.',
   '[{"id": "worker", "name": "Background Worker", "category": "compute"}, {"id": "app_server", "name": "Application Server", "category": "compute"}]',
   datetime('now'), datetime('now')),

  ('stage-m5-004', 'aa0e8400-e29b-41d4-a716-446655440005', 4,
   'Track What Matters',
   'Marcus needs to apply for a $200,000 grant but can''t answer basic questions: How many kids served? Total volunteer hours? Program outcomes? The data exists somewhere in scattered spreadsheets and paper records. Build proper reporting and analytics.',
   '[{"id": "database", "name": "SQL Database", "category": "database"}, {"id": "monitoring", "name": "Monitoring", "category": "observability"}, {"id": "app_server", "name": "Application Server", "category": "compute"}]',
   datetime('now'), datetime('now')),

  ('stage-m5-005', 'aa0e8400-e29b-41d4-a716-446655440005', 5,
   'Serve More Communities',
   'Three nearby centers want the same system. Each has their own programs and volunteers, but some volunteers work at multiple centers. Design it to support multiple locations with shared volunteer pools and role-based access.',
   '[{"id": "api_gateway", "name": "API Gateway", "category": "networking"}, {"id": "auth_service", "name": "Auth Service", "category": "security"}, {"id": "load_balancer", "name": "Load Balancer", "category": "networking"}]',
   datetime('now'), datetime('now'));


-- ============================================================
-- 3. STAGE REQUIREMENTS
-- ============================================================

-- =====================================================
-- SCHOOL DISTRICT CRISIS - Stage Requirements
-- =====================================================

-- ----- Stage 1: Emergency Triage (stage-m2-001) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m2-s1-001', 'stage-m2-001',
   'Add a Web Server',
   'Add a Web Server to handle enrollment requests from families.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 10,
   'Drag a Web Server from the Compute category to serve the enrollment portal',
   datetime('now'), datetime('now')),

  ('req-m2-s1-002', 'stage-m2-001',
   'Add an Application Server',
   'Add a separate Application Server to handle grade book and student record logic independently from enrollment.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 2}',
   1, 2, 1, 15,
   'Separating concerns means different services for different functions -- add an Application Server',
   datetime('now'), datetime('now')),

  ('req-m2-s1-003', 'stage-m2-001',
   'Add a Database',
   'Add a SQL Database to store student records with proper structure.',
   'component_required',
   '{"required_components": ["database"], "min_instances": 1}',
   1, 3, 1, 10,
   'Student data needs a real database, not a file on a shared drive',
   datetime('now'), datetime('now')),

  ('req-m2-s1-004', 'stage-m2-001',
   'Connect server to database',
   'Connect the Web Server to the Database so enrollment data can be stored.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["database"]}',
   2, 4, 1, 20,
   'Draw a connection from the Web Server to the Database',
   datetime('now'), datetime('now'));

-- ----- Stage 2: Survive Enrollment Week (stage-m2-002) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m2-s2-001', 'stage-m2-002',
   'Add a Cache',
   'Add an In-Memory Cache to store frequently accessed enrollment data and reduce database load.',
   'component_required',
   '{"required_components": ["cache"], "min_instances": 1}',
   1, 1, 1, 10,
   'A cache keeps hot data in memory so the database isn''t hammered during peak enrollment',
   datetime('now'), datetime('now')),

  ('req-m2-s2-002', 'stage-m2-002',
   'Add a Background Worker',
   'Add a Background Worker to process enrollment submissions asynchronously so families don''t wait for slow operations.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 2, 1, 15,
   'Background workers process tasks in the background so the web server stays responsive',
   datetime('now'), datetime('now')),

  ('req-m2-s2-003', 'stage-m2-002',
   'Add a Load Balancer',
   'Add a Load Balancer to distribute enrollment traffic across multiple servers.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   1, 3, 1, 10,
   'A Load Balancer prevents any single server from being overwhelmed during peak traffic',
   datetime('now'), datetime('now')),

  ('req-m2-s2-004', 'stage-m2-002',
   'Connect load balancer to servers',
   'Connect the Load Balancer to the Web Server so traffic is properly distributed.',
   'connection_required',
   '{"source_types": ["networking"], "target_types": ["compute"]}',
   2, 4, 1, 20,
   'The Load Balancer needs to know which servers to send enrollment traffic to',
   datetime('now'), datetime('now'));

-- ----- Stage 3: One Source of Truth (stage-m2-003) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m2-s3-001', 'stage-m2-003',
   'Consolidate to one database',
   'Ensure there is a single SQL Database that serves as the authoritative source for all student records across campuses.',
   'component_required',
   '{"required_components": ["database"], "min_instances": 1}',
   1, 1, 1, 15,
   'One database to rule them all -- no more conflicting records across campuses',
   datetime('now'), datetime('now')),

  ('req-m2-s3-002', 'stage-m2-003',
   'Add an Application Server for data services',
   'Add an Application Server that enforces data validation rules and handles the migration from three campus databases to one.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 2, 1, 15,
   'An Application Server layer ensures data is validated before it reaches the database',
   datetime('now'), datetime('now')),

  ('req-m2-s3-003', 'stage-m2-003',
   'Connect application server to database',
   'Connect the Application Server to the centralized Database so all campuses route through one data layer.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["database"]}',
   2, 3, 1, 20,
   'All data access should go through the Application Server to the single database',
   datetime('now'), datetime('now'));

-- ----- Stage 4: Keep the Lights On (stage-m2-004) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m2-s4-001', 'stage-m2-004',
   'Add Monitoring',
   'Add Monitoring to track resource usage and identify waste -- which servers are idle, which databases are over-provisioned.',
   'component_required',
   '{"required_components": ["observability"], "min_instances": 1}',
   1, 1, 1, 15,
   'You can''t cut costs if you can''t see where the money is going -- add Monitoring',
   datetime('now'), datetime('now')),

  ('req-m2-s4-002', 'stage-m2-004',
   'Connect monitoring to servers',
   'Connect Monitoring to the Application Server so you can track resource usage and right-size infrastructure.',
   'connection_required',
   '{"source_types": ["observability"], "target_types": ["compute"]}',
   2, 2, 1, 20,
   'Monitoring needs to observe your compute resources to find optimization opportunities',
   datetime('now'), datetime('now')),

  ('req-m2-s4-003', 'stage-m2-004',
   'Keep existing architecture intact',
   'Ensure the core architecture from previous stages is maintained -- cost optimization shouldn''t break what works.',
   'node_count',
   '{"required_components": ["compute", "database"], "min_instances": 1}',
   1, 3, 1, 10,
   'Don''t remove working components -- optimize them instead',
   datetime('now'), datetime('now'));

-- ----- Stage 5: Back to School Ready (stage-m2-005) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m2-s5-001', 'stage-m2-005',
   'Add a Load Balancer',
   'Add a Load Balancer to distribute 50,000 concurrent users across multiple servers.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   1, 1, 1, 15,
   'Horizontal scaling starts with a Load Balancer distributing traffic',
   datetime('now'), datetime('now')),

  ('req-m2-s5-002', 'stage-m2-005',
   'Add a CDN',
   'Add a CDN to serve static enrollment forms and assets from edge locations close to families.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   2, 2, 1, 10,
   'A CDN caches static content at edge locations so your servers handle less traffic',
   datetime('now'), datetime('now')),

  ('req-m2-s5-003', 'stage-m2-005',
   'Add Monitoring for capacity planning',
   'Add Monitoring to track system capacity and set up alerts before resources are exhausted.',
   'component_required',
   '{"required_components": ["observability"], "min_instances": 1}',
   1, 3, 1, 15,
   'Capacity planning requires real-time visibility into resource usage',
   datetime('now'), datetime('now')),

  ('req-m2-s5-004', 'stage-m2-005',
   'Connect CDN to web servers',
   'Connect the CDN to the Web Server so static assets are cached and served from edge locations.',
   'connection_required',
   '{"source_types": ["networking"], "target_types": ["compute"]}',
   2, 4, 1, 20,
   'The CDN needs to know which origin server to pull content from',
   datetime('now'), datetime('now'));


-- =====================================================
-- ENVIRONMENTAL MONITORING - Stage Requirements
-- =====================================================

-- ----- Stage 1: Collect the Evidence (stage-m3-001) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m3-s1-001', 'stage-m3-001',
   'Add a Web Server',
   'Add a Web Server to receive data from the 50 IoT sensors via HTTP.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 10,
   'Sensors need an endpoint to send their readings to -- add a Web Server',
   datetime('now'), datetime('now')),

  ('req-m3-s1-002', 'stage-m3-001',
   'Add a Background Worker',
   'Add a Background Worker to process incoming sensor readings asynchronously so no data is dropped.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 2, 1, 15,
   'A Background Worker processes readings off a queue so the ingestion endpoint stays fast',
   datetime('now'), datetime('now')),

  ('req-m3-s1-003', 'stage-m3-001',
   'Add a Database',
   'Add a SQL Database to store sensor readings reliably.',
   'component_required',
   '{"required_components": ["database"], "min_instances": 1}',
   1, 3, 1, 10,
   'Every sensor reading is evidence -- store it in a proper database',
   datetime('now'), datetime('now')),

  ('req-m3-s1-004', 'stage-m3-001',
   'Connect worker to database',
   'Connect the Background Worker to the Database so processed readings are persisted.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["database"]}',
   2, 4, 1, 20,
   'The worker needs to write processed readings to the database',
   datetime('now'), datetime('now'));

-- ----- Stage 2: Process in Real-Time (stage-m3-002) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m3-s2-001', 'stage-m3-002',
   'Add an Application Server',
   'Add an Application Server to run transformation and aggregation logic on raw sensor data.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 15,
   'ETL logic needs a dedicated Application Server for data transformation',
   datetime('now'), datetime('now')),

  ('req-m3-s2-002', 'stage-m3-002',
   'Add a Cache for rolling averages',
   'Add an In-Memory Cache to hold rolling window calculations for real-time aggregation.',
   'component_required',
   '{"required_components": ["cache"], "min_instances": 1}',
   1, 2, 1, 10,
   'Rolling averages need fast in-memory storage -- a cache is perfect for this',
   datetime('now'), datetime('now')),

  ('req-m3-s2-003', 'stage-m3-002',
   'Connect application server to cache',
   'Connect the Application Server to the Cache so aggregated values are quickly accessible.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["cache"]}',
   2, 3, 1, 20,
   'The processing server writes computed averages to the cache for fast retrieval',
   datetime('now'), datetime('now'));

-- ----- Stage 3: Store It Forever (stage-m3-003) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m3-s3-001', 'stage-m3-003',
   'Add Object Storage',
   'Add Object Storage for archiving old sensor data cheaply (cold storage tier).',
   'component_required',
   '{"required_components": ["storage"], "min_instances": 1}',
   1, 1, 1, 10,
   'Old data can be archived to cheap Object Storage while recent data stays in the database',
   datetime('now'), datetime('now')),

  ('req-m3-s3-002', 'stage-m3-003',
   'Add a Backup Service',
   'Add a Backup Service to ensure no data is ever lost -- the legal case depends on it.',
   'component_required',
   '{"required_components": ["storage"], "min_instances": 1}',
   1, 2, 1, 10,
   'Two years of evidence can''t afford to be lost -- add automated backups',
   datetime('now'), datetime('now')),

  ('req-m3-s3-003', 'stage-m3-003',
   'Connect database to object storage',
   'Connect the Database to Object Storage so old data is automatically archived.',
   'connection_required',
   '{"source_types": ["database"], "target_types": ["storage"]}',
   2, 3, 1, 20,
   'Set up a pipeline from the database to object storage for data lifecycle management',
   datetime('now'), datetime('now')),

  ('req-m3-s3-004', 'stage-m3-003',
   'Connect database to backup',
   'Connect the Database to the Backup Service for automated disaster recovery.',
   'connection_required',
   '{"source_types": ["database"], "target_types": ["storage"]}',
   2, 4, 1, 20,
   'The database must be backed up automatically -- connect it to the Backup Service',
   datetime('now'), datetime('now'));

-- ----- Stage 4: Make It Visual (stage-m3-004) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m3-s4-001', 'stage-m3-004',
   'Add an API Gateway',
   'Add an API Gateway as the single entry point for the visualization frontend to query data.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   1, 1, 1, 15,
   'An API Gateway manages all API traffic with rate limiting and authentication',
   datetime('now'), datetime('now')),

  ('req-m3-s4-002', 'stage-m3-004',
   'Add a Cache for API responses',
   'Add an In-Memory Cache to store frequently queried aggregations so the dashboard loads fast.',
   'component_required',
   '{"required_components": ["cache"], "min_instances": 1}',
   1, 2, 1, 10,
   'Dashboard queries hit the same aggregations repeatedly -- cache them for speed',
   datetime('now'), datetime('now')),

  ('req-m3-s4-003', 'stage-m3-004',
   'Connect API gateway to application server',
   'Connect the API Gateway to the Application Server so API requests reach the data processing layer.',
   'connection_required',
   '{"source_types": ["networking"], "target_types": ["compute"]}',
   2, 3, 1, 20,
   'The API Gateway routes requests to the Application Server that serves the data',
   datetime('now'), datetime('now'));

-- ----- Stage 5: Prove It in Court (stage-m3-005) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m3-s5-001', 'stage-m3-005',
   'Add a Logging Service',
   'Add a Logging Service to create immutable audit trails for every data access and modification.',
   'component_required',
   '{"required_components": ["observability"], "min_instances": 1}',
   1, 1, 1, 15,
   'Immutable logs prove the data chain of custody -- add a Logging Service',
   datetime('now'), datetime('now')),

  ('req-m3-s5-002', 'stage-m3-005',
   'Add Authentication',
   'Add an Auth Service to control who can access and modify sensor data.',
   'component_required',
   '{"required_components": ["security"], "min_instances": 1}',
   1, 2, 1, 15,
   'Only authorized personnel should access or modify evidence data',
   datetime('now'), datetime('now')),

  ('req-m3-s5-003', 'stage-m3-005',
   'Add a Firewall',
   'Add a Firewall to prevent unauthorized network access to the data pipeline.',
   'component_required',
   '{"required_components": ["security"], "min_instances": 2}',
   1, 3, 1, 15,
   'Network security prevents tampering with the data from outside',
   datetime('now'), datetime('now')),

  ('req-m3-s5-004', 'stage-m3-005',
   'Connect logging to database',
   'Connect the Logging Service to the Database so every query and modification is recorded.',
   'connection_required',
   '{"source_types": ["observability"], "target_types": ["database"]}',
   2, 4, 1, 20,
   'Audit logs must capture every database interaction for the legal record',
   datetime('now'), datetime('now'));


-- =====================================================
-- INVENTORY CRISIS - Stage Requirements
-- =====================================================

-- ----- Stage 1: Stop the Bleeding (stage-m4-001) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m4-s1-001', 'stage-m4-001',
   'Add a Web Server',
   'Add a Web Server for the inventory management interface that employees access.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 10,
   'Employees need a web interface instead of emailing spreadsheets around',
   datetime('now'), datetime('now')),

  ('req-m4-s1-002', 'stage-m4-001',
   'Add a Database',
   'Add a SQL Database with ACID transactions to prevent concurrent editing conflicts.',
   'component_required',
   '{"required_components": ["database"], "min_instances": 1}',
   1, 2, 1, 10,
   'A real database prevents two people from editing the same inventory count simultaneously',
   datetime('now'), datetime('now')),

  ('req-m4-s1-003', 'stage-m4-001',
   'Connect server to database',
   'Connect the Web Server to the Database so inventory changes are immediately persisted.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["database"]}',
   2, 3, 1, 20,
   'The inventory interface needs to read and write to the database',
   datetime('now'), datetime('now'));

-- ----- Stage 2: Online and In-Store (stage-m4-002) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m4-s2-001', 'stage-m4-002',
   'Add an Application Server',
   'Add an Application Server to handle inventory reservation logic across online and in-store channels.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 15,
   'Business logic for inventory reservation needs a dedicated Application Server',
   datetime('now'), datetime('now')),

  ('req-m4-s2-002', 'stage-m4-002',
   'Add a Cache',
   'Add an In-Memory Cache for real-time inventory availability lookups across both channels.',
   'component_required',
   '{"required_components": ["cache"], "min_instances": 1}',
   1, 2, 1, 10,
   'A cache provides instant inventory counts without hitting the database for every check',
   datetime('now'), datetime('now')),

  ('req-m4-s2-003', 'stage-m4-002',
   'Connect application server to database',
   'Connect the Application Server to the Database so inventory state is always consistent.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["database"]}',
   2, 3, 1, 20,
   'The Application Server must read and write inventory data atomically',
   datetime('now'), datetime('now'));

-- ----- Stage 3: Automate Reordering (stage-m4-003) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m4-s3-001', 'stage-m4-003',
   'Add a Background Worker',
   'Add a Background Worker to run scheduled inventory checks and trigger automatic reorder when stock drops below thresholds.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 15,
   'A Background Worker runs on a schedule to check stock levels and place orders automatically',
   datetime('now'), datetime('now')),

  ('req-m4-s3-002', 'stage-m4-003',
   'Add Monitoring',
   'Add Monitoring to track inventory levels, reorder success rates, and supplier response times.',
   'component_required',
   '{"required_components": ["observability"], "min_instances": 1}',
   1, 2, 1, 10,
   'Monitoring dashboards show which items are running low and whether reorders are succeeding',
   datetime('now'), datetime('now')),

  ('req-m4-s3-003', 'stage-m4-003',
   'Connect worker to database',
   'Connect the Background Worker to the Database so it can check stock levels and record reorders.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["database"]}',
   2, 3, 1, 20,
   'The worker reads inventory levels from the database and writes purchase orders back',
   datetime('now'), datetime('now'));

-- ----- Stage 4: Handle Black Friday (stage-m4-004) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m4-s4-001', 'stage-m4-004',
   'Add a Load Balancer',
   'Add a Load Balancer to distribute Black Friday traffic across multiple web servers.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   1, 1, 1, 15,
   'Black Friday traffic could 10x overnight -- a Load Balancer distributes the load',
   datetime('now'), datetime('now')),

  ('req-m4-s4-002', 'stage-m4-004',
   'Add a Background Worker for order processing',
   'Add a Background Worker to process orders asynchronously so the storefront stays responsive under heavy load.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 2, 1, 15,
   'Queue-based order processing keeps the site fast even when thousands are checking out',
   datetime('now'), datetime('now')),

  ('req-m4-s4-003', 'stage-m4-004',
   'Add a Cache for product pages',
   'Add an In-Memory Cache to serve product listings and inventory counts without hitting the database.',
   'component_required',
   '{"required_components": ["cache"], "min_instances": 1}',
   1, 3, 1, 10,
   'Cache product pages so the database only handles actual purchases, not browsing',
   datetime('now'), datetime('now')),

  ('req-m4-s4-004', 'stage-m4-004',
   'Connect load balancer to servers',
   'Connect the Load Balancer to the Web Server(s) for traffic distribution.',
   'connection_required',
   '{"source_types": ["networking"], "target_types": ["compute"]}',
   2, 4, 1, 20,
   'Route all incoming Black Friday traffic through the Load Balancer',
   datetime('now'), datetime('now'));

-- ----- Stage 5: Multi-Store Expansion (stage-m4-005) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m4-s5-001', 'stage-m4-005',
   'Add an API Gateway',
   'Add an API Gateway as the unified entry point for both store locations and the e-commerce site.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   1, 1, 1, 15,
   'An API Gateway routes requests from multiple store locations through one managed entry point',
   datetime('now'), datetime('now')),

  ('req-m4-s5-002', 'stage-m4-005',
   'Add Authentication',
   'Add an Auth Service to manage employee access across both locations with role-based permissions.',
   'component_required',
   '{"required_components": ["security"], "min_instances": 1}',
   1, 2, 1, 15,
   'Different employees at different stores need different access levels',
   datetime('now'), datetime('now')),

  ('req-m4-s5-003', 'stage-m4-005',
   'Connect API gateway to application server',
   'Connect the API Gateway to the Application Server for centralized inventory management.',
   'connection_required',
   '{"source_types": ["networking"], "target_types": ["compute"]}',
   2, 3, 1, 20,
   'Both stores access the same inventory system through the API Gateway',
   datetime('now'), datetime('now'));


-- =====================================================
-- COMMUNITY CENTER UPGRADE - Stage Requirements
-- =====================================================

-- ----- Stage 1: Go Digital (stage-m5-001) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m5-s1-001', 'stage-m5-001',
   'Add a Web Server',
   'Add a Web Server for the volunteer registration portal.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 10,
   'Replace the paper clipboard with a web-based registration form',
   datetime('now'), datetime('now')),

  ('req-m5-s1-002', 'stage-m5-001',
   'Add a Database',
   'Add a SQL Database to store volunteer information, event details, and sign-ups.',
   'component_required',
   '{"required_components": ["database"], "min_instances": 1}',
   1, 2, 1, 10,
   'Volunteer data needs a real database -- clipboards get lost behind filing cabinets',
   datetime('now'), datetime('now')),

  ('req-m5-s1-003', 'stage-m5-001',
   'Connect server to database',
   'Connect the Web Server to the Database so volunteer registrations are saved immediately.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["database"]}',
   2, 3, 1, 20,
   'The registration portal needs to save volunteer info to the database',
   datetime('now'), datetime('now'));

-- ----- Stage 2: Schedule Without Conflicts (stage-m5-002) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m5-s2-001', 'stage-m5-002',
   'Add an Application Server',
   'Add an Application Server to handle scheduling logic, conflict detection, and availability checks.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 15,
   'Scheduling logic with conflict detection needs a dedicated Application Server',
   datetime('now'), datetime('now')),

  ('req-m5-s2-002', 'stage-m5-002',
   'Add a Cache',
   'Add an In-Memory Cache to store real-time room and volunteer availability for instant conflict checks.',
   'component_required',
   '{"required_components": ["cache"], "min_instances": 1}',
   1, 2, 1, 10,
   'Availability checks need to be instant -- cache current schedules in memory',
   datetime('now'), datetime('now')),

  ('req-m5-s2-003', 'stage-m5-002',
   'Connect application server to database',
   'Connect the Application Server to the Database so schedule changes are validated and persisted.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["database"]}',
   2, 3, 1, 20,
   'The scheduling server reads and writes to the database for persistent schedule data',
   datetime('now'), datetime('now'));

-- ----- Stage 3: Never Miss a Volunteer (stage-m5-003) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m5-s3-001', 'stage-m5-003',
   'Add a Background Worker',
   'Add a Background Worker to send scheduled SMS/email reminders and handle confirmation responses.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 15,
   'A Background Worker sends reminders on a schedule without blocking the main app',
   datetime('now'), datetime('now')),

  ('req-m5-s3-002', 'stage-m5-003',
   'Add an Application Server for notifications',
   'Add an Application Server to manage notification templates, delivery rules, and integration with SMS/email providers.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 2}',
   1, 2, 1, 15,
   'Notification logic -- when to send, what to send, how to send -- needs its own service',
   datetime('now'), datetime('now')),

  ('req-m5-s3-003', 'stage-m5-003',
   'Connect worker to application server',
   'Connect the Background Worker to the Application Server so reminders are processed through the notification service.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["compute"]}',
   2, 3, 1, 20,
   'The worker pulls scheduled reminders and sends them through the notification service',
   datetime('now'), datetime('now'));

-- ----- Stage 4: Track What Matters (stage-m5-004) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m5-s4-001', 'stage-m5-004',
   'Add Monitoring for analytics',
   'Add Monitoring to create dashboards showing kids served, volunteer hours, and program outcomes.',
   'component_required',
   '{"required_components": ["observability"], "min_instances": 1}',
   1, 1, 1, 15,
   'Grant applications need hard numbers -- Monitoring dashboards provide them',
   datetime('now'), datetime('now')),

  ('req-m5-s4-002', 'stage-m5-004',
   'Add an Application Server for reporting',
   'Add an Application Server to run aggregation queries and generate reports for grant applications.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 2, 1, 15,
   'Complex reporting queries need a dedicated server so they don''t slow down the main app',
   datetime('now'), datetime('now')),

  ('req-m5-s4-003', 'stage-m5-004',
   'Connect monitoring to database',
   'Connect Monitoring to the Database to track data patterns and generate usage reports.',
   'connection_required',
   '{"source_types": ["observability"], "target_types": ["database"]}',
   2, 3, 1, 20,
   'Analytics dashboards need access to the underlying data in the database',
   datetime('now'), datetime('now'));

-- ----- Stage 5: Serve More Communities (stage-m5-005) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-m5-s5-001', 'stage-m5-005',
   'Add an API Gateway',
   'Add an API Gateway as the unified entry point for all three community centers.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   1, 1, 1, 15,
   'Multiple centers accessing one system need a managed API Gateway for routing and rate limiting',
   datetime('now'), datetime('now')),

  ('req-m5-s5-002', 'stage-m5-005',
   'Add Authentication',
   'Add an Auth Service for role-based access -- center directors, coordinators, and volunteers have different permissions.',
   'component_required',
   '{"required_components": ["security"], "min_instances": 1}',
   1, 2, 1, 15,
   'Different roles at different centers need different access levels',
   datetime('now'), datetime('now')),

  ('req-m5-s5-003', 'stage-m5-005',
   'Add a Load Balancer',
   'Add a Load Balancer to handle traffic from three centers without performance degradation.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   1, 3, 1, 10,
   'Three centers means 3x the traffic -- distribute it with a Load Balancer',
   datetime('now'), datetime('now')),

  ('req-m5-s5-004', 'stage-m5-005',
   'Connect API gateway to application server',
   'Connect the API Gateway to the Application Server so all centers route through the same backend.',
   'connection_required',
   '{"source_types": ["networking"], "target_types": ["compute"]}',
   2, 4, 1, 20,
   'All three centers share the same backend through the API Gateway',
   datetime('now'), datetime('now'));


-- ============================================================
-- 4. MISSION EMAILS (story progression)
-- ============================================================

-- =====================================================
-- SCHOOL DISTRICT CRISIS EMAILS
-- =====================================================

-- Mission start
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m2-start', '770e8400-e29b-41d4-a716-446655440002', NULL,
   'Maria Rodriguez', 'maria.rodriguez@metroschools.edu',
   'URGENT: Student System Down During Enrollment',
   'The student information system crashed this morning and enrollment opens tomorrow...',
   'Hi,

I''m Maria Rodriguez, IT coordinator at Metro School District in Portland. I''m writing because our student information system crashed this morning and enrollment opens TOMORROW.

The system handles everything -- enrollment, grade books, student records, class scheduling. It''s one big application running on a single server. When enrollment traffic picks up, the whole thing goes down, including the grade book that teachers need for report cards.

Here''s what we''re dealing with:
- 15,000 students across three campuses
- The app runs enrollment, grades, and records all in one codebase
- When one part gets overloaded, everything crashes
- Families who moved between campuses have incomplete records
- Teachers can''t access grade books when enrollment is happening

I''ve been the only IT person for this district for 6 years. I know how to keep printers working and reset passwords. I don''t know how to architect systems. But I know this: if we can''t enroll students tomorrow, 15,000 families are going to be very upset, and the school board will be looking for someone to blame.

Please help me figure out how to untangle this mess before tomorrow morning.

Desperately,
Maria Rodriguez
IT Coordinator, Metro School District',
   'urgent',
   '["crisis", "education", "system-design", "enrollment"]',
   'primary',
   'mission_start',
   datetime('now'), datetime('now'));

-- Stage 1 complete -> Stage 2
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m2-s1-complete', '770e8400-e29b-41d4-a716-446655440002', 'stage-m2-001',
   'Maria Rodriguez', 'maria.rodriguez@metroschools.edu',
   'We separated the systems! But enrollment starts Monday...',
   'The enrollment system is running independently now -- teachers can access grades again!',
   'Good news -- the enrollment system is running independently now! Teachers can access the grade book even when enrollment is busy. You saved report card week.

But here''s the problem: enrollment week starts Monday. 3,000 families trying to enroll in 5 days. Last year we could only handle about 200 at a time before the system slowed to a crawl. Parents were waiting 45 minutes just to submit a form.

Some parents are already saying they''ll drive to the school and do paper enrollment if the website is too slow. That means longer lines, more paperwork, and my staff working until midnight.

Can we make this thing handle the rush? I don''t need it to be perfect -- I just need it to survive 5 days.

Nervously,
Maria',
   'high',
   '["enrollment", "performance", "caching", "queues"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 2 complete -> Stage 3
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m2-s2-complete', '770e8400-e29b-41d4-a716-446655440002', 'stage-m2-002',
   'Maria Rodriguez', 'maria.rodriguez@metroschools.edu',
   'We survived! But now we have a data problem...',
   'Enrollment week is over. 3,000 families enrolled without a single crash!',
   'Enrollment week is OVER. 3,000 families enrolled without a single crash. Parents were posting on social media about how smooth it was. The superintendent actually smiled at me in the hallway. I almost cried.

But now I''m looking at the data and we have a mess. A student named David Kim shows up as "enrolled" at Lincoln Elementary AND "waitlisted" at Jefferson Middle School. His mom transferred him last month but the records didn''t sync.

There are 340 students with conflicts like this across the three campuses. Each campus has been running its own version of the student database, and they don''t agree on anything. Different field names, different ID formats, some records are duplicated, some are missing entirely.

We need one source of truth. If a teacher at Lincoln looks up David Kim, they should see the same record as Jefferson.

Can you help us consolidate this mess?

Hopefully,
Maria',
   'high',
   '["data", "normalization", "migration", "consistency"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 3 complete -> Stage 4
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m2-s3-complete', '770e8400-e29b-41d4-a716-446655440002', 'stage-m2-003',
   'Maria Rodriguez', 'maria.rodriguez@metroschools.edu',
   'The superintendent saw the cloud bill...',
   'One database, zero conflicts! But the superintendent wants to talk about costs...',
   'One database, zero conflicts! David Kim now has exactly one record, and it''s correct. Every campus sees the same data. Teachers are calling it magic (it''s just normalization, but I''ll take it).

Bad news: the superintendent saw the cloud hosting bill. $1,400 last month. The entire IT budget for "technology services" is $500/month, which is supposed to cover this PLUS the printer ink PLUS the WiFi access points PLUS my coffee.

She wasn''t angry -- she understands the system had to work for enrollment. But she asked me to find a way to cut the cloud costs by at least 60% before the next board meeting.

I looked at the servers and half of them seem to be doing nothing most of the day. Enrollment is a burst -- crazy traffic for a week, then barely anything for months. Are we paying for capacity we''re not using?

Can you help me figure out how to keep it running without going broke?

Gratefully (and frugally),
Maria',
   'high',
   '["cost", "optimization", "serverless", "right-sizing"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 4 complete -> Stage 5
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m2-s4-complete', '770e8400-e29b-41d4-a716-446655440002', 'stage-m2-004',
   'Maria Rodriguez', 'maria.rodriguez@metroschools.edu',
   'Budget approved! But next year is going to be huge...',
   'Costs are down to $380/month! The board approved the budget. But...',
   'Costs are down to $380/month! The superintendent high-fived me. The SUPERINTENDENT. I didn''t know she did that.

The board approved the technology budget unanimously. And then they dropped the bombshell: two neighboring districts want to join our enrollment system. That means next fall, we''re looking at 50,000 students trying to enroll, not 15,000.

I did the math. On the first day of enrollment last year, we had 3,000 concurrent users and barely survived. Next year, we could have 50,000 concurrent on opening day. And the board wants zero downtime -- they don''t want a single parent to have a bad experience.

We have 3 months. Is it possible to scale this thing up by 16x without starting over?

One last push?

Maria',
   'high',
   '["scaling", "capacity", "load-testing", "horizontal-scaling"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Mission complete
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m2-complete', '770e8400-e29b-41d4-a716-446655440002', NULL,
   'Maria Rodriguez', 'maria.rodriguez@metroschools.edu',
   'Every student has a schedule. Every parent has peace of mind.',
   '52,000 enrollments processed. Zero crashes. Zero lost records.',
   'I just finished opening day. 52,000 enrollments processed. Zero crashes. Zero lost records. The system didn''t even break a sweat.

A parent stopped me in the hallway this morning. She said she enrolled her daughter at 6am from her phone while making breakfast. Took 3 minutes. Last year she took a half day off work to stand in line.

Here''s what we built together:
- Separated enrollment from grade books so nothing takes everything down
- Handled 3,000 families in a week without a single timeout
- Consolidated three campus databases into one source of truth
- Cut costs from $1,400/month to $380/month
- Scaled to handle 52,000 concurrent users across three districts

The school board is talking about making our system a state model. Me, Maria Rodriguez, the person who couldn''t architect a system 3 months ago, is presenting at the state technology conference next month.

Every student has a schedule. Every parent has peace of mind. That''s what you helped build.

Thank you doesn''t begin to cover it.

-- Maria

P.S. The superintendent high-fived me again. I think it''s becoming a thing.',
   'normal',
   '["success", "impact", "completion"]',
   'primary',
   'mission_complete',
   datetime('now'), datetime('now'));


-- =====================================================
-- ENVIRONMENTAL MONITORING EMAILS
-- =====================================================

-- Mission start
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m3-start', '880e8400-e29b-41d4-a716-446655440003', NULL,
   'James Chen', 'james.chen@greenfuture.org',
   'HELP: Sensor data is being lost -- kids are getting sick',
   'The sensors are running but we''re losing 70% of the data. The factory keeps polluting...',
   'Hi,

My name is James Chen. I''m a volunteer software engineer at Green Future Coalition in San Francisco. I need help and I don''t know where else to turn.

We installed 50 air quality sensors around a neighborhood near the Henderson Chemical plant. Kids in that neighborhood have 3x the asthma rate of the city average. We think the factory is releasing pollutants, but the EPA says they need data -- hard data -- before they''ll investigate.

Here''s the problem: the sensors are running, but our data pipeline is a mess. Each sensor sends a reading every 30 seconds. That''s 100 readings per minute, 144,000 per day. Our ingestion script is single-threaded and running on a donated laptop. It can''t keep up.

We''re losing 70% of the readings. They just vanish. The sensor sends the data, but our script is too busy processing the last batch to receive it.

The data we DO capture shows alarming spikes in particulate matter, especially between 2am and 5am when nobody''s watching. But our evidence is full of gaps. The factory''s lawyers will tear it apart.

I can code, but I''ve never built something that needs to handle this kind of throughput. The kids in that neighborhood don''t have time for me to figure it out by trial and error.

Can you help me build a pipeline that doesn''t lose a single reading?

James Chen
Volunteer Engineer, Green Future Coalition',
   'urgent',
   '["environment", "data-pipeline", "iot", "health"]',
   'primary',
   'mission_start',
   datetime('now'), datetime('now'));

-- Stage 1 complete -> Stage 2
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m3-s1-complete', '880e8400-e29b-41d4-a716-446655440003', 'stage-m3-001',
   'James Chen', 'james.chen@greenfuture.org',
   'Zero readings lost! But raw data isn''t enough...',
   'The pipeline hasn''t dropped a single reading in 72 hours!',
   'The pipeline hasn''t dropped a single reading in 72 hours! Every sensor, every 30 seconds, captured perfectly. You have no idea how good that feels.

But I''m staring at the data and it''s just... numbers. Voltage readings, temperature offsets, humidity percentages. The EPA doesn''t want to see 144,000 raw data points per day. They want to see: "Air quality exceeded safe levels for 6 consecutive hours on Tuesday between 2am and 8am."

We need to transform this raw data into something meaningful. Hourly averages, daily trends, anomaly detection when readings spike above EPA thresholds. And we need it in real-time -- if there''s a pollution event happening RIGHT NOW, we need to know immediately, not 24 hours later in a batch report.

Can we build a processing layer on top of what we have?

James',
   'high',
   '["processing", "etl", "stream", "real-time"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 2 complete -> Stage 3
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m3-s2-complete', '880e8400-e29b-41d4-a716-446655440003', 'stage-m3-002',
   'James Chen', 'james.chen@greenfuture.org',
   'We caught a 3am pollution event in real-time!',
   'The anomaly detection flagged a massive spike at 3:17am. We have the evidence!',
   'Last night the anomaly detection flagged a massive particulate spike at 3:17am. We had volunteers at the site within 20 minutes with backup sensors. The readings matched. We have timestamped, corroborated evidence of an illegal emission event.

But our lawyer says we need MORE. She wants 2 years of continuous data to prove this is a pattern, not an anomaly. The EPA requires historical baselines to establish contamination.

Our database is filling up fast. At 144,000 readings per day, we''ll run out of storage in 3 months. And queries on the full dataset are getting slow -- a simple date range query takes 45 seconds.

I need a way to keep 2 years of data without going broke on storage. Recent data needs to be fast for dashboards, but data from 6 months ago can be slower to access. I just can''t lose ANY of it.

James',
   'high',
   '["storage", "archival", "data-lifecycle", "time-series"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 3 complete -> Stage 4
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m3-s3-complete', '880e8400-e29b-41d4-a716-446655440003', 'stage-m3-003',
   'James Chen', 'james.chen@greenfuture.org',
   'The EPA wants to see dashboards, not spreadsheets',
   'We met with the EPA regional office. They want interactive maps and charts.',
   'We met with the EPA regional office yesterday. They''re interested! But when I showed them our CSV exports and spreadsheet charts, the lead investigator said: "We need something our team can explore interactively. Maps, time-series charts, the ability to zoom into specific sensors and time ranges."

They want a dashboard they can access from their offices. Not a spreadsheet I email them every week. They need:
- Interactive maps showing air quality by sensor location
- Time-series charts with zoom and date range selection
- The ability to compare different sensors side by side
- Export functionality for their own analysis tools
- Pagination for browsing historical data

Basically, we need an API that serves our data to a frontend. Can we build that on top of what we have?

James',
   'high',
   '["api", "visualization", "rest", "dashboard"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 4 complete -> Stage 5
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m3-s4-complete', '880e8400-e29b-41d4-a716-446655440003', 'stage-m3-004',
   'James Chen', 'james.chen@greenfuture.org',
   'EPA is building a case. But we need court-ready data.',
   'The dashboards are a hit at the EPA. Now the lawyers want chain-of-custody proof.',
   'The dashboards are a hit. The EPA investigators are using them daily. They''ve identified 47 separate pollution events over the past 8 months.

But the factory''s legal team is already pushing back. They''re claiming our data could have been tampered with. "How do we know these readings are authentic? Where''s the chain of custody?"

Our lawyer says we need:
- Immutable logs proving no data was altered after collection
- Timestamps from the sensors that can be verified independently
- A complete audit trail: who accessed what data, when, and why
- Cryptographic checksums on raw readings so any tampering is detectable
- Access controls so only authorized personnel can view or export data

If the factory''s lawyers can cast doubt on even one data point, the whole case could collapse. These kids'' health depends on our data being bulletproof.

This is the final piece. Can we make it court-ready?

James',
   'high',
   '["security", "audit", "immutable", "legal", "integrity"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Mission complete
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m3-complete', '880e8400-e29b-41d4-a716-446655440003', NULL,
   'James Chen', 'james.chen@greenfuture.org',
   'The EPA accepted our data. The factory has 90 days.',
   'The factory has 90 days to install scrubbers. The kids are going to be okay.',
   'I''m writing this from the steps of the EPA regional office. We just walked out of a hearing where the lead investigator presented our data -- 18 months of continuous air quality monitoring, 78 million readings, zero gaps, every single one cryptographically verified.

The factory''s lawyers tried to challenge our data integrity. The judge asked them to show a single altered reading. They couldn''t. Our audit trail was flawless. Our checksums matched. Our access logs showed exactly who touched what and when.

The EPA ruled: Henderson Chemical has 90 days to install industrial scrubbers on all three smokestacks. They''re also fined $2.3 million for the 47 documented pollution events.

Here''s what we built together:
- A pipeline that captured every reading from 50 sensors without losing one
- Real-time processing that caught pollution events as they happened
- 2 years of archived data with hot/warm/cold storage tiers
- Interactive dashboards the EPA used daily
- Court-ready data with immutable audit trails and cryptographic proof

The kids'' asthma rates should start dropping by next year. A neighborhood that was being slowly poisoned now has clean air to look forward to.

You helped us go from a broken laptop losing 70% of data to a system that stood up in federal court.

Thank you.

-- James

P.S. Three other neighborhoods have reached out. They want to set up their own sensor networks. The system you helped design is about to protect a lot more kids.',
   'normal',
   '["success", "impact", "completion", "environment"]',
   'primary',
   'mission_complete',
   datetime('now'), datetime('now'));


-- =====================================================
-- INVENTORY CRISIS EMAILS
-- =====================================================

-- Mission start
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m4-start', '990e8400-e29b-41d4-a716-446655440004', NULL,
   'Lisa Thompson', 'lisa@thompsonhardware.com',
   'We just sold something we don''t have. Again.',
   'A customer just bought a drill press online that we sold in-store an hour ago...',
   'Hi,

I''m Lisa Thompson. I own Thompson Hardware in Austin, Texas. My parents built this business over 40 years ago -- started as a small shop with a cash register and a handshake. I took over 3 years ago and I''m trying to modernize without losing the soul of the place.

The problem: we just sold something online that we don''t actually have in stock. A customer ordered a $450 drill press on our website. But we sold the last one in the store an hour earlier. This is the third time this week.

Here''s how we track inventory right now: a spreadsheet. On Google Drive. Shared with 8 employees. Two people edited it at the same time yesterday and now our nail counts are off -- the spreadsheet says we have 14 boxes of finishing nails, but I walked the aisle and counted 3.

We have 50 employees, 12,000 SKUs, and a growing e-commerce site. I spend 10 hours every week manually checking stock and placing reorders. Half the time I find out we''re out of something because a customer tells me.

My parents never had these problems because they had one store and one cash register. I have a store, a website, and a spreadsheet that lies to me.

I don''t need a fancy system. I just need to know what I have, sell what I actually have, and not make my customers angry.

Can you help?

Lisa Thompson
Owner, Thompson Hardware
"If we don''t have it, you don''t need it" (except apparently we sometimes don''t have it)',
   'high',
   '["inventory", "small-business", "ecommerce", "data-consistency"]',
   'primary',
   'mission_start',
   datetime('now'), datetime('now'));

-- Stage 1 complete -> Stage 2
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m4-s1-complete', '990e8400-e29b-41d4-a716-446655440004', 'stage-m4-001',
   'Lisa Thompson', 'lisa@thompsonhardware.com',
   'The spreadsheet is dead. Long live the database!',
   'No more conflicting edits! Employees love scanning items instead of typing into cells.',
   'We threw a little party at the store today. We printed out the spreadsheet, and the whole team signed it like a yearbook. Then we recycled it. No more conflicting edits, no more "who changed the nail count?"

Employees love the new system. They scan items, the count updates instantly, and everyone sees the same number. Revolutionary, I know -- but you have no idea how good it feels after years of spreadsheet chaos.

But here''s my next problem. The e-commerce site is still running its own inventory system. When someone buys something in the store, the website doesn''t know. And vice versa.

This morning, a customer reserved a table saw online for pickup. When she arrived, it was gone -- someone had bought it in the store 20 minutes after she reserved it. She drove 45 minutes each way. She was NOT happy.

I need the store and the website to share one inventory. When something sells anywhere, it should update everywhere. In real-time.

Lisa',
   'high',
   '["inventory", "consistency", "omnichannel", "events"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 2 complete -> Stage 3
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m4-s2-complete', '990e8400-e29b-41d4-a716-446655440004', 'stage-m4-002',
   'Lisa Thompson', 'lisa@thompsonhardware.com',
   'Unified inventory! Now about those 10 hours/week...',
   'No more phantom sales! But I''m still manually checking stock and placing orders.',
   'Unified inventory is working beautifully. A customer buys something in the store, the website updates in seconds. An online order comes in, the shelf count adjusts. Zero phantom sales in two weeks.

But I''m still spending 10 hours every week walking the aisles, checking stock levels, and placing orders with suppliers. I have 12,000 SKUs. I can''t check them all. Last week I discovered we''d been out of 1/4" drywall screws for 3 days -- that''s our #2 seller. We probably lost $800 in sales.

My dad used to do this by instinct. He''d walk the store every morning and just KNOW what needed reordering. I don''t have 40 years of instinct. I have data. Can the data do the reordering for me?

I want the system to watch inventory levels and automatically create purchase orders when something drops below a threshold. And I want to know when it does it -- like a notification that says "Ordered 50 boxes of drywall screws from supplier X."

Lisa',
   'high',
   '["automation", "scheduling", "reordering", "workers"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 3 complete -> Stage 4
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m4-s3-complete', '990e8400-e29b-41d4-a716-446655440004', 'stage-m4-003',
   'Lisa Thompson', 'lisa@thompsonhardware.com',
   'We''re running a Black Friday sale. Am I crazy?',
   'Auto-reordering is saving me 10 hours a week! But now I want to do something ambitious...',
   'Auto-reordering is MAGICAL. I saved 10 hours this week. TEN HOURS. The system placed 23 purchase orders automatically, all at the right quantities, all on time. I nearly hugged the server. (I didn''t. I''m not that far gone.)

So here''s the thing -- with all this time I''m saving, I''ve been thinking bigger. Thompson Hardware has never done a Black Friday sale. The big-box stores crush us every year. But this year, I want to fight back.

We''re planning "Thompson''s Tool Bonanza" -- 30% off power tools, 20% off everything else, online and in-store. I posted about it on social media and it already has 2,000 shares.

I''m excited. And terrified. Our website currently handles maybe 200 visitors at a time. What if we get 2,000? 5,000? What if everyone tries to check out at once and the system melts?

I can''t afford to crash on the biggest sales day of our history. Can we make this thing handle a flood?

Nervously optimistic,
Lisa',
   'high',
   '["scaling", "black-friday", "load", "ecommerce"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 4 complete -> Stage 5
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m4-s4-complete', '990e8400-e29b-41d4-a716-446655440004', 'stage-m4-004',
   'Lisa Thompson', 'lisa@thompsonhardware.com',
   'Black Friday was INSANE. And now... a second store?!',
   'We processed 4,200 orders in 24 hours! Not a single crash.',
   'Thompson''s Tool Bonanza was the biggest day in our 40-year history. 4,200 orders in 24 hours. 12,000 unique visitors to the website. The parking lot was full by 7am. And NOT A SINGLE CRASH.

We made more revenue on Friday than we normally do in three weeks. My dad called to congratulate me. He said, "I didn''t understand any of what you described, but I''m proud."

Here''s the big news: a commercial real estate developer wants to partner with us to open a second Thompson Hardware location across town. Different inventory needs (more commercial/contractor supplies), but shared customer base.

I need the system to work across both stores. A contractor should be able to check stock at either location. If we''re out of something at Store A, we should be able to transfer from Store B. Employee access needs to be location-aware.

My parents built one great store. I want to build two. Can the system handle it?

Lisa',
   'high',
   '["expansion", "multi-store", "distributed", "multi-tenancy"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Mission complete
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m4-complete', '990e8400-e29b-41d4-a716-446655440004', NULL,
   'Lisa Thompson', 'lisa@thompsonhardware.com',
   'Same family store. Now it can compete with anyone.',
   'Second store opened last week. Both locations running perfectly.',
   'Second store opened last week. Both locations share inventory in real-time. A customer in Store B can see that Store A has the specific router bit she needs, and we''ll have it transferred by tomorrow morning.

Here''s the journey:
- Started with a lying spreadsheet and phantom sales
- Built a real database that everyone trusts
- Unified online and in-store inventory so no one drives 45 minutes for nothing
- Automated reordering (I got those 10 hours back)
- Survived our first Black Friday with 4,200 orders and zero crashes
- Expanded to two stores with seamless inventory sharing

My parents visited the new location last weekend. My dad walked the aisles for an hour, checking stock, nodding approvingly. My mom said, "It still feels like Thompson Hardware." That''s the best review I could get.

Same family store, same values, same handshake. But now it can compete with anyone.

Thank you for helping me build something my parents can be proud of.

-- Lisa

P.S. We''re already talking about Store #3. But I''ll let you rest first. Maybe.',
   'normal',
   '["success", "impact", "completion", "family"]',
   'primary',
   'mission_complete',
   datetime('now'), datetime('now'));


-- =====================================================
-- COMMUNITY CENTER UPGRADE EMAILS
-- =====================================================

-- Mission start
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m5-start', 'aa0e8400-e29b-41d4-a716-446655440005', NULL,
   'Marcus Washington', 'marcus@unitycommunitycenter.org',
   'A volunteer didn''t show up. 15 kids had no program.',
   'A volunteer no-showed yesterday. 15 kids had nowhere to go after school...',
   'Hi there,

I''m Marcus Washington, director of Unity Community Center in Detroit. I need help and I hope you can hear me out.

Yesterday afternoon, a volunteer didn''t show up for our after-school tutoring program. 15 kids between ages 8 and 12 had no program. We found out because a parent called asking where her son was. He was sitting on the steps outside the center, alone.

Here''s how we manage things right now:
- Volunteer sign-ups are on paper clipboards at the front desk
- We track events on a whiteboard in my office
- Shift reminders go out via a phone tree that takes 3 hours to complete
- Member registration is a paper form in a manila folder

Last week, a clipboard with 30 volunteer commitments fell behind a filing cabinet. Nobody found it until Saturday when no one showed up for the food drive.

We serve 1,200 members. 200+ kids depend on us for after-school programs. The gym gets double-booked every Tuesday. Volunteers sign up and forget. I spend more time managing logistics than actually helping people.

I don''t need something fancy. I need something that doesn''t fall behind filing cabinets. Something that reminds people to show up. Something that makes sure every kid has a program to go to.

Can you help?

Marcus Washington
Director, Unity Community Center
"Building community, one neighbor at a time"',
   'high',
   '["community", "volunteer", "scheduling", "non-profit"]',
   'primary',
   'mission_start',
   datetime('now'), datetime('now'));

-- Stage 1 complete -> Stage 2
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m5-s1-complete', 'aa0e8400-e29b-41d4-a716-446655440005', 'stage-m5-001',
   'Marcus Washington', 'marcus@unitycommunitycenter.org',
   'No more clipboards! But the gym is still double-booked...',
   'Volunteers are registering online. But we still have scheduling chaos...',
   'The clipboards are officially retired! Volunteers register online, we can see who signed up for what, and nothing falls behind filing cabinets. My front desk coordinator actually smiled at me for the first time in months.

But we still have a scheduling problem. The gym is double-booked every Tuesday -- basketball practice at 4pm and senior yoga at 4pm. Both groups show up and it''s awkward every time. Last Tuesday, Mrs. Henderson (she''s 78) walked into the gym during a basketball scrimmage. She was not impressed.

Volunteer shifts overlap too. I had 3 tutors signed up for the same Tuesday 4pm slot and nobody signed up for Thursday. The sign-up system doesn''t check for conflicts -- it just records names.

I need a scheduling system that knows when a room is taken, knows when a shift is filled, and tells people "sorry, that slot is taken -- here''s what''s available."

Marcus',
   'high',
   '["scheduling", "conflicts", "availability", "calendar"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 2 complete -> Stage 3
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m5-s2-complete', 'aa0e8400-e29b-41d4-a716-446655440005', 'stage-m5-002',
   'Marcus Washington', 'marcus@unitycommunitycenter.org',
   'Zero double-bookings! But volunteers still forget to show up...',
   'The scheduling system caught 12 conflicts before they happened!',
   'The scheduling system caught 12 potential conflicts in its first week. Mrs. Henderson has her yoga slot locked in. The basketball team knows exactly when the gym is theirs. Zero double-bookings.

But we still have the no-show problem. Last month, 40% of committed volunteers didn''t show up. Not because they don''t care -- they just forget. Life gets busy, and our paper reminders (when they happen at all) go out the day before. By then, some volunteers have already made other plans.

Our phone tree is supposed to call everyone with a reminder, but it takes 3 hours and half the calls go to voicemail. I have a coordinator who spends every Friday afternoon calling volunteers about their weekend shifts. She could be doing so much more with that time.

What if the system could send automatic reminders? A text 48 hours before, another one 2 hours before. And let volunteers confirm with a simple "Yes" or "I can''t make it" so we have time to find a replacement.

Marcus',
   'high',
   '["notifications", "reminders", "sms", "automation"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 3 complete -> Stage 4
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m5-s3-complete', 'aa0e8400-e29b-41d4-a716-446655440005', 'stage-m5-003',
   'Marcus Washington', 'marcus@unitycommunitycenter.org',
   'Volunteer no-shows dropped from 40% to 5%!',
   'The reminder system is working. But we have a grant deadline and no data...',
   'The reminder system is incredible. Volunteer no-shows dropped from 40% to 5%. FIVE PERCENT. We haven''t had a single program cancellation due to missing volunteers in 3 weeks.

But now I have a different problem, and it''s urgent. We''re applying for a $200,000 Community Impact Grant from the Detroit Foundation. The application asks:
- How many children were served last year?
- Total volunteer hours contributed?
- Average program attendance by month?
- Year-over-year growth in community engagement?

I KNOW the answers are good. We''re doing incredible work. But I can''t PROVE it. Our records are scattered across spreadsheets, paper files, and my memory. I told the grant officer "about 200 kids" and she said, "We need exact numbers with monthly breakdowns."

Without this grant, we can''t fund the summer program. 200 kids will have nowhere to go for 10 weeks.

Can we build reporting that gives me real numbers? Dashboards, charts, exportable reports -- whatever grant officers want to see?

Marcus',
   'high',
   '["analytics", "reporting", "grants", "data"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 4 complete -> Stage 5
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m5-s4-complete', 'aa0e8400-e29b-41d4-a716-446655440005', 'stage-m5-004',
   'Marcus Washington', 'marcus@unitycommunitycenter.org',
   'WE GOT THE GRANT! And three centers want our system...',
   'The Detroit Foundation awarded us $200,000! And word is spreading...',
   'WE GOT THE GRANT!! $200,000 from the Detroit Foundation!

The grant officer said our application stood out because of the data. "Most applications say ''we serve about 200 kids.'' Yours said ''We served 247 unique children across 14 programs, with an average weekly attendance of 189, representing a 34% increase over the prior year.'' That''s the kind of evidence we fund."

That data came from the reporting system you helped build. Real numbers, not guesses.

Now here''s what happened next: three other community centers in Detroit heard about our system and want the same thing. Brightside Community House, Riverside Youth Center, and MLK Heritage Center. They serve a combined 3,400 members.

Some volunteers already work at multiple centers. They want one login that works everywhere. Each center has its own programs and schedules, but shared volunteer pools would make everyone stronger.

Can we design the system to work for multiple locations? Same volunteers, different programs, all coordinated?

Marcus',
   'high',
   '["multi-tenant", "expansion", "saas", "role-based-access"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Mission complete
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-m5-complete', 'aa0e8400-e29b-41d4-a716-446655440005', NULL,
   'Marcus Washington', 'marcus@unitycommunitycenter.org',
   'Every kid has somewhere to go after school.',
   'Three centers, 847 volunteer shifts, zero no-shows. Every kid is covered.',
   'Three centers went live on the platform this month. Brightside, Riverside, and MLK Heritage -- all running on the same system, all sharing volunteer pools, all tracking their impact with real data.

The numbers from last month:
- 847 volunteer shifts completed across all three centers
- Zero no-shows (automated reminders + easy confirmation)
- 423 unique children served in after-school programs
- 12 programs running without a single scheduling conflict
- 3 grant applications submitted with data-backed evidence

A volunteer named DeShawn works at Unity on Tuesdays and Brightside on Thursdays. He has one login, one schedule, and he gets reminders for both. He told me, "Before this, I missed a shift at Brightside because I forgot which center I was supposed to be at. That doesn''t happen anymore."

But here''s what matters most: every kid has somewhere to go after school. Nobody is sitting on the steps alone. Nobody goes home to an empty house because a volunteer forgot to show up.

We started with paper clipboards and a whiteboard. Now we have a platform that serves three communities. My grant officer from the Detroit Foundation called it "a model for community center management in the 21st century."

You helped build that. Not just a system -- a safety net. For 423 kids and counting.

Thank you.

-- Marcus

P.S. Mrs. Henderson asked me to tell you that yoga has not been double-booked once since the new system. She says you''re welcome at Tuesday 4pm anytime. She''ll save you a mat.',
   'normal',
   '["success", "impact", "completion", "community"]',
   'primary',
   'mission_complete',
   datetime('now'), datetime('now'));


-- ============================================================
-- 5. FIX NEWS ARTICLE -> MISSION LINKAGE
-- ============================================================

-- Link news articles to real mission UUIDs
UPDATE news_articles SET mission_id = '770e8400-e29b-41d4-a716-446655440002' WHERE mission_id = 'mission_2';
UPDATE news_articles SET mission_id = '880e8400-e29b-41d4-a716-446655440003' WHERE mission_id = 'mission_3';
UPDATE news_articles SET mission_id = '990e8400-e29b-41d4-a716-446655440004' WHERE mission_id = 'mission_4';
UPDATE news_articles SET mission_id = 'aa0e8400-e29b-41d4-a716-446655440005' WHERE mission_id = 'mission_5';


-- ============================================================
-- 6. ENRICH NEWS ARTICLES with fuller content
-- ============================================================

UPDATE news_articles
SET
  headline = 'School District''s Student System Crashes During Enrollment -- 15,000 Students Affected',
  subheadline = 'Metro School District''s IT coordinator scrambles as monolithic student information system fails under enrollment load.',
  preview_text = 'Maria Rodriguez, the lone IT coordinator for Metro School District in Portland, faces a crisis: the student information system that handles enrollment, grades, and records for 15,000 students crashes whenever enrollment traffic spikes. With three campuses running conflicting databases and a budget of $500/month, she needs help designing a system that can survive enrollment week.',
  full_text = 'When 3,000 families try to enroll their children in Metro School District, they expect the process to take minutes. Instead, they''re waiting 45 minutes for a page to load -- if the site doesn''t crash first.

Maria Rodriguez has been the district''s sole IT coordinator for six years. She can fix printers and reset passwords, but she never signed up to be a systems architect. The district''s student information system -- a monolithic application running enrollment, grade books, and student records on a single server -- has been crumbling under its own weight.

"When enrollment traffic picks up, everything goes down," Rodriguez explains. "Teachers can''t access the grade book. Parents can''t enroll. Three campuses have different records for the same students. A kid named David Kim shows up as enrolled at Lincoln AND waitlisted at Jefferson."

The system runs on a single server with a $1,400/month cloud bill -- nearly triple the district''s $500 IT budget. Rodriguez needs to separate the tightly coupled systems, survive enrollment week, consolidate three conflicting campus databases, cut costs, and eventually scale to serve 50,000 students across multiple districts.

"If we can''t enroll students, 15,000 families are going to be very upset," Rodriguez says. "The school board will be looking for someone to blame. I''d rather they be looking at someone to thank."',
  impact_stats = '{"people": 15000, "metric": "students affected", "campuses": 3, "enrollment_target": 50000, "monthly_budget": 500}',
  urgency_level = 'critical',
  grid_size = 'large',
  sort_weight = 200,
  updated_at = datetime('now')
WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

UPDATE news_articles
SET
  headline = 'Children''s Asthma Rates Soar Near Factory -- Volunteer Engineers Race to Prove Contamination',
  subheadline = 'Green Future Coalition''s sensor network captures evidence of illegal emissions, but data pipeline failures threaten the case.',
  preview_text = 'James Chen, a volunteer engineer at Green Future Coalition, has installed 50 air quality sensors near the Henderson Chemical plant in San Francisco. Children in the neighborhood have 3x the asthma rate. The sensors capture evidence, but a broken data pipeline loses 70% of readings. Without reliable data, the EPA won''t investigate.',
  full_text = 'The children in the Bayview neighborhood have been getting sick. Asthma rates are three times the city average. Parents suspect the Henderson Chemical plant, but suspicion isn''t evidence.

James Chen, a software engineer who volunteers at the Green Future Coalition, installed 50 air quality sensors throughout the neighborhood. Each sensor sends a reading every 30 seconds -- 144,000 data points per day. The data could prove contamination. But there''s a problem.

"We''re losing 70% of the readings," Chen says. "The sensors send data, but our ingestion pipeline can''t keep up. It''s a single-threaded script running on a donated laptop."

The readings that do get captured show alarming spikes in particulate matter, especially between 2am and 5am -- when the factory thinks nobody''s watching. But with 70% of data missing, the evidence is full of gaps. The factory''s lawyers would tear it apart.

Chen needs a complete data pipeline: reliable ingestion that doesn''t drop readings, real-time processing to detect pollution events as they happen, long-term storage for the 2 years of data the EPA requires, visualization dashboards for investigators, and court-ready audit trails proving the data wasn''t tampered with.

"Every reading we lose is evidence we can''t use," Chen says. "And every day without evidence is another day those kids are breathing contaminated air."',
  impact_stats = '{"people": 2000, "metric": "community members at risk", "sensors": 50, "readings_per_day": 144000, "data_loss_pct": 70, "asthma_rate_multiplier": 3}',
  urgency_level = 'high',
  grid_size = 'medium',
  sort_weight = 150,
  updated_at = datetime('now')
WHERE id = 'c3d4e5f6-a7b8-9012-cdef-123456789012';

UPDATE news_articles
SET
  headline = 'Family Hardware Store Fights to Survive E-Commerce Expansion',
  subheadline = 'Thompson Hardware''s spreadsheet-based inventory can''t keep up with online orders, threatening a 40-year family legacy.',
  preview_text = 'Lisa Thompson took over her parents'' 40-year-old hardware store in Austin three years ago. She launched e-commerce to compete with big-box stores, but a shared spreadsheet for inventory tracking means phantom sales, wrong counts, and furious customers. She needs a real system before Black Friday.',
  full_text = 'Thompson Hardware has been an Austin institution for 40 years. Founded by Lisa Thompson''s parents with a cash register and a handshake, it grew into a 50-employee operation known for knowledgeable staff and community connection.

When Lisa took over three years ago, she knew the store needed to go online. Big-box stores and Amazon were eating into sales. She launched an e-commerce site. But the underlying inventory system -- a Google Sheets spreadsheet shared via email among 8 employees -- couldn''t handle the complexity.

"We just sold a $450 drill press online that we''d already sold in the store an hour earlier," Thompson says. "This is the third time this week. Two employees edited the spreadsheet at the same time and now our nail counts are off by 11 boxes."

Thompson spends 10 hours every week manually checking stock levels and placing orders with suppliers. She has 12,000 SKUs across the store and the website, and no way to keep them synchronized.

"My parents never had these problems because they had one store and one cash register," she says. "I have a store, a website, and a spreadsheet that lies to me."

With Black Friday approaching and plans for a second location in the works, Thompson needs a system that tracks inventory accurately across channels, automates reordering, survives traffic spikes, and scales to multiple stores -- without losing the family feel that makes Thompson Hardware special.',
  impact_stats = '{"people": 50, "metric": "employees", "skus": 12000, "hours_wasted_weekly": 10, "phantom_sales_weekly": 3}',
  urgency_level = 'high',
  grid_size = 'small',
  sort_weight = 120,
  updated_at = datetime('now')
WHERE id = 'd4e5f6a7-b8c9-0123-defa-234567890123';

UPDATE news_articles
SET
  headline = 'Community Center''s Paper-Based Systems Fail 200 Children Who Need It Most',
  subheadline = 'Unity Community Center''s director pleads for help after volunteer no-shows leave kids without after-school programs.',
  preview_text = 'Marcus Washington directs Unity Community Center in Detroit, the only safe after-school space for 200+ children. Paper sign-ups get lost, the gym is double-booked every Tuesday, and 40% of volunteers are no-shows. A clipboard fell behind a filing cabinet and 30 volunteers never got notified. Marcus needs a system that ensures every kid has somewhere to go.',
  full_text = 'Unity Community Center sits on the corner of MLK Boulevard and Hope Street in Detroit. For 1,200 members -- and especially for 200 children who depend on it as their only safe after-school space -- it''s the most important building in the neighborhood.

But behind the bright murals and the basketball court, director Marcus Washington manages everything with paper clipboards, a whiteboard, and a phone tree that takes three hours to complete.

"A volunteer didn''t show up yesterday," Washington says quietly. "Fifteen kids between ages 8 and 12 had no after-school program. We found out because a parent called asking where her son was. He was sitting on the steps outside the center. Alone."

The center''s management failures are systemic. Last week, a clipboard with 30 volunteer commitments fell behind a filing cabinet and nobody found it until Saturday, when no volunteers showed up for the community food drive. The gym is double-booked every Tuesday -- basketball practice and senior yoga at the same time.

Forty percent of committed volunteers are no-shows, not because they don''t care, but because paper reminders go out too late or not at all. Washington''s coordinator spends every Friday afternoon making reminder calls. Half go to voicemail.

"I need something that doesn''t fall behind filing cabinets," Washington says. "Something that reminds people to show up. Something that makes sure every kid has a program to go to."

With a $200,000 grant application on the horizon that requires data he can''t produce from scattered paper records, Washington needs to go digital -- and fast.',
  impact_stats = '{"people": 1200, "metric": "community members served", "children_dependent": 200, "volunteer_noshow_rate": 40, "programs_weekly": 14}',
  urgency_level = 'high',
  grid_size = 'medium',
  sort_weight = 140,
  updated_at = datetime('now')
WHERE id = 'e5f6a7b8-c9d0-1234-efab-345678901234';
