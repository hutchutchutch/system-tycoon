import { Context, Next } from 'hono';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'https://saas.game',
];

/**
 * CORS middleware. Required for Better Auth cookies to work cross-origin
 * in development (Vite on :5173, Worker on :8787).
 */
export async function corsMiddleware(c: Context, next: Next) {
  const origin = c.req.header('Origin');

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    c.header('Access-Control-Max-Age', '86400');
    c.header('Vary', 'Origin');
  }

  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }

  return next();
}
