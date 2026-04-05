# BLOC — Developer Documentation

> Component contracts, data models, API patterns, and conventions for building BLOC.

---

## Conventions

### File Naming
- Components: `PascalCase.jsx` (e.g., `SessionTimer.jsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `useActiveSession.js`)
- Stores: `camelCase` with `Store` suffix (e.g., `focusStore.js`)
- API files: `camelCase` with `Api` suffix (e.g., `sessionsApi.js`)
- Pages: `PascalCase` + `Page` suffix (e.g., `FocusPage.jsx`)

### Import Alias
All imports use `@/` as the root:
```js
import { Button } from '@/components/ui/Button'
import { useSessions } from '@/modules/focus/hooks/useSessions'
```

### Code Style
- Functional components only (no class components)
- Props destructured inline: `function Card({ title, desc, onClick })`
- Default exports for pages and layout components
- Named exports for utility components and hooks
- No prop-types (TypeScript annotations preferred as comments for now)

---

## Shared Component API

### `<Button>`

```jsx
<Button
  variant="primary" | "secondary" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  loading={false}
  disabled={false}
  onClick={fn}
  fullWidth={false}
>
  Label
</Button>
```

**Variants:**
- `primary` — fire background, white text (main CTAs)
- `secondary` — bordered, transparent background
- `ghost` — no border, subtle hover
- `danger` — red, used for destructive actions

---

### `<Input>`

```jsx
<Input
  label="Session name"
  placeholder="What are you working on?"
  value={value}
  onChange={fn}
  error="This field is required"
  hint="Keep it short and clear"
  disabled={false}
  autoFocus={false}
/>
```

---

### `<Card>`

```jsx
<Card
  padding="sm" | "md" | "lg"
  hoverable={false}
  onClick={fn}       // makes card clickable
  className=""
>
  {children}
</Card>
```

---

### `<Badge>`

```jsx
<Badge
  variant="default" | "success" | "warning" | "danger" | "info"
  size="sm" | "md"
>
  In Review
</Badge>
```

---

### `<Modal>`

```jsx
<Modal
  open={true}
  onClose={fn}
  title="End Session"
  size="sm" | "md" | "lg"
>
  {children}
</Modal>
```

---

### `<EmptyState>`

```jsx
<EmptyState
  icon={<Clock />}
  title="No sessions yet"
  description="Start your first Focus session to begin tracking your work."
  action={<Button onClick={fn}>Start session</Button>}
/>
```

---

### `<PageHeader>`

```jsx
<PageHeader
  title="Ship Log"
  subtitle="Everything you've shipped"
  actions={<Button>New entry</Button>}
/>
```

---

## Module APIs

### Focus Module

#### `useActiveSession()`
Returns the current active session and controls.

```js
const {
  session,          // { id, title, project, startedAt } | null
  elapsed,          // seconds elapsed
  isRunning,        // boolean
  isPaused,         // boolean
  startSession,     // fn(title, projectId?) => Promise<session>
  pauseSession,     // fn() => void
  resumeSession,    // fn() => void
  endSession,       // fn(notes?) => Promise<logEntry>
} = useActiveSession()
```

#### `useSessions(options)`
Fetches past sessions.

```js
const {
  sessions,         // array
  isLoading,        // boolean
  error,            // Error | null
  hasMore,          // boolean
  loadMore,         // fn()
} = useSessions({ projectId?, limit? })
```

#### `sessionsApi.js`

```js
// Create a new session
createSession({ title, projectId }) => Promise<session>

// End a session
endSession(id, { notes }) => Promise<{ session, logEntry }>

// Get sessions
getSessions({ userId, projectId, limit, offset }) => Promise<session[]>

// Get today's total time
getTodayMinutes(userId) => Promise<number>
```

---

### Ship Log Module

#### `useLogEntries(options)`

```js
const {
  entries,          // array of log entries
  isLoading,
  error,
  filters,          // { projectId, dateRange, tags, search }
  setFilters,       // fn(partial filters)
  hasMore,
  loadMore,
  createEntry,      // fn(data) => Promise<entry>
  updateEntry,      // fn(id, data) => Promise<entry>
  deleteEntry,      // fn(id) => Promise<void>
} = useLogEntries()
```

#### `useWeeklySummary(weekStart)`

```js
const {
  summary,          // { weekStart, weekEnd, totalMins, entries, byProject }
  isLoading,
  shareUrl,         // string | null
  generateShareUrl, // fn() => Promise<string>
  copyAsText,       // fn() => void
} = useWeeklySummary(weekStart)
```

#### `logApi.js`

```js
createLogEntry(data) => Promise<entry>
updateLogEntry(id, data) => Promise<entry>
deleteLogEntry(id) => Promise<void>
getLogEntries({ userId, projectId, dateRange, tags, search, limit, offset }) => Promise<entry[]>
getWeeklySummary(userId, weekStart) => Promise<summary>
pushToPortal(logEntryId, projectId) => Promise<portalUpdate>
```

---

### Client Portal Module

#### `useClients()`

```js
const {
  clients,          // array
  isLoading,
  createClient,     // fn(data) => Promise<client>
  updateClient,     // fn(id, data) => Promise<client>
  archiveClient,    // fn(id) => Promise<void>
} = useClients()
```

#### `usePortal(clientId)`

```js
const {
  client,
  projects,
  updates,          // sorted by date desc
  deliverables,
  isLoading,
  addUpdate,        // fn({ content, projectId }) => Promise<update>
  addDeliverable,   // fn({ title, fileUrl, projectId }) => Promise<deliverable>
  updateDeliverableStatus, // fn(id, status) => Promise<void>
  portalUrl,        // the public-facing URL string
  regenerateToken,  // fn() => Promise<string>
} = usePortal(clientId)
```

#### `usePublicPortal(token)` (used on the public portal page)

```js
const {
  client,           // limited fields only
  projects,
  updates,
  deliverables,
  isLoading,
  isPasswordRequired,
  unlockWithPassword, // fn(password) => Promise<boolean>
  addComment,       // fn(updateId, text) => Promise<void>
  approveDeliverable, // fn(id) => Promise<void>
} = usePublicPortal(token)
```

#### `portalApi.js`

```js
getPortalData(token, passwordHash?) => Promise<portalData>
addPortalUpdate({ projectId, content, logEntryId? }) => Promise<update>
addDeliverable({ projectId, title, fileUrl }) => Promise<deliverable>
updateDeliverableStatus(id, status) => Promise<void>
addComment(updateId, text) => Promise<comment>
approveDeliverable(id, token) => Promise<void>
```

---

### Proposal Builder Module

#### `useProposals()`

```js
const {
  proposals,        // array
  isLoading,
  createProposal,   // fn(data) => Promise<proposal>
  duplicateProposal, // fn(id) => Promise<proposal>
  archiveProposal,  // fn(id) => Promise<void>
} = useProposals()
```

#### `useProposal(id)`

```js
const {
  proposal,
  services,         // ordered array of services
  isLoading,
  isSaving,
  update,           // fn(fields) => Promise<void>   (auto-debounced)
  addService,       // fn(data) => Promise<service>
  updateService,    // fn(id, data) => Promise<void>
  removeService,    // fn(id) => Promise<void>
  reorderServices,  // fn(orderedIds) => Promise<void>
  totalValue,       // computed number
  shareUrl,         // string
  markAsSent,       // fn() => Promise<void>
} = useProposal(id)
```

#### `usePublicProposal(token)` (used on the public proposal page)

```js
const {
  proposal,
  services,
  isLoading,
  isSigned,
  sign,             // fn(name) => Promise<void>
} = usePublicProposal(token)
```

#### `proposalApi.js`

```js
createProposal(data) => Promise<proposal>
updateProposal(id, data) => Promise<proposal>
getProposal(id) => Promise<{ proposal, services }>
getPublicProposal(token) => Promise<{ proposal, services }>
addService(proposalId, data) => Promise<service>
updateService(id, data) => Promise<service>
removeService(id) => Promise<void>
reorderServices(proposalId, orderedIds) => Promise<void>
signProposal(token, name) => Promise<void>
```

---

## Supabase Patterns

### Client Setup

```js
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Standard Query Pattern

```js
// Always handle errors explicitly
const { data, error } = await supabase
  .from('log_entries')
  .select('*, projects(name, color)')
  .eq('user_id', userId)
  .order('date', { ascending: false })
  .range(offset, offset + limit - 1)

if (error) throw new Error(error.message)
return data
```

### Realtime Subscription Pattern

```js
// Used in Client Portal for live updates
useEffect(() => {
  const channel = supabase
    .channel(`portal:${clientId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'portal_updates',
      filter: `project_id=eq.${projectId}`
    }, (payload) => {
      addUpdateToState(payload.new)
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [clientId, projectId])
```

### Auth Pattern

```js
// hooks/useAuth.js
export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, isLoading: user === undefined }
}
```

---

## Environment Variables

```bash
# .env.local

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (public key — safe for client)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=BLOC
```

Server-side secrets (Stripe secret key, Resend API key) live only in Supabase Edge Functions — never in the frontend bundle.

---

## Error Handling

### API Errors
All API functions throw on error. Hooks catch and expose via `error` state.

```js
// In a hook
try {
  const data = await sessionsApi.createSession(payload)
  setSession(data)
} catch (err) {
  setError(err.message)
  toast.error('Could not start session. Please try again.')
}
```

### Global Error Boundary
A React Error Boundary wraps the entire app. Caught errors show a friendly "Something went wrong" screen with a reload button.

---

## Testing Strategy

- **Unit tests** (Vitest) — pure utility functions, store reducers
- **Component tests** (Vitest + Testing Library) — key UI components
- **E2E tests** (Playwright) — critical user flows (start session, sign proposal)
- No 100% coverage goal — test what breaks, not everything

---

*Last updated: Phase 0 — Documentation*
*Next update due: End of Phase 1*