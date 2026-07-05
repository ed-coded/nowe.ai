# Production Hardening Checklist

The permanent engineering checklist. Every completed feature is audited
against every section below before it is considered done, per
`DEVELOPMENT_WORKFLOW.md`.

---

## Classification Criteria

### 🔴 Blocker
Used **only** when the finding affects one or more of:
- Authentication
- Authorization / RLS
- Data integrity
- Privacy
- Critical business logic (the feature is actually broken, not just imperfect)

Must be fixed before the feature is considered complete. Never batched, never
deferred.

### 🟡 Production Hardening
Everything else that matters for a healthy production system but does not
meet the 🔴 bar: performance, missing indexes, pagination, race conditions
that degrade UX rather than corrupt data, missing validation that isn't a
security hole, observability, error handling, UX polish, accessibility,
technical debt, documentation, test coverage.

Filed to `PHASE_X_BACKLOG.md` immediately. Never fixed "just because it's
quick" instead of being logged first — logging first keeps the backlog
honest even if the fix happens the same day.

### 🟢 Future Enhancement
Optional, nice-to-have capability. Not a defect, not a gap in the current
feature's contract — just an idea for later. Mentioned in the feature report;
not required to be tracked with backlog rigor.

---

## Audit Checklist

Run through every applicable section for every completed feature.

### Authentication & Authorization
- [ ] Every mutation checks the caller is authenticated
- [ ] RLS policies exist on every table touched, with correct `USING` **and**
      `WITH CHECK` clauses (an `UPDATE`/`INSERT` policy missing `WITH CHECK`
      silently reuses `USING` — verify this is intentional)
- [ ] Cross-tenant access is impossible (user A cannot read/write user B's
      rows via a crafted request, not just via the UI)
- [ ] No privilege-escalation path (a lower-privileged role cannot set a
      field that grants itself higher privilege or bypasses another user's
      approval step)
- [ ] Service-layer functions that rely entirely on RLS for safety are noted
      as such — flag any that would misbehave if ever called from an
      ungated context

### Database & Data Integrity
- [ ] Foreign keys exist for every relationship
- [ ] Constraints (`CHECK`, `UNIQUE`, `NOT NULL`) match the real business
      rules, not just the happy path
- [ ] Missing indexes on columns used in `WHERE`/`JOIN`/RLS subqueries
- [ ] Composite indexes match actual query patterns (leading column = the
      one every query filters by first)
- [ ] Query performance — no unindexed sequential scans on tables expected
      to grow
- [ ] N+1 queries — batch instead of looping individual fetches
- [ ] Pagination on any list that can grow unbounded
- [ ] Transactions used where multiple writes must succeed or fail together
- [ ] Race conditions — concurrent writes to the same row produce a correct,
      not-corrupted result
- [ ] Duplicate-submission protection where a repeated action shouldn't
      create repeated rows

### Validation
- [ ] Server-side validation exists independent of client-side validation
- [ ] Client-side validation (HTML `min`/`max`/`required`, etc.) is never the
      only defense — confirm a crafted request bypassing the UI is still
      rejected or safely ignored server-side

### File Uploads & Storage
- [ ] MIME type restrictions enforced (bucket-level, not just UI `accept`)
- [ ] File size limits enforced (bucket-level)
- [ ] Storage bucket RLS correctly scopes read/write, and public vs. private
      bucket choice matches the actual privacy requirement of the content
- [ ] Orphaned file cleanup strategy exists (or is explicitly deferred and
      logged) when rows referencing storage objects can be deleted

### Background Work & Cleanup
- [ ] Any queued/deferred work (cleanup jobs, background workers) has a
      real consumer, or is explicitly flagged as "queued but nothing
      processes it yet"

### Error Handling & Observability
- [ ] Errors are caught and surfaced to the user with a clear message, never
      a silent failure
- [ ] No sensitive internals (stack traces, raw DB errors) leak to the client
- [ ] Logging exists for auth events and critical mutations, without logging
      secrets/tokens/passwords
- [ ] Audit trails exist for admin/moderation actions where relevant

### UX States
- [ ] Loading state
- [ ] Empty state
- [ ] Error state
- [ ] Mobile responsiveness
- [ ] Basic accessibility (labels, focus states, keyboard reachability)

### API & Application Security
- [ ] No sensitive data exposed in API responses beyond what the caller
      needs
- [ ] Rate limiting considered for anything abusable (signup, messaging,
      report filing, AI endpoints)
- [ ] Caching strategy doesn't leak one user's data to another
- [ ] No performance regression introduced relative to the existing feature
      set

### Production Scalability
- [ ] Confirm the feature's query/storage patterns still make sense at
      10x–100x current data volume, not just at today's near-empty tables

---

## Relationship to Phase X

Every 🟡 finding from this checklist is filed to `PHASE_X_BACKLOG.md` in the
exact format defined there — never left only in chat. See
`DEVELOPMENT_WORKFLOW.md` for the full process this checklist plugs into.
