-- Migration: Seed ALL content for playable health-tracker-crisis mission
-- Includes: Components, Mentors, Mission Stages 2-5, Stage Requirements,
--           Mission Emails (story progression), and News Article fixes.
-- All inserts are idempotent (INSERT OR REPLACE / INSERT OR IGNORE).

-- ============================================================
-- 1. COMPONENTS (15 system design building blocks)
-- ============================================================

-- Compute
INSERT OR REPLACE INTO components (id, name, category, icon_name, color, short_description, detailed_description, concepts, use_cases, compatible_with, cost, capacity, min_level, unlock_level, sort_order, created_at, updated_at) VALUES
  ('web_server', 'Web Server', 'compute', 'server', '#3B82F6',
   'Runs your application code and serves web pages to users',
   'A web server accepts HTTP requests from clients (browsers, mobile apps) and returns responses. It serves static files, renders dynamic pages, and routes requests to the appropriate handler. In production, you typically run multiple web servers behind a load balancer for reliability.',
   '["Client-server model", "HTTP requests", "Application logic", "Request routing"]',
   '["Serving web pages", "Handling API calls", "Static file hosting", "Server-side rendering"]',
   '["database", "cache", "load_balancer", "cdn", "api_gateway"]',
   50, 100, 1, 1, 10, datetime('now'), datetime('now')),

  ('app_server', 'Application Server', 'compute', 'cpu', '#2563EB',
   'Handles business logic and API endpoints separately from web serving',
   'An application server runs your core business logic, processing data, enforcing rules, and coordinating between services. Separating it from the web server allows independent scaling and clearer separation of concerns.',
   '["Business logic", "API endpoints", "Service layer", "Separation of concerns"]',
   '["REST APIs", "Background processing", "Microservices", "Data transformation"]',
   '["database", "cache", "load_balancer", "worker", "api_gateway"]',
   80, 100, 1, 2, 20, datetime('now'), datetime('now')),

  ('worker', 'Background Worker', 'compute', 'cog', '#1D4ED8',
   'Processes tasks asynchronously in the background',
   'A background worker picks up tasks from a queue and processes them without blocking the main application. This is ideal for sending emails, generating reports, processing images, or any task that takes too long for a synchronous request.',
   '["Async processing", "Job queues", "Task scheduling", "Worker pools"]',
   '["Email sending", "Report generation", "Image processing", "Data imports"]',
   '["database", "cache", "app_server", "object_storage"]',
   40, 100, 1, 2, 30, datetime('now'), datetime('now'));

-- Database
INSERT OR REPLACE INTO components (id, name, category, icon_name, color, short_description, detailed_description, concepts, use_cases, compatible_with, cost, capacity, min_level, unlock_level, sort_order, created_at, updated_at) VALUES
  ('database', 'SQL Database', 'database', 'database', '#F97316',
   'Stores structured data with strong consistency and SQL queries',
   'A relational database stores data in tables with defined schemas, enforcing data integrity through constraints and transactions. SQL databases excel at complex queries, joins, and ensuring your data is always consistent (ACID properties).',
   '["ACID transactions", "Relational data", "SQL queries", "Data integrity", "Normalization"]',
   '["User accounts", "Financial records", "Inventory systems", "Health records"]',
   '["web_server", "app_server", "cache", "backup", "worker"]',
   100, 100, 1, 1, 40, datetime('now'), datetime('now')),

  ('nosql_db', 'NoSQL Database', 'database', 'layers', '#EA580C',
   'Flexible schema database for unstructured or semi-structured data',
   'NoSQL databases store data without requiring a fixed schema, making them ideal for rapidly changing data structures, document storage, or key-value lookups. They trade some consistency guarantees for horizontal scalability and flexibility.',
   '["Document storage", "Key-value pairs", "Eventual consistency", "Horizontal scaling"]',
   '["User profiles", "Product catalogs", "Session storage", "Real-time analytics"]',
   '["web_server", "app_server", "cache", "backup"]',
   80, 100, 1, 2, 50, datetime('now'), datetime('now'));

-- Cache
INSERT OR REPLACE INTO components (id, name, category, icon_name, color, short_description, detailed_description, concepts, use_cases, compatible_with, cost, capacity, min_level, unlock_level, sort_order, created_at, updated_at) VALUES
  ('cache', 'In-Memory Cache', 'cache', 'zap', '#EF4444',
   'Stores frequently accessed data in memory for ultra-fast reads',
   'An in-memory cache like Redis or Memcached keeps hot data in RAM, reducing database load and dramatically improving response times. The tradeoff is limited storage and the need to handle cache invalidation carefully.',
   '["Cache hit/miss", "TTL (Time to Live)", "Cache invalidation", "LRU eviction"]',
   '["Session storage", "API response caching", "Leaderboards", "Rate limiting"]',
   '["database", "nosql_db", "web_server", "app_server", "load_balancer"]',
   60, 100, 1, 1, 60, datetime('now'), datetime('now'));

-- Networking
INSERT OR REPLACE INTO components (id, name, category, icon_name, color, short_description, detailed_description, concepts, use_cases, compatible_with, cost, capacity, min_level, unlock_level, sort_order, created_at, updated_at) VALUES
  ('load_balancer', 'Load Balancer', 'networking', 'git-branch', '#8B5CF6',
   'Distributes incoming traffic across multiple servers',
   'A load balancer sits in front of your servers and distributes incoming requests across them. This prevents any single server from becoming overwhelmed, improves reliability (if one server fails, traffic routes to others), and enables horizontal scaling.',
   '["Round-robin", "Health checks", "High availability", "Horizontal scaling", "SSL termination"]',
   '["Web application scaling", "API load distribution", "Zero-downtime deployments"]',
   '["web_server", "app_server", "cdn", "firewall", "api_gateway"]',
   70, 100, 1, 1, 70, datetime('now'), datetime('now')),

  ('cdn', 'CDN', 'networking', 'globe', '#7C3AED',
   'Serves static content from edge locations close to users',
   'A Content Delivery Network caches your static assets (images, CSS, JavaScript) on servers distributed worldwide. Users download files from the nearest edge location, dramatically reducing latency and offloading bandwidth from your origin servers.',
   '["Edge caching", "Geographic distribution", "Origin offloading", "Cache headers"]',
   '["Static asset delivery", "Video streaming", "Global web apps", "Download acceleration"]',
   '["web_server", "load_balancer", "object_storage"]',
   50, 100, 1, 1, 80, datetime('now'), datetime('now')),

  ('api_gateway', 'API Gateway', 'networking', 'shield', '#6D28D9',
   'Single entry point for all API requests with rate limiting and auth',
   'An API Gateway acts as the front door for all your APIs. It handles cross-cutting concerns like authentication, rate limiting, request validation, and routing -- so your backend services can focus on business logic.',
   '["Rate limiting", "API versioning", "Request routing", "Authentication proxy"]',
   '["Microservice architectures", "Public APIs", "Mobile backends", "Third-party integrations"]',
   '["load_balancer", "auth_service", "web_server", "app_server", "firewall"]',
   60, 100, 1, 2, 90, datetime('now'), datetime('now'));

-- Storage
INSERT OR REPLACE INTO components (id, name, category, icon_name, color, short_description, detailed_description, concepts, use_cases, compatible_with, cost, capacity, min_level, unlock_level, sort_order, created_at, updated_at) VALUES
  ('object_storage', 'Object Storage', 'storage', 'hard-drive', '#22C55E',
   'Stores files, images, and documents at massive scale',
   'Object storage (like S3 or R2) stores unstructured data as objects with metadata. It scales virtually infinitely, is highly durable, and is cost-effective for large files. Perfect for user uploads, backups, and static assets.',
   '["Blob storage", "Metadata", "Durability", "Presigned URLs"]',
   '["User file uploads", "Image hosting", "Data lake storage", "Backup archives"]',
   '["web_server", "cdn", "backup", "worker"]',
   30, 100, 1, 1, 100, datetime('now'), datetime('now')),

  ('backup', 'Backup Service', 'storage', 'save', '#16A34A',
   'Automated copies of your data for disaster recovery',
   'A backup service automatically creates copies of your critical data on a schedule. It supports point-in-time recovery, letting you restore your database to any moment before a disaster. Essential for any production system.',
   '["Point-in-time recovery", "Disaster recovery", "RPO/RTO", "Incremental backups", "Backup verification"]',
   '["Database backups", "File system snapshots", "Compliance archiving", "Disaster recovery"]',
   '["database", "nosql_db", "object_storage"]',
   40, 100, 1, 1, 110, datetime('now'), datetime('now'));

-- Security
INSERT OR REPLACE INTO components (id, name, category, icon_name, color, short_description, detailed_description, concepts, use_cases, compatible_with, cost, capacity, min_level, unlock_level, sort_order, created_at, updated_at) VALUES
  ('firewall', 'Firewall', 'security', 'shield', '#06B6D4',
   'Controls network traffic and blocks unauthorized access',
   'A firewall monitors and filters network traffic based on security rules. It blocks malicious requests, prevents unauthorized access to internal services, and can detect and mitigate DDoS attacks. Your first line of defense.',
   '["Network rules", "IP whitelisting", "DDoS protection", "Port filtering"]',
   '["Perimeter security", "Internal network segmentation", "DDoS mitigation", "Access control"]',
   '["load_balancer", "web_server", "api_gateway", "auth_service"]',
   30, 100, 1, 1, 120, datetime('now'), datetime('now')),

  ('auth_service', 'Auth Service', 'security', 'lock', '#0891B2',
   'Handles user authentication and authorization',
   'An authentication service manages user identities, login flows, permissions, and access tokens. It supports multiple auth methods (passwords, OAuth, SSO) and ensures only authorized users can access protected resources.',
   '["OAuth 2.0", "JWT tokens", "Role-based access", "Multi-factor auth", "Session management"]',
   '["User login systems", "API authentication", "Single sign-on", "Permission management"]',
   '["web_server", "app_server", "api_gateway", "database", "firewall"]',
   50, 100, 1, 1, 130, datetime('now'), datetime('now'));

-- Observability
INSERT OR REPLACE INTO components (id, name, category, icon_name, color, short_description, detailed_description, concepts, use_cases, compatible_with, cost, capacity, min_level, unlock_level, sort_order, created_at, updated_at) VALUES
  ('monitoring', 'Monitoring', 'observability', 'activity', '#EC4899',
   'Tracks system health, performance, and errors in real-time',
   'A monitoring system collects metrics from all your services -- CPU usage, memory, request latency, error rates -- and visualizes them in dashboards. It triggers alerts when something goes wrong, so you can fix problems before users notice.',
   '["Metrics collection", "Dashboards", "SLAs/SLOs", "Uptime monitoring", "Alerting"]',
   '["Infrastructure monitoring", "Application performance", "Uptime tracking", "Capacity planning"]',
   '["web_server", "app_server", "database", "load_balancer", "logging"]',
   30, 100, 1, 1, 140, datetime('now'), datetime('now')),

  ('logging', 'Logging Service', 'observability', 'file-text', '#DB2777',
   'Collects and stores application logs for debugging',
   'A centralized logging service aggregates logs from all your applications and infrastructure into one searchable place. When something goes wrong, you can trace the exact sequence of events across services to find the root cause.',
   '["Structured logging", "Log aggregation", "Log levels", "Trace correlation", "Audit trails"]',
   '["Debugging production issues", "Security audit trails", "Compliance logging", "Performance analysis"]',
   '["web_server", "app_server", "database", "monitoring", "auth_service"]',
   25, 100, 1, 1, 150, datetime('now'), datetime('now'));


-- ============================================================
-- 2. MENTORS (5 characters)
-- ============================================================

INSERT OR REPLACE INTO mentors (id, name, title, tags, tagline, quote, signature, personality, specialty, lore, created_at, updated_at) VALUES
  ('jordan-rivera', 'Jordan Rivera', 'Startup CTO',
   '["architecture", "scaling", "startups"]',
   'Build it right, then build it fast',
   'The best architecture is the one your team can understand at 3am during an outage.',
   '{"legacy": "Three successful startup exits", "knownFor": "Practical system design under pressure"}',
   '{"style": "practical", "traits": ["direct", "encouraging", "pragmatic"]}',
   '{"tools": ["AWS", "Kubernetes", "PostgreSQL"], "domains": ["web apps", "APIs", "microservices"]}',
   'Jordan built three startups from garage to acquisition. Learned system design the hard way -- through 3am outages and data loss scares. Believes the best architecture is simple enough that a sleep-deprived engineer can debug it.',
   datetime('now'), datetime('now')),

  ('dr-linda-wu', 'Dr. Linda Wu', 'Distributed Systems Professor',
   '["theory", "distributed-systems", "databases"]',
   'Understand the theory, then break the rules',
   'Every system fails. The question is whether you designed for it.',
   '{"legacy": "Published 40+ papers on distributed consensus", "knownFor": "Making CAP theorem intuitive"}',
   '{"style": "academic", "traits": ["patient", "thorough", "precise"]}',
   '{"tools": ["consensus protocols", "CAP theorem", "replication"], "domains": ["distributed systems", "databases", "consistency"]}',
   'Dr. Wu spent 20 years researching distributed systems at MIT before advising some of the largest tech companies on database architecture. She has a gift for making complex theoretical concepts click through simple analogies.',
   datetime('now'), datetime('now')),

  ('sam-okafor', 'Sam Okafor', 'DevOps Lead',
   '["devops", "reliability", "monitoring"]',
   'If you can''t measure it, you can''t fix it',
   'Monitoring isn''t optional. It''s how you sleep at night.',
   '{"legacy": "Built observability at three unicorn startups", "knownFor": "Zero-downtime deployments"}',
   '{"style": "methodical", "traits": ["calm", "systematic", "detail-oriented"]}',
   '{"tools": ["Prometheus", "Grafana", "Terraform"], "domains": ["observability", "CI/CD", "infrastructure"]}',
   'Sam has kept systems running at scale for over a decade. After a catastrophic outage early in his career that took a service offline for 18 hours, he became obsessed with observability and reliability engineering.',
   datetime('now'), datetime('now')),

  ('maya-patel', 'Maya Patel', 'Cloud Architect',
   '["cloud", "serverless", "cost-optimization"]',
   'The cloud is someone else''s computer -- use it wisely',
   'Every dollar you waste on over-provisioned infrastructure is a dollar that could have gone to your users.',
   '{"legacy": "Reduced cloud costs 60% at Fortune 500", "knownFor": "Serverless-first architectures"}',
   '{"style": "strategic", "traits": ["creative", "cost-conscious", "forward-thinking"]}',
   '{"tools": ["Cloudflare", "AWS Lambda", "DynamoDB"], "domains": ["cloud architecture", "serverless", "edge computing"]}',
   'Maya started as a traditional infrastructure engineer before the cloud revolution. She now designs systems that auto-scale from zero to millions of requests, paying only for what they use.',
   datetime('now'), datetime('now')),

  ('chen-zhang', 'Chen Zhang', 'Security Engineer',
   '["security", "privacy", "compliance"]',
   'Security isn''t a feature. It''s a foundation.',
   'Every shortcut in security becomes someone else''s vulnerability.',
   '{"legacy": "Led HIPAA certification for three health-tech companies", "knownFor": "Making security practical, not painful"}',
   '{"style": "cautious", "traits": ["vigilant", "principled", "thorough"]}',
   '{"tools": ["OWASP", "encryption", "zero-trust"], "domains": ["application security", "data privacy", "HIPAA"]}',
   'Chen spent years as a penetration tester before moving to the defensive side. He has led security and compliance initiatives at multiple health-tech companies, and believes security should be baked in from day one, not bolted on after a breach.',
   datetime('now'), datetime('now'));


-- ============================================================
-- 3. MISSION STAGES for health-tracker-crisis (stages 2-5)
-- ============================================================
-- Stage 1 already exists: bcd0760f-c920-44e8-b658-1674341ea1d8
-- Mission ID: 550e8400-e29b-41d4-a716-446655440000

INSERT OR IGNORE INTO mission_stages (id, mission_id, stage_number, title, problem_description, required_components, created_at, updated_at) VALUES
  ('a1b2c3d4-1111-4111-a111-111111111112', '550e8400-e29b-41d4-a716-446655440000', 2,
   'Add Reliability',
   'The health data has been lost twice this week. Alex needs backups and redundancy so the data survives even if a server crashes.',
   '[{"id": "database", "name": "SQL Database", "category": "database"}, {"id": "backup", "name": "Backup Service", "category": "storage"}]',
   datetime('now'), datetime('now')),

  ('a1b2c3d4-2222-4222-a222-222222222223', '550e8400-e29b-41d4-a716-446655440000', 3,
   'Handle the Load',
   'Word has spread. 2,000 families now want to use the tracker. The single web server can''t handle the traffic -- pages take 30 seconds to load during peak hours.',
   '[{"id": "load_balancer", "name": "Load Balancer", "category": "networking"}, {"id": "web_server", "name": "Web Server", "category": "compute"}, {"id": "cache", "name": "In-Memory Cache", "category": "cache"}]',
   datetime('now'), datetime('now')),

  ('a1b2c3d4-3333-4333-a333-333333333334', '550e8400-e29b-41d4-a716-446655440000', 4,
   'Protect Patient Data',
   'A local news story about the health tracker means the city health department wants to use it. But they require HIPAA-level security -- encrypted data, authenticated access, and audit logging.',
   '[{"id": "auth_service", "name": "Auth Service", "category": "security"}, {"id": "firewall", "name": "Firewall", "category": "security"}, {"id": "logging", "name": "Logging Service", "category": "observability"}]',
   datetime('now'), datetime('now')),

  ('a1b2c3d4-4444-4444-a444-444444444445', '550e8400-e29b-41d4-a716-446655440000', 5,
   'Monitor & Scale',
   'The system is serving 10,000+ families across three counties. Alex needs to know when something goes wrong before users notice -- proactive monitoring, alerting, and the ability to scale automatically.',
   '[{"id": "monitoring", "name": "Monitoring", "category": "observability"}, {"id": "cdn", "name": "CDN", "category": "networking"}, {"id": "api_gateway", "name": "API Gateway", "category": "networking"}]',
   datetime('now'), datetime('now'));


-- ============================================================
-- 4. STAGE REQUIREMENTS for ALL 5 stages
-- ============================================================

-- ----- Stage 1: Separate Concerns (bcd0760f-c920-44e8-b658-1674341ea1d8) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-s1-001', 'bcd0760f-c920-44e8-b658-1674341ea1d8',
   'Add a Web Server',
   'Drag a Web Server component onto the canvas to handle HTTP requests from families.',
   'component_required',
   '{"required_components": ["compute"], "min_instances": 1}',
   1, 1, 1, 10,
   'Drag a Web Server from the component panel on the left',
   datetime('now'), datetime('now')),

  ('req-s1-002', 'bcd0760f-c920-44e8-b658-1674341ea1d8',
   'Add a Database',
   'Add a SQL Database to store the health records separately from the web server.',
   'component_required',
   '{"required_components": ["database"], "min_instances": 1}',
   1, 2, 1, 10,
   'The data needs its own dedicated database -- look in the Database category',
   datetime('now'), datetime('now')),

  ('req-s1-003', 'bcd0760f-c920-44e8-b658-1674341ea1d8',
   'Connect families to the server',
   'Draw a connection from the Families node to the Web Server so requests can flow.',
   'connection_required',
   '{"source_types": ["families"], "target_types": ["compute"]}',
   2, 3, 1, 20,
   'Click and drag from the Families node to the Web Server to create an edge',
   datetime('now'), datetime('now')),

  ('req-s1-004', 'bcd0760f-c920-44e8-b658-1674341ea1d8',
   'Connect server to database',
   'Connect the Web Server to the Database so the application can read and write health data.',
   'connection_required',
   '{"source_types": ["compute"], "target_types": ["database"]}',
   2, 4, 1, 20,
   'The server needs to talk to the database -- draw a line between them',
   datetime('now'), datetime('now'));

-- ----- Stage 2: Add Reliability (a1b2c3d4-1111-4111-a111-111111111112) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-s2-001', 'a1b2c3d4-1111-4111-a111-111111111112',
   'Add a Backup Service',
   'Add a Backup Service to automatically create copies of the health data for disaster recovery.',
   'component_required',
   '{"required_components": ["storage"], "min_instances": 1}',
   1, 1, 1, 10,
   'Look for Backup Service in the Storage category',
   datetime('now'), datetime('now')),

  ('req-s2-002', 'a1b2c3d4-1111-4111-a111-111111111112',
   'Connect database to backup',
   'Connect the SQL Database to the Backup Service so data is automatically backed up.',
   'connection_required',
   '{"source_types": ["database"], "target_types": ["storage"]}',
   2, 2, 1, 20,
   'Draw a connection from the Database to the Backup Service',
   datetime('now'), datetime('now')),

  ('req-s2-003', 'a1b2c3d4-1111-4111-a111-111111111112',
   'Keep the original architecture',
   'Make sure the Web Server and Database from Stage 1 are still present on the canvas.',
   'node_count',
   '{"required_components": ["compute", "database"], "min_instances": 1}',
   1, 3, 1, 10,
   'Don''t remove components from the previous stage -- build on top of them',
   datetime('now'), datetime('now'));

-- ----- Stage 3: Handle the Load (a1b2c3d4-2222-4222-a222-222222222223) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-s3-001', 'a1b2c3d4-2222-4222-a222-222222222223',
   'Add a Load Balancer',
   'Add a Load Balancer to distribute traffic across multiple servers.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   1, 1, 1, 10,
   'A Load Balancer goes in front of your web servers to spread the traffic',
   datetime('now'), datetime('now')),

  ('req-s3-002', 'a1b2c3d4-2222-4222-a222-222222222223',
   'Add a Cache',
   'Add an In-Memory Cache to speed up frequently accessed data.',
   'component_required',
   '{"required_components": ["cache"], "min_instances": 1}',
   1, 2, 1, 10,
   'A cache stores hot data in memory so the database isn''t hit for every request',
   datetime('now'), datetime('now')),

  ('req-s3-003', 'a1b2c3d4-2222-4222-a222-222222222223',
   'Connect load balancer to servers',
   'Connect the Load Balancer to the Web Server(s) so traffic flows through it.',
   'connection_required',
   '{"source_types": ["networking"], "target_types": ["compute"]}',
   2, 3, 1, 20,
   'The Load Balancer needs to know which servers to send traffic to',
   datetime('now'), datetime('now')),

  ('req-s3-004', 'a1b2c3d4-2222-4222-a222-222222222223',
   'Connect cache to database',
   'Connect the Cache to the Database so it can store frequently queried data.',
   'connection_required',
   '{"source_types": ["cache"], "target_types": ["database"]}',
   2, 4, 1, 20,
   'The cache sits between the application and the database',
   datetime('now'), datetime('now'));

-- ----- Stage 4: Protect Patient Data (a1b2c3d4-3333-4333-a333-333333333334) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-s4-001', 'a1b2c3d4-3333-4333-a333-333333333334',
   'Add Authentication',
   'Add an Auth Service to handle user login and access control for HIPAA compliance.',
   'component_required',
   '{"required_components": ["security"], "min_instances": 1}',
   1, 1, 1, 15,
   'HIPAA requires authenticated access -- add an Auth Service from the Security category',
   datetime('now'), datetime('now')),

  ('req-s4-002', 'a1b2c3d4-3333-4333-a333-333333333334',
   'Add a Firewall',
   'Add a Firewall to control network access and block unauthorized traffic.',
   'component_required',
   '{"required_components": ["security"], "min_instances": 2}',
   1, 2, 1, 15,
   'You need both Auth Service and Firewall for HIPAA -- two security components total',
   datetime('now'), datetime('now')),

  ('req-s4-003', 'a1b2c3d4-3333-4333-a333-333333333334',
   'Add Logging',
   'Add a Logging Service to create audit trails required for HIPAA compliance.',
   'component_required',
   '{"required_components": ["observability"], "min_instances": 1}',
   1, 3, 1, 15,
   'HIPAA requires audit logs -- add a Logging Service from the Observability category',
   datetime('now'), datetime('now'));

-- ----- Stage 5: Monitor & Scale (a1b2c3d4-4444-4444-a444-444444444445) -----
INSERT OR REPLACE INTO mission_stage_requirements (id, stage_id, title, description, requirement_type, validation_config, priority, unlock_order, initially_visible, points, hint, created_at, updated_at) VALUES
  ('req-s5-001', 'a1b2c3d4-4444-4444-a444-444444444445',
   'Add Monitoring',
   'Add a Monitoring service to track system health and alert when something goes wrong.',
   'component_required',
   '{"required_components": ["observability"], "min_instances": 1}',
   1, 1, 1, 15,
   'Monitoring lets you see CPU, memory, errors, and latency in real-time dashboards',
   datetime('now'), datetime('now')),

  ('req-s5-002', 'a1b2c3d4-4444-4444-a444-444444444445',
   'Add a CDN',
   'Add a CDN to serve static content quickly to families spread across three counties.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   2, 2, 1, 10,
   'A CDN helps serve static content to users across three counties from nearby edge locations',
   datetime('now'), datetime('now')),

  ('req-s5-003', 'a1b2c3d4-4444-4444-a444-444444444445',
   'Add an API Gateway',
   'Add an API Gateway as the single entry point for all API requests with rate limiting.',
   'component_required',
   '{"required_components": ["networking"], "min_instances": 1}',
   2, 3, 1, 10,
   'An API Gateway manages all API traffic in one place with rate limiting and authentication',
   datetime('now'), datetime('now'));


-- ============================================================
-- 5. MISSION EMAILS (story progression)
-- ============================================================

-- Stage 1 completion -> Stage 2 intro
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-stage1-complete', '550e8400-e29b-41d4-a716-446655440000', 'bcd0760f-c920-44e8-b658-1674341ea1d8',
   'Alex Chen', 'alex.chen@example.com',
   'It''s working! But I''m worried about the data...',
   'The separate server setup is working great -- no more crashes!',
   'Hi,

The separate server setup is working great -- no more crashes! Families can submit their symptom reports without the system freezing. You really saved us.

But I''m terrified of losing data again. Last week the database crashed and we lost 3 days of symptom reports. 47 families had to re-enter everything. Some of them just gave up.

Is there a way to protect against that? Like, if the database goes down, can we have a copy of the data somewhere safe?

We can''t afford to lose this data -- it''s evidence. The environmental agency is starting to pay attention, and every data point matters.

Thanks,
Alex',
   'high',
   '["progress", "reliability", "data-loss"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 2 completion -> Stage 3 intro
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-stage2-complete', '550e8400-e29b-41d4-a716-446655440000', 'a1b2c3d4-1111-4111-a111-111111111112',
   'Alex Chen', 'alex.chen@example.com',
   'We''re going viral... in a bad way',
   'A local journalist wrote about our tracker and now everyone wants to use it.',
   'Hey,

So... a local journalist wrote a story about our community health tracker. It was supposed to be a feel-good piece about neighbors helping each other. But it went viral on social media.

We went from 200 to 2,000 families overnight. The server is crawling -- pages take 30 seconds to load. During peak hours (evenings when parents get home from work), the site is basically unusable.

Families are giving up and going back to paper records. We''re losing the momentum we built.

I know you designed the system to handle our little neighborhood, but can we make it handle this kind of growth? These families need this tracker just as much as we do.

Desperately,
Alex',
   'urgent',
   '["growth", "performance", "scaling"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 3 completion -> Stage 4 intro
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-stage3-complete', '550e8400-e29b-41d4-a716-446655440000', 'a1b2c3d4-2222-4222-a222-222222222223',
   'Alex Chen', 'alex.chen@example.com',
   'The city health department wants in',
   'Amazing news -- the city health department saw our tracker and wants to adopt it officially!',
   'Amazing news!!

The city health department saw our tracker and wants to adopt it officially. They want to use it to coordinate their environmental health response across the whole city.

But they have strict requirements. They need HIPAA compliance:
- Encrypted data at rest and in transit
- User authentication with role-based access
- Firewall protection for the network
- Complete audit logs of who accessed what data and when

They gave us 2 weeks to meet these requirements. If we pull this off, this becomes an official public health tool backed by the city. That means funding, legitimacy, and real political power to force a cleanup.

Can we add security without breaking what we already built?

Excitedly (and nervously),
Alex',
   'high',
   '["security", "compliance", "HIPAA", "government"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Stage 4 completion -> Stage 5 intro
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-stage4-complete', '550e8400-e29b-41d4-a716-446655440000', 'a1b2c3d4-3333-4333-a333-333333333334',
   'Alex Chen', 'alex.chen@example.com',
   'Three counties and counting',
   'We did it -- HIPAA certified! The tracker is now serving families across three counties.',
   'We did it -- HIPAA certified!!

The city health department officially adopted the tracker. And then two neighboring counties asked to join. We''re now serving 10,000+ families across three counties.

But I''m flying blind. Yesterday the database was at 95% capacity and I didn''t know until users started complaining about errors. Last week a server went down for 2 hours before anyone noticed.

I need to see what''s happening before users do. Real-time dashboards, alerts when things go wrong, the ability to know something is about to break before it actually does.

And with users spread across the state, everything needs to be fast everywhere -- not just for people close to our servers.

One last push?

Alex',
   'high',
   '["monitoring", "observability", "scaling", "performance"]',
   'primary',
   'stage_complete',
   datetime('now'), datetime('now'));

-- Mission complete
INSERT OR REPLACE INTO mission_emails (id, mission_id, stage_id, sender_name, sender_email, subject, preview, body, priority, tags, category, trigger_type, created_at, updated_at) VALUES
  ('email-mission-complete', '550e8400-e29b-41d4-a716-446655440000', NULL,
   'Alex Chen', 'alex.chen@example.com',
   'You changed everything',
   'I just got off the phone with the state epidemiologist...',
   'I just got off the phone with the state epidemiologist. Using our data, they identified the contamination source -- an old industrial site leaking into the groundwater. The cleanup starts next month.

None of this would have happened without the system you designed. 200 families became 10,000. A laptop became a platform. Data that used to disappear is now backed up, encrypted, and monitored.

The system you built:
- Survived a viral news story without going down
- Passed HIPAA certification on the first try
- Serves three counties with sub-second response times
- Has 99.9% uptime since you added monitoring

Thank you. You didn''t just fix a tech problem. You helped prove that an entire neighborhood was being poisoned. And now it''s getting fixed.

-- Alex

P.S. The city council voted unanimously to fund the cleanup. The families wanted me to tell you: you gave them their voice back.',
   'normal',
   '["success", "impact", "completion"]',
   'primary',
   'mission_complete',
   datetime('now'), datetime('now'));


-- ============================================================
-- 6. FIX NEWS ARTICLE -> MISSION LINKAGE
-- ============================================================

-- Link the healthcare article to the real mission UUID
UPDATE news_articles SET mission_id = '550e8400-e29b-41d4-a716-446655440000' WHERE mission_id = 'mission_1';


-- ============================================================
-- 7. UPDATE HEALTHCARE NEWS ARTICLE with richer content
-- ============================================================

UPDATE news_articles
SET
  headline = 'Community Health Crisis: Parent''s DIY Tracker Crashes as 200 Families Depend on It',
  subheadline = 'A neighborhood parent built a health tracking system on a laptop. Now it''s failing -- and the data could prove environmental contamination.',
  preview_text = 'Alex Chen built a community health tracker to document mysterious symptoms affecting neighborhood children. With 200+ families depending on it, the system is crashing and data is being lost. Alex needs help designing a real system architecture.',
  full_text = 'In a quiet neighborhood on the east side, children have been getting sick at alarming rates. Respiratory issues, skin rashes, and neurological symptoms that doctors can''t explain. Parent and community organizer Alex Chen started documenting everything.

"I built a simple website on my laptop to let families report symptoms," Chen explains. "Date, symptoms, severity, location. I thought maybe 20 families would use it."

200 families signed up in the first month.

Now the system -- a basic Node.js server with SQLite running on Chen''s MacBook -- crashes every few hours. Critical health data has been lost twice. The database and web server compete for resources on the same machine, and the laptop''s fan runs so loud that Chen''s kids call it "the angry computer."

"Every data point matters," Chen says, voice breaking. "We''re trying to prove there''s something in the water. The environmental agency won''t act without evidence, and our evidence keeps disappearing."

Chen is looking for someone with system design skills to help architect a proper solution -- one that can handle the growing number of families, keep the data safe, and eventually scale to serve the whole city.

The stakes couldn''t be higher. Preliminary analysis of the data already collected suggests a correlation between proximity to an old industrial site and symptom severity. But without a reliable system, the evidence remains fragmented and vulnerable.',
  impact_stats = '{"people": 200, "metric": "families at risk", "families_affected": 200, "children_sick": 47, "data_points_lost": 1200}',
  urgency_level = 'critical',
  grid_size = 'featured',
  sort_weight = 200,
  author_name = 'Maria Gonzalez',
  publication_name = 'Community Health Watch',
  location = 'East River District',
  tags = '["healthcare", "system-design", "databases", "community", "environment"]',
  updated_at = datetime('now')
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
