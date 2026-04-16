import { useEffect, useRef, useState, useCallback } from 'react';
import { throttle } from 'lodash-es';
import { useAppSelector } from './redux';

interface CollaborationState {
  participants: Record<string, ParticipantInfo>;
  cursors: Record<string, CursorPosition>;
  selections: Record<string, string[]>;
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

/**
 * Realtime collaboration hook using Durable Objects + WebSocket.
 * Connects to /api/ws/session/:sessionId for live cursor, node, and edge sync.
 */
export const useRealtimeCollaboration = (sessionId: string) => {
  const user = useAppSelector(state => state.auth.user);
  const profile = useAppSelector(state => state.auth.profile);
  const wsRef = useRef<WebSocket | null>(null);

  const [collaborationState, setCollaborationState] = useState<CollaborationState>({
    participants: {},
    cursors: {},
    selections: {},
  });

  const [isConnected, setIsConnected] = useState(false);

  // Connect WebSocket
  useEffect(() => {
    if (!sessionId || !user) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).host
      : window.location.host;

    const wsUrl = `${protocol}//${host}/api/ws/session/${sessionId}?userId=${user.id}&username=${encodeURIComponent(profile?.username || user.email || 'Anonymous')}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleMessage(msg);
      } catch {
        // ignore malformed messages
      }
    };

    // Keepalive ping every 30s
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping', payload: {} }));
      }
    }, 30_000);

    return () => {
      clearInterval(pingInterval);
      ws.close();
      wsRef.current = null;
      setIsConnected(false);
    };
  }, [sessionId, user, profile]);

  const handleMessage = useCallback((msg: { type: string; payload: any }) => {
    switch (msg.type) {
      case 'init': {
        const participants: Record<string, ParticipantInfo> = {};
        const cursors: Record<string, CursorPosition> = {};
        for (const p of msg.payload.participants || []) {
          participants[p.userId] = {
            id: p.userId,
            name: p.username,
            avatar_url: p.avatarUrl,
            color: p.color,
            last_seen: p.lastSeen || Date.now(),
            status: 'active',
          };
          if (p.cursor) {
            cursors[p.userId] = { ...p.cursor, timestamp: Date.now() };
          }
        }
        setCollaborationState(prev => ({ ...prev, participants, cursors }));
        break;
      }

      case 'join':
        setCollaborationState(prev => ({
          ...prev,
          participants: {
            ...prev.participants,
            [msg.payload.userId]: {
              id: msg.payload.userId,
              name: msg.payload.username,
              color: msg.payload.color,
              last_seen: Date.now(),
              status: 'active',
            },
          },
        }));
        break;

      case 'leave':
        setCollaborationState(prev => {
          const next = { ...prev };
          const participants = { ...next.participants };
          const cursors = { ...next.cursors };
          const selections = { ...next.selections };
          delete participants[msg.payload.userId];
          delete cursors[msg.payload.userId];
          delete selections[msg.payload.userId];
          return { participants, cursors, selections };
        });
        break;

      case 'cursor':
        setCollaborationState(prev => ({
          ...prev,
          cursors: {
            ...prev.cursors,
            [msg.payload.userId]: {
              x: msg.payload.x,
              y: msg.payload.y,
              timestamp: Date.now(),
            },
          },
        }));
        break;

      case 'selection':
        setCollaborationState(prev => ({
          ...prev,
          selections: {
            ...prev.selections,
            [msg.payload.userId]: msg.payload.componentIds,
          },
        }));
        break;

      // Canvas change events — these should be dispatched to React Flow
      case 'node_update':
      case 'node_delete':
      case 'edge_update':
      case 'edge_delete':
        // Emit a custom event that the canvas component can listen for
        window.dispatchEvent(new CustomEvent('collab:' + msg.type, { detail: msg.payload }));
        break;
    }
  }, []);

  // --- Outbound methods ---

  const send = useCallback((type: string, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  const trackCursor = useCallback(
    throttle((position: CursorPosition) => {
      send('cursor', position);
    }, 50),
    [send]
  );

  const updateComponent = useCallback(
    throttle((componentData: any) => {
      send('node_update', componentData);
    }, 100),
    [send]
  );

  const selectComponents = useCallback((componentIds: string[]) => {
    send('selection', { componentIds });
  }, [send]);

  const updateSelection = selectComponents;
  const throttledSelectionUpdate = throttle(selectComponents, 100);

  const broadcastNodeUpdate = useCallback((node: any) => {
    send('node_update', { node });
  }, [send]);

  const broadcastNodeDeletion = useCallback((nodeId: string) => {
    send('node_delete', { nodeId });
  }, [send]);

  const broadcastEdgeUpdate = useCallback((edge: any) => {
    send('edge_update', { edge });
  }, [send]);

  const broadcastEdgeDeletion = useCallback((edgeId: string) => {
    send('edge_delete', { edgeId });
  }, [send]);

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
