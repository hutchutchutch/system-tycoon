import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import type { Env, AuthUser, Profile } from '../types';
import { queryOne } from '../lib/db';

/**
 * JWT auth middleware using Hono's built-in JWT utilities.
 *
 * Expects: Authorization: Bearer <token>
 * The JWT payload contains { sub: profileId, email: string }.
 * Looks up the profile in D1 and attaches user + profile to context.
 */
export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verify(token, c.env.JWT_SECRET) as { sub: string; email: string };

    const profile = await queryOne<Profile>(
      c.env.DB,
      'SELECT * FROM profiles WHERE id = ?',
      [payload.sub]
    );

    if (!profile) {
      return c.json({ error: 'User not found' }, 401);
    }

    c.set('user', { id: profile.id, email: profile.email } as AuthUser);
    c.set('profile', profile);

    return next();
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
}

/**
 * Optional auth — doesn't block unauthenticated requests.
 */
export async function optionalAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const payload = await verify(token, c.env.JWT_SECRET) as { sub: string; email: string };
      const profile = await queryOne<Profile>(
        c.env.DB,
        'SELECT * FROM profiles WHERE id = ?',
        [payload.sub]
      );
      if (profile) {
        c.set('user', { id: profile.id, email: profile.email } as AuthUser);
        c.set('profile', profile);
      }
    } catch {
      // Silently ignore — unauthenticated is fine
    }
  }

  return next();
}
