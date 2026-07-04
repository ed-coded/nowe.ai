-- Per-listing analytics: raw events for flexibility/AI insight, plus a
-- rollup table maintained by trigger for fast dashboard reads.

create table property_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties (id) on delete cascade,
  event_type text not null,
  actor_id uuid references profiles (id) on delete set null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index property_events_property_event_created_idx
  on property_events (property_id, event_type, created_at);

alter table property_events enable row level security;

create policy "Owners and admins view their property events"
  on property_events for select
  using (
    exists (
      select 1 from properties
      where properties.id = property_events.property_id
        and (properties.owner_id = auth.uid() or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
    )
  );

-- No client insert policy: events must be recorded by a server-side service
-- (server Supabase client or service role), not written directly by
-- browsers, to prevent event spoofing / inflated metrics.

create table property_stats (
  property_id uuid primary key references properties (id) on delete cascade,
  views_count integer not null default 0,
  saves_count integer not null default 0,
  inquiries_count integer not null default 0,
  last_response_at timestamptz,
  avg_response_seconds numeric,
  updated_at timestamptz not null default now()
);

alter table property_stats enable row level security;

create policy "Owners and admins view their property stats"
  on property_stats for select
  using (
    exists (
      select 1 from properties
      where properties.id = property_stats.property_id
        and (properties.owner_id = auth.uid() or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
    )
  );

-- No client write policy: property_stats is maintained entirely by the
-- trigger below.

create or replace function public.rollup_property_event()
returns trigger
language plpgsql
as $$
begin
  insert into property_stats (property_id, views_count, saves_count, inquiries_count, updated_at)
  values (
    new.property_id,
    case when new.event_type = 'view' then 1 else 0 end,
    case when new.event_type = 'save' then 1 else 0 end,
    case when new.event_type = 'inquiry' then 1 else 0 end,
    now()
  )
  on conflict (property_id) do update set
    views_count = property_stats.views_count + case when new.event_type = 'view' then 1 else 0 end,
    saves_count = property_stats.saves_count + case when new.event_type = 'save' then 1 else 0 end,
    inquiries_count = property_stats.inquiries_count + case when new.event_type = 'inquiry' then 1 else 0 end,
    updated_at = now();
  return new;
end;
$$;

create trigger rollup_property_event_trigger
  after insert on property_events
  for each row execute function public.rollup_property_event();
