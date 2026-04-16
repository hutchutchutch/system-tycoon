/**
 * Phase 5: Durable Object for real-time design session collaboration.
 *
 * Each design session gets its own DO instance (keyed by session ID).
 * Participants connect via WebSocket and receive broadcasts of:
 * - Cursor positions (presence)
 * - Canvas node/edge changes
 * - Component selections
 * - Join/leave events
 */

interface SessionState {
  sessionId: string;
  participants: Map<string, ParticipantState>;
}

interface ParticipantState {
  userId: string;
  username: string;
  avatarUrl?: string;
  color: string;
  cursor: { x: number; y: number };
  selectedComponents: string[];
  lastSeen: number;
}

interface WSMessage {
  type: 'cursor' | 'node_update' | 'node_delete' | 'edge_update' | 'edge_delete' | 'selection' | 'ping';
  payload: any;
}

export class DesignSessionDO implements DurableObject {
  private state: DurableObjectState;
  private sessions: Map<WebSocket, ParticipantState> = new Map();
  private sessionId: string = '';

  constructor(state: DurableObjectState, _env: any) {
    this.state = state;
    // Recover hibernated WebSocket sessions
    this.state.getWebSockets().forEach((ws) => {
      const meta = ws.deserializeAttachment() as ParticipantState | null;
      if (meta) {
        this.sessions.set(ws, meta);
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // WebSocket upgrade
    if (request.headers.get('Upgrade') === 'websocket') {
      return this.handleWebSocketUpgrade(request, url);
    }

    // REST endpoints for the session
    if (url.pathname.endsWith('/participants')) {
      return this.getParticipants();
    }

    return new Response('Not found', { status: 404 });
  }

  private async handleWebSocketUpgrade(request: Request, url: URL): Promise<Response> {
    const userId = url.searchParams.get('userId');
    const username = url.searchParams.get('username') || 'Anonymous';
    const color = url.searchParams.get('color') || this.generateColor(userId || '');
    this.sessionId = url.searchParams.get('sessionId') || '';

    if (!userId) {
      return new Response('userId required', { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];

    const participant: ParticipantState = {
      userId,
      username,
      color,
      cursor: { x: 0, y: 0 },
      selectedComponents: [],
      lastSeen: Date.now(),
    };

    // Accept with hibernation support
    this.state.acceptWebSocket(server);
    server.serializeAttachment(participant);
    this.sessions.set(server, participant);

    // Broadcast join event
    this.broadcast({
      type: 'join',
      payload: { userId, username, color },
    }, server);

    // Send current participants to the new joiner
    const participants: ParticipantState[] = [];
    this.sessions.forEach((p) => participants.push(p));
    server.send(JSON.stringify({
      type: 'init',
      payload: { participants },
    }));

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const participant = this.sessions.get(ws);
    if (!participant) return;

    participant.lastSeen = Date.now();

    try {
      const msg: WSMessage = JSON.parse(message as string);

      switch (msg.type) {
        case 'cursor':
          participant.cursor = msg.payload;
          ws.serializeAttachment(participant);
          // Broadcast cursor to others
          this.broadcast({
            type: 'cursor',
            payload: { userId: participant.userId, ...msg.payload },
          }, ws);
          break;

        case 'node_update':
        case 'node_delete':
        case 'edge_update':
        case 'edge_delete':
          // Broadcast canvas changes to all other participants
          this.broadcast({
            type: msg.type,
            payload: { userId: participant.userId, ...msg.payload },
          }, ws);
          break;

        case 'selection':
          participant.selectedComponents = msg.payload.componentIds || [];
          ws.serializeAttachment(participant);
          this.broadcast({
            type: 'selection',
            payload: { userId: participant.userId, componentIds: participant.selectedComponents },
          }, ws);
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', payload: { timestamp: Date.now() } }));
          break;
      }
    } catch (err) {
      console.error('Invalid WebSocket message:', err);
    }
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    const participant = this.sessions.get(ws);
    this.sessions.delete(ws);

    if (participant) {
      this.broadcast({
        type: 'leave',
        payload: { userId: participant.userId, username: participant.username },
      });
    }
  }

  async webSocketError(ws: WebSocket, error: unknown) {
    const participant = this.sessions.get(ws);
    this.sessions.delete(ws);

    if (participant) {
      this.broadcast({
        type: 'leave',
        payload: { userId: participant.userId, username: participant.username },
      });
    }
  }

  private broadcast(message: object, exclude?: WebSocket) {
    const data = JSON.stringify(message);
    this.sessions.forEach((_, ws) => {
      if (ws !== exclude) {
        try {
          ws.send(data);
        } catch {
          // Connection dead — will be cleaned up on close
        }
      }
    });
  }

  private getParticipants(): Response {
    const participants: ParticipantState[] = [];
    this.sessions.forEach((p) => participants.push(p));
    return Response.json({ participants });
  }

  private generateColor(userId: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    ];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash = hash & hash;
    }
    return colors[Math.abs(hash) % colors.length];
  }
}
