import { Hono } from 'hono';
import type { Env, AuthUser, Profile, MissionEmail } from '../types';
import { generateId, now, queryOne, query, execute, parseJson, toJson } from '../lib/db';

export const emailRoutes = new Hono<{ Bindings: Env }>();

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

  // Find the user's active mission progress
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

  // Get emails from user_email_inbox joined with mission_emails
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

  // No inbox entries — return undelivered mission_start emails for the current stage
  const defaultEmails = await query<MissionEmail>(
    db,
    `SELECT * FROM mission_emails
     WHERE stage_id = ? AND trigger_type = 'mission_start'
     ORDER BY created_at DESC`,
    [stageId]
  );

  const parsed = defaultEmails.map(toEmailData);

  return c.json(parsed);
});

/**
 * GET /emails/:id
 * Get a single email by ID.
 */
emailRoutes.get('/:id', async (c) => {
  const db = c.env.DB;
  const emailId = c.req.param('id');

  const email = await queryOne<MissionEmail>(
    db,
    'SELECT * FROM mission_emails WHERE id = ?',
    [emailId]
  );

  if (!email) {
    return c.json({ error: 'Email not found' }, 404);
  }

  return c.json(toEmailData(email));
});

/**
 * POST /emails
 * Compose and save a new email.
 * Body: { to, subject, body, status ('draft'|'sent'), missionId?, stageId? }
 */
emailRoutes.post('/', async (c) => {
  const user = c.get('user') as AuthUser;
  const profile = c.get('profile') as Profile;
  const db = c.env.DB;

  const { to, subject, body, status, missionId, stageId } = await c.req.json<{
    to: string;
    subject: string;
    body: string;
    status: 'draft' | 'sent';
    missionId?: string;
    stageId?: string;
  }>();

  const id = generateId();
  const timestamp = now();

  await execute(
    db,
    `INSERT INTO mission_emails
       (id, mission_id, stage_id, sender_name, sender_email, recipient_email, subject, body, status, priority, has_attachments, tags, category, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'normal', 0, '[]', ?, ?, ?)`,
    [
      id,
      missionId || null,
      stageId || null,
      profile.display_name || profile.username,
      profile.email,
      to,
      subject,
      body,
      status,
      status === 'sent' ? 'sent' : 'drafts',
      timestamp,
      timestamp,
    ]
  );

  // If sent, also insert into user_email_inbox
  if (status === 'sent') {
    await execute(
      db,
      `INSERT INTO user_email_inbox (id, user_id, mission_email_id, status, delivered_at)
       VALUES (?, ?, ?, 'unread', ?)`,
      [generateId(), user.id, id, timestamp]
    );
  }

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

/**
 * PATCH /emails/:id/status
 * Update an email's status.
 * Body: { status }
 */
emailRoutes.patch('/:id/status', async (c) => {
  const db = c.env.DB;
  const emailId = c.req.param('id');
  const { status } = await c.req.json<{ status: string }>();
  const timestamp = now();

  const result = await execute(
    db,
    `UPDATE mission_emails SET status = ?, updated_at = ? WHERE id = ?`,
    [status, timestamp, emailId]
  );

  if (result.meta.changes === 0) {
    return c.json({ error: 'Email not found' }, 404);
  }

  return c.json({ success: true });
});

/**
 * POST /emails/deliver
 * Deliver mission emails to the user's inbox.
 * Replaces the `deliver_mission_emails` RPC.
 * Body: { missionId, stageId }
 */
emailRoutes.post('/deliver', async (c) => {
  const user = c.get('user') as AuthUser;
  const db = c.env.DB;
  const { missionId, stageId } = await c.req.json<{ missionId: string; stageId: string }>();
  const timestamp = now();

  // Find mission emails for this stage that are NOT yet in the user's inbox
  const undelivered = await query<{ id: string }>(
    db,
    `SELECT me.id FROM mission_emails me
     WHERE me.mission_id = ? AND me.stage_id = ?
       AND me.id NOT IN (
         SELECT mission_email_id FROM user_email_inbox WHERE user_id = ?
       )`,
    [missionId, stageId, user.id]
  );

  if (undelivered.length === 0) {
    return c.json({ delivered: 0 });
  }

  // Insert each undelivered email into the user's inbox
  const statements = undelivered.map((email) => ({
    sql: `INSERT INTO user_email_inbox (id, user_id, mission_email_id, status, delivered_at)
          VALUES (?, ?, ?, 'unread', ?)`,
    params: [generateId(), user.id, email.id, timestamp] as unknown[],
  }));

  // Use batch for efficiency
  const prepared = statements.map(({ sql, params }) => {
    const stmt = db.prepare(sql);
    return params && params.length > 0 ? stmt.bind(...params) : stmt;
  });
  await db.batch(prepared);

  return c.json({ delivered: undelivered.length });
});
