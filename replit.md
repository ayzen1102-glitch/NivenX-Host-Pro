# NivenX Hosting

A full-featured premium game & VPS hosting SaaS platform with landing page, client dashboard, admin panel, billing (Stripe), support tickets, knowledgebase, and announcements.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session signing

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + Wouter (routing)
- API: Express 5 at `/api`
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Auth: JWT tokens in DB sessions table, `Authorization: Bearer <token>`
- Payments: Stripe (via `stripe-replit-sync`)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all endpoints)
- `lib/db/src/schema/` — all Drizzle schema files (users, plans, services, invoices, tickets, announcements, kb, settings, sessions)
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/api-server/src/lib/` — auth helpers, stripe client/service, webhook handlers
- `artifacts/api-server/src/middlewares/auth.ts` — requireAuth / requireAdmin middleware
- `artifacts/nivenx-hosting/src/pages/` — all frontend pages
- `artifacts/nivenx-hosting/src/contexts/AuthContext.tsx` — auth state
- `artifacts/nivenx-hosting/src/lib/api.ts` — typed API fetch wrapper

## Architecture decisions

- Auth uses scrypt password hashing with `salt:hash` format stored in DB
- Sessions stored in `sessions` table (not JWTs); tokens are 48-byte random hex
- Stripe webhook must be registered BEFORE `express.json()` to receive raw Buffer
- Frontend uses direct fetch wrapper (`lib/api.ts`) rather than generated hooks since auth token injection is needed
- Admin panel is completely separate UI at `/admin/*` routes, guarded by `requireAdmin` middleware

## Product

- **Landing page**: hero, features, pricing preview, CTA
- **Plans page**: all hosting plans with monthly/yearly toggle, category filter
- **Announcements & Knowledgebase**: public pages + dashboard versions
- **Client dashboard**: overview stats, services list, billing/invoices, support tickets, settings
- **Admin panel**: stats, users (role toggle), plans CRUD, tickets (with staff replies), announcements CRUD, KB CRUD, site settings

## Seeded credentials

- Admin: `admin@nivenx.com` / `admin123`
- Demo user: `demo@nivenx.com` / `demo123456`

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After schema changes run `pnpm run typecheck:libs` before leaf artifact typechecks — stale lib declarations cause false missing-export errors
- Stripe integration requires connecting Stripe via Replit Integrations tab before billing endpoints will work
- The `plans?all=true` query param returns inactive plans too (for admin use)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
