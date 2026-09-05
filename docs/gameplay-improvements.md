# Gameplay reliability implementation

Implemented on 2026-09-05. Scope: repair the five-story MVP before adding new campaigns. Completion feedback reports verified design facts, not fabricated performance metrics. The standalone whiteboard is a device-saved practice space, not a custom mission generator.

Release preparation: production D1 was backed up, and pending migrations `0015`, `0016`, and `0017` were applied successfully on 2026-09-05. The backup is stored privately under the Git-ignored `.wrangler/` directory. The deployment preceding this release was `5fe615a7-2dec-4449-bb72-cb137561d5b9`; application rollback alone does not reverse the database migrations.

Production compatibility: the existing `DesignSessionDO` export and original `v1` migration history remain in the Worker because live namespaces depend on that class. There is no MVP binding or public collaboration route. The legacy fetch/WebSocket handlers remain compatible; no delete-class migration, storage deletion, or namespace recreation is performed.

- [x] Shared graph schema, unique instances, stable stakeholder roles and directed rules.
- [x] Specific component requirements and realistic fixtures for all 25 stages.
- [x] Versioned drafts, accepted snapshots, atomic stage inheritance and conflict handling.
- [x] Canvas loading/saving lifecycle, empty saves, viewport recovery and editing history.
- [x] Click/drag placement, keyboard connection form, reconnect/delete, undo/redo, and validation feedback.
- [x] Consistent game costs and honest completion presentation.
- [x] Mentor receives canonical graph/rule context for UUID and non-UUID stage IDs.
- [x] Continue/review campaign navigation, player progression and optional timer.
- [x] Persisted practice canvas with full catalog and JSON import/export.
- [x] Lint, tests, builds, Worker types and deployment packaging.

## What changed

`shared/game.ts` owns the serializable graph and deterministic evaluator. A node instance ID is separate from its catalog component ID; traffic sources use a stable role rather than a display label. The Worker canonicalizes component identity, category, cost, and broken starting fixtures. New graph writes reject duplicate IDs, dangling/self/duplicate edges, malformed coordinates, and unsupported versions. Legacy reads use a bounded repair adapter.

`useMissionCanvas` owns mission loading, serialized saves, revision checks, per-user/per-stage recovery, and completion. It replaces the old duplicated canvas slice/API/hook. Completion accepts the current graph even before autosave, stores an immutable snapshot and validation result, advances progress, and initializes the next draft in one database batch. Late responses from another route cannot overwrite the active editor. Conflicts require an explicit choice; local data can be exported before loading the server version.

Previous-stage rules remain active with zero additional points. All working components must be integrated into the graph, and every stage needs a directed traffic-source-to-database path. Four scaling stages require one load balancer to connect to two distinct web server instances. These are structural checks, not proofs of security, redundancy, throughput, or performance under failure.

## Campaign and levels

| Story | Five-stage progression | Total Impact |
| --- | --- | ---: |
| Health tracker | Separate concerns → reliability → load and replicas → data protection → monitoring and scale | 240 |
| School district | Triage → enrollment load → shared data → operations → school readiness and replicas | 265 |
| Environmental monitoring | Collection → processing → durable storage → visualization API → auditability | 270 |
| Inventory | Recovery → online/in-store integration → reordering → Black Friday replicas → multi-store | 240 |
| Community center | Digitization → scheduling → volunteer work → monitoring → multi-community replicas | 245 |

Components unlock cumulatively within each story. Player level is `1 + floor(Impact / 250)`; all 25 stages yield 1,260 Impact and level 6. Stages 3/4/5 have budgets of 550/750/900 game credits per month. The optional three-minute challenge pauses in hidden tabs, checks the design at expiry, and never deletes work or auto-awards completion.

## Verification

- `npm run check`: zero lint warnings; 33 tests pass; frontend production build, Worker TypeScript, and generated binding checks pass. CI uses Node 22, and required secret names are declared in Wrangler so generated types do not depend on private local files.
- The 25-stage HTTP journey loads the actual inherited graph, edits it through the production Redux actions using the unlocked palette, compares local/server evaluations, saves, completes, reviews the accepted snapshot, and verifies the next-stage graph and final Impact.
- Negative cases cover wrong direction, broken starting designs, disconnected components, missing replicas, regression of earlier requirements, forged identities/costs, malformed graphs, stale saves/completions, owner isolation, and locked/completed stages.
- React DOM lifecycle tests cover Strict Mode, route changes with delayed responses, empty saves, unsaved recovery with viewport restoration, offline retry, conflict preservation, completion before autosave, and completion during an in-flight save.
- Mentor tests verify non-UUID stage context, canonical graph checks, recent history, malformed-context rejection, and authorization. The model request is mocked; live model quality was not evaluated.
- All migrations run against a fresh local D1 test database. Wrangler migration application also succeeded in an isolated temporary database. Deployment dry run passed without publishing.
- Hand-authored changes pass whitespace checks. Existing unrelated `.swarm` runtime changes are excluded from release commits.

## Release steps and remaining limitations

1. Production backup and migrations through `0017_gameplay_integrity.sql` are complete. Do not edit an already-applied migration; use a new migration for subsequent changes.
2. Run a real browser playthrough on desktop and touch: placement, dragging, reconnecting, keyboard use, timer, practice import/export, and reload. The browser runtime reported no connected browsers here, so visual layout and real pointer/touch behavior remain unverified.
3. Verify one live mentor interaction in staging and monitor errors after release.
4. Address the dependency audit separately: the current lockfile reports 10 advisories (7 high, 2 moderate, 1 low), including Kysely. No broad dependency upgrade or forced audit fix was performed. The build also warns that its Browserslist data is old. Neither warning is an ESLint warning.

Pre-migration completed stages retain their completion records but cannot recover graphs that were never stored; review explicitly explains an unavailable snapshot. Legacy duplicate node IDs can only retain their first unambiguous instance. Practice storage is per user on one browser/device and should be exported for backup. Revision conflicts support preserve/export/reload, not automatic graph merging. Authored branching stories, a mission editor/generator, incident simulation, traffic-capacity calculations, and multiplayer are future work.
