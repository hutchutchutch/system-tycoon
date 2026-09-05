import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { query, parseJson } from '../lib/db';

export const gameRoutes = new Hono<AppEnv>();

type ComponentRow = Record<string, unknown> & {
  concepts: string;
  use_cases: string;
  compatible_with: string;
};

/** The only legacy /game read model still required by the mission whiteboard. */
gameRoutes.get('/components', async (c) => {
  const components = await query<ComponentRow>(
    c.env.DB,
    'SELECT * FROM components ORDER BY sort_order ASC',
  );
  return c.json(components.map((component) => ({
    ...component,
    concepts: parseJson(component.concepts, []),
    use_cases: parseJson(component.use_cases, []),
    compatible_with: parseJson(component.compatible_with, []),
  })));
});
