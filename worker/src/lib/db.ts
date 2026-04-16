/**
 * D1 Database helpers
 * Handles JSON column parsing, UUID generation, and timestamp management
 */

/**
 * Generate a UUID v4 using Web Crypto API (available in Workers)
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Get current timestamp in ISO format (SQLite-compatible)
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Parse a JSON string column, returning the parsed value or a default
 */
export function parseJson<T>(value: string | null | undefined, defaultValue: T): T {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Stringify a value for storage in a TEXT column as JSON
 */
export function toJson(value: unknown): string {
  return JSON.stringify(value);
}

/**
 * Convert SQLite integer boolean (0/1) to JS boolean
 */
export function toBool(value: number | null | undefined): boolean {
  return value === 1;
}

/**
 * Convert JS boolean to SQLite integer (0/1)
 */
export function fromBool(value: boolean): number {
  return value ? 1 : 0;
}

/**
 * Execute a D1 query and return typed results
 */
export async function query<T>(db: D1Database, sql: string, params: unknown[] = []): Promise<T[]> {
  const stmt = db.prepare(sql);
  const result = await (params.length > 0 ? stmt.bind(...params) : stmt).all<T>();
  return result.results;
}

/**
 * Execute a D1 query and return a single typed result
 */
export async function queryOne<T>(db: D1Database, sql: string, params: unknown[] = []): Promise<T | null> {
  const stmt = db.prepare(sql);
  const result = await (params.length > 0 ? stmt.bind(...params) : stmt).first<T>();
  return result;
}

/**
 * Execute a D1 mutation (INSERT, UPDATE, DELETE)
 */
export async function execute(db: D1Database, sql: string, params: unknown[] = []): Promise<D1Result> {
  const stmt = db.prepare(sql);
  return params.length > 0 ? stmt.bind(...params).run() : stmt.run();
}

/**
 * Execute multiple statements in a batch (transaction-like)
 */
export async function batch(db: D1Database, statements: { sql: string; params?: unknown[] }[]): Promise<D1Result[]> {
  const prepared = statements.map(({ sql, params }) => {
    const stmt = db.prepare(sql);
    return params && params.length > 0 ? stmt.bind(...params) : stmt;
  });
  return db.batch(prepared);
}
