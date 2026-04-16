import { Hono } from 'hono';
import type { Env, NewsArticle } from '../types';
import { query, execute, parseJson } from '../lib/db';

export const newsRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /news
 * Fetch articles with optional filters.
 * Query params: limit, categories (comma-separated), urgencyLevel, gridSize.
 */
newsRoutes.get('/', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  const categories = c.req.query('categories');
  const urgencyLevel = c.req.query('urgencyLevel');
  const gridSize = c.req.query('gridSize');

  const conditions: string[] = ["article_status = 'active'"];
  const params: unknown[] = [];

  if (categories) {
    const slugs = categories.split(',').map((s) => s.trim()).filter(Boolean);
    if (slugs.length > 0) {
      conditions.push(`category_slug IN (${slugs.map(() => '?').join(', ')})`);
      params.push(...slugs);
    }
  }

  if (urgencyLevel) {
    conditions.push('urgency_level = ?');
    params.push(urgencyLevel);
  }

  if (gridSize) {
    conditions.push('grid_size = ?');
    params.push(gridSize);
  }

  const whereClause = conditions.join(' AND ');
  params.push(limit);

  const rows = await query<NewsArticle>(
    c.env.DB,
    `SELECT * FROM news_articles WHERE ${whereClause} ORDER BY published_at DESC LIMIT ?`,
    params
  );

  const articles = rows.map((row) => ({
    ...row,
    impact_stats: parseJson(row.impact_stats, {}),
    tags: parseJson<string[]>(row.tags, []),
    success_stats: parseJson(row.success_stats, null),
  }));

  return c.json(articles);
});

/**
 * GET /news/categories
 * Get unique category slugs from active articles.
 */
newsRoutes.get('/categories', async (c) => {
  const rows = await query<{ category_slug: string }>(
    c.env.DB,
    "SELECT DISTINCT category_slug FROM news_articles WHERE article_status = 'active' ORDER BY category_slug ASC",
    []
  );

  const categories = rows.map((row) => row.category_slug);
  return c.json(categories);
});

/**
 * POST /news/:id/view
 * Increment view count for an article.
 */
newsRoutes.post('/:id/view', async (c) => {
  const id = c.req.param('id');

  await execute(
    c.env.DB,
    'UPDATE news_articles SET view_count = view_count + 1 WHERE id = ?',
    [id]
  );

  return c.json({ success: true });
});

/**
 * POST /news/:id/contact
 * Increment contact count for an article.
 */
newsRoutes.post('/:id/contact', async (c) => {
  const id = c.req.param('id');

  await execute(
    c.env.DB,
    'UPDATE news_articles SET contact_count = contact_count + 1 WHERE id = ?',
    [id]
  );

  return c.json({ success: true });
});
