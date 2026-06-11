import { Hono } from 'hono';
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
import { collaborationRoutes } from './routes/collaboration';
import { gameRoutes } from './routes/game';
import { socialRoutes } from './routes/social';
import { conversationRoutes } from './routes/conversations';
import { projectRoutes } from './routes/projects';

export { DesignSessionDO } from './durable-objects/DesignSessionDO';

const app = new Hono<AppEnv>();

// Global middleware
app.use('*', corsMiddleware);

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
app.use('/api/game/scenarios', kvCache({ ttlSeconds: 300, prefix: 'scenarios' }));
app.use('/api/game/components', kvCache({ ttlSeconds: 300, prefix: 'components' }));
app.use('/api/game/achievements', kvCache({ ttlSeconds: 300, prefix: 'achievements' }));

// Profile mgmt routes (auth-related but not handled by Better Auth)
app.route('/api/profile', authRoutes);

// Feature routes
app.route('/api/emails', emailRoutes);
app.route('/api/missions', missionRoutes);
app.route('/api/canvas', canvasRoutes);
app.route('/api/mentors', mentorRoutes);
app.route('/api/collaboration', collaborationRoutes);
app.route('/api/game', gameRoutes);
app.route('/api/social', socialRoutes);
app.route('/api/conversations', conversationRoutes);
app.route('/api/projects', projectRoutes);

// -------------------------------------------------------
// WebSocket endpoint for realtime collaboration
// -------------------------------------------------------
app.get('/api/ws/session/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  const user = c.get('user') as any;

  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const doId = c.env.DESIGN_SESSION.idFromName(sessionId);
  const stub = c.env.DESIGN_SESSION.get(doId);

  const url = new URL(c.req.url);
  url.searchParams.set('userId', user.id);
  url.searchParams.set('username', user.name || user.email?.split('@')[0] || 'Anonymous');
  url.searchParams.set('sessionId', sessionId);

  return stub.fetch(new Request(url.toString(), { headers: c.req.raw.headers }));
});

app.get('/api/ws/session/:sessionId/participants', async (c) => {
  const sessionId = c.req.param('sessionId');
  const doId = c.env.DESIGN_SESSION.idFromName(sessionId);
  const stub = c.env.DESIGN_SESSION.get(doId);
  const url = new URL(c.req.url);
  url.pathname = '/participants';
  return stub.fetch(new Request(url.toString()));
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));

app.onError((err, c) => {
  console.error('Worker error:', err);
  return c.json(
    {
      error: c.env.ENVIRONMENT === 'development' ? err.message : 'Internal server error',
      ...(c.env.ENVIRONMENT === 'development' && { stack: err.stack }),
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
      return app.fetch(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
};
