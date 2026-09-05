import { Hono } from 'hono';
import type { AppEnv, Profile } from '../types';
import { now, queryOne, execute, toBool, fromBool } from '../lib/db';

/**
 * Auth routes for profile management.
 * Signup/signin/OAuth are handled by Better Auth at /api/auth/sign-up,
 * /api/auth/sign-in, /api/auth/sign-in/social, etc. (mounted in index.ts).
 */
export const authRoutes = new Hono<AppEnv>();

function formatProfile(profile: Profile) {
  return {
    ...profile,
    onboarding_completed: toBool(profile.onboarding_completed),
    emailVerified: toBool(profile.emailVerified),
  };
}

/**
 * GET /me — current user's profile
 */
authRoutes.get('/me', async (c) => {
  const profile = c.get('profile') as Profile | undefined;
  if (!profile) {
    return c.json({ error: 'Profile not found' }, 404);
  }
  return c.json(formatProfile(profile));
});

/**
 * PATCH / — update profile fields (mounted at /api/profile)
 */
authRoutes.patch('/', async (c) => {
  const profile = c.get('profile') as Profile | undefined;
  if (!profile) {
    return c.json({ error: 'Profile not found' }, 404);
  }

  const body = await c.req.json<{
    username?: string;
    display_name?: string;
    avatar_url?: string;
    career_title?: string;
    preferred_mentor_id?: string;
    onboarding_completed?: boolean;
  }>().catch(() => null);
  if (!body || typeof body !== 'object') {
    return c.json({ error: 'Invalid profile update' }, 400);
  }

  if (body.username !== undefined && !/^[a-z0-9_-]{3,30}$/.test(body.username)) {
    return c.json({ error: 'Username must be 3-30 lowercase letters, numbers, underscores, or hyphens' }, 400);
  }
  if (body.display_name !== undefined && (typeof body.display_name !== 'string' || body.display_name.trim().length > 80)) {
    return c.json({ error: 'Display name must be 80 characters or fewer' }, 400);
  }
  if (body.career_title !== undefined && (typeof body.career_title !== 'string' || body.career_title.trim().length > 80)) {
    return c.json({ error: 'Career title must be 80 characters or fewer' }, 400);
  }
  if (body.avatar_url !== undefined) {
    try {
      const url = new URL(body.avatar_url);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('unsupported protocol');
    } catch {
      return c.json({ error: 'Avatar URL must be an HTTP or HTTPS URL' }, 400);
    }
  }
  if (body.onboarding_completed !== undefined && typeof body.onboarding_completed !== 'boolean') {
    return c.json({ error: 'Invalid onboarding value' }, 400);
  }
  if (body.preferred_mentor_id !== undefined) {
    if (typeof body.preferred_mentor_id !== 'string' || body.preferred_mentor_id.length > 128) {
      return c.json({ error: 'Invalid mentor' }, 400);
    }
    const mentor = await queryOne<{ id: string }>(c.env.DB, 'SELECT id FROM mentors WHERE id = ?', [body.preferred_mentor_id]);
    if (!mentor) return c.json({ error: 'Invalid mentor' }, 400);
  }

  if (body.username !== undefined && body.username !== profile.username) {
    const existing = await queryOne<Profile>(
      c.env.DB,
      'SELECT id FROM user WHERE username = ? AND id != ?',
      [body.username, profile.id]
    );
    if (existing) {
      return c.json({ error: 'Username already taken' }, 409);
    }
  }

  const setClauses: string[] = [];
  const params: unknown[] = [];

  if (body.username !== undefined) { setClauses.push('username = ?'); params.push(body.username); }
  if (body.display_name !== undefined) { setClauses.push('display_name = ?'); params.push(body.display_name.trim()); }
  if (body.avatar_url !== undefined) { setClauses.push('avatar_url = ?'); params.push(body.avatar_url); }
  if (body.career_title !== undefined) { setClauses.push('career_title = ?'); params.push(body.career_title.trim()); }
  if (body.preferred_mentor_id !== undefined) { setClauses.push('preferred_mentor_id = ?'); params.push(body.preferred_mentor_id); }
  if (body.onboarding_completed !== undefined) { setClauses.push('onboarding_completed = ?'); params.push(fromBool(body.onboarding_completed)); }

  if (setClauses.length === 0) {
    return c.json({ error: 'No fields to update' }, 400);
  }

  setClauses.push('updatedAt = ?');
  params.push(now());
  params.push(profile.id);

  await execute(c.env.DB, `UPDATE user SET ${setClauses.join(', ')} WHERE id = ?`, params);

  const updated = await queryOne<Profile>(
    c.env.DB, 'SELECT * FROM user WHERE id = ?', [profile.id]
  );
  return c.json(formatProfile(updated!));
});
