# Realtime Collaboration Implementation

## Overview

The realtime collaboration feature for SystemDesignCanvas has been successfully implemented using Supabase's Presence API. This allows multiple users to work together on the same system design in real-time.

## Database Schema

The following tables have been created in Supabase:

### 1. `design_sessions`
Stores collaboration sessions for system designs.
- `id`: UUID (Primary Key)
- `scenario_id`: Text (Links to mission/scenario)
- `created_by`: UUID (References profiles)
- `session_name`: Text
- `is_active`: Boolean
- `max_collaborators`: Integer (Default: 10)
- `canvas_state`: JSONB (Stores nodes and edges)
- `created_at`, `updated_at`: Timestamps

### 2. `canvas_components`
Tracks individual components on the canvas.
- `id`: UUID (Primary Key)
- `session_id`: UUID (References design_sessions)
- `component_id`: Text (React Flow node ID)
- `component_type`: Text
- `position`: JSONB ({x, y})
- `data`: JSONB (Component-specific data)
- `style`: JSONB
- `created_by`, `last_modified_by`: UUID
- `is_selected`: Boolean
- `selected_by`: UUID (For conflict resolution)

### 3. `canvas_connections`
Stores connections between components.
- `id`: UUID (Primary Key)
- `session_id`: UUID
- `connection_id`: Text (React Flow edge ID)
- `source_component_id`: Text
- `target_component_id`: Text
- `connection_type`: Text
- `style`: JSONB

### 4. `design_session_participants`
Tracks who's in each session.
- `session_id`: UUID
- `consultant_id`: UUID
- `role`: Text (owner/collaborator/viewer)
- `joined_at`: Timestamp

### 5. `collaboration_logs`
Logs actions for debugging and analytics.
- `id`: UUID
- `session_id`: UUID
- `user_id`: UUID
- `action_type`: Text
- `action_data`: JSONB
- `timestamp`: Timestamp

## Key Components

### 1. `useRealtimeCollaboration` Hook
Located at: `src/hooks/useRealtimeCollaboration.ts`

This custom hook manages:
- Supabase channel subscription
- Presence tracking (user list, cursors)
- Broadcasting component updates
- Selection synchronization

### 2. `SystemDesignCanvas` Component
Located at: `src/components/organisms/SystemDesignCanvas/SystemDesignCanvas.tsx`

Enhanced with:
- React Flow integration
- Drag-and-drop support
- Realtime synchronization
- Cursor tracking
- Component selection broadcasting

### 3. `CollaborationPanel` Component
Located at: `src/components/organisms/CollaborationPanel/CollaborationPanel.tsx`

Features:
- Create new collaboration sessions
- Join existing sessions
- View active participants
- Share session links

### 4. `CursorManager` Component
Located at: `src/components/organisms/CursorManager/CursorManager.tsx`

Displays other users' cursors on the canvas in real-time.

### 5. `CollaboratorCursor` Component
Located at: `src/components/atoms/CollaboratorCursor/CollaboratorCursor.tsx`

Individual cursor component with user avatar and name.

### 6. `ParticipantsList` Component
Located at: `src/components/molecules/ParticipantsList/ParticipantsList.tsx`

Shows list of active collaborators with their status.

## Usage

### Starting a Collaboration Session

1. Navigate to the Design Phase page
2. Click "Show Collaboration" button
3. Click "New Session" in the collaboration panel
4. Enter a session name and create
5. Share the generated link with collaborators

### Joining a Session

1. Use the shared link (includes `?session=SESSION_ID`)
2. Or manually join from the collaboration panel
3. The canvas will sync automatically

### Features Available in Collaborative Mode

- **Real-time cursor tracking**: See where other users are pointing
- **Component synchronization**: Components added/moved/deleted sync instantly
- **Selection indicators**: See which components others are selecting
- **Participant list**: View who's currently active in the session
- **Persistent state**: Canvas state is saved and restored when rejoining

## Technical Details

### Supabase Channel Configuration

```typescript
const channel = supabase.channel(`design_session:${sessionId}`, {
  config: {
    presence: { key: user.id },
    broadcast: { self: false }
  }
});
```

### Presence Data Structure

```typescript
{
  user_id: string;
  name: string;
  avatar_url?: string;
  color: string;
  cursor_position: { x: number; y: number; timestamp: number };
  status: 'active' | 'idle' | 'away';
  last_seen: number;
}
```

### Broadcast Events

- `node_update`: When a component is added or modified
- `node_delete`: When a component is removed
- `edge_update`: When a connection is added
- `edge_delete`: When a connection is removed
- `component_selection`: When selection changes

## Security

All tables have Row Level Security (RLS) enabled:
- Users can only access sessions they created or are participants in
- Components and connections are accessible to session participants
- Logs are write-only for participants

## Testing

Run the test script to verify the setup:

```bash
node scripts/test-realtime-collaboration.js
```

This tests:
1. Table accessibility
2. Session creation
3. Realtime channel subscription
4. Presence API
5. Broadcast functionality

## Future Enhancements

1. **Conflict Resolution**: Handle simultaneous edits to the same component
2. **Permissions**: Implement viewer-only mode
3. **History**: Add undo/redo with collaborative awareness
4. **Voice/Video**: Integrate communication tools
5. **Comments**: Add inline commenting on components
6. **Templates**: Save and share design templates 