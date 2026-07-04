-- Saved searches (renter feature) and platform notifications.

create table saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  name text,
  query_text text,
  -- Deliberate exception to the project's "avoid unnecessary JSON blobs"
  -- rule: AI-extracted search filter criteria are inherently semi-structured
  -- and evolve with the AI layer, not a fixed relational shape.
  filters jsonb,
  notify boolean not null default false,
  created_at timestamptz not null default now()
);

create index saved_searches_user_id_idx on saved_searches (user_id);

alter table saved_searches enable row level security;

create policy "Users manage their own saved searches"
  on saved_searches for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on notifications (user_id);
create index notifications_user_id_read_at_idx on notifications (user_id, read_at);

alter table notifications enable row level security;

create policy "Users view their own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users mark their own notifications read"
  on notifications for update
  using (auth.uid() = user_id);

-- Deliberately no insert policy: notifications must only ever be written
-- server-side (via the server Supabase client or a security-definer
-- function), never directly by a client, to prevent spoofed notifications.
