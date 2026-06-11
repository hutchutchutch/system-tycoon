import { Hono } from 'hono';
import type { AppEnv, Env, Profile } from '../types';
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
  }>();

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
  if (body.display_name !== undefined) { setClauses.push('display_name = ?'); params.push(body.display_name); }
  if (body.avatar_url !== undefined) { setClauses.push('avatar_url = ?'); params.push(body.avatar_url); }
  if (body.career_title !== undefined) { setClauses.push('career_title = ?'); params.push(body.career_title); }
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
