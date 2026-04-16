import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { Env, AuthUser, Profile } from '../types';
import { generateId, now, queryOne, execute, toBool, fromBool } from '../lib/db';

export const authRoutes = new Hono<{ Bindings: Env }>();

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

/** Hash a password using PBKDF2 via Web Crypto API */
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  // Store as salt:hash (both hex-encoded)
  const saltHex = [...new Uint8Array(salt)].map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}

/** Verify a password against a stored salt:hash */
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, expectedHashHex] = stored.split(':');
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashHex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === expectedHashHex;
}

/** Issue a JWT for a profile */
async function issueToken(profile: Profile, secret: string): Promise<string> {
  const payload = {
    sub: profile.id,
    email: profile.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };
  return sign(payload, secret);
}

/** Format profile for response (convert SQLite booleans) */
function formatProfile(profile: Profile) {
  return {
    ...profile,
    onboarding_completed: toBool(profile.onboarding_completed),
    password_hash: undefined, // never expose
  };
}

// -------------------------------------------------------
// POST /signup — email + password
// -------------------------------------------------------
authRoutes.post('/signup', async (c) => {
  const { email, password, username } = await c.req.json<{
    email: string;
    password: string;
    username: string;
  }>();

  if (!email || !password || !username) {
    return c.json({ error: 'Email, password, and username are required' }, 400);
  }
  if (password.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400);
  }

  // Check existing email
  const existingEmail = await queryOne<Profile>(c.env.DB, 'SELECT id FROM profiles WHERE email = ?', [email]);
  if (existingEmail) {
    return c.json({ error: 'Email already registered' }, 409);
  }

  // Check existing username
  const existingUsername = await queryOne<Profile>(c.env.DB, 'SELECT id FROM profiles WHERE username = ?', [username]);
  if (existingUsername) {
    return c.json({ error: 'Username already taken' }, 409);
  }

  const id = generateId();
  const timestamp = now();
  const passwordHash = await hashPassword(password);

  await execute(c.env.DB, `
    INSERT INTO profiles (id, email, username, display_name, password_hash, auth_provider, current_level, reputation_score, career_title, onboarding_completed, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'email', 1, 0, 'Aspiring Developer', 0, ?, ?)
  `, [id, email, username, username, passwordHash, timestamp, timestamp]);

  // Create initial user_stats
  await execute(c.env.DB, `
    INSERT INTO user_stats (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)
  `, [generateId(), id, timestamp, timestamp]);

  const profile = (await queryOne<Profile>(c.env.DB, 'SELECT * FROM profiles WHERE id = ?', [id]))!;
  const token = await issueToken(profile, c.env.JWT_SECRET);

  return c.json({ token, user: formatProfile(profile) }, 201);
});

// -------------------------------------------------------
// POST /signin — email + password
// -------------------------------------------------------
authRoutes.post('/signin', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>();

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const profile = await queryOne<Profile & { password_hash: string }>(
    c.env.DB,
    'SELECT * FROM profiles WHERE email = ?',
    [email]
  );

  if (!profile || !profile.password_hash) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const valid = await verifyPassword(password, profile.password_hash);
  if (!valid) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const token = await issueToken(profile, c.env.JWT_SECRET);
  return c.json({ token, user: formatProfile(profile) });
});

// -------------------------------------------------------
// GET /google — redirect to Google OAuth consent screen
// -------------------------------------------------------
authRoutes.get('/google', async (c) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = c.env;
  const state = crypto.randomUUID(); // CSRF protection

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'consent',
  });

  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// -------------------------------------------------------
// GET /google/callback — exchange code for tokens, create/login user
// -------------------------------------------------------
authRoutes.get('/google/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) {
    return c.json({ error: 'Missing authorization code' }, 400);
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = c.env;

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    return c.json({ error: 'Failed to exchange authorization code' }, 400);
  }

  const tokens = await tokenRes.json() as { id_token: string; access_token: string };

  // Decode the Google ID token to get user info (header.payload.signature)
  const payloadB64 = tokens.id_token.split('.')[1];
  const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))) as {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
  };

  if (!payload.email) {
    return c.json({ error: 'Google account has no email' }, 400);
  }

  const db = c.env.DB;

  // Check if user exists by google_id or email
  let profile = await queryOne<Profile>(db, 'SELECT * FROM profiles WHERE google_id = ?', [payload.sub]);

  if (!profile) {
    profile = await queryOne<Profile>(db, 'SELECT * FROM profiles WHERE email = ?', [payload.email]);
  }

  if (profile) {
    // Update google_id if not set (email user linking to Google)
    if (!(profile as any).google_id) {
      await execute(db, 'UPDATE profiles SET google_id = ?, auth_provider = ?, updated_at = ? WHERE id = ?', [
        payload.sub, 'google', now(), profile.id,
      ]);
    }
  } else {
    // Create new user
    const id = generateId();
    const username = payload.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const timestamp = now();

    await execute(db, `
      INSERT INTO profiles (id, email, username, display_name, avatar_url, google_id, auth_provider, current_level, reputation_score, career_title, onboarding_completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'google', 1, 0, 'Aspiring Developer', 0, ?, ?)
    `, [id, payload.email, username, payload.name || username, payload.picture || null, payload.sub, timestamp, timestamp]);

    await execute(db, 'INSERT INTO user_stats (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)', [
      generateId(), id, timestamp, timestamp,
    ]);

    profile = (await queryOne<Profile>(db, 'SELECT * FROM profiles WHERE id = ?', [id]))!;
  }

  const token = await issueToken(profile!, c.env.JWT_SECRET);

  // Redirect to frontend with token in URL fragment (not query — fragments aren't sent to server)
  const frontendUrl = c.req.header('Origin') || 'http://localhost:5173';
  return c.redirect(`${frontendUrl}/auth/callback#token=${token}`);
});

// -------------------------------------------------------
// GET /me — returns current user profile (requires auth middleware)
// -------------------------------------------------------
authRoutes.get('/me', async (c) => {
  const profile = c.get('profile') as Profile | undefined;

  if (!profile) {
    return c.json({ error: 'Profile not found' }, 404);
  }

  return c.json(formatProfile(profile));
});

// -------------------------------------------------------
// PATCH /profile — update profile fields
// -------------------------------------------------------
authRoutes.patch('/profile', async (c) => {
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

  // Validate username uniqueness
  if (body.username !== undefined && body.username !== profile.username) {
    const existing = await queryOne<Profile>(
      c.env.DB, 'SELECT id FROM profiles WHERE username = ? AND id != ?', [body.username, profile.id]
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

  setClauses.push('updated_at = ?');
  params.push(now());
  params.push(profile.id);

  await execute(c.env.DB, `UPDATE profiles SET ${setClauses.join(', ')} WHERE id = ?`, params);

  const updated = await queryOne<Profile>(c.env.DB, 'SELECT * FROM profiles WHERE id = ?', [profile.id]);
  return c.json(formatProfile(updated!));
});

// -------------------------------------------------------
// GET /demo — dev-only demo sign-in
// -------------------------------------------------------
authRoutes.get('/demo', async (c) => {
  const profileId = c.req.query('profileId') || generateId();
  const email = 'demo@example.com';
  const username = 'demo_user';
  const timestamp = now();

  let profile = await queryOne<Profile>(c.env.DB, 'SELECT * FROM profiles WHERE id = ?', [profileId]);

  if (!profile) {
    await execute(c.env.DB, `
      INSERT INTO profiles (id, email, username, display_name, auth_provider, current_level, reputation_score, career_title, onboarding_completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'demo', 1, 0, 'Aspiring Developer', 0, ?, ?)
    `, [profileId, email, username, username, timestamp, timestamp]);

    profile = await queryOne<Profile>(c.env.DB, 'SELECT * FROM profiles WHERE id = ?', [profileId]);
  }

  if (!profile) {
    return c.json({ error: 'Failed to create demo profile' }, 500);
  }

  const token = await issueToken(profile, c.env.JWT_SECRET);
  return c.json({ token, user: formatProfile(profile) });
});
