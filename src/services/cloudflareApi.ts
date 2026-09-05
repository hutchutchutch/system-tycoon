/**
 * API client for the Cloudflare Worker backend.
 *
 * Authentication is handled by Better Auth via httpOnly cookies.
 * All requests include `credentials: 'include'` to send the session cookie.
 */

import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

const API_BASE = import.meta.env.VITE_API_URL || '';

// ============================================================
// Better Auth client
// ============================================================

export const authClient = createAuthClient({
  baseURL: API_BASE || window.location.origin,
  plugins: [
    inferAdditionalFields({
      user: {
        username: { type: 'string', required: false },
        display_name: { type: 'string', required: false },
        avatar_url: { type: 'string', required: false },
        current_level: { type: 'number', required: false },
        reputation_score: { type: 'number', required: false },
        career_title: { type: 'string', required: false },
        preferred_mentor_id: { type: 'string', required: false },
        onboarding_completed: { type: 'boolean', required: false },
      },
    }),
  ],
});

// Helper exports for common auth actions
export const { useSession } = authClient;

// ============================================================
// Generic API client (cookie-based auth)
// ============================================================

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

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // send Better Auth session cookie
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      const message = typeof error === 'object' && error !== null && 'error' in error
        ? String(error.error)
        : `Request failed: ${response.status}`;
      throw new ApiError(
        message,
        response.status,
        error
      );
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  get<T>(path: string, headers?: Record<string, string>) { return this.request<T>(path, { headers }); }
  post<T>(path: string, body?: unknown, headers?: Record<string, string>) { return this.request<T>(path, { method: 'POST', body, headers }); }
  put<T>(path: string, body?: unknown, headers?: Record<string, string>) { return this.request<T>(path, { method: 'PUT', body, headers }); }
  patch<T>(path: string, body?: unknown, headers?: Record<string, string>) { return this.request<T>(path, { method: 'PATCH', body, headers }); }
  delete<T>(path: string, body?: unknown, headers?: Record<string, string>) { return this.request<T>(path, { method: 'DELETE', body, headers }); }
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

export const api = new ApiClient(API_BASE ? `${API_BASE}/api` : '/api');

// ============================================================
// Auth response types
// ============================================================

export interface AuthUserProfile {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  current_level: number;
  reputation_score: number;
  career_title: string | null;
  preferred_mentor_id: string | null;
  onboarding_completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Auth action helpers (wrapping Better Auth client)
// ============================================================

export async function signUp(email: string, password: string, username: string) {
  const res = await authClient.signUp.email({
    email,
    password,
    name: username,
  });
  if (res.error) throw new ApiError(res.error.message ?? 'Sign up failed', res.error.status ?? 400);
  return res.data;
}

export async function signIn(email: string, password: string) {
  const res = await authClient.signIn.email({ email, password });
  if (res.error) throw new ApiError(res.error.message ?? 'Sign in failed', res.error.status ?? 401);
  return res.data;
}

export function signInWithGoogle() {
  authClient.signIn.social({
    provider: 'google',
    // Return to /auth so the AuthFlowDiagram can play its success animation
    // before navigating the user onward to /onboarding or /game.
    callbackURL: '/auth',
  });
}

export async function signOut() {
  await authClient.signOut();
  window.location.href = '/';
}

export async function getCurrentUser(): Promise<AuthUserProfile> {
  return api.get<AuthUserProfile>('/profile/me');
}

export function isAuthenticated(): boolean {
  // Better Auth manages cookies; we probe via the session hook in React components,
  // or rely on /profile/me 401 in thunks. This helper is used as an initial hint.
  return document.cookie.includes('better-auth');
}
