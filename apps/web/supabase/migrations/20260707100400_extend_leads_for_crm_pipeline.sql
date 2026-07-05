-- Backend wiring: reconciles the real `leads` table with the Agent CRM's
-- Kanban pipeline (Phase 4B built it against mock data since the enum and
-- columns didn't match yet). Additive-only.

alter type lead_status add value if not exists 'interested' before 'closed';
alter type lead_status add value if not exists 'negotiating' before 'closed';

alter table leads
  add column if not exists budget text,
  add column if not exists preferred_location text,
  add column if not exists next_follow_up_at timestamptz;
