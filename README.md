# Service as a Software

**Learn system design by helping real people.**

A gamified platform where you solve real-world system architecture challenges — a doctor whose patient tracker is crashing, a teacher whose school database can't handle enrollment, an activist who needs to prove environmental contamination. Each mission teaches system design concepts by making them matter.

**Live at [saas.game](https://saas.game)**

## How it works

1. **Browse missions** — news-style cards tell stories of people who need tech help
2. **Contact the hero** — send them a message offering to help
3. **Design the system** — drag components onto a canvas, connect them, validate against requirements
4. **Get mentored** — an AI mentor guides you through architecture decisions
5. **See the impact** — your design keeps 200 families' health data safe, keeps a school running, proves contamination is real

## Tech stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, React Flow, Tailwind CSS, Framer Motion |
| **State** | Redux Toolkit, RTK Query, Redux Persist |
| **Backend** | Cloudflare Workers (Hono), D1 (SQLite), KV, Durable Objects |
| **Auth** | Better Auth (email/password + Google OAuth, httpOnly sessions) |
| **Email** | SendGrid (verification, password reset) |
| **Design system** | Atomic design (atoms/molecules/organisms), CSS modules, Radix UI primitives |

## Development

```bash
# Install dependencies
npm install

# Start frontend (Vite dev server on :5173)
npm run dev

# Start backend (Cloudflare Worker on :8787, proxied by Vite)
npm run dev:worker

# Or both at once
npm run dev:all
```

The Vite config proxies `/api/*` requests to the Worker dev server automatically.

### Environment setup

Create `.dev.vars` in the project root (gitignored):

```
ENVIRONMENT=development
BETTER_AUTH_URL=http://localhost:8787
JWT_SECRET=<your-secret>
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
SENDGRID_API_KEY=<your-key>
EMAIL_FROM=hello@yourdomain.com
EMAIL_FROM_NAME=Your App Name
```

### Database

```bash
# Run migrations locally
npm run db:migrate:local

# Run migrations on production D1
npm run db:migrate:remote
```

## Deployment

Single deployment — the Worker serves both the API and the React SPA via Cloudflare's Static Assets:

```bash
npm run deploy   # builds frontend + deploys Worker
```

Production secrets are set via `npx wrangler secret put <NAME>`.

## Project structure

```
src/
├── components/
│   ├── atoms/          # Button, Input, Spinner, Tooltip, etc.
│   ├── molecules/      # EmailCard, BentoGrid, Requirements, etc.
│   ├── organisms/      # GameHUD, EmailClient, MentorChat, ProductTour
│   ├── templates/      # Page-level layouts
│   ├── layout/         # RootLayout, GameLayout, AuthLayout
│   └── ui/             # Radix UI wrappers (Dialog, Tabs, Dropdown, Tooltip)
├── features/           # Redux slices (auth, game, user, mission, design)
├── store/              # Redux store, RTK Query APIs, middleware
├── services/           # API client, email/mission/mentor/news services
├── hooks/              # Custom React hooks
├── pages/              # Route page components
├── styles/             # Design system tokens, foundation styles
├── utils/              # Shared utilities (date, email formatting)
└── types/              # TypeScript type definitions

worker/
├── src/
│   ├── index.ts        # Hono router + static asset dispatcher
│   ├── lib/            # Better Auth config, D1 helpers, SendGrid sender
│   ├── middleware/      # Auth (session validation), CORS, KV cache
│   ├── routes/         # API routes (auth, emails, missions, canvas, etc.)
│   └── durable-objects/ # Realtime collaboration (WebSocket)
└── migrations/         # D1 schema migrations

hype-video/             # Hyperframes video compositions (see hype-video/README.md)
```

## License

Private.
