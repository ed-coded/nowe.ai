-- Agent Lead CRM and agent verification workflow.

create type lead_status as enum ('new', 'contacted', 'inspection_scheduled', 'closed', 'lost');
create type verification_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------

create table leads (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references profiles (id) on delete cascade,
  property_id uuid references properties (id) on delete set null,
  renter_id uuid references profiles (id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  source text,
  status lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_agent_id_idx on leads (agent_id);
create index leads_status_idx on leads (status);
create index leads_property_id_idx on leads (property_id);

alter table leads enable row level security;

create policy "Agents manage their own leads"
  on leads for all
  using (
    auth.uid() = agent_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  )
  with check (auth.uid() = agent_id);

create trigger set_leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- lead_notes (append-only; a lead can accumulate many notes over time)
-- ---------------------------------------------------------------------------

create table lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  author_id uuid not null references profiles (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create index lead_notes_lead_id_idx on lead_notes (lead_id);

alter table lead_notes enable row level security;

create policy "Agents view notes on their own leads"
  on lead_notes for select
  using (
    exists (
      select 1 from leads
      where leads.id = lead_notes.lead_id
        and (leads.agent_id = auth.uid() or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
    )
  );

create policy "Agents add notes to their own leads"
  on lead_notes for insert
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from leads
      where leads.id = lead_notes.lead_id
        and leads.agent_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- verification_requests
-- ---------------------------------------------------------------------------

create table verification_requests (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references profiles (id) on delete cascade,
  business_name text,
  id_document_url text,
  additional_info text,
  status verification_status not null default 'pending',
  reviewed_by uuid references profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index verification_requests_agent_id_idx on verification_requests (agent_id);
create index verification_requests_status_idx on verification_requests (status);

alter table verification_requests enable row level security;

create policy "Agents and admins view verification requests"
  on verification_requests for select
  using (
    auth.uid() = agent_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Agents create their own verification requests"
  on verification_requests for insert
  with check (auth.uid() = agent_id);

create policy "Admins review verification requests"
  on verification_requests for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
