import { Hono } from 'hono';
import { isGraphSnapshot } from '../../../shared/game';
import { evaluateStage } from '../lib/game';
import type { AppEnv, AuthUser, Mentor, MentorChatMessage } from '../types';
import { generateId, now, query, parseJson } from '../lib/db';
import { generateMentorResponse, MENTOR_FALLBACK_REPLY } from '../lib/mentor';

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
  const user = c.get('user') as AuthUser;
  const sessionId = c.req.param('sessionId');

  const rows = await query<MentorChatMessage>(
    c.env.DB,
    `SELECT * FROM mentor_chat_messages
     WHERE conversation_session_id = ? AND user_id = ?
     ORDER BY created_at ASC`,
    [sessionId, user.id]
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
 * Save a player message and return the mentor's response.
 */
mentorRoutes.post('/chat', async (c) => {
  const user = c.get('user') as AuthUser;
  const body = await c.req.json<{
    mentorId: string;
    conversationSessionId: string;
    messageContent: string;
    senderType: string;
    missionStageId?: string;
    canvasState?: unknown;
  }>().catch(() => null);

  if (!body || typeof body.mentorId !== 'string' || !body.mentorId || body.mentorId.length > 128) {
    return c.json({ error: 'Invalid mentor chat command' }, 400);
  }

  const messageContent = typeof body.messageContent === 'string' ? body.messageContent.trim() : '';
  if (!messageContent || messageContent.length > 2_000) {
    return c.json({ error: 'Message must contain between 1 and 2000 characters' }, 400);
  }
  if (typeof body.conversationSessionId !== 'string' || !body.conversationSessionId || body.conversationSessionId.length > 128
    || (body.missionStageId !== undefined && (typeof body.missionStageId !== 'string' || !body.missionStageId || body.missionStageId.length > 128))) {
    return c.json({ error: 'Invalid conversation session' }, 400);
  }
  if (body.canvasState !== undefined && !isGraphSnapshot(body.canvasState)) return c.json({ error: 'Invalid design context' }, 400);
  if (body.missionStageId) {
    const allowed = await c.env.DB.prepare(`SELECT p.id FROM user_mission_progress p
      JOIN mission_stages s ON s.mission_id=p.mission_id WHERE p.user_id=? AND s.id=?
      AND (p.current_stage_id=s.id OR EXISTS (SELECT 1 FROM mission_stage_completions sc WHERE sc.user_id=p.user_id AND sc.stage_id=s.id))`)
      .bind(user.id, body.missionStageId).first();
    if (!allowed) return c.json({ error: 'Start this stage before requesting design coaching.' }, 403);
  }

  const mentor = await c.env.DB.prepare(
    'SELECT * FROM mentors WHERE id = ?',
  ).bind(body.mentorId).first<Mentor>();
  if (!mentor) return c.json({ error: 'Mentor not found' }, 404);

  const history = await query<MentorChatMessage>(
    c.env.DB,
    `SELECT * FROM mentor_chat_messages
     WHERE conversation_session_id = ? AND user_id = ? AND mentor_id = ?
     ORDER BY created_at DESC, rowid DESC LIMIT 24`,
    [body.conversationSessionId, user.id, body.mentorId],
  );

  history.reverse();
  const checked = body.missionStageId && isGraphSnapshot(body.canvasState)
    ? await evaluateStage(c.env.DB, body.missionStageId, body.canvasState) : null;
  const designContext = checked ? JSON.stringify({
    nodes: checked.graph.nodes.slice(0, 50).map(n => ({ id: n.id, component: n.data.componentId, role: n.data.role, status: n.data.status })),
    edges: checked.graph.edges.slice(0, 100).map(e => ({ from: e.source, to: e.target })),
    checks: checked.requirements.map(r => ({ title: r.title, passed: r.completed, hint: r.message })),
  }) : undefined;

  const mission = body.missionStageId
    ? await c.env.DB.prepare(
        `SELECT m.title, ms.problem_description AS problemDescription
         FROM mission_stages ms JOIN missions m ON m.id = ms.mission_id
         WHERE ms.id = ?`,
      ).bind(body.missionStageId).first<{ title: string; problemDescription: string | null }>()
    : null;

  let response = MENTOR_FALLBACK_REPLY;
  try {
    response = await generateMentorResponse(
      c.env.OPENAI_API_KEY,
      {
        name: mentor.name,
        title: mentor.title,
        tagline: mentor.tagline,
        quote: mentor.quote,
        personality: parseJson(mentor.personality, {}),
        specialty: parseJson(mentor.specialty, {}),
      },
      history,
      messageContent,
      mission,
      designContext,
    );
  } catch (error) {
    console.error(JSON.stringify({
      message: 'mentor_response_failed',
      error: error instanceof Error ? error.message : String(error),
      userId: user.id,
      mentorId: body.mentorId,
    }));
  }

  const id = generateId();
  const responseId = generateId();
  const timestamp = now();

  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO mentor_chat_messages (id, user_id, mentor_id, conversation_session_id, message_content, sender_type, mission_stage_id, created_at)
       VALUES (?, ?, ?, ?, ?, 'user', ?, ?)`,
    ).bind(id, user.id, body.mentorId, body.conversationSessionId, messageContent, body.missionStageId ?? null, timestamp),
    c.env.DB.prepare(
      `INSERT INTO mentor_chat_messages (id, user_id, mentor_id, conversation_session_id, message_content, sender_type, mission_stage_id, created_at)
       VALUES (?, ?, ?, ?, ?, 'mentor', ?, ?)`,
    ).bind(responseId, user.id, body.mentorId, body.conversationSessionId, response, body.missionStageId ?? null, timestamp),
  ]);

  return c.json({
    id,
    content: messageContent,
    responseId,
    response,
    timestamp,
    sender: 'user',
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
