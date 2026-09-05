# Service as a Software

Learn system design by helping people through short, story-driven architecture missions.

The MVP loop is deliberately narrow: browse a mission, contact the client, work through ordered design stages, validate and persist the whiteboard, receive mentor guidance, earn Impact, and continue from the campaign or results. Five stories have five stages each. The standalone whiteboard is device-saved practice, not a custom mission generator. Social feeds, NPC direct messages, collaborative sessions, and performance simulations are outside the MVP.

## Architecture

| Layer | Technology | Responsibility |
|---|---|---|
| Web | React 19, TypeScript, Vite, React Router | Route-split SPA and mission UI |
| Client state | Redux Toolkit | One graph editor and revisioned canvas persistence |
| API | Cloudflare Worker, Hono | Authenticated commands and read models |
| Data | Cloudflare D1 | Users, mission content, progress, completions, inbox, chat |
| Cache | Cloudflare KV | Public/read-heavy response caching |
| Auth | Better Auth | Email/password, Google OAuth, HTTP-only sessions |
| Email | Resend | Verification and password reset messages |
| Mentor | OpenAI Responses API | Short contextual coaching with a deterministic fallback |

The server is authoritative for mission order, component identity/category/cost, validation, Impact awards, and email delivery. Per-user progress, inbox state, chat history, and canvas state are always scoped by the authenticated user. Stage completion uses an idempotency key and a D1 batch to prevent duplicate awards, store the accepted graph, and seed the next stage. Draft writes use revision comparisons; the browser retains unsaved recovery data. Shared rules live in `shared/game.ts`, and previous-stage checks remain active without awarding their points again. Costs are game credits, not provider quotes; completion proves topology rules, not uptime or latency.

See [gameplay implementation and release notes](docs/gameplay-improvements.md) for the stage matrix, verification coverage, migration requirements, and remaining limitations.

## Local development

Requirements: Node.js 22.22.2+ and npm 10+.

```bash
npm ci
cp .env.example .dev.vars
npm run db:migrate:local
npm run dev:all
```

Vite runs on `http://localhost:5173`, proxies `/api/*` to the Worker on `http://localhost:8787`, and `.dev.vars` remains gitignored.

Required secrets are `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, and `OPENAI_API_KEY`. Non-secret development values are documented in `.env.example`.

## Verification

```bash
npm run check
npx wrangler deploy --dry-run
```

`npm run check` runs correctness linting, the D1-backed HTTP integration suite, the production frontend build, Worker typechecking, and generated-binding drift detection. The integration suite applies every migration to a fresh Miniflare D1 database.

## Database and deployment

```bash
npm run db:migrate:local
npm run db:migrate:remote
npm run deploy
```

Production secrets are configured with `npx wrangler secret put NAME`. Migrations should be applied before deploying Worker code that depends on them. Cloudflare Workers observability is enabled in `wrangler.toml`; traces are sampled at 5%.

A separate staging D1 database and KV namespace should be provisioned before the first external beta. Their resource IDs must come from Cloudflare and should not be copied from production.

## MVP operational checks

- Complete signup, email verification, login, and onboarding against the intended domain.
- Run one full five-stage mission, refresh the whiteboard and results pages, and retry a completion request.
- Confirm each user sees only their own inbox, canvas, completion, and mentor history.
- Confirm Resend and OpenAI secrets are present; mentor chat should fall back safely if OpenAI is unavailable.
- Inspect Worker error logs and traces after each release.
- Capture Core Web Vitals with Chrome DevTools or Lighthouse. This repository can verify bundle output, but browser field/lab metrics require a running deployment.

## Project layout

```text
src/                 React application
  components/        UI and game components
  features/          active Redux slices
  pages/             route-level code-split screens
  services/          typed API clients
worker/
  src/routes/        MVP HTTP routes
  src/lib/           auth, D1, email, and mentor integrations
  migrations/        ordered D1 schema/content migrations
  test/              Miniflare/D1 HTTP integration tests
```

Private project.
