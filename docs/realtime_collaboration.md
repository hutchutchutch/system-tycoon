# Realtime Collaboration on SystemDesignCanvas

**Version:** 1.0  
**Date:** January 2025  
**Status:** Implementation Guide  

## Table of Contents
1. [Overview](#overview)
2. [Architecture Design](#architecture-design)
3. [Database Schema](#database-schema)
4. [Client Implementation](#client-implementation)
5. [Cursor Tracking](#cursor-tracking)
6. [Component Synchronization](#component-synchronization)
7. [User Presence Management](#user-presence-management)
8. [Performance Optimization](#performance-optimization)
9. [Security & Authorization](#security--authorization)
10. [Implementation Steps](#implementation-steps)
11. [Testing & Debugging](#testing--debugging)

---

## Overview

### The Vision
Transform the SystemDesignCanvas into a collaborative workspace where multiple users can work together in real-time, similar to Figma or Miro. Users will see:

- **Live cursor movements** of other collaborators
- **Real-time component placement** and modifications  
- **User presence indicators** showing who's currently active
- **Collaborative conflict resolution** when multiple users edit the same component
- **Synchronized canvas state** across all connected clients

### Core Requirements
- Support 2-10 concurrent users per design session
- Sub-200ms latency for cursor movements
- Persistent component state across sessions
- Graceful handling of user disconnections
- Integration with existing SystemDesignCanvas architecture

### Technology Stack
- **Frontend**: React Flow + Supabase Realtime JavaScript Client
- **Backend**: Supabase Realtime (Presence API + Broadcast API)
- **Database**: PostgreSQL with Row Level Security
- **Transport**: WebSockets via Supabase Realtime

---

## Architecture Design

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client A      │    │   Client B      │    │   Client C      │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ React     │  │    │  │ React     │  │    │  │ React     │  │
│  │ Flow      │  │    │  │ Flow      │  │    │  │ Flow      │  │
│  │ Canvas    │  │    │  │ Canvas    │  │    │  │ Canvas    │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│        │        │    │        │        │    │        │        │
└────────┼────────┘    └────────┼────────┘    └────────┼────────┘
         │                      │                      │
         │              WebSocket Connections          │
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                ┌───────────────────────────────┐
                │    Supabase Realtime         │
                │                              │
                │  ┌─────────────────────────┐ │
                │  │    Presence API         │ │
                │  │  (User State & Cursors) │ │
                │  └─────────────────────────┘ │
                │                              │
                │  ┌─────────────────────────┐ │
                │  │    Broadcast API        │ │
                │  │  (Component Changes)    │ │
                │  └─────────────────────────┘ │
                │                              │
                │  ┌─────────────────────────┐ │
                │  │  Postgres Changes       │ │
                │  │  (Persistent State)     │ │
                │  └─────────────────────────┘ │
                └───────────────────────────────┘
                                │
                    ┌─────────────────────┐
                    │    PostgreSQL       │
                    │                     │
                    │  ┌───────────────┐  │
                    │  │ design_       │  │
                    │  │ sessions      │  │
                    │  └───────────────┘  │
                    │                     │
                    │  ┌───────────────┐  │
                    │  │ canvas_       │  │
                    │  │ components    │  │
                    │  └───────────────┘  │
                    │                     │
                    │  ┌───────────────┐  │
                    │  │ collaboration │  │
                    │  │ _logs         │  │
                    │  └───────────────┘  │
                    └─────────────────────┘
```

### Event Flow Architecture
```typescript
interface CollaborationEventFlow {
  // User actions trigger events
  userAction: 'cursor_move' | 'component_add' | 'component_move' | 'component_delete' | 'connection_add';
  
  // Events flow through different channels based on frequency
  channels: {
    presence: 'frequent_updates',  // cursor moves, user status
    broadcast: 'component_changes', // component CRUD operations
    postgres: 'persistent_state'    // final state persistence
  };
  
  // State synchronization strategy
  sync: {
    immediate: ['cursor_position', 'user_status'],
    throttled: ['component_position', 'component_selection'],
    batched: ['component_creation', 'component_deletion'],
    persistent: ['canvas_save', 'session_end']
  };
}
```

---

## Database Schema

### Core Tables
```sql
-- Design sessions for collaboration
CREATE TABLE design_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id TEXT NOT NULL,
  created_by UUID REFERENCES consultant_profiles(id),
  session_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  max_collaborators INTEGER DEFAULT 10,
  canvas_state JSONB DEFAULT '{"nodes": [], "edges": []}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual canvas components with real-time tracking
CREATE TABLE canvas_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES design_sessions(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL, -- React Flow node ID
  component_type TEXT NOT NULL, -- 'web-server', 'database', etc.
  position JSONB NOT NULL, -- {x: number, y: number}
  data JSONB DEFAULT '{}', -- Component-specific data
  style JSONB DEFAULT '{}', -- Visual styling
  created_by UUID REFERENCES consultant_profiles(id),
  last_modified_by UUID REFERENCES consultant_profiles(id),
  is_selected BOOLEAN DEFAULT FALSE,
  selected_by UUID REFERENCES consultant_profiles(id), -- For conflict resolution
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(session_id, component_id)
);

-- Component connections (React Flow edges)
CREATE TABLE canvas_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES design_sessions(id) ON DELETE CASCADE,
  connection_id TEXT NOT NULL, -- React Flow edge ID
  source_component_id TEXT NOT NULL,
  target_component_id TEXT NOT NULL,
  connection_type TEXT DEFAULT 'default',
  style JSONB DEFAULT '{}',
  created_by UUID REFERENCES consultant_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(session_id, connection_id)
);

-- Collaboration participants
CREATE TABLE session_participants (
  session_id UUID REFERENCES design_sessions(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) DEFAULT 'editor',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (session_id, consultant_id)
);

-- Real-time collaboration logs for debugging
CREATE TABLE collaboration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES design_sessions(id),
  user_id UUID REFERENCES consultant_profiles(id),
  action_type TEXT NOT NULL,
  action_data JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_design_sessions_active ON design_sessions(is_active);
CREATE INDEX idx_canvas_components_session ON canvas_components(session_id);
CREATE INDEX idx_canvas_components_updated ON canvas_components(updated_at);
CREATE INDEX idx_session_participants_active ON session_participants(last_active);
```

### Row Level Security Policies
```sql
-- Enable RLS on all tables
ALTER TABLE design_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;

-- Participants can only access sessions they're part of
CREATE POLICY "Users can access their sessions" ON design_sessions
  FOR ALL USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM session_participants 
      WHERE session_id = design_sessions.id 
      AND consultant_id = auth.uid()
    )
  );

-- Components are accessible to session participants
CREATE POLICY "Session participants can access components" ON canvas_components
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM session_participants 
      WHERE session_id = canvas_components.session_id 
      AND consultant_id = auth.uid()
    )
  );

-- Similar policies for connections and participants
CREATE POLICY "Session participants can access connections" ON canvas_connections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM session_participants 
      WHERE session_id = canvas_connections.session_id 
      AND consultant_id = auth.uid()
    )
  );
```

---

## Client Implementation

### Core Collaboration Hook
```typescript
// src/hooks/useRealtimeCollaboration.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { throttle } from 'lodash-es';

interface CollaborationState {
  participants: Record<string, ParticipantInfo>;
  cursors: Record<string, CursorPosition>;
  selections: Record<string, string[]>; // user_id -> component_ids
}

interface ParticipantInfo {
  id: string;
  name: string;
  avatar_url?: string;
  color: string;
  last_seen: number;
  status: 'active' | 'idle' | 'away';
}

interface CursorPosition {
  x: number;
  y: number;
  timestamp: number;
}

export const useRealtimeCollaboration = (sessionId: string) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  const [collaborationState, setCollaborationState] = useState<CollaborationState>({
    participants: {},
    cursors: {},
    selections: {}
  });
  
  const [isConnected, setIsConnected] = useState(false);
  
  // Generate user color based on user ID
  const userColor = useRef<string>('');
  
  useEffect(() => {
    if (user?.id) {
      userColor.current = generateUserColor(user.id);
    }
  }, [user?.id]);

  // Throttled cursor tracking
  const throttledCursorTrack = useCallback(
    throttle((position: CursorPosition) => {
      if (channelRef.current && user) {
        channelRef.current.track({
          user_id: user.id,
          name: user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url,
          color: userColor.current,
          cursor_position: position,
          status: 'active',
          last_seen: Date.now()
        });
      }
    }, 50), // 20 FPS for smooth cursor movement
    [user]
  );

  // Component state broadcasting (less frequent)
  const throttledComponentUpdate = useCallback(
    throttle((componentData: any) => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'component_update',
          payload: componentData
        });
      }
    }, 100), // 10 FPS for component updates
    []
  );

  // Initialize collaboration channel
  useEffect(() => {
    if (!sessionId || !user) return;

    const channelName = `design_session:${sessionId}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: { key: user.id },
        broadcast: { self: false }
      }
    });

    // Presence sync - when user list changes
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const participants: Record<string, ParticipantInfo> = {};
      const cursors: Record<string, CursorPosition> = {};

      Object.keys(presenceState).forEach(userId => {
        const presence = presenceState[userId][0];
        if (presence) {
          participants[userId] = {
            id: userId,
            name: presence.name,
            avatar_url: presence.avatar_url,
            color: presence.color,
            last_seen: presence.last_seen,
            status: presence.status
          };

          if (presence.cursor_position) {
            cursors[userId] = presence.cursor_position;
          }
        }
      });

      setCollaborationState(prev => ({
        ...prev,
        participants,
        cursors
      }));
    });

    // Presence join - new user joins
    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log(`👥 User ${key} joined the session`);
    });

    // Presence leave - user leaves
    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log(`👋 User ${key} left the session`);
      setCollaborationState(prev => {
        const newState = { ...prev };
        delete newState.participants[key];
        delete newState.cursors[key];
        delete newState.selections[key];
        return newState;
      });
    });

    // Broadcast events - component changes
    channel.on('broadcast', { event: 'component_update' }, ({ payload }) => {
      // Handle component updates from other users
      handleRemoteComponentUpdate(payload);
    });

    channel.on('broadcast', { event: 'component_selection' }, ({ payload }) => {
      // Handle component selection from other users
      setCollaborationState(prev => ({
        ...prev,
        selections: {
          ...prev.selections,
          [payload.user_id]: payload.selected_components
        }
      }));
    });

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        console.log(`✅ Connected to collaboration session: ${sessionId}`);
        
        // Initial presence tracking
        channel.track({
          user_id: user.id,
          name: user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url,
          color: userColor.current,
          status: 'active',
          last_seen: Date.now()
        });
      } else {
        setIsConnected(false);
        console.log(`❌ Connection status: ${status}`);
      }
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [sessionId, user]);

  // API methods
  const trackCursor = useCallback((x: number, y: number) => {
    throttledCursorTrack({ x, y, timestamp: Date.now() });
  }, [throttledCursorTrack]);

  const updateComponent = useCallback((componentData: any) => {
    throttledComponentUpdate(componentData);
  }, [throttledComponentUpdate]);

  const selectComponents = useCallback((componentIds: string[]) => {
    if (channelRef.current && user) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'component_selection',
        payload: {
          user_id: user.id,
          selected_components: componentIds
        }
      });
    }
  }, [user]);

  return {
    collaborationState,
    isConnected,
    trackCursor,
    updateComponent,
    selectComponents
  };
};

// Helper function to generate consistent user colors
function generateUserColor(userId: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return colors[Math.abs(hash) % colors.length];
}

// Handle remote component updates
function handleRemoteComponentUpdate(payload: any) {
  // This will be implemented to update React Flow state
  // without triggering infinite loops
  console.log('Remote component update:', payload);
}
```

---

## Cursor Tracking

### Cursor Component
```typescript
// src/components/atoms/CollaboratorCursor/CollaboratorCursor.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CollaboratorCursorProps {
  x: number;
  y: number;
  color: string;
  name: string;
  avatar?: string;
  isVisible: boolean;
}

export const CollaboratorCursor: React.FC<CollaboratorCursorProps> = ({
  x,
  y,
  color,
  name,
  avatar,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      initial={{ x: x - 12, y: y - 12, opacity: 0 }}
      animate={{ 
        x: x - 12, 
        y: y - 12, 
        opacity: 1,
        transition: { 
          type: 'spring',
          stiffness: 500,
          damping: 30
        }
      }}
      exit={{ opacity: 0 }}
    >
      {/* Cursor SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-lg"
      >
        <path
          d="M5.65 1.74L13.73 21.94C13.93 22.54 14.83 22.54 15.03 21.94L17.05 15.74L21.29 13.05C21.89 12.65 21.69 11.75 20.99 11.55L1.09 3.49C0.49 3.29 0.29 2.39 0.89 1.99L5.65 1.74Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      
      {/* User name badge */}
      <div 
        className="absolute top-6 left-4 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap shadow-lg"
        style={{ backgroundColor: color }}
      >
        {avatar && (
          <img 
            src={avatar} 
            alt={name}
            className="inline-block w-4 h-4 rounded-full mr-1 border border-white/30"
          />
        )}
        {name}
      </div>
    </motion.div>
  );
};
```

### Cursor Manager
```typescript
// src/components/organisms/CursorManager/CursorManager.tsx
import React, { useEffect, useState } from 'react';
import { CollaboratorCursor } from '../../atoms/CollaboratorCursor';

interface CursorManagerProps {
  cursors: Record<string, CursorPosition>;
  participants: Record<string, ParticipantInfo>;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export const CursorManager: React.FC<CursorManagerProps> = ({
  cursors,
  participants,
  canvasRef
}) => {
  const [canvasBounds, setCanvasBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (canvasRef.current) {
        setCanvasBounds(canvasRef.current.getBoundingClientRect());
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [canvasRef]);

  if (!canvasBounds) return null;

  return (
    <>
      {Object.entries(cursors).map(([userId, cursor]) => {
        const participant = participants[userId];
        if (!participant) return null;

        // Convert canvas-relative coordinates to screen coordinates
        const screenX = canvasBounds.left + cursor.x;
        const screenY = canvasBounds.top + cursor.y;

        // Hide if cursor is outside canvas bounds
        const isVisible = 
          screenX >= canvasBounds.left &&
          screenX <= canvasBounds.right &&
          screenY >= canvasBounds.top &&
          screenY <= canvasBounds.bottom;

        return (
          <CollaboratorCursor
            key={userId}
            x={screenX}
            y={screenY}
            color={participant.color}
            name={participant.name}
            avatar={participant.avatar_url}
            isVisible={isVisible}
          />
        );
      })}
    </>
  );
};
```

---

## Component Synchronization

### Enhanced SystemDesignCanvas with Collaboration
```typescript
// src/screens/game/SystemDesignCanvas.tsx (Enhanced)
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useRealtimeCollaboration } from '../../hooks/useRealtimeCollaboration';
import { CursorManager } from '../../components/organisms/CursorManager';
import { ParticipantsList } from '../../components/molecules/ParticipantsList';

export const SystemDesignCanvas: React.FC = () => {
  const { scenarioId } = useParams();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Existing state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Collaboration state
  const sessionId = `${scenarioId}-${user?.id}`; // Generate or get from props
  const { 
    collaborationState, 
    isConnected, 
    trackCursor, 
    updateComponent,
    selectComponents 
  } = useRealtimeCollaboration(sessionId);

  // Track mouse movement for cursor sharing
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const bounds = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    
    trackCursor(x, y);
  }, [trackCursor]);

  // Enhanced node change handler with collaboration
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Broadcast significant changes to other users
    const significantChanges = changes.filter(change => 
      change.type === 'position' || 
      change.type === 'add' || 
      change.type === 'remove'
    );
    
    if (significantChanges.length > 0) {
      updateComponent({
        type: 'nodes_changed',
        changes: significantChanges,
        timestamp: Date.now(),
        user_id: user?.id
      });
    }
  }, [onNodesChange, updateComponent, user?.id]);

  // Enhanced edge change handler
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    
    const significantChanges = changes.filter(change => 
      change.type === 'add' || 
      change.type === 'remove'
    );
    
    if (significantChanges.length > 0) {
      updateComponent({
        type: 'edges_changed',
        changes: significantChanges,
        timestamp: Date.now(),
        user_id: user?.id
      });
    }
  }, [onEdgesChange, updateComponent, user?.id]);

  // Handle node selection for collaboration
  const handleSelectionChange = useCallback((params: { nodes: Node[], edges: Edge[] }) => {
    const selectedNodeIds = params.nodes.map(node => node.id);
    selectComponents(selectedNodeIds);
  }, [selectComponents]);

  return (
    <div 
      ref={canvasRef}
      style={containerStyle}
      onMouseMove={handleMouseMove}
      className="text-gray-800"
    >
      {/* Collaboration Status Indicator */}
      <Panel position="top-center" className="pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          {/* Existing panels */}
          <div className="bg-gray-800 px-4 py-2 rounded shadow-lg text-white">
            Timer: 15:00
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded shadow-lg text-white">
            Budget: $0 / $200
          </div>
          
          {/* Collaboration indicator */}
          <div className={`px-4 py-2 rounded shadow-lg text-white flex items-center gap-2 ${
            isConnected ? 'bg-green-600' : 'bg-red-600'
          }`}>
            <Users size={16} />
            <span>
              {isConnected 
                ? `${Object.keys(collaborationState.participants).length} Users`
                : 'Disconnected'
              }
            </span>
          </div>
        </div>
      </Panel>

      {/* Participants List */}
      <Panel position="top-right" className="pointer-events-auto">
        <ParticipantsList participants={collaborationState.participants} />
      </Panel>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        fitView
        style={reactFlowStyle}
      >
        {/* Existing panels */}
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {/* Cursor Manager for collaborator cursors */}
      <CursorManager 
        cursors={collaborationState.cursors}
        participants={collaborationState.participants}
        canvasRef={canvasRef}
      />
    </div>
  );
};
```

---

## User Presence Management

### Participants List Component
```typescript
// src/components/molecules/ParticipantsList/ParticipantsList.tsx
import React from 'react';
import { ParticipantInfo } from '../../../hooks/useRealtimeCollaboration';

interface ParticipantsListProps {
  participants: Record<string, ParticipantInfo>;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  const participantList = Object.values(participants);
  
  if (participantList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Collaborators</h3>
        <p className="text-xs text-gray-500">No other users online</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200 max-w-[200px]">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Collaborators ({participantList.length})
      </h3>
      
      <div className="space-y-2">
        {participantList.map(participant => (
          <div key={participant.id} className="flex items-center gap-2">
            {/* Avatar */}
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
              style={{ backgroundColor: participant.color }}
            >
              {participant.avatar_url ? (
                <img 
                  src={participant.avatar_url} 
                  alt={participant.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)
              )}
            </div>
            
            {/* User info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {participant.name}
              </p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  participant.status === 'active' ? 'bg-green-500' :
                  participant.status === 'idle' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}></div>
                <span className="text-xs text-gray-500">
                  {participant.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Status Management
```typescript
// src/hooks/usePresenceStatus.ts
import { useEffect, useRef } from 'react';

export const usePresenceStatus = (trackPresence: (status: string) => void) => {
  const statusRef = useRef<'active' | 'idle' | 'away'>('active');
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const awayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimers = () => {
    // Clear existing timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (awayTimerRef.current) clearTimeout(awayTimerRef.current);

    // Set user as active
    if (statusRef.current !== 'active') {
      statusRef.current = 'active';
      trackPresence('active');
    }

    // Set idle timer (2 minutes)
    idleTimerRef.current = setTimeout(() => {
      statusRef.current = 'idle';
      trackPresence('idle');
      
      // Set away timer (5 minutes total)
      awayTimerRef.current = setTimeout(() => {
        statusRef.current = 'away';
        trackPresence('away');
      }, 3 * 60 * 1000); // Additional 3 minutes
    }, 2 * 60 * 1000);
  };

  useEffect(() => {
    // Track user activity
    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activities.forEach(activity => {
      document.addEventListener(activity, resetTimers);
    });

    // Initial timer setup
    resetTimers();

    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, resetTimers);
      });
      
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
    };
  }, [trackPresence]);

  return statusRef.current;
};
```

---

## Performance Optimization

### Throttling Strategy
```typescript
// src/utils/collaborationThrottling.ts
import { throttle, debounce } from 'lodash-es';

interface ThrottlingConfig {
  cursor: number;      // 50ms (20 FPS)
  component: number;   // 100ms (10 FPS)  
  selection: number;   // 200ms (5 FPS)
  persistence: number; // 1000ms (1 FPS)
}

const THROTTLING_CONFIG: ThrottlingConfig = {
  cursor: 50,
  component: 100,
  selection: 200,
  persistence: 1000
};

export class CollaborationThrottler {
  private throttledFunctions = new Map<string, Function>();
  
  getThrottledFunction(key: string, fn: Function, delay: number): Function {
    if (!this.throttledFunctions.has(key)) {
      this.throttledFunctions.set(key, throttle(fn, delay, { 
        leading: true, 
        trailing: true 
      }));
    }
    return this.throttledFunctions.get(key)!;
  }

  throttleCursor(fn: Function): Function {
    return this.getThrottledFunction('cursor', fn, THROTTLING_CONFIG.cursor);
  }

  throttleComponent(fn: Function): Function {
    return this.getThrottledFunction('component', fn, THROTTLING_CONFIG.component);
  }

  throttleSelection(fn: Function): Function {
    return this.getThrottledFunction('selection', fn, THROTTLING_CONFIG.selection);
  }

  debouncePersistence(fn: Function): Function {
    return debounce(fn, THROTTLING_CONFIG.persistence);
  }

  cleanup(): void {
    this.throttledFunctions.clear();
  }
}
```

### Message Batching
```typescript
// src/utils/messageBatching.ts
interface BatchedMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export class MessageBatcher {
  private batchQueue: BatchedMessage[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_INTERVAL = 100; // ms

  constructor(private sendFunction: (messages: BatchedMessage[]) => void) {}

  addMessage(type: string, payload: any): void {
    this.batchQueue.push({
      type,
      payload,
      timestamp: Date.now()
    });

    // Send immediately if batch is full
    if (this.batchQueue.length >= this.BATCH_SIZE) {
      this.flush();
    } else if (!this.batchTimer) {
      // Set timer for partial batch
      this.batchTimer = setTimeout(() => {
        this.flush();
      }, this.BATCH_INTERVAL);
    }
  }

  flush(): void {
    if (this.batchQueue.length === 0) return;

    const messagesToSend = [...this.batchQueue];
    this.batchQueue = [];
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    this.sendFunction(messagesToSend);
  }

  destroy(): void {
    this.flush();
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }
}
```

---

## Security & Authorization

### Access Control
```typescript
// src/utils/collaborationSecurity.ts
interface SessionPermissions {
  canView: boolean;
  canEdit: boolean;
  canInvite: boolean;
  canManage: boolean;
}

export class CollaborationSecurity {
  static async validateSessionAccess(
    sessionId: string, 
    userId: string
  ): Promise<SessionPermissions> {
    // This would typically call your Supabase RPC
    const { data, error } = await supabase
      .rpc('get_session_permissions', {
        session_id: sessionId,
        user_id: userId
      });

    if (error) {
      console.error('Permission check failed:', error);
      return {
        canView: false,
        canEdit: false,
        canInvite: false,
        canManage: false
      };
    }

    return data;
  }

  static validateMessage(message: any, userId: string): boolean {
    // Validate message structure
    if (!message.type || !message.payload) return false;
    
    // Ensure user is not impersonating others
    if (message.payload.user_id && message.payload.user_id !== userId) {
      return false;
    }

    // Add other validation rules as needed
    return true;
  }

  static sanitizeComponentData(data: any): any {
    // Remove any potentially harmful data
    const sanitized = { ...data };
    
    // Remove script tags or other dangerous content
    if (sanitized.label) {
      sanitized.label = sanitized.label.replace(/<script.*?>.*?<\/script>/gi, '');
    }

    return sanitized;
  }
}
```

### Rate Limiting
```typescript
// src/utils/rateLimiting.ts
export class RateLimiter {
  private timestamps: number[] = [];
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(): boolean {
    const now = Date.now();
    
    // Remove timestamps outside the window
    this.timestamps = this.timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    );

    // Check if under limit
    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    const validTimestamps = this.timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    return Math.max(0, this.maxRequests - validTimestamps.length);
  }
}
```

---

## Implementation Steps

### Phase 1: Core Infrastructure (Week 1)
1. **Database Setup**
   ```bash
   # Run database migrations
   supabase db push
   
   # Enable realtime for tables
   supabase realtime enable design_sessions
   supabase realtime enable canvas_components
   ```

2. **Basic Presence Tracking**
   - Implement `useRealtimeCollaboration` hook
   - Add basic cursor tracking
   - Test with 2 users

3. **UI Components**
   - Create `CollaboratorCursor` component
   - Create `ParticipantsList` component
   - Add connection status indicator

### Phase 2: Component Synchronization (Week 2)
1. **React Flow Integration**
   - Enhance node/edge change handlers
   - Implement conflict resolution for simultaneous edits
   - Add selection synchronization

2. **Performance Optimization**
   - Implement throttling for different event types
   - Add message batching
   - Optimize render cycles

3. **Testing**
   - Test with 3-5 concurrent users
   - Measure latency and performance
   - Debug synchronization issues

### Phase 3: Advanced Features (Week 3)
1. **Conflict Resolution**
   - Implement optimistic updates
   - Add rollback mechanisms
   - Handle network interruptions

2. **Persistence & Recovery**
   - Auto-save canvas state
   - Session recovery on reconnect
   - Offline mode support

3. **Security & Validation**
   - Implement rate limiting
   - Add message validation
   - Audit permissions

### Phase 4: Polish & Production (Week 4)
1. **User Experience**
   - Add animations and transitions
   - Improve error messages
   - Add keyboard shortcuts

2. **Monitoring & Analytics**
   - Add collaboration metrics
   - Performance monitoring
   - Error tracking

3. **Documentation & Training**
   - User guides for collaboration features
   - Developer documentation
   - Team training sessions

---

## Testing & Debugging

### Test Scenarios
```typescript
// src/tests/collaboration.test.ts
describe('Realtime Collaboration', () => {
  test('Multiple users can see each other\'s cursors', async () => {
    const user1 = await createTestUser('user1');
    const user2 = await createTestUser('user2');
    
    const session1 = await joinSession(user1, 'test-session');
    const session2 = await joinSession(user2, 'test-session');
    
    // Simulate cursor movement
    session1.moveCursor(100, 200);
    
    // Wait for sync
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if user2 sees user1's cursor
    expect(session2.getCursors()).toHaveProperty(user1.id);
    expect(session2.getCursors()[user1.id]).toEqual({ x: 100, y: 200 });
  });

  test('Component changes are synchronized', async () => {
    // Test component addition, movement, deletion
  });

  test('Handles user disconnection gracefully', async () => {
    // Test cleanup when user leaves
  });

  test('Performance under load', async () => {
    // Test with 10 concurrent users
  });
});
```

### Debug Tools
```typescript
// src/utils/collaborationDebug.ts
export class CollaborationDebugger {
  private logs: any[] = [];
  private isEnabled = process.env.NODE_ENV === 'development';

  log(event: string, data: any): void {
    if (!this.isEnabled) return;
    
    const logEntry = {
      timestamp: Date.now(),
      event,
      data,
      stackTrace: new Error().stack
    };
    
    this.logs.push(logEntry);
    console.log(`[Collaboration] ${event}:`, data);
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
  }

  getLogs(): any[] {
    return [...this.logs];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clear(): void {
    this.logs = [];
  }
}

export const collaborationDebugger = new CollaborationDebugger();
```

### Performance Monitoring
```typescript
// src/utils/performanceMonitor.ts
export class CollaborationPerformanceMonitor {
  private metrics = {
    messageLatency: [],
    renderTime: [],
    cursorUpdateRate: 0,
    componentUpdateRate: 0
  };

  recordLatency(startTime: number): void {
    const latency = Date.now() - startTime;
    this.metrics.messageLatency.push(latency);
    
    // Keep only last 100 measurements
    if (this.metrics.messageLatency.length > 100) {
      this.metrics.messageLatency.shift();
    }
  }

  getAverageLatency(): number {
    const latencies = this.metrics.messageLatency;
    return latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
  }

  getMetrics() {
    return {
      averageLatency: this.getAverageLatency(),
      p95Latency: this.getPercentile(95),
      cursorUpdateRate: this.metrics.cursorUpdateRate,
      componentUpdateRate: this.metrics.componentUpdateRate
    };
  }

  private getPercentile(percentile: number): number {
    const sorted = [...this.metrics.messageLatency].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }
}
```

---

## Conclusion

This implementation guide provides a comprehensive foundation for adding Figma-like realtime collaboration to your SystemDesignCanvas. The approach leverages Supabase's proven Realtime infrastructure while maintaining performance and security.

### Key Benefits
- **Sub-200ms latency** for cursor movements
- **Scalable architecture** supporting 10+ concurrent users
- **Robust conflict resolution** preventing data corruption
- **Optimistic updates** for responsive user experience
- **Production-ready security** with proper authentication and rate limiting

### Next Steps
1. Start with Phase 1 implementation
2. Test thoroughly with your team
3. Gradually roll out to users
4. Monitor performance and iterate

The collaborative SystemDesignCanvas will transform how users work together on system architecture projects, making the learning experience more engaging and realistic. 