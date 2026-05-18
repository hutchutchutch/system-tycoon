# ADR 0001: Remove real-time collaboration

**Status:** Decided  
**Date:** 2026-05-18

## Context

Early in development, multi-user real-time co-editing of the Whiteboard was explored. Code was written for `collaborationSlice`, `CollaborationPanel`, `InviteCollaboratorModal`, `realtimeCollaboration`, and `CursorManager`.

## Decision

Remove all collaboration code. The product is a single-user learning experience. Multi-user editing adds infrastructure complexity (Durable Objects, presence state, conflict resolution) with no corresponding product value — the Mission/Stage/Whiteboard model is designed around one User solving one problem at a time.

## Consequences

- Dead code (`collaborationSlice`, `CollaborationPanel`, `InviteCollaboratorModal`, `realtimeCollaboration.ts`, `CursorManager`) should be deleted
- The `collaborationSlice` in the Redux store should be removed and its state eliminated
- No multiplayer session concept exists in the domain model
