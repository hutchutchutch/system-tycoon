import { Context, Next } from 'hono';
import type { AppEnv, AuthUser, Profile } from '../types';
import { createAuth } from '../lib/auth';
import { queryOne } from '../lib/db';

/**
 * Validates the Better Auth session cookie.
 * Attaches `user` and `profile` to the request context.
 */
export async function authMiddleware(c: Context<AppEnv>, next: Next) {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  // Load the full user row (with our additionalFields) from D1
  const profile = await queryOne<Profile>(
    c.env.DB,
    'SELECT * FROM user WHERE id = ?',
    [session.user.id]
  );

  if (!profile) {
    return c.json({ error: 'User not found' }, 401);
  }

  c.set('user', {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    image: profile.image,
  } as AuthUser);
  c.set('profile', profile);

  return next();
}

/**
 * Optional auth — doesn't block unauthenticated requests.
 */
export async function optionalAuth(c: Context<AppEnv>, next: Next) {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (session) {
    const profile = await queryOne<Profile>(
      c.env.DB,
      'SELECT * FROM user WHERE id = ?',
      [session.user.id]
    );
    if (profile) {
      c.set('user', {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        image: profile.image,
      } as AuthUser);
      c.set('profile', profile);
    }
  }

  return next();
}
