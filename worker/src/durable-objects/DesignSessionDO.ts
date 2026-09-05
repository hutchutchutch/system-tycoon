/**
 * Legacy compatibility export for existing production Durable Objects.
 * The MVP has no binding or public route to this class. Retain its class name
 * and existing handlers to preserve deployed namespaces and hibernated sessions.
 * Do not delete the namespace without an explicit data-retirement decision.
 *
 * Each design session gets its own DO instance (keyed by session ID).
 * Participants connect via WebSocket and receive broadcasts of:
 * - Cursor positions (presence)
 * - Canvas node/edge changes
 * - Component selections
 * - Join/leave events
 */

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
  payload: Record<string, unknown>;
}

export class DesignSessionDO {
  private state: DurableObjectState;
  private sessions: Map<WebSocket, ParticipantState> = new Map();

  constructor(state: DurableObjectState, _env: unknown) {
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
      return this.handleWebSocketUpgrade(url);
    }

    // REST endpoints for the session
    if (url.pathname.endsWith('/participants')) {
      return this.getParticipants();
    }

    return new Response('Not found', { status: 404 });
  }

  private async handleWebSocketUpgrade(url: URL): Promise<Response> {
    const userId = url.searchParams.get('userId');
    const username = url.searchParams.get('username') || 'Anonymous';
    const color = url.searchParams.get('color') || this.generateColor(userId || '');

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
      if (typeof message !== 'string' || message.length > 64_000) return;
      const parsed: unknown = JSON.parse(message);
      if (!parsed || typeof parsed !== 'object' || !('type' in parsed) || !('payload' in parsed)
        || !parsed.payload || typeof parsed.payload !== 'object' || Array.isArray(parsed.payload)) return;
      const msg = parsed as WSMessage;

      switch (msg.type) {
        case 'cursor':
          if (typeof msg.payload.x !== 'number' || typeof msg.payload.y !== 'number'
            || !Number.isFinite(msg.payload.x) || !Number.isFinite(msg.payload.y)) return;
          participant.cursor = { x: msg.payload.x, y: msg.payload.y };
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
          participant.selectedComponents = Array.isArray(msg.payload.componentIds)
            ? msg.payload.componentIds.filter((id): id is string => typeof id === 'string').slice(0, 250) : [];
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

  async webSocketClose(ws: WebSocket, _code: number, _reason: string, _wasClean: boolean) {
    const participant = this.sessions.get(ws);
    this.sessions.delete(ws);

    if (participant) {
      this.broadcast({
        type: 'leave',
        payload: { userId: participant.userId, username: participant.username },
      });
    }
  }

  async webSocketError(ws: WebSocket, _error: unknown) {
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
