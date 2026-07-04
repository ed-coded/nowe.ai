# nowe.ai — Web App

Next.js (App Router) frontend for nowe.ai, an AI-powered property discovery platform for Ghana. Handles the marketing site plus Supabase-backed authentication (sign up, sign in, email confirmation).

## Prerequisites

- Node.js 20+
- npm (repo is set up with `package-lock.json`)
- A Supabase project (free tier is fine) — see [Supabase setup](#supabase-setup)

## Installation

```bash
cd apps/web
npm install
```

## Environment Setup

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required variables in `.env.local` (see [Supabase setup](#supabase-setup) for where to find the Supabase ones):

   | Variable | Description |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project's API URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase project's publishable key (safe for browser use) |
   | `ADMIN_ACCESS_PASSPHRASE` | Server-only second factor required to reach `/noweadmin`, in addition to a real admin Supabase account. Pick a long random value; rotate any value that's ever been shared outside `.env.local`. |

   `NEXT_PUBLIC_*` values are validated at startup by [`src/lib/env.ts`](./src/lib/env.ts); server-only values (currently just `ADMIN_ACCESS_PASSPHRASE`) are validated separately by [`src/lib/env.server.ts`](./src/lib/env.server.ts) — that file imports the `server-only` package, so accidentally importing it from a Client Component fails at build time instead of leaking a server secret's absence into the browser. If any required value is missing, the app fails fast with a clear list of what to add — instead of Supabase's generic "URL and Key are required" error.

`.env.local` is gitignored (see `.gitignore`) — never commit real credentials. If you need to add another environment variable in the future: public/browser-safe values go in `lib/env.ts`, server-only secrets go in `lib/env.server.ts` — either way, add it there first so it's validated the same way, then document it in `.env.example`.

## Supabase Setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **Project Settings → API → API Keys** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (`sb_publishable_...`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Apply the database schema in `supabase/migrations/` to your project (via the Supabase CLI: `supabase link` then `supabase db push`, or by running the SQL files directly in the SQL editor).
4. In **Authentication → URL Configuration**, add your local and production URLs (e.g. `http://localhost:3000/**`) to the allowed redirect URLs so email confirmation links (`/auth/confirm`) work correctly.

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server uses Turbopack.

## Building for Production

```bash
npm run build
npm run start
```

**Important:** `NEXT_PUBLIC_*` variables are inlined into the JavaScript bundle at build time, not read at server runtime. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in your hosting provider's environment variables (e.g. Vercel Project Settings → Environment Variables) **before** running a build/deploy — setting them after a build won't take effect until you rebuild.

## Troubleshooting

**"Missing required environment variables" error on startup**
`.env.local` is missing or incomplete. Copy `.env.example` to `.env.local` and fill in both Supabase values, then restart the dev server (env files are only read at startup).

**"Your project's URL and Key are required to create a Supabase client!"**
This is the underlying Supabase SDK error that `lib/env.ts` is designed to preempt. If you see it, something is bypassing the validated `env` export and reading `process.env` directly — check for a new call site that wasn't wired through `lib/env.ts`.

**Auth works locally but not in production**
Usually one of:
- The production environment variables weren't set before the last build (see [Building for Production](#building-for-production)).
- The deployed URL isn't in Supabase's **Authentication → URL Configuration** allow-list, so email confirmation redirects fail.

**Session doesn't persist / user gets logged out unexpectedly**
Check that `proxy.ts` is present at the project root and its `matcher` still covers your routes — it's what refreshes the Supabase session cookie on every request via `utils/supabase/middleware.ts`.

## Admin Portal

`/noweadmin` is intentionally not linked anywhere in the public site or nav — it's reached only by typing the URL directly. Access requires three things at once: a real Supabase account with `profiles.role = 'admin'`, the `ADMIN_ACCESS_PASSPHRASE` entered at `/noweadmin/login`, and (per-request) the resulting gate cookie. See [`src/services/auth/`](./src/services/auth/) for the RBAC helpers and [`src/proxy.ts`](./src/proxy.ts) for the edge-level gate.

There is currently no self-service way to become the first admin (by design — `admin_set_user_role()` requires an existing admin caller). To bootstrap the first one, temporarily disable the role-change trigger for a single statement:

```sql
alter table profiles disable trigger prevent_profiles_role_update;
update profiles set role = 'admin' where email = 'you@example.com';
alter table profiles enable trigger prevent_profiles_role_update;
```

Run this once, directly against your Supabase project (e.g. via `supabase db query --linked`), for whichever account should be the first admin.

## Folder Structure

```
apps/web/
├── src/
│   ├── app/                     # App Router routes
│   │   ├── auth/confirm/        # Email OTP confirmation route handler
│   │   ├── signin/, signup/     # Renter auth pages (client components)
│   │   └── noweadmin/           # Hidden admin portal (login + gated shell)
│   ├── components/
│   │   ├── landing/             # Marketing/landing page sections
│   │   └── ui/                  # shadcn/ui primitives
│   ├── features/                # Feature-owned components/hooks/actions (populated per phase)
│   ├── services/
│   │   └── auth/                # getCurrentUserRole, requireRole, requireAdminAccess, adminGate
│   ├── store/                   # Zustand stores (populated per phase)
│   ├── hooks/                   # Shared cross-feature hooks
│   ├── lib/
│   │   ├── env.ts               # Validated public/browser-safe env vars
│   │   ├── env.server.ts        # Validated server-only env vars (never bundled client-side)
│   │   ├── branding.ts          # Brand identity — single source of truth
│   │   └── utils.ts             # Shared helpers (e.g. `cn`)
│   ├── utils/supabase/
│   │   ├── client.ts            # Browser Supabase client
│   │   ├── server.ts            # Server Component / Route Handler Supabase client
│   │   └── middleware.ts        # Session-refresh + role lookup used by proxy.ts
│   ├── proxy.ts                 # Next.js 16 middleware entry point (session refresh + edge RBAC gate)
│   └── types/                   # Shared TypeScript types (incl. `UserRole`)
├── supabase/                    # Supabase CLI config + SQL migrations
└── .env.example                 # Template for required environment variables
```
