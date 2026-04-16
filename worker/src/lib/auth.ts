import { betterAuth } from 'better-auth';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import type { Env } from '../types';
import { generateId, now } from './db';
import { sendEmail, renderEmail } from './email';

/**
 * Creates a Better Auth instance bound to the current request's Cloudflare bindings.
 * Must be created per-request because Workers don't share state across requests.
 */
export function createAuth(env: Env) {
  if (!env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is not set. Run `wrangler secret put JWT_SECRET` to configure it in production.'
    );
  }

  const db = new Kysely<any>({
    dialect: new D1Dialect({ database: env.DB }),
  });

  return betterAuth({
    database: {
      db,
      type: 'sqlite',
    },
    secret: env.JWT_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://saas.game',
    ],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      autoSignIn: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        const { html, text } = renderEmail({
          preheader: 'Reset your Service as a Software password',
          heading: 'Reset your password',
          body: `Hi ${user.name || user.email}, we received a request to reset the password for your account. Click the button below to choose a new password. This link expires in 1 hour.`,
          ctaLabel: 'Reset Password',
          ctaUrl: url,
          footer: "If you didn't request this, you can safely ignore this email.",
        });
        await sendEmail(env, {
          to: user.email,
          subject: 'Reset your password',
          html,
          text,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        const { html, text } = renderEmail({
          preheader: 'Verify your email to start using Service as a Software',
          heading: 'Verify your email',
          body: `Welcome, ${user.name || user.email}! Click the button below to verify your email address and activate your account.`,
          ctaLabel: 'Verify Email',
          ctaUrl: url,
          footer: "If you didn't create this account, you can safely ignore this email.",
        });
        await sendEmail(env, {
          to: user.email,
          subject: 'Verify your email address',
          html,
          text,
        });
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        prompt: 'select_account',
      },
    },
    user: {
      additionalFields: {
        username: {
          type: 'string',
          required: false,
        },
        display_name: {
          type: 'string',
          required: false,
        },
        avatar_url: {
          type: 'string',
          required: false,
        },
        current_level: {
          type: 'number',
          required: false,
          defaultValue: 1,
        },
        reputation_score: {
          type: 'number',
          required: false,
          defaultValue: 0,
        },
        career_title: {
          type: 'string',
          required: false,
          defaultValue: 'Aspiring Developer',
        },
        preferred_mentor_id: {
          type: 'string',
          required: false,
        },
        onboarding_completed: {
          type: 'boolean',
          required: false,
          defaultValue: false,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // refresh session if older than 1 day
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 min
      },
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: false,
      },
      useSecureCookies: env.ENVIRONMENT === 'production',
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            // Bootstrap per-user rows: initial stats + derive username if missing
            const timestamp = now();
            const usernameBase = (user.email || '').split('@')[0]
              .toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'user';

            try {
              await env.DB.prepare(
                'UPDATE user SET username = COALESCE(username, ?), display_name = COALESCE(display_name, ?) WHERE id = ?'
              ).bind(usernameBase, user.name || usernameBase, user.id).run();
            } catch (err) {
              console.error('Failed to set default username:', err);
            }

            try {
              await env.DB.prepare(
                'INSERT OR IGNORE INTO user_stats (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)'
              ).bind(generateId(), user.id, timestamp, timestamp).run();
            } catch (err) {
              console.error('Failed to create user_stats:', err);
            }
          },
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
