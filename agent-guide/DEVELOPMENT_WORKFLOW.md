# Development Workflow

This defines the mandatory workflow for every feature built on this project from
this point forward. It formalizes and supersedes the informal process first
described in `production_hardening.md`.

Goal: keep feature velocity high while guaranteeing that security, authorization,
and data-integrity issues are always fixed immediately, and every other
production concern is always tracked — never forgotten, never left only in chat.

---

## The Workflow

Every feature follows these steps, in order:

### 1. Implement the feature
Build exactly what was scoped. No unrequested redesigns, no speculative
abstractions, no scope creep.

### 2. Verify
Run, and confirm clean:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

A feature is not "built" until all three pass. Fix real errors; do not suppress
or bypass checks to force a pass.

### 3. Perform a mandatory production-readiness audit
Audit the feature against the full checklist in `PRODUCTION_HARDENING.md` —
authentication, authorization/RLS, cross-tenant access, data integrity,
concurrency, file/storage security, observability, UX states, and
scalability. This step is not optional and is not skipped for small features.

### 4. Classify every finding
Every issue found in the audit is classified as exactly one of:

- 🔴 **Blocker**
- 🟡 **Production Hardening**
- 🟢 **Future Enhancement**

See `PRODUCTION_HARDENING.md` for the exact criteria. When in doubt between
🔴 and 🟡, default to 🟡 and explicitly justify why it is *not* a blocker —
see the "Blocker Justification Rule" below.

### 5. Fix every 🔴 blocker
A feature is not complete while any 🔴 blocker is open. Blockers are fixed
before moving on, not batched, not deferred, not left for "next time."

### 6. File every 🟡 finding
Every 🟡 Production Hardening finding is added to `PHASE_X_BACKLOG.md`
immediately, in the same session, using the format defined there. It is never
left only in the chat transcript or in a summary the user might not re-read.

### 7. Note every 🟢 finding
🟢 Future Enhancements are mentioned in the feature report but are not
required to be tracked with the same rigor as 🟡 items — they're optional
ideas, not deferred work.

### 8. Never silently defer work
If something is deferred, it is deferred *visibly*: classified, logged to the
backlog (if 🟡) or explicitly called out (if 🟢), and mentioned in the final
report. Silent omission is never acceptable.

---

## Blocker Justification Rule

Before classifying anything as 🔴, state explicitly which of the following it
affects, and how:

- Authentication
- Authorization / RLS
- Data integrity
- Privacy
- Critical business logic

If a finding doesn't clearly hit one of these, it is 🟡 or 🟢 — not a blocker.
Performance, missing indexes, pagination, UX polish, confirmation dialogs,
logging, and similar concerns are **never** blockers by default, regardless of
how important they feel in the moment. (See `PRODUCTION_HARDENING.md` for the
full definitions.)

---

## Required Feature Completion Report

Every completed feature ends with a report containing exactly these four
sections, in this order:

```
## Verification Summary
- tsc / lint / build results

## Production Audit Summary
- what was audited
- findings, classified 🔴 / 🟡 / 🟢

## Updated Production Hardening Backlog
- newly added items (with IDs)
- items completed this session (with IDs)
- current remaining backlog count

## Remaining Blockers
- "None" — or the specific open 🔴 items and why they're still open
```

A feature report that omits any of these four sections is incomplete.

---

## Milestone Reminders

When all requested feature work for a milestone is complete, explicitly remind
the user of the current `PHASE_X_BACKLOG.md` contents so a dedicated hardening
pass can be scheduled before production launch. Don't wait to be asked.
