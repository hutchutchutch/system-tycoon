import { Hono } from 'hono';
import type { Env, AuthUser, Npc, SocialFeedPost } from '../types';
import { generateId, now, query, queryOne, execute, parseJson, toBool, fromBool } from '../lib/db';

export const socialRoutes = new Hono<{ Bindings: Env }>();

// ------------------------------------------------------------
// Hydration helpers — parse JSON columns / 0-1 booleans for the client
// ------------------------------------------------------------
function hydrateNpc(row: Npc) {
  return {
    ...row,
    verified: toBool(row.verified),
    personality: parseJson<Record<string, unknown>>(row.personality, {}),
  };
}

function hydratePost(
  row: SocialFeedPost,
  npc: Npc | null,
  liked: boolean,
  bookmarked: boolean
) {
  return {
    ...row,
    is_visible: toBool(row.is_visible),
    is_pinned: toBool(row.is_pinned),
    tech_tags: parseJson<string[]>(row.tech_tags, []),
    is_liked: liked,
    is_bookmarked: bookmarked,
    npc: npc ? hydrateNpc(npc) : undefined,
  };
}

function placeholders(n: number): string {
  return Array.from({ length: n }, () => '?').join(', ');
}

// ------------------------------------------------------------
// GET /feed — paginated feed with per-user like/bookmark flags
// ------------------------------------------------------------
socialRoutes.get('/feed', async (c) => {
  const user = c.get('user') as AuthUser;
  const url = new URL(c.req.url);
  const cursor = url.searchParams.get('cursor');
  const limit = Math.min(Number(url.searchParams.get('limit')) || 20, 50);
  const csv = (k: string) => (url.searchParams.get(k) || '').split(',').map((s) => s.trim()).filter(Boolean);
  const postTypes = csv('postTypes');
  const difficulties = csv('difficulties');
  const urgencies = csv('urgencies');

  const where: string[] = ['is_visible = 1', "(scheduled_at IS NULL OR scheduled_at <= datetime('now'))"];
  const params: unknown[] = [];
  if (cursor) { where.push('created_at < ?'); params.push(cursor); }
  if (postTypes.length) { where.push(`post_type IN (${placeholders(postTypes.length)})`); params.push(...postTypes); }
  if (difficulties.length) { where.push(`difficulty_hint IN (${placeholders(difficulties.length)})`); params.push(...difficulties); }
  if (urgencies.length) { where.push(`urgency IN (${placeholders(urgencies.length)})`); params.push(...urgencies); }
  params.push(limit);

  const posts = await query<SocialFeedPost>(
    c.env.DB,
    `SELECT * FROM social_feed_posts WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ?`,
    params
  );

  if (posts.length === 0) return c.json({ posts: [], nextCursor: null });

  const npcIds = [...new Set(posts.map((p) => p.npc_id).filter(Boolean))] as string[];
  const postIds = posts.map((p) => p.id);

  const [npcRows, likeRows, bookmarkRows] = await Promise.all([
    npcIds.length
      ? query<Npc>(c.env.DB, `SELECT * FROM npcs WHERE id IN (${placeholders(npcIds.length)})`, npcIds)
      : Promise.resolve([]),
    query<{ post_id: string }>(
      c.env.DB,
      `SELECT post_id FROM post_likes WHERE player_id = ? AND post_id IN (${placeholders(postIds.length)})`,
      [user.id, ...postIds]
    ),
    query<{ post_id: string }>(
      c.env.DB,
      `SELECT post_id FROM post_bookmarks WHERE player_id = ? AND post_id IN (${placeholders(postIds.length)})`,
      [user.id, ...postIds]
    ),
  ]);

  const npcById = new Map(npcRows.map((n) => [n.id, n]));
  const likedIds = new Set(likeRows.map((r) => r.post_id));
  const bookmarkedIds = new Set(bookmarkRows.map((r) => r.post_id));

  const hydrated = posts.map((p) =>
    hydratePost(p, p.npc_id ? npcById.get(p.npc_id) ?? null : null, likedIds.has(p.id), bookmarkedIds.has(p.id))
  );

  const nextCursor = posts.length === limit ? posts[posts.length - 1].created_at : null;
  return c.json({ posts: hydrated, nextCursor });
});

// ------------------------------------------------------------
// GET /posts/:id
// ------------------------------------------------------------
socialRoutes.get('/posts/:id', async (c) => {
  const user = c.get('user') as AuthUser;
  const id = c.req.param('id');
  const post = await queryOne<SocialFeedPost>(c.env.DB, 'SELECT * FROM social_feed_posts WHERE id = ?', [id]);
  if (!post) return c.json({ error: 'Post not found' }, 404);

  const npc = post.npc_id ? await queryOne<Npc>(c.env.DB, 'SELECT * FROM npcs WHERE id = ?', [post.npc_id]) : null;
  const liked = await queryOne(c.env.DB, 'SELECT 1 AS x FROM post_likes WHERE post_id = ? AND player_id = ?', [id, user.id]);
  const booked = await queryOne(c.env.DB, 'SELECT 1 AS x FROM post_bookmarks WHERE post_id = ? AND player_id = ?', [id, user.id]);
  return c.json(hydratePost(post, npc, !!liked, !!booked));
});

// ------------------------------------------------------------
// NPCs
// ------------------------------------------------------------
socialRoutes.get('/npcs', async (c) => {
  const rows = await query<Npc>(c.env.DB, 'SELECT * FROM npcs ORDER BY follower_count DESC', []);
  return c.json(rows.map(hydrateNpc));
});

socialRoutes.get('/npcs/handle/:handle', async (c) => {
  const row = await queryOne<Npc>(c.env.DB, 'SELECT * FROM npcs WHERE handle = ?', [c.req.param('handle')]);
  if (!row) return c.json({ error: 'NPC not found' }, 404);
  return c.json(hydrateNpc(row));
});

socialRoutes.get('/npcs/:id', async (c) => {
  const row = await queryOne<Npc>(c.env.DB, 'SELECT * FROM npcs WHERE id = ?', [c.req.param('id')]);
  if (!row) return c.json({ error: 'NPC not found' }, 404);
  return c.json(hydrateNpc(row));
});

socialRoutes.get('/npcs/:id/interaction', async (c) => {
  const user = c.get('user') as AuthUser;
  const row = await queryOne(
    c.env.DB,
    'SELECT * FROM player_npc_interactions WHERE player_id = ? AND npc_id = ?',
    [user.id, c.req.param('id')]
  );
  return c.json(row ?? null);
});

socialRoutes.post('/npcs/:id/follow', async (c) => {
  const user = c.get('user') as AuthUser;
  const npcId = c.req.param('id');
  const body = await c.req.json<{ follow: boolean }>();
  const ts = now();
  await execute(
    c.env.DB,
    `INSERT INTO player_npc_interactions (id, player_id, npc_id, is_following, first_interaction_at, last_interaction_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(player_id, npc_id) DO UPDATE SET is_following = excluded.is_following, updated_at = excluded.updated_at`,
    [generateId(), user.id, npcId, fromBool(body.follow), ts, ts, ts, ts]
  );
  return c.json({ success: true });
});

// ------------------------------------------------------------
// Likes / bookmarks (toggle, maintaining the denormalized count)
// ------------------------------------------------------------
socialRoutes.post('/posts/:id/like', async (c) => {
  const user = c.get('user') as AuthUser;
  const postId = c.req.param('id');
  const res = await execute(
    c.env.DB,
    'INSERT OR IGNORE INTO post_likes (id, post_id, player_id, created_at) VALUES (?, ?, ?, ?)',
    [generateId(), postId, user.id, now()]
  );
  if (res.meta.changes > 0) {
    await execute(c.env.DB, 'UPDATE social_feed_posts SET likes = likes + 1 WHERE id = ?', [postId]);
  }
  return c.json({ success: true });
});

socialRoutes.delete('/posts/:id/like', async (c) => {
  const user = c.get('user') as AuthUser;
  const postId = c.req.param('id');
  const res = await execute(c.env.DB, 'DELETE FROM post_likes WHERE post_id = ? AND player_id = ?', [postId, user.id]);
  if (res.meta.changes > 0) {
    await execute(c.env.DB, 'UPDATE social_feed_posts SET likes = MAX(0, likes - 1) WHERE id = ?', [postId]);
  }
  return c.json({ success: true });
});

socialRoutes.post('/posts/:id/bookmark', async (c) => {
  const user = c.get('user') as AuthUser;
  await execute(
    c.env.DB,
    'INSERT OR IGNORE INTO post_bookmarks (id, post_id, player_id, created_at) VALUES (?, ?, ?, ?)',
    [generateId(), c.req.param('id'), user.id, now()]
  );
  return c.json({ success: true });
});

socialRoutes.delete('/posts/:id/bookmark', async (c) => {
  const user = c.get('user') as AuthUser;
  await execute(c.env.DB, 'DELETE FROM post_bookmarks WHERE post_id = ? AND player_id = ?', [c.req.param('id'), user.id]);
  return c.json({ success: true });
});
