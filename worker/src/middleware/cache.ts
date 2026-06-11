import { Context, Next } from 'hono';
import type { AppEnv, Env } from '../types';

/**
 * Phase 6: KV Cache middleware for read-heavy GET endpoints.
 *
 * Caches responses in Cloudflare KV with configurable TTL.
 * Cache key is based on the request URL path + query string.
 * Only caches successful JSON responses.
 */

interface CacheOptions {
  ttlSeconds: number;
  /** Optional key prefix to namespace cache entries */
  prefix?: string;
  /** If true, cache varies per-user (appends user ID to key) */
  perUser?: boolean;
}

export function kvCache(options: CacheOptions) {
  const { ttlSeconds, prefix = 'cache', perUser = false } = options;

  return async (c: Context<AppEnv>, next: Next) => {
    // Only cache GET requests
    if (c.req.method !== 'GET') {
      return next();
    }

    const kv = c.env.CACHE;
    const url = new URL(c.req.url);
    let cacheKey = `${prefix}:${url.pathname}${url.search}`;

    if (perUser) {
      const user = c.get('user') as any;
      if (user?.id) {
        cacheKey += `:u:${user.id}`;
      }
    }

    // Check cache
    const cached = await kv.get(cacheKey, 'text');
    if (cached) {
      return c.json(JSON.parse(cached));
    }

    // Execute handler
    await next();

    // Cache successful JSON responses
    if (c.res.status === 200) {
      const contentType = c.res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const body = await c.res.clone().text();
        c.executionCtx.waitUntil(
          kv.put(cacheKey, body, { expirationTtl: ttlSeconds })
        );
      }
    }
  };
}

/**
 * Invalidate cache entries by prefix.
 * Call this after mutations that affect cached data.
 */
export async function invalidateCache(kv: KVNamespace, prefix: string) {
  // KV doesn't support prefix deletion natively, so we use list + delete
  const list = await kv.list({ prefix });
  const deletes = list.keys.map((key) => kv.delete(key.name));
  await Promise.all(deletes);
}
