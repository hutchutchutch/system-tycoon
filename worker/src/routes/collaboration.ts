import { Hono } from 'hono';
import type { AppEnv, Env, AuthUser, Profile, CollaborationInvitation } from '../types';
import { generateId, now, queryOne, query, execute, parseJson, toJson } from '../lib/db';

export const collaborationRoutes = new Hono<AppEnv>();

/**
 * GET /sessions/:scenarioId
 * Get active design sessions for a scenario, including participants.
 */
collaborationRoutes.get('/sessions/:scenarioId', async (c) => {
  const scenarioId = c.req.param('scenarioId');

  const sessions = await query<{
    id: string;
    scenario_id: string;
    session_name: string;
    created_by: string;
    canvas_state: string | null;
    is_active: number;
    created_at: string;
    updated_at: string;
  }>(
    c.env.DB,
    'SELECT * FROM design_sessions WHERE scenario_id = ? AND is_active = 1',
    [scenarioId]
  );

  const result = await Promise.all(
    sessions.map(async (session) => {
      const participants = await query<{
        id: string;
        consultant_id: string;
        joined_at: string;
      }>(
        c.env.DB,
        'SELECT * FROM design_session_participants WHERE session_id = ?',
        [session.id]
      );

      return {
        ...session,
        canvas_state: parseJson(session.canvas_state, null),
        participants,
      };
    })
  );

  return c.json(result);
});

/**
 * POST /sessions
 * Create a new design session.
 */
collaborationRoutes.post('/sessions', async (c) => {
  const user = c.get('user') as AuthUser;
  const body = await c.req.json<{
    scenarioId: string;
    sessionName: string;
  }>();

  const id = generateId();
  const timestamp = now();

  await execute(
    c.env.DB,
    `INSERT INTO design_sessions (id, scenario_id, session_name, created_by, canvas_state, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, '{}', 1, ?, ?)`,
    [id, body.scenarioId, body.sessionName, user.id, timestamp, timestamp]
  );

  // Auto-join creator as first participant
  await execute(
    c.env.DB,
    'INSERT INTO design_session_participants (id, session_id, consultant_id, joined_at) VALUES (?, ?, ?, ?)',
    [generateId(), id, user.id, timestamp]
  );

  return c.json({ id, sessionName: body.sessionName, createdAt: timestamp }, 201);
});

/**
 * POST /sessions/:id/join
 * Join an existing design session.
 */
collaborationRoutes.post('/sessions/:id/join', async (c) => {
  const user = c.get('user') as AuthUser;
  const sessionId = c.req.param('id');

  const existing = await queryOne<{ id: string }>(
    c.env.DB,
    'SELECT id FROM design_session_participants WHERE session_id = ? AND consultant_id = ?',
    [sessionId, user.id]
  );

  if (existing) {
    return c.json({ message: 'Already a participant' }, 200);
  }

  const id = generateId();
  const timestamp = now();

  await execute(
    c.env.DB,
    'INSERT INTO design_session_participants (id, session_id, consultant_id, joined_at) VALUES (?, ?, ?, ?)',
    [id, sessionId, user.id, timestamp]
  );

  return c.json({ success: true, joinedAt: timestamp }, 201);
});

/**
 * DELETE /sessions/:id/leave
 * Leave a design session.
 */
collaborationRoutes.delete('/sessions/:id/leave', async (c) => {
  const user = c.get('user') as AuthUser;
  const sessionId = c.req.param('id');

  await execute(
    c.env.DB,
    'DELETE FROM design_session_participants WHERE session_id = ? AND consultant_id = ?',
    [sessionId, user.id]
  );

  return c.json({ success: true });
});

/**
 * PUT /sessions/:id/canvas
 * Update canvas state for a design session.
 */
collaborationRoutes.put('/sessions/:id/canvas', async (c) => {
  const sessionId = c.req.param('id');
  const body = await c.req.json<{
    nodes: unknown[];
    edges: unknown[];
  }>();

  const timestamp = now();

  await execute(
    c.env.DB,
    'UPDATE design_sessions SET canvas_state = ?, updated_at = ? WHERE id = ?',
    [toJson({ nodes: body.nodes, edges: body.edges }), timestamp, sessionId]
  );

  return c.json({ success: true, lastSaved: timestamp });
});

/**
 * POST /invitations
 * Send a collaboration invitation by username.
 */
collaborationRoutes.post('/invitations', async (c) => {
  const user = c.get('user') as AuthUser;
  const body = await c.req.json<{
    inviteeUsername: string;
    missionStageId: string;
  }>();

  const recipient = await queryOne<Profile>(
    c.env.DB,
    'SELECT id FROM user WHERE username = ?',
    [body.inviteeUsername]
  );

  if (!recipient) {
    return c.json({ error: 'User not found' }, 404);
  }

  if (recipient.id === user.id) {
    return c.json({ error: 'Cannot invite yourself' }, 400);
  }

  const id = generateId();
  const timestamp = now();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await execute(
    c.env.DB,
    `INSERT INTO collaboration_invitations (id, sender_id, invited_id, mission_stage_id, status, created_at, updated_at, expires_at)
     VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)`,
    [id, user.id, recipient.id, body.missionStageId, timestamp, timestamp, expiresAt]
  );

  return c.json({ id, status: 'pending', createdAt: timestamp }, 201);
});

/**
 * GET /invitations
 * Load sent and received invitations for the current user.
 */
collaborationRoutes.get('/invitations', async (c) => {
  const user = c.get('user') as AuthUser;

  const [sent, received] = await Promise.all([
    query<CollaborationInvitation>(
      c.env.DB,
      'SELECT * FROM collaboration_invitations WHERE sender_id = ? ORDER BY created_at DESC',
      [user.id]
    ),
    query<CollaborationInvitation>(
      c.env.DB,
      'SELECT * FROM collaboration_invitations WHERE invited_id = ? ORDER BY created_at DESC',
      [user.id]
    ),
  ]);

  return c.json({ sent, received });
});

/**
 * PATCH /invitations/:id
 * Update invitation status (accept or decline).
 */
collaborationRoutes.patch('/invitations/:id', async (c) => {
  const user = c.get('user') as AuthUser;
  const invitationId = c.req.param('id');
  const body = await c.req.json<{
    status: 'accepted' | 'declined';
  }>();

  // Only the invited user can update the status
  const invitation = await queryOne<CollaborationInvitation>(
    c.env.DB,
    'SELECT * FROM collaboration_invitations WHERE id = ? AND invited_id = ?',
    [invitationId, user.id]
  );

  if (!invitation) {
    return c.json({ error: 'Invitation not found' }, 404);
  }

  if (invitation.status !== 'pending') {
    return c.json({ error: 'Invitation already responded to' }, 400);
  }

  const timestamp = now();

  await execute(
    c.env.DB,
    'UPDATE collaboration_invitations SET status = ?, updated_at = ? WHERE id = ?',
    [body.status, timestamp, invitationId]
  );

  return c.json({ id: invitationId, status: body.status, updatedAt: timestamp });
});
