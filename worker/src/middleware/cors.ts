import { Context, Next } from 'hono';

/**
 * CORS middleware for development
 * In production, Cloudflare Pages Functions handle same-origin requests
 */
export async function corsMiddleware(c: Context, next: Next) {
  // Allow requests from the frontend dev server
  const origin = c.req.header('Origin');
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
  ];

  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cf-Access-Jwt-Assertion, X-Dev-Email, X-Dev-User-Id');
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('Access-Control-Max-Age', '86400');
  }

  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }

  return next();
}
