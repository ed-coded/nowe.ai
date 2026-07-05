# Phase X – Production Hardening Backlog

Structured backlog of every 🟡 Production Hardening finding, per
`DEVELOPMENT_WORKFLOW.md` / `PRODUCTION_HARDENING.md`. This is not part of
feature implementation — it is the collection point for everything important
but non-blocking, to be worked through in a dedicated hardening pass before
production launch.

Rules:
- Never remove an item — mark it **Completed** instead.
- Every 🟡 finding from every future audit is added here immediately.
- Every completed feature updates this file (new items + status changes).

---

## Summary

| Status | Count |
|---|---|
| Open | 6 |
| Completed | 0 |
| **Total** | **6** |

---

## PH-001 — Missing index on `properties.owner_id`

- **Priority:** Medium
- **Category:** Database / Performance
- **Description:** `properties.owner_id` has no index, confirmed via live `pg_indexes` inspection.
- **Why it matters:** It's the filter/join column for every agent-scoped query (`listMyProperties`, `getMyPropertyById`, `listInspectionsForMyProperties`), the `Owners can manage their own listings` RLS policy (evaluated on every property mutation), and every `property-media` storage RLS policy check.
- **Risk if deferred:** Sequential scans on `properties` as listings grow; increasing per-request RLS evaluation cost; slower agent dashboard load times at scale. Zero risk today at near-empty table size.
- **Recommended implementation:**
  ```sql
  create index if not exists properties_owner_id_idx on properties (owner_id);
  ```
- **Safe to defer?** Yes — purely additive, zero-risk to add at any time.
- **Estimated effort:** Small
- **Status:** Open

---

## PH-002 — No confirmation step before admin role changes

- **Priority:** Medium
- **Category:** UX / Operational Safety
- **Description:** `UsersAgentsList.tsx`'s "Set as User"/"Set as Agent" buttons call `setUserRole()` immediately on click — no confirmation step, unlike the two-step inline confirm pattern already used elsewhere in the app (e.g. conversation delete).
- **Why it matters:** Role changes are high-impact — they grant or revoke CRUD access to real listings. A misclick has real consequences with no built-in undo.
- **Risk if deferred:** An admin could accidentally demote an active agent or promote the wrong account, requiring manual correction. Admin-only surface, low traffic — no security or data exposure.
- **Recommended implementation:** Add the same inline two-step confirm pattern (click → "Confirm / Cancel" replaces the button) already established in this app before calling `setUserRole`.
- **Safe to defer?** Yes.
- **Estimated effort:** Small
- **Status:** Open

---

## PH-003 — No duplicate-request protection on inspections

- **Priority:** Low
- **Category:** Database / Data Integrity
- **Description:** No constraint stops a renter from submitting multiple pending inspection requests for the same property.
- **Why it matters:** Left unchecked, this clutters the agent's inspection review queue with redundant entries over time.
- **Risk if deferred:** Minor UX/queue-noise issue only — no security, correctness, or data-corruption impact.
- **Recommended implementation:**
  ```sql
  create unique index if not exists inspections_one_pending_per_renter_property
    on inspections (user_id, property_id) where status = 'pending';
  ```
- **Safe to defer?** Yes.
- **Estimated effort:** Small
- **Status:** Open

---

## PH-004 — Unpaginated admin list views

- **Priority:** Medium
- **Category:** Performance / Scalability
- **Description:** `listAllProfiles`, `listReports`, `listAnnouncements`, and `listPendingVerificationRequests` all fetch their entire result set unbounded — no `.range()`/limit.
- **Why it matters:** Fine at today's near-zero row counts; will not scale to real production user/report/listing volumes.
- **Risk if deferred:** Slow admin page loads and oversized payloads once real data volume grows — a usability wall, not a security issue.
- **Recommended implementation:** Add `.range()` or cursor-based pagination to all four list functions, with corresponding "load more" / page controls in their UI components.
- **Safe to defer?** Yes — no correctness/security impact at current scale.
- **Estimated effort:** Medium (touches 4 services + their UI components)
- **Status:** Open

---

## PH-005 — `listAllProfiles()` has no authorization check of its own

- **Priority:** Medium (highest priority in this backlog — closest to the authorization boundary)
- **Category:** Security / Authorization (defense-in-depth)
- **Description:** `listAllProfiles()` performs no internal admin-role check. It is safe today only because its sole caller (`/noweadmin/users`) is wrapped in `requireAdminAccess()`. This differs from `listReports`, `listAnnouncements`, and `listPendingVerificationRequests`, all of which stay safe even from an ungated context because their underlying RLS is itself admin-scoped — `profiles` SELECT RLS ("Users can view all profiles") is intentionally broad by pre-existing design.
- **Why it matters:** Defense-in-depth. This function's safety depends entirely on every future caller remembering to gate it; it does not fail safe on its own.
- **Risk if deferred:** Not currently exploitable — no ungated caller exists today. But a future refactor that imports this function into a new, ungated context would silently expose every user's email/role/agent_type with no additional review catching it.
- **Recommended implementation:** Add an explicit role check inside `listAllProfiles()` itself (return `[]` or throw if the caller isn't an admin), independent of the calling page's gate.
- **Safe to defer?** Yes for now — not currently exploitable — but should be first in line whenever this backlog is worked.
- **Estimated effort:** Small
- **Status:** Open

---

## PH-006 — No DB-level validation on `inspections.booking_date`

- **Priority:** Low
- **Category:** Data Integrity / Validation
- **Description:** The "no past dates" rule is enforced only by the HTML date input's `min` attribute in `PropertyDetailActions.tsx` — trivially bypassable via a direct API request.
- **Why it matters:** Minor data-quality concern only.
- **Risk if deferred:** Occasional nonsensical historical booking dates in the data; no functional breakage, no security impact.
- **Recommended implementation:**
  ```sql
  alter table inspections add constraint inspections_booking_date_check
    check (booking_date >= created_at) not valid;
  alter table inspections validate constraint inspections_booking_date_check;
  ```
- **Safe to defer?** Yes.
- **Estimated effort:** Small
- **Status:** Open
