import { Hono } from 'hono';
import type { AppEnv, AuthUser, Profile, MissionEmail } from '../types';
import { generateId, now, queryOne, query, execute, parseJson } from '../lib/db';

export const emailRoutes = new Hono<AppEnv>();

// Transform DB row to frontend EmailData shape
function toEmailData(e: MissionEmail & { inbox_status?: string; read_at?: string | null; delivered_at?: string | null }) {
  return {
    ...e,
    content: e.body ?? '',
    timestamp: e.created_at,
    status: (e.inbox_status ?? e.status) as 'unread' | 'read' | 'draft' | 'sent',
    preview: e.preview ?? '',
    sender_avatar: e.sender_avatar ?? undefined,
    has_attachments: Boolean(e.has_attachments),
    tags: parseJson<string[]>(e.tags, []),
  };
}

/**
 * GET /emails
 * Get emails for the current user's active mission stage.
 * Replaces the Supabase RPC `get_emails_for_current_stage`.
 */
emailRoutes.get('/', async (c) => {
  const user = c.get('user') as AuthUser;
  const db = c.env.DB;

  // The inbox is user-scoped — it must survive mission completion
  // (the mission_complete congratulation lives here too).
  const inboxEmails = await query<MissionEmail & { inbox_status: string; read_at: string | null; delivered_at: string | null }>(
    db,
    `SELECT me.*, uei.status AS inbox_status, uei.read_at, uei.delivered_at
     FROM user_email_inbox uei
     JOIN mission_emails me ON me.id = uei.mission_email_id
     WHERE uei.user_id = ?
     ORDER BY me.created_at DESC`,
    [user.id]
  );

  if (inboxEmails.length > 0) {
    return c.json(inboxEmails.map(toEmailData));
  }

  // Empty inbox — fall back to undelivered mission_start emails for the
  // user's active stage, if they have a mission in progress.
  const progress = await queryOne<{ mission_id: string; stage_id: string; current_stage_id: string | null }>(
    db,
    `SELECT mission_id, stage_id, current_stage_id FROM user_mission_progress
     WHERE user_id = ? AND status = 'in_progress'
     ORDER BY updated_at DESC LIMIT 1`,
    [user.id]
  );

  if (!progress) {
    return c.json([]);
  }

  const stageId = progress.current_stage_id || progress.stage_id;

  const defaultEmails = await query<MissionEmail>(
    db,
    `SELECT * FROM mission_emails
     WHERE stage_id = ? AND trigger_type = 'mission_start'
     ORDER BY created_at DESC`,
    [stageId]
  );

  return c.json(defaultEmails.map(toEmailData));
});

/**
 * GET /emails/:id
 * Get a single email by ID.
 */
emailRoutes.get('/:id', async (c) => {
  const user = c.get('user') as AuthUser;
  const db = c.env.DB;
  const emailId = c.req.param('id');

  const email = await queryOne<MissionEmail & { inbox_status: string; read_at: string | null; delivered_at: string | null }>(
    db,
    `SELECT me.*, uei.status AS inbox_status, uei.read_at, uei.delivered_at
     FROM user_email_inbox uei
     JOIN mission_emails me ON me.id = uei.mission_email_id
     WHERE uei.user_id = ? AND me.id = ?`,
    [user.id, emailId]
  );

  if (!email) {
    return c.json({ error: 'Email not found' }, 404);
  }

  return c.json(toEmailData(email));
});

/**
 * POST /emails
 * Compose and save a new email.
 * Body: { to, subject, body, status ('draft'|'sent') }
 */
emailRoutes.post('/', async (c) => {
  const user = c.get('user') as AuthUser;
  const profile = c.get('profile') as Profile;
  const db = c.env.DB;

  const payload = await c.req.json<{
    to: string;
    subject: string;
    body: string;
    status: 'draft' | 'sent';
  }>().catch(() => null);
  const recipient = payload?.to?.trim();
  const subject = payload?.subject?.trim();
  const message = payload?.body?.trim();
  const status = payload?.status;
  if (
    !recipient || recipient.length > 320
    || !subject || subject.length > 200
    || !message || message.length > 10_000
    || (status !== 'draft' && status !== 'sent')
  ) {
    return c.json({ error: 'Invalid email' }, 400);
  }

  const id = generateId();
  const timestamp = now();

  const statements: D1PreparedStatement[] = [db.prepare(
    `INSERT INTO mission_emails
       (id, mission_id, stage_id, sender_name, sender_email, recipient_email, subject, body, status, priority, has_attachments, tags, category, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'normal', 0, '[]', ?, ?, ?)`,
  ).bind(
      id,
      null,
      null,
      profile.display_name || profile.username || profile.name || profile.email,
      profile.email,
      recipient,
      subject,
      message,
      status,
      status === 'sent' ? 'sent' : 'drafts',
      timestamp,
      timestamp,
    )];

  // If sent, also insert into user_email_inbox
  if (status === 'sent') {
    statements.push(db.prepare(
      `INSERT INTO user_email_inbox (id, user_id, mission_email_id, status, delivered_at)
       VALUES (?, ?, ?, 'unread', ?)`,
    ).bind(generateId(), user.id, id, timestamp));
  }
  await db.batch(statements);

  const created = await queryOne<MissionEmail>(db, 'SELECT * FROM mission_emails WHERE id = ?', [id]);

  return c.json(toEmailData(created!), 201);
});

/**
 * PATCH /emails/:id/read
 * Mark an email as read.
 * Replaces the `mark_email_as_read` RPC.
 */
emailRoutes.patch('/:id/read', async (c) => {
  const user = c.get('user') as AuthUser;
  const db = c.env.DB;
  const emailId = c.req.param('id');
  const timestamp = now();

  const result = await execute(
    db,
    `UPDATE user_email_inbox SET status = 'read', read_at = ?
     WHERE user_id = ? AND mission_email_id = ?`,
    [timestamp, user.id, emailId]
  );

  if (result.meta.changes === 0) {
    return c.json({ error: 'Inbox entry not found' }, 404);
  }

  return c.json({ success: true });
});
