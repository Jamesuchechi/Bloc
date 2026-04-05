# BLOC — Build Phases & Task Tracker

> This file is the single source of truth for what gets built, in what order, and why.
> Update it as you complete tasks. Never skip a phase.

---

## Current Status

**Phase:** 1 — Foundation
**Started:** 2026-04-05
**Target MVP:** Phase 3 complete

---

## Phase 0 — Documentation & Design ✅
*Define before building. Think before typing.*

- [x] Write README.md — product vision and overview
- [x] Write TODO.md — phased build plan
- [x] Write ARCHITECTURE.md — system design decisions
- [x] Write DOCS.md — API, data models, component contracts
- [ ] Sketch wireframes for each module (low-fi, any tool)
- [x] Define color system and design tokens
- [x] Lock in typography choices
- [x] Create component inventory list

---

## Phase 1 — Foundation & Shell
*The skeleton everything else hangs on.*

### Project Setup
- [x] Scaffold with `npm create vite@latest bloc -- --template react`
- [x] Install and configure Tailwind CSS 3
- [x] Install Framer Motion, Lucide React, React Router v6, Zustand
- [/] Set up ESLint + Prettier
- [x] Configure path aliases (`@/` for `src/`)
- [ ] Set up `.env.example` with required keys
- [x] Initialize Supabase project (auth, database, storage)
- [x] Connect Supabase to local dev

### App Shell
- [/] Build `AppLayout` — sidebar + main content area
- [x] Build `Sidebar` — navigation between modules
- [ ] Build `TopBar` — user avatar, current context, quick actions
- [ ] Set up React Router routes for each module
- [ ] Build `NotFound` page
- [x] Add loading state skeleton component

### Auth
- [ ] Supabase email/password sign up
- [ ] Supabase email/password sign in
- [ ] Google OAuth sign in
- [ ] Auth redirect guards (protected routes)
- [ ] User profile page (name, avatar, timezone)
- [ ] Sign out

### Database
- [ ] Design and create `users` table
- [ ] Design and create `sessions` table (Focus module)
- [ ] Design and create `log_entries` table (Ship Log)
- [ ] Design and create `clients` table
- [ ] Design and create `projects` table
- [ ] Design and create `portal_updates` table
- [ ] Design and create `proposals` table
- [ ] Design and create `proposal_services` table
- [ ] Set up Row Level Security (RLS) policies for all tables
- [ ] Seed dev database with test data

---

## Phase 2 — Focus Module
*The heartbeat of BLOC. Start here.*

### Core Session Flow
- [ ] "What are you working on?" start screen
- [ ] Project selector (or quick-create inline)
- [ ] Session timer — countdown or stopwatch mode
- [ ] Minimal full-screen focus mode (hides everything)
- [ ] Pause / resume session
- [ ] End session — prompts for: "what did you complete?"
- [ ] Session saved to Ship Log automatically on end

### Session History
- [ ] Today's sessions listed on Focus home
- [ ] Total time tracked today (visible in sidebar)
- [ ] Session streak indicator (days in a row with sessions)

### Settings
- [ ] Default session duration preference
- [ ] Pomodoro mode toggle (25/5 splits)
- [ ] Sound/notification on session end

---

## Phase 3 — Ship Log Module
*The record of everything you've built.*

### Log Entry
- [ ] Auto-create entry when Focus session ends
- [ ] Manual entry creation
- [ ] Entry fields: date, project, description, duration, tags
- [ ] Markdown support in description field
- [ ] Edit and delete entries

### Log Views
- [ ] Default: chronological list view
- [ ] Group by project
- [ ] Filter by date range
- [ ] Filter by project
- [ ] Search entries by keyword

### Weekly Summary
- [ ] Auto-generate weekly summary (Mon–Sun)
- [ ] Summary includes: total hours, entries by project, highlights
- [ ] Copy summary as plain text
- [ ] Share summary via public link (read-only page)
- [ ] Send summary via email to a client

---

## Phase 4 — Client Portal Module
*Your clients' window into your work.*

### Client Management
- [ ] Create client (name, email, company, color/avatar)
- [ ] Edit and archive clients
- [ ] Assign projects to clients
- [ ] Client list view

### Portal Page (Builder View)
- [ ] Portal dashboard per client
- [ ] List of projects and their status
- [ ] Add manual updates (text, optional file attachment)
- [ ] Ship Log entries can be "pushed" to portal as updates
- [ ] Deliverables list with status: pending / in review / approved
- [ ] Upload deliverable files

### Portal Page (Client View — Public)
- [ ] Unique shareable URL per client (`/portal/[token]`)
- [ ] Optional password protection
- [ ] Client sees: projects, updates feed, deliverables
- [ ] Client can leave comments on updates
- [ ] Client can mark deliverables as "Approved"
- [ ] Email notification to builder when client approves or comments

### Portal Branding
- [ ] Builder can set their name/logo on portal
- [ ] Accent color customization per portal

---

## Phase 5 — Proposal Builder Module
*Close the deal without leaving BLOC.*

### Proposal Creation
- [ ] Create proposal — link to existing client or create new
- [ ] Add services (name, description, price, optional quantity)
- [ ] Reorder services via drag-and-drop
- [ ] Write project scope (rich text)
- [ ] Set timeline (start date, duration or end date)
- [ ] Set payment terms (full upfront, 50/50, monthly)
- [ ] Add optional terms & conditions block

### Proposal Preview & Sharing
- [ ] Live preview as you build
- [ ] Generate clean proposal page (`/proposal/[token]`)
- [ ] PDF export of proposal
- [ ] Copy shareable link

### Digital Signing
- [ ] Client can type their name to sign
- [ ] Timestamp and IP logged on signing
- [ ] Builder gets email notification on signing
- [ ] Signed proposals locked from editing

### Post-Sign Automation
- [ ] Signed proposal auto-creates client (if new)
- [ ] Auto-creates project linked to that client
- [ ] Proposal shows as "Won" in proposal list

### Proposal Management
- [ ] List view: draft / sent / viewed / signed / declined
- [ ] Duplicate proposal
- [ ] Archive proposal
- [ ] Basic stats: total proposed value, win rate

---

## Phase 6 — Cross-Module Polish
*Make the whole greater than the sum of its parts.*

- [ ] Dashboard home — today's session, recent log, client activity
- [ ] Global search across sessions, log entries, clients, proposals
- [ ] Keyboard shortcuts (cmd+K command palette)
- [ ] Notifications center (client approved, proposal signed, etc.)
- [ ] Dark mode support
- [ ] Mobile responsive layout
- [ ] Onboarding flow for new users (guided first steps)

---

## Phase 7 — Billing & Launch
*Make it real.*

### Billing
- [ ] Integrate Stripe
- [ ] Free plan limits (e.g., 1 client portal, 3 proposals/month)
- [ ] Pro plan — $15/month (unlimited everything)
- [ ] Billing portal (manage subscription, cancel, invoices)

### Launch Prep
- [ ] Write landing page copy
- [ ] Build BLOC landing page (separate from app)
- [ ] Set up waitlist / early access flow
- [ ] Configure Vercel deployment (preview + production)
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (Plausible — privacy-first)
- [ ] Write onboarding email sequence
- [ ] Public launch (Product Hunt, Twitter/X, communities)

---

## Backlog (Post-Launch Ideas)

- [ ] Zapier / Make integration
- [ ] Time tracking reports (CSV export)
- [ ] Invoice generation from signed proposals
- [ ] Multiple workspaces (for builders with separate brands)
- [ ] API for power users
- [ ] iOS app (React Native or PWA)
- [ ] Recurring retainer proposals
- [ ] AI-assisted proposal writing
- [ ] AI weekly summary generation
- [ ] Team mode (2–5 person shops)

---

## Notes

- Never start a new phase before the previous one is functionally complete
- Each module should work independently before integrations are built
- Prioritize the happy path before edge cases
- Ship something real at the end of Phase 3 (even to 5 beta users)