-- Migration: Add initial_system_state to mission_stages
-- Stores the broken starting state shown on the Whiteboard when a Stage begins.
-- Format: JSON { "nodes": [...], "edges": [...] } matching the React Flow node shape.

ALTER TABLE mission_stages ADD COLUMN initial_system_state TEXT;

-- ============================================================
-- Mission 1 (health-tracker-crisis) — Stage 1: Separate Concerns
-- Stage ID: bcd0760f-c920-44e8-b658-1674341ea1d8
-- Broken state: Alex's laptop running web server + database together
-- ============================================================
UPDATE mission_stages
SET initial_system_state = '{"nodes":[{"id":"alexs-laptop","type":"custom","position":{"x":500,"y":300},"data":{"label":"Alex''s Laptop","icon":"server","category":"compute","description":"Running both web server and database on one machine"}}],"edges":[]}'
WHERE id = 'bcd0760f-c920-44e8-b658-1674341ea1d8';

-- Stage 2: Add Reliability — web server + database, no backups yet
UPDATE mission_stages
SET initial_system_state = '{"nodes":[{"id":"web-server","type":"custom","position":{"x":400,"y":200},"data":{"label":"Web Server","icon":"server","category":"compute","description":"Handles user requests"}},{"id":"database","type":"custom","position":{"x":650,"y":200},"data":{"label":"SQL Database","icon":"database","category":"database","description":"No backups — single point of failure"}}],"edges":[{"id":"e1","source":"web-server","target":"database"}]}'
WHERE id = 'a1b2c3d4-1111-4111-a111-111111111112';

-- ============================================================
-- Mission 2 (school-enrollment-crisis) — Stage 1: Emergency Triage
-- Stage ID: stage-m2-001
-- Broken state: monolithic server handling everything
-- ============================================================
UPDATE mission_stages
SET initial_system_state = '{"nodes":[{"id":"monolith-server","type":"custom","position":{"x":500,"y":300},"data":{"label":"Monolith Server","icon":"server","category":"compute","description":"Runs enrollment, grade books, and student records all in one — crashes under load"}}],"edges":[]}'
WHERE id = 'stage-m2-001';

-- ============================================================
-- Mission 3 (air-quality-crisis) — Stage 1: Collect the Evidence
-- Stage ID: stage-m3-001
-- Broken state: single-threaded ingestion script dropping readings
-- ============================================================
UPDATE mission_stages
SET initial_system_state = '{"nodes":[{"id":"ingestion-script","type":"custom","position":{"x":500,"y":300},"data":{"label":"Ingestion Script","icon":"server","category":"compute","description":"Single-threaded — drops 70% of sensor readings under load"}}],"edges":[]}'
WHERE id = 'stage-m3-001';

-- ============================================================
-- Mission 4 (inventory-crisis) — Stage 1: Stop the Bleeding
-- Stage ID: stage-m4-001
-- Broken state: shared spreadsheet with no concurrency control
-- ============================================================
UPDATE mission_stages
SET initial_system_state = '{"nodes":[{"id":"shared-spreadsheet","type":"custom","position":{"x":500,"y":300},"data":{"label":"Shared Spreadsheet","icon":"file","category":"database","description":"Emailed between employees — concurrent edits cause data corruption"}}],"edges":[]}'
WHERE id = 'stage-m4-001';

-- ============================================================
-- Mission 5 (volunteer-crisis) — Stage 1: Go Digital
-- Stage ID: stage-m5-001
-- Broken state: paper clipboard sign-up sheets
-- ============================================================
UPDATE mission_stages
SET initial_system_state = '{"nodes":[{"id":"paper-clipboard","type":"custom","position":{"x":500,"y":300},"data":{"label":"Paper Clipboard","icon":"file","category":"other","description":"Sign-up sheets that get lost — 30 volunteer commitments vanished last week"}}],"edges":[]}'
WHERE id = 'stage-m5-001';
