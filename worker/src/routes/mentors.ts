import { Hono } from 'hono';
import type { AppEnv, Env, AuthUser, Mentor, MentorChatMessage } from '../types';
import { generateId, now, query, execute, parseJson } from '../lib/db';

export const mentorRoutes = new Hono<AppEnv>();

/**
 * GET /
 * List all mentors, transforming DB rows for the UI.
 */
mentorRoutes.get('/', async (c) => {
  const rows = await query<Mentor>(
    c.env.DB,
    'SELECT * FROM mentors ORDER BY created_at',
    []
  );

  const mentors = rows.map((row) => {
    const tags = parseJson<string[]>(row.tags, []);
    const signature = parseJson<Record<string, string>>(row.signature, {});
    const personality = parseJson<Record<string, unknown>>(row.personality, {});
    const specialty = parseJson<{ domains?: string[] }>(row.specialty, {});

    return {
      id: row.id,
      name: row.name,
      title: row.title,
      company: signature.knownFor ?? null,
      contribution: signature.legacy ?? null,
      expertise: specialty.domains ?? [],
      message: row.lore || row.quote,
      toastMessage: row.tagline,
      tags,
      personality,
    };
  });

  return c.json(mentors);
});

/**
 * GET /chat/:sessionId
 * Load chat history for a conversation session.
 */
mentorRoutes.get('/chat/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');

  const rows = await query<MentorChatMessage>(
    c.env.DB,
    'SELECT * FROM mentor_chat_messages WHERE conversation_session_id = ? ORDER BY created_at ASC',
    [sessionId]
  );

  const messages = rows.map((row) => ({
    id: row.id,
    content: row.message_content,
    timestamp: row.created_at,
    sender: row.sender_type,
    mentorId: row.mentor_id,
  }));

  return c.json(messages);
});

/**
 * POST /chat
 * Save a chat message.
 */
mentorRoutes.post('/chat', async (c) => {
  const user = c.get('user') as AuthUser;
  const body = await c.req.json<{
    mentorId: string;
    conversationSessionId: string;
    messageContent: string;
    senderType: string;
    missionStageId?: string;
  }>();

  const id = generateId();
  const timestamp = now();

  await execute(
    c.env.DB,
    `INSERT INTO mentor_chat_messages (id, user_id, mentor_id, conversation_session_id, message_content, sender_type, mission_stage_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      user.id,
      body.mentorId,
      body.conversationSessionId,
      body.messageContent,
      body.senderType,
      body.missionStageId ?? null,
      timestamp,
    ]
  );

  return c.json({
    id,
    content: body.messageContent,
    timestamp,
    sender: body.senderType,
    mentorId: body.mentorId,
  }, 201);
});

/**
 * GET /sessions
 * Get conversation sessions for the current user.
 */
mentorRoutes.get('/sessions', async (c) => {
  const user = c.get('user') as AuthUser;

  const rows = await query<{
    conversation_session_id: string;
    mentor_id: string;
    last_activity: string;
    message_count: number;
  }>(
    c.env.DB,
    `SELECT
       conversation_session_id,
       mentor_id,
       MAX(created_at) AS last_activity,
       COUNT(*) AS message_count
     FROM mentor_chat_messages
     WHERE user_id = ?
     GROUP BY conversation_session_id
     ORDER BY last_activity DESC`,
    [user.id]
  );

  const sessions = rows.map((row) => ({
    sessionId: row.conversation_session_id,
    mentorId: row.mentor_id,
    lastActivity: row.last_activity,
    messageCount: row.message_count,
  }));

  return c.json(sessions);
});
