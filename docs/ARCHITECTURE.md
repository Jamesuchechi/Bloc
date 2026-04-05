# BLOC — Architecture

> This document describes the technical decisions behind BLOC: how the system is structured, why each choice was made, and how the pieces fit together.

---

## System Overview

BLOC is a **single-page application** backed by **Supabase** (PostgreSQL + Auth + Realtime + Storage). The frontend is React + Vite. The entire system is designed to be operated by one developer and scaled to thousands of users without infrastructure complexity.

```
┌──────────────────────────────────────────────────┐
│                   Browser (React)                │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Focus   │  │ Ship Log │  │ Client Portal  │ │
│  └──────────┘  └──────────┘  └────────────────┘ │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │           Proposal Builder               │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │     Zustand Store (client state)         │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────┘
                           │ HTTPS / WebSocket
┌──────────────────────────▼───────────────────────┐
│                    Supabase                       │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │   Auth   │  │PostgREST │  │   Realtime     │ │
│  │ (JWT)    │  │  (REST)  │  │  (WebSocket)   │ │
│  └──────────┘  └──────────┘  └────────────────┘ │
│                                                  │
│  ┌──────────┐  ┌──────────┐                     │
│  │PostgreSQL│  │ Storage  │                     │
│  │  (RLS)   │  │ (files)  │                     │
│  └──────────┘  └──────────┘                     │
└──────────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
    ┌─────────┐             ┌──────────┐
    │  Resend │             │  Stripe  │
    │ (email) │             │(payments)│
    └─────────┘             └──────────┘
```

---

## Frontend Architecture

### Framework: React 18 + Vite

**Why React:** The component model maps cleanly to BLOC's modular structure. The ecosystem (Framer Motion, Zustand, React Router) is mature and well-supported. Vite provides near-instant HMR and fast production builds.

**Why not Next.js:** BLOC's client portals are the only truly public-facing pages. Everything else is behind auth. SSR adds complexity without meaningful benefit for an authenticated SPA. Vite is simpler, faster to develop with, and easier to deploy anywhere.

### State Management: Zustand

Each module manages its own Zustand store slice. There is a shared `appStore` for cross-cutting concerns (user, current project, notifications).

```
store/
├── appStore.js          # user session, global UI state
├── focusStore.js        # active session, timer state
├── shipLogStore.js      # entries, filters, view mode
├── portalStore.js       # clients, projects, updates
└── proposalStore.js     # proposals, services, signing state
```

**Why Zustand over Redux:** Less boilerplate. No provider hell. Stores are plain JS functions. Easy to use outside of React (e.g., in utility functions).

**Why not React Context:** Context causes unnecessary re-renders at scale. Zustand's selector model is more precise.

### Routing: React Router v6

```
/                          → Redirect to /focus (if authed) or /login
/login                     → Auth page
/signup                    → Sign up page

/focus                     → Focus module home
/focus/session             → Active session (full-screen mode)

/log                       → Ship Log — full entry list
/log/week                  → Weekly summary view

/clients                   → Client list
/clients/:id               → Client detail + portal dashboard
/clients/:id/portal        → Portal builder view

/proposals                 → Proposal list
/proposals/new             → Create proposal
/proposals/:id             → Edit proposal
/proposals/:id/preview     → Preview proposal

/settings                  → User settings
/settings/billing          → Billing & plan

/portal/:token             → Public client portal (no auth required)
/proposal/:token           → Public proposal view (no auth required)
```

### Module Structure

Each module follows the same internal structure:

```
modules/focus/
├── index.jsx              # Module entry point / router
├── components/            # UI components specific to this module
├── hooks/                 # Data fetching + business logic hooks
├── store.js               # Zustand slice for this module
└── api.js                 # Supabase queries for this module
```

This keeps modules independent. Each one can be developed, tested, and reasoned about in isolation.

---

## Backend Architecture

### Supabase

Supabase provides everything needed without managing servers:

- **PostgreSQL** — relational database with full SQL support
- **PostgREST** — auto-generated REST API from the database schema
- **Auth** — JWT-based auth with email/password and OAuth
- **Realtime** — WebSocket subscriptions for live updates (used in Client Portal)
- **Storage** — file storage for proposal assets and deliverables
- **Row Level Security (RLS)** — data access enforced at the database level

**RLS is non-negotiable.** Every table has RLS enabled. Users can only read and write their own data. Client portal data is readable by anyone with the correct token but not writable (except for approved/comments actions with token validation).

### Database Schema

#### `users` (extends Supabase auth.users)
```sql
id            uuid PRIMARY KEY (references auth.users)
full_name     text
avatar_url    text
timezone      text DEFAULT 'UTC'
created_at    timestamptz DEFAULT now()
```

#### `projects`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES users(id) ON DELETE CASCADE
client_id     uuid REFERENCES clients(id) ON DELETE SET NULL
name          text NOT NULL
status        text DEFAULT 'active'  -- active | paused | completed | archived
color         text                   -- hex color for UI display
created_at    timestamptz DEFAULT now()
```

#### `sessions` (Focus module)
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES users(id) ON DELETE CASCADE
project_id    uuid REFERENCES projects(id) ON DELETE SET NULL
title         text NOT NULL           -- "what are you working on?"
started_at    timestamptz NOT NULL
ended_at      timestamptz
duration_mins integer                 -- computed on end
notes         text                    -- optional end-of-session notes
created_at    timestamptz DEFAULT now()
```

#### `log_entries` (Ship Log module)
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES users(id) ON DELETE CASCADE
project_id    uuid REFERENCES projects(id) ON DELETE SET NULL
session_id    uuid REFERENCES sessions(id) ON DELETE SET NULL
date          date NOT NULL
description   text NOT NULL
duration_mins integer
tags          text[]
created_at    timestamptz DEFAULT now()
```

#### `clients`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES users(id) ON DELETE CASCADE
name          text NOT NULL
company       text
email         text
color         text
portal_token  uuid DEFAULT gen_random_uuid() UNIQUE
portal_password_hash text             -- optional; null = no password
created_at    timestamptz DEFAULT now()
```

#### `portal_updates`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id    uuid REFERENCES projects(id) ON DELETE CASCADE
log_entry_id  uuid REFERENCES log_entries(id) ON DELETE SET NULL
content       text NOT NULL
visible       boolean DEFAULT true
created_at    timestamptz DEFAULT now()
```

#### `deliverables`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id    uuid REFERENCES projects(id) ON DELETE CASCADE
title         text NOT NULL
status        text DEFAULT 'pending'  -- pending | in_review | approved
file_url      text
approved_at   timestamptz
created_at    timestamptz DEFAULT now()
```

#### `proposals`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES users(id) ON DELETE CASCADE
client_id     uuid REFERENCES clients(id) ON DELETE SET NULL
title         text NOT NULL
scope         text
timeline_start date
timeline_end   date
payment_terms  text DEFAULT 'full'   -- full | half | monthly
status         text DEFAULT 'draft'  -- draft | sent | viewed | signed | declined
share_token    uuid DEFAULT gen_random_uuid() UNIQUE
signed_at      timestamptz
signed_name    text
total_value    numeric(10,2)
created_at     timestamptz DEFAULT now()
```

#### `proposal_services`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
proposal_id   uuid REFERENCES proposals(id) ON DELETE CASCADE
name          text NOT NULL
description   text
quantity      integer DEFAULT 1
unit_price    numeric(10,2) NOT NULL
position      integer NOT NULL        -- for ordering
```

---

## Data Flow

### Focus → Ship Log (automatic)

When a Focus session ends:
1. `sessions` row is updated with `ended_at` and `duration_mins`
2. A `log_entries` row is automatically created via a Supabase database trigger
3. The log entry is linked via `session_id` so it can always be traced back

### Ship Log → Client Portal (push)

When a builder wants to share a log entry with a client:
1. Builder clicks "Push to portal" on a log entry
2. A `portal_updates` row is created linked to `log_entry_id`
3. The client's portal page shows this update in real time via Supabase Realtime

### Proposal → Client + Project (automation)

When a proposal is signed:
1. `proposals.status` updates to `signed`, `signed_at` and `signed_name` set
2. If `client_id` is null (new client), a `clients` row is created
3. A `projects` row is created linked to that client
4. Builder receives email notification via Resend

---

## Security Model

### Authentication
All app routes (except `/portal/:token` and `/proposal/:token`) require a valid Supabase JWT. The JWT is stored in `localStorage` by the Supabase client. Sessions expire after 1 hour and are silently refreshed.

### Row Level Security
Every table enforces: `user_id = auth.uid()`. No user can ever read or write another user's data through the API — even if they construct a valid request.

### Public Pages
Client Portal and Proposal pages are accessible without auth, but gated by:
- A `uuid` token embedded in the URL (unguessable, 128-bit random)
- Optional password for portals (bcrypt hashed server-side via Supabase Edge Function)

### Proposal Signing
Signing is handled via a Supabase Edge Function (not a direct DB write) so that:
- The signed name and timestamp can be validated
- IP address can be logged server-side
- The proposal can be locked from further edits atomically

---

## External Services

| Service | Purpose | Why |
|---------|---------|-----|
| **Supabase** | Backend-as-a-service | Full stack in one: DB, auth, storage, realtime |
| **Resend** | Transactional email | Simple API, great deliverability, generous free tier |
| **Stripe** | Subscription billing | Industry standard, excellent developer experience |
| **Vercel** | Hosting | Zero-config deploys, preview URLs, edge network |

---

## Performance Considerations

- All database queries use indexes on `user_id`, `created_at`, and `project_id`
- Log entries are paginated (20 per page) — never load the full history
- Client portal uses Supabase Realtime only for live comment/approval events (not polling)
- Framer Motion animations use `will-change: transform` and avoid layout-triggering properties
- Images (avatars, proposal assets) are served from Supabase Storage CDN

---

## Decisions Log (ADR)

| # | Decision | Reason |
|---|----------|--------|
| 1 | Vite over Next.js | SPA is sufficient; simpler ops; faster DX |
| 2 | Supabase over custom API | Speed of development; built-in auth + RLS |
| 3 | Zustand over Redux | Less boilerplate; module-scoped stores |
| 4 | Resend over SendGrid | Better DX; simpler pricing |
| 5 | Tailwind CSS | Utility-first matches component-driven development |
| 6 | No mobile app at launch | Web-first; PWA later if demand warrants |
| 7 | PostgreSQL over NoSQL | Relational data model suits this domain well |
| 8 | RLS over API-level auth | Security at the data layer, not just the route layer |