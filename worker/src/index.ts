import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import type { AppEnv, Env } from './types';
import { createAuth } from './lib/auth';
import { corsMiddleware } from './middleware/cors';
import { authMiddleware, optionalAuth } from './middleware/auth';
import { kvCache } from './middleware/cache';
import { authRoutes } from './routes/auth';
import { emailRoutes } from './routes/emails';
import { missionRoutes } from './routes/missions';
import { canvasRoutes } from './routes/canvas';
import { mentorRoutes } from './routes/mentors';
import { newsRoutes } from './routes/news';
import { gameRoutes } from './routes/game';

// Existing production DO namespaces must retain their class export. The MVP
// intentionally has no public collaboration route or binding to this class.
export { DesignSessionDO } from './durable-objects/DesignSessionDO';

export const app = new Hono<AppEnv>();

function withSecurityHeaders(response: Response, environment: string): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (headers.get('content-type')?.includes('text/html')) {
    headers.set(
      'Content-Security-Policy',
      "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
    );
  }
  if (environment === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Global middleware
app.use('*', corsMiddleware);
app.use('/api/*', bodyLimit({
  maxSize: 600 * 1024,
  onError: (c) => c.json({ error: 'Request body too large' }, 413),
}));

// Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT,
  });
});

// -------------------------------------------------------
// Better Auth handler — owns signup, signin, OAuth, signout, session
// Mounted at /api/auth/* — handles ALL auth endpoints automatically
// -------------------------------------------------------
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

// -------------------------------------------------------
// Public routes (no/optional auth)
// -------------------------------------------------------
app.use('/api/news/*', optionalAuth);
app.use('/api/news', kvCache({ ttlSeconds: 300, prefix: 'news' }));
app.use('/api/news/categories', kvCache({ ttlSeconds: 600, prefix: 'news-cat' }));
app.route('/api/news', newsRoutes);

// -------------------------------------------------------
// Protected routes (Better Auth session required)
// -------------------------------------------------------
app.use('/api/*', authMiddleware);

// Cached read-heavy routes
app.use('/api/mentors', kvCache({ ttlSeconds: 300, prefix: 'mentors' }));
app.use('/api/game/components', kvCache({ ttlSeconds: 300, prefix: 'components' }));

// Profile mgmt routes (auth-related but not handled by Better Auth)
app.route('/api/profile', authRoutes);

// Feature routes
app.route('/api/emails', emailRoutes);
app.route('/api/missions', missionRoutes);
app.route('/api/canvas', canvasRoutes);
app.route('/api/mentors', mentorRoutes);
app.route('/api/game', gameRoutes);

app.notFound((c) => c.json({ error: 'Not found' }, 404));

app.onError((err, c) => {
  console.error(JSON.stringify({
    message: 'worker_request_failed',
    error: err.message,
    method: c.req.method,
    path: new URL(c.req.url).pathname,
  }));
  return c.json(
    {
      error: 'Internal server error',
    },
    500
  );
});

/**
 * Entry point. Dispatches:
 *   /api/*  → Hono app (API routes)
 *   /*      → static assets (React SPA with SPA fallback)
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return withSecurityHeaders(await app.fetch(request, env, ctx), env.ENVIRONMENT);
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request), env.ENVIRONMENT);
  },
};
