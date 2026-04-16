/**
 * API Client for the Cloudflare Worker backend.
 *
 * Authentication uses Bearer JWT tokens stored in localStorage.
 * Tokens are issued by POST /auth/signin, POST /auth/signup, or GET /auth/google/callback.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'auth_token';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers: extraHeaders = {} } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

    // Attach JWT if available
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new ApiError(
        (error as any).error || `Request failed: ${response.status}`,
        response.status,
        error
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { headers });
  }

  post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { method: 'POST', body, headers });
  }

  put<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body, headers });
  }

  patch<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body, headers });
  }

  delete<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { method: 'DELETE', body, headers });
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Singleton
export const api = new ApiClient(API_BASE ? `${API_BASE}/api` : '/api');

// ============================================================
// Token management
// ============================================================

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ============================================================
// Auth actions
// ============================================================

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    current_level: number;
    reputation_score: number;
    career_title: string | null;
    preferred_mentor_id: string | null;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
  };
}

export async function signUp(email: string, password: string, username: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/signup', { email, password, username });
  setToken(res.token);
  return res;
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/signin', { email, password });
  setToken(res.token);
  return res;
}

export function signInWithGoogle() {
  const base = API_BASE || '';
  window.location.href = `${base}/api/auth/google`;
}

/**
 * Handle the Google OAuth callback.
 * The Worker redirects to /auth/callback#token=xxx
 * Call this from the callback page to extract and store the token.
 */
export function handleOAuthCallback(): string | null {
  const hash = window.location.hash;
  const match = hash.match(/token=([^&]+)/);
  if (match) {
    const token = match[1];
    setToken(token);
    // Clean the URL
    window.history.replaceState(null, '', window.location.pathname);
    return token;
  }
  return null;
}

export async function getCurrentUser() {
  return api.get<AuthResponse['user']>('/auth/me');
}

export function signOut() {
  clearToken();
  window.location.href = '/';
}
