import { Hono } from 'hono';
import type { Env, AuthUser, Npc, Conversation, ConversationMessage } from '../types';
import { generateId, now, query, queryOne, execute, parseJson, toBool, toJson } from '../lib/db';
import { generateNpcResponse, alertOpenAiFailure, NPC_FALLBACK_REPLY } from '../lib/openai';

export const conversationRoutes = new Hono<{ Bindings: Env }>();

const MAX_PLAYER_MESSAGES = 3;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
async function getOwned(env: Env, id: string, userId: string): Promise<Conversation | null> {
  const row = await queryOne<Conversation>(env.DB, 'SELECT * FROM conversations WHERE id = ?', [id]);
  if (!row || row.player_id !== userId) return null;
  return row;
}

function hydrateMessage(row: ConversationMessage) {
  return {
    ...row,
    metadata: parseJson<Record<string, unknown>>(row.metadata, {}),
    is_read: toBool(row.is_read),
  };
}

async function getMessages(env: Env, conversationId: string) {
  const rows = await query<ConversationMessage>(
    env.DB,
    'SELECT * FROM conversation_messages WHERE conversation_id = ? ORDER BY created_at ASC',
    [conversationId]
  );
  return rows.map(hydrateMessage);
}

async function hydrateConversation(env: Env, row: Conversation) {
  const npc = await queryOne<Npc>(env.DB, 'SELECT * FROM npcs WHERE id = ?', [row.npc_id]);
  return {
    ...row,
    context: parseJson<Record<string, unknown>>(row.context, {}),
    npc: npc ? { ...npc, verified: toBool(npc.verified), personality: parseJson(npc.personality, {}) } : undefined,
  };
}

async function playerMessageCount(env: Env, conversationId: string): Promise<number> {
  const r = await queryOne<{ n: number }>(
    env.DB,
    "SELECT COUNT(*) AS n FROM conversation_messages WHERE conversation_id = ? AND sender_type = 'player'",
    [conversationId]
  );
  return r?.n ?? 0;
}

async function insertMessage(
  env: Env,
  conversationId: string,
  senderType: 'player' | 'npc',
  content: string,
  messageType = 'text',
  metadata: unknown = {}
): Promise<string> {
  const id = generateId();
  const ts = now();
  await execute(
    env.DB,
    `INSERT INTO conversation_messages (id, conversation_id, sender_type, content, message_type, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, conversationId, senderType, content, messageType, toJson(metadata), ts]
  );
  // Maintain conversation last_message_at + npc unread count (the old Postgres trigger)
  await execute(
    env.DB,
    `UPDATE conversations
       SET last_message_at = ?,
           unread_count = unread_count + ?,
           updated_at = ?
     WHERE id = ?`,
    [ts, senderType === 'npc' ? 1 : 0, ts, conversationId]
  );
  return id;
}

async function buildGreeting(env: Env, npcId: string, missionId?: string | null): Promise<string> {
  if (missionId) {
    const m = await queryOne<{ emotional_hook: string | null }>(
      env.DB,
      'SELECT emotional_hook FROM missions WHERE id = ?',
      [missionId]
    );
    if (m?.emotional_hook) {
      return `Hi! Thank you so much for reaching out about my post. ${m.emotional_hook} I really hope you can help us. What's your experience with this kind of work?`;
    }
  }
  return `Hi! Thanks so much for reaching out. I saw you might be able to help — what made you interested in my situation?`;
}

// ------------------------------------------------------------
// GET / — list the current user's conversations
// ------------------------------------------------------------
conversationRoutes.get('/', async (c) => {
  const user = c.get('user') as AuthUser;
  const rows = await query<Conversation>(
    c.env.DB,
    'SELECT * FROM conversations WHERE player_id = ? ORDER BY COALESCE(last_message_at, created_at) DESC',
    [user.id]
  );
  const out = await Promise.all(
    rows.map(async (row) => ({
      ...(await hydrateConversation(c.env, row)),
      message_count: await playerMessageCount(c.env, row.id),
      messages: [],
    }))
  );
  return c.json(out);
});

// ------------------------------------------------------------
// POST / — start (or return existing) conversation with an NPC
// ------------------------------------------------------------
conversationRoutes.post('/', async (c) => {
  const user = c.get('user') as AuthUser;
  const body = await c.req.json<{ npcId: string; postId?: string; missionId?: string }>();

  const existing = await queryOne<Conversation>(
    c.env.DB,
    'SELECT * FROM conversations WHERE player_id = ? AND npc_id = ?',
    [user.id, body.npcId]
  );
  if (existing) {
    return c.json({
      ...(await hydrateConversation(c.env, existing)),
      message_count: await playerMessageCount(c.env, existing.id),
      messages: await getMessages(c.env, existing.id),
    });
  }

  const id = generateId();
  const ts = now();
  const context = toJson({ source_post_id: body.postId ?? null, started_at: ts });
  await execute(
    c.env.DB,
    `INSERT INTO conversations (id, player_id, npc_id, status, initiated_from_post_id, mission_id, context, created_at, updated_at)
     VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?)`,
    [id, user.id, body.npcId, body.postId ?? null, body.missionId ?? null, context, ts, ts]
  );

  // First NPC greeting (no AI — fast, deterministic)
  const greeting = await buildGreeting(c.env, body.npcId, body.missionId);
  await insertMessage(c.env, id, 'npc', greeting, 'text');

  // Track first interaction
  await execute(
    c.env.DB,
    `INSERT INTO player_npc_interactions (id, player_id, npc_id, interaction_count, first_interaction_at, last_interaction_at, created_at, updated_at)
     VALUES (?, ?, ?, 1, ?, ?, ?, ?)
     ON CONFLICT(player_id, npc_id) DO UPDATE SET
       interaction_count = interaction_count + 1,
       last_interaction_at = excluded.last_interaction_at,
       updated_at = excluded.updated_at`,
    [generateId(), user.id, body.npcId, ts, ts, ts, ts]
  );

  const row = (await queryOne<Conversation>(c.env.DB, 'SELECT * FROM conversations WHERE id = ?', [id]))!;
  return c.json(
    {
      ...(await hydrateConversation(c.env, row)),
      message_count: 0,
      messages: await getMessages(c.env, id),
    },
    201
  );
});

// ------------------------------------------------------------
// GET /:id  and  GET /:id/messages
// ------------------------------------------------------------
conversationRoutes.get('/:id', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwned(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Conversation not found' }, 404);
  return c.json({
    ...(await hydrateConversation(c.env, row)),
    message_count: await playerMessageCount(c.env, row.id),
    messages: await getMessages(c.env, row.id),
  });
});

conversationRoutes.get('/:id/messages', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await getOwned(c.env, c.req.param('id'), user.id);
  if (!row) return c.json({ error: 'Conversation not found' }, 404);
  return c.json(await getMessages(c.env, row.id));
});

// ------------------------------------------------------------
// POST /:id/messages — send a player message, get an AI NPC reply
// ------------------------------------------------------------
conversationRoutes.post('/:id/messages', async (c) => {
  const user = c.get('user') as AuthUser;
  const conv = await getOwned(c.env, c.req.param('id'), user.id);
  if (!conv) return c.json({ error: 'Conversation not found' }, 404);

  const { playerMessage } = await c.req.json<{ playerMessage: string }>();
  const messageCount = (await playerMessageCount(c.env, conv.id)) + 1;
  if (messageCount > MAX_PLAYER_MESSAGES) {
    return c.json({ error: 'Conversation limit reached. Please respond to the offer.' }, 400);
  }

  const npc = await queryOne<Npc>(c.env.DB, 'SELECT * FROM npcs WHERE id = ?', [conv.npc_id]);
  if (!npc) return c.json({ error: 'NPC not found' }, 404);

  const mission = conv.mission_id
    ? await queryOne<{
        title: string; tagline: string | null; description: string | null;
        crisis_description: string | null; emotional_hook: string | null;
        difficulty: number | null; tech_tags: string | null;
      }>(
        c.env.DB,
        'SELECT title, tagline, description, crisis_description, emotional_hook, difficulty, tech_tags FROM missions WHERE id = ?',
        [conv.mission_id]
      )
    : null;

  // history BEFORE storing the new player message
  const history = await query<{ sender_type: 'player' | 'npc'; content: string }>(
    c.env.DB,
    'SELECT sender_type, content FROM conversation_messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 10',
    [conv.id]
  );

  let reply: string;
  try {
    reply = await generateNpcResponse(
      c.env.OPENAI_API_KEY,
      {
        name: npc.name, handle: npc.handle, company: npc.company, role: npc.role, bio: npc.bio,
        personality: parseJson(npc.personality, {}),
      },
      mission
        ? {
            title: mission.title, tagline: mission.tagline, description: mission.description,
            crisis_description: mission.crisis_description, emotional_hook: mission.emotional_hook,
            difficulty: mission.difficulty, tech_tags: parseJson<string[]>(mission.tech_tags, []),
          }
        : null,
      history,
      playerMessage,
      messageCount
    );
  } catch (err) {
    // OpenAI unavailable (e.g. quota exceeded). Alert the operator (rate-limited)
    // and serve a graceful fallback WITHOUT consuming the player's message budget,
    // so they can simply retry once service is restored. Nothing is persisted here.
    await alertOpenAiFailure(c.env, err instanceof Error ? err.message : String(err));
    return c.json({
      message: NPC_FALLBACK_REPLY,
      message_type: 'text',
      is_project_offer: false,
      can_continue: true,
      npc_message_id: null,
      degraded: true,
    });
  }

  await insertMessage(c.env, conv.id, 'player', playerMessage, 'text');

  const isProjectOffer = messageCount >= MAX_PLAYER_MESSAGES && !!conv.mission_id;
  const npcMessageId = await insertMessage(
    c.env,
    conv.id,
    'npc',
    reply,
    isProjectOffer ? 'project_offer' : 'text',
    isProjectOffer ? { mission_id: conv.mission_id, offer_type: 'help_request', can_accept: true } : {}
  );

  if (isProjectOffer) {
    await execute(
      c.env.DB,
      'UPDATE conversations SET status = ?, context = ?, updated_at = ? WHERE id = ?',
      [
        'offer_pending',
        toJson({ ...parseJson(conv.context, {}), stage: 'offer_pending', messages_exchanged: messageCount, offer_made_at: now() }),
        now(),
        conv.id,
      ]
    );
  }

  return c.json({
    message: reply,
    message_type: isProjectOffer ? 'project_offer' : 'text',
    is_project_offer: isProjectOffer,
    can_continue: messageCount < MAX_PLAYER_MESSAGES,
    npc_message_id: npcMessageId,
  });
});

// ------------------------------------------------------------
// PATCH /:id/status  and  PATCH /:id/read
// ------------------------------------------------------------
conversationRoutes.patch('/:id/status', async (c) => {
  const user = c.get('user') as AuthUser;
  const conv = await getOwned(c.env, c.req.param('id'), user.id);
  if (!conv) return c.json({ error: 'Conversation not found' }, 404);
  const { status } = await c.req.json<{ status: string }>();
  await execute(c.env.DB, 'UPDATE conversations SET status = ?, updated_at = ? WHERE id = ?', [status, now(), conv.id]);
  return c.json({ success: true });
});

conversationRoutes.patch('/:id/read', async (c) => {
  const user = c.get('user') as AuthUser;
  const conv = await getOwned(c.env, c.req.param('id'), user.id);
  if (!conv) return c.json({ error: 'Conversation not found' }, 404);
  await execute(
    c.env.DB,
    "UPDATE conversation_messages SET is_read = 1 WHERE conversation_id = ? AND sender_type = 'npc' AND is_read = 0",
    [conv.id]
  );
  await execute(c.env.DB, 'UPDATE conversations SET unread_count = 0, updated_at = ? WHERE id = ?', [now(), conv.id]);
  return c.json({ success: true });
});

// ------------------------------------------------------------
// POST /:id/accept — accept the offer, create a project
// ------------------------------------------------------------
conversationRoutes.post('/:id/accept', async (c) => {
  const user = c.get('user') as AuthUser;
  const conv = await getOwned(c.env, c.req.param('id'), user.id);
  if (!conv) return c.json({ error: 'Conversation not found' }, 404);
  if (!conv.mission_id) return c.json({ error: 'No mission associated with this conversation' }, 400);

  await insertMessage(c.env, conv.id, 'player', "I'd be happy to help! Let's do this.", 'acceptance');
  await execute(
    c.env.DB,
    'UPDATE conversations SET status = ?, context = ?, updated_at = ? WHERE id = ?',
    ['accepted', toJson({ ...parseJson(conv.context, {}), accepted_at: now() }), now(), conv.id]
  );

  // Seed design_state from the mission's first stage
  const firstStage = await queryOne<{ initial_system_state: string | null }>(
    c.env.DB,
    'SELECT initial_system_state FROM mission_stages WHERE mission_id = ? AND stage_number = 1',
    [conv.mission_id]
  );
  const designState = firstStage?.initial_system_state ?? toJson({ nodes: [], edges: [] });

  const projectId = generateId();
  const ts = now();
  await execute(
    c.env.DB,
    `INSERT INTO projects (id, player_id, mission_id, npc_id, conversation_id, status, current_stage, design_state, requirements_met, score, revenue_earned, started_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'designing', 1, ?, '[]', 0, 0, ?, ?, ?)`,
    [projectId, user.id, conv.mission_id, conv.npc_id, conv.id, designState, ts, ts, ts]
  );
  await execute(
    c.env.DB,
    `INSERT INTO project_metrics (id, project_id, uptime_percentage, updated_at) VALUES (?, ?, 100, ?)`,
    [generateId(), projectId, ts]
  );

  await insertMessage(
    c.env,
    conv.id,
    'npc',
    "Thank you so much! This means everything to us. I've set up a workspace for you — check out the project details and let's get started. I'll be here if you have questions along the way.",
    'text'
  );

  return c.json({ success: true, project_id: projectId });
});

// ------------------------------------------------------------
// POST /:id/decline
// ------------------------------------------------------------
conversationRoutes.post('/:id/decline', async (c) => {
  const user = c.get('user') as AuthUser;
  const conv = await getOwned(c.env, c.req.param('id'), user.id);
  if (!conv) return c.json({ error: 'Conversation not found' }, 404);

  await insertMessage(c.env, conv.id, 'player', "I appreciate the opportunity, but I can't take this on right now.", 'decline');
  await execute(c.env.DB, 'UPDATE conversations SET status = ?, updated_at = ? WHERE id = ?', ['declined', now(), conv.id]);
  await insertMessage(
    c.env,
    conv.id,
    'npc',
    "I understand — thank you for being honest. If you change your mind or want to help in the future, don't hesitate to reach out. Good luck with everything!",
    'text'
  );
  return c.json({ success: true });
});
