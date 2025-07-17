import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { throttle } from 'lodash-es';
import { supabase } from '../services/supabase';
import { useAppSelector } from './redux';

interface CollaborationState {
  participants: Record<string, ParticipantInfo>;
  cursors: Record<string, CursorPosition>;
  selections: Record<string, string[]>; // user_id -> component_ids
}

export interface ParticipantInfo {
  id: string;
  name: string;
  avatar_url?: string;
  color: string;
  last_seen: number;
  status: 'active' | 'idle' | 'away';
}

export interface CursorPosition {
  x: number;
  y: number;
  timestamp: number;
}

export const useRealtimeCollaboration = (sessionId: string) => {
  const user = useAppSelector(state => state.auth.user);
  const profile = useAppSelector(state => state.auth.profile);
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
          name: profile?.display_name || profile?.username || user.email || 'Anonymous',
          avatar_url: profile?.avatar_url,
          color: userColor.current,
          cursor_position: position,
          status: 'active',
          last_seen: Date.now()
        });
      }
    }, 50), // 20 FPS for smooth cursor movement
    [user, profile]
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
      const presenceState = channel.presenceState() as Record<string, any[]>;
      const participants: Record<string, ParticipantInfo> = {};
      const cursors: Record<string, CursorPosition> = {};

      Object.keys(presenceState).forEach(userId => {
        const presence = presenceState[userId][0] as any;
        if (presence) {
          participants[userId] = {
            id: userId,
            name: presence.name || 'Anonymous',
            avatar_url: presence.avatar_url,
            color: presence.color || '#000000',
            last_seen: presence.last_seen || Date.now(),
            status: presence.status || 'active'
          };

          if (presence.cursor_position) {
            cursors[userId] = presence.cursor_position as CursorPosition;
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
          name: profile?.display_name || profile?.username || user.email || 'Anonymous',
          avatar_url: profile?.avatar_url,
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
  }, [sessionId, user, profile]);

  // API methods
  const trackCursor = useCallback((position: CursorPosition) => {
    throttledCursorTrack(position);
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

  // Alias for selectComponents
  const updateSelection = selectComponents;
  
  // Throttled selection update
  const throttledSelectionUpdate = throttle(selectComponents, 100);

  // Broadcast functions for different operations
  const broadcastNodeUpdate = useCallback((node: any) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'node_update',
        payload: { node }
      });
    }
  }, []);

  const broadcastNodeDeletion = useCallback((nodeId: string) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'node_delete',
        payload: { nodeId }
      });
    }
  }, []);

  const broadcastEdgeUpdate = useCallback((edge: any) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'edge_update',
        payload: { edge }
      });
    }
  }, []);

  const broadcastEdgeDeletion = useCallback((edgeId: string) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'edge_delete',
        payload: { edgeId }
      });
    }
  }, []);

  return {
    collaborationState,
    isConnected,
    trackCursor,
    updateComponent,
    selectComponents,
    updateSelection,
    throttledSelectionUpdate,
    broadcastNodeUpdate,
    broadcastNodeDeletion,
    broadcastEdgeUpdate,
    broadcastEdgeDeletion,
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
  
  // TODO: Dispatch to Redux or update React Flow directly
  // The implementation depends on how you want to handle state updates
} 