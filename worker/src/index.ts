import { Hono } from 'hono';
import type { Env } from './types';
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

// Re-export Durable Object class for wrangler
export { DesignSessionDO } from './durable-objects/DesignSessionDO';

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', corsMiddleware);

// Health check (no auth required)
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT,
  });
});

// -------------------------------------------------------
// Public routes (no/optional auth)
// -------------------------------------------------------
app.use('/api/news/*', optionalAuth);

// Phase 6: KV cache for news (5 min TTL — rarely changes)
app.use('/api/news', kvCache({ ttlSeconds: 300, prefix: 'news' }));
app.use('/api/news/categories', kvCache({ ttlSeconds: 600, prefix: 'news-cat' }));
app.route('/api/news', newsRoutes);

// Public auth routes (signup, signin, OAuth, demo — no auth required)
app.route('/api/auth', authRoutes);

// -------------------------------------------------------
// Protected routes (auth required for everything else under /api)
// -------------------------------------------------------
app.use('/api/*', authMiddleware);

// Phase 6: KV cache for static-ish data (mentors, components, scenarios, achievements)
app.use('/api/mentors', kvCache({ ttlSeconds: 300, prefix: 'mentors' }));
app.use('/api/game/scenarios', kvCache({ ttlSeconds: 300, prefix: 'scenarios' }));
app.use('/api/game/components', kvCache({ ttlSeconds: 300, prefix: 'components' }));
app.use('/api/game/achievements', kvCache({ ttlSeconds: 300, prefix: 'achievements' }));

// Mount authenticated route groups
app.route('/api/emails', emailRoutes);
app.route('/api/missions', missionRoutes);
app.route('/api/canvas', canvasRoutes);
app.route('/api/mentors', mentorRoutes);
app.route('/api/collaboration', collaborationRoutes);
app.route('/api/game', gameRoutes);

// -------------------------------------------------------
// Phase 5: WebSocket endpoint for realtime collaboration
// -------------------------------------------------------
app.get('/api/ws/session/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  const user = c.get('user') as any;

  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  // Get or create the Durable Object for this session
  const doId = c.env.DESIGN_SESSION.idFromName(sessionId);
  const stub = c.env.DESIGN_SESSION.get(doId);

  // Forward the WebSocket upgrade to the Durable Object
  const url = new URL(c.req.url);
  url.searchParams.set('userId', user.id);
  url.searchParams.set('username', user.email?.split('@')[0] || 'Anonymous');
  url.searchParams.set('sessionId', sessionId);

  return stub.fetch(new Request(url.toString(), {
    headers: c.req.raw.headers,
  }));
});

// GET session participants without WebSocket
app.get('/api/ws/session/:sessionId/participants', async (c) => {
  const sessionId = c.req.param('sessionId');
  const doId = c.env.DESIGN_SESSION.idFromName(sessionId);
  const stub = c.env.DESIGN_SESSION.get(doId);

  const url = new URL(c.req.url);
  url.pathname = '/participants';

  return stub.fetch(new Request(url.toString()));
});

// -------------------------------------------------------
// Error handling
// -------------------------------------------------------
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

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

export default app;
