# BLOC — The Operating System for Independent Builders

> *Focus on your work. Log what you ship. Impress your clients. Close more deals.*

---

## What is BLOC?

BLOC is a unified workspace built for **solo builders, freelancers, and independent creators** who are tired of juggling five different tools to run their work.

Most productivity tools are built for teams. BLOC is built for **one person doing serious work**.

It combines four things that belong together:

| Module | What it does |
|--------|-------------|
| **Focus** | Deep work sessions — one goal, one timer, zero distraction |
| **Ship Log** | Daily build journal — log what you shipped, auto-generate weekly summaries |
| **Client Portal** | Send clients a branded link to track progress and approve work |
| **Proposals** | Beautiful, signable proposals — close deals without leaving BLOC |

---

## Why BLOC Exists

Independent builders waste hours every week on things that shouldn't exist:

- Sending "quick update" emails to clients who can't find the last one
- Copy-pasting proposal templates in Google Docs
- Writing end-of-week summaries from memory
- Switching between Notion, Toggl, Figma, DocuSign, and a notes app just to do one day of work

BLOC is the answer to all of that. One product. One purpose. One place.

---

## Core Philosophy

**1. Sessions over tasks**
BLOC doesn't give you a 47-item to-do list. It asks: *what are you working on right now?* Start a session. Do the work. Log it.

**2. Shipping is the metric**
The only progress that matters is shipped work. BLOC tracks what you delivered — not what you planned.

**3. Clients deserve transparency**
Clients don't need more meetings. They need a link that shows them exactly where things stand, updated in real time.

**4. Proposals should take 10 minutes**
Beautiful, professional proposals shouldn't require a design degree. BLOC's proposal builder is opinionated and fast.

**5. Everything is connected**
A session you log becomes an entry in your Ship Log. Your Ship Log feeds your Client Portal. Your Client Portal links to your Proposal. The data flows — you don't carry it.

---

## Tech Stack

```
Frontend     React 18 + Vite
Styling      Tailwind CSS 3
Animation    Framer Motion
Icons        Lucide React
State        Zustand
Routing      React Router v6
Backend      Supabase (Auth + DB + Realtime)
Storage      Supabase Storage (for proposal assets)
Email        Resend (client notifications)
Payments     Stripe (subscription billing)
Deployment   Vercel
```

---

## Getting Started (Local Dev)

```bash
# Clone the repo
git clone https://github.com/yourhandle/bloc.git
cd bloc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase + Stripe + Resend keys

# Start dev server
npm run dev
```

Visit `http://localhost:5173`

---

## Project Structure

```
bloc/
├── src/
│   ├── app/                  # App shell, routing, layout
│   ├── modules/
│   │   ├── focus/            # Focus session module
│   │   ├── shiplog/          # Ship Log module
│   │   ├── portal/           # Client Portal module
│   │   └── proposals/        # Proposal Builder module
│   ├── components/           # Shared UI components
│   ├── hooks/                # Shared custom hooks
│   ├── store/                # Zustand global state
│   ├── lib/                  # Supabase client, utils, helpers
│   └── styles/               # Global CSS, Tailwind config
├── public/
├── docs/                     # Architecture, ADRs, API specs
├── README.md
├── TODO.md
├── ARCHITECTURE.md
└── package.json
```

---

## Modules Overview

### 🎯 Focus
Start a work session by naming what you're working on. Set a duration or go open-ended. A minimal timer UI clears everything else away. When done, the session is automatically saved to your Ship Log.

### 📦 Ship Log
A reverse-chronological journal of everything you've shipped. Each entry has: date, project, what was done, time spent, and optional notes. Weekly summaries are auto-generated and can be shared or sent to clients.

### 🔗 Client Portal
Each client gets a unique, password-optional link. They can see: active projects, recent updates (pulled from Ship Log), deliverable status, and files you've shared. They can leave comments and approve deliverables — no login required on their end.

### 📄 Proposals
Build a proposal by selecting services, setting prices, writing a short scope, and setting a timeline. The output is a clean, branded PDF-style page the client can sign digitally. Signed proposals auto-create a client and project in BLOC.

---

## Contributing

BLOC is currently in early development. If you want to contribute:

1. Read `ARCHITECTURE.md` to understand the system
2. Check `TODO.md` for current phase and open tasks
3. Open an issue before starting large changes
4. Follow the existing code style (ESLint + Prettier configured)

---

## License

MIT — build freely, ship loudly.

---

*BLOC is built with React + Vite + Tailwind CSS.*
*Made for builders, by builders.*