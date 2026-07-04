-- Admin moderation (abuse/report handling) and platform announcements.

create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles (id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  details text,
  status report_status not null default 'open',
  resolved_by uuid references profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index reports_status_idx on reports (status);
create index reports_target_idx on reports (target_type, target_id);

alter table reports enable row level security;

create policy "Reporters and admins view reports"
  on reports for select
  using (
    auth.uid() = reporter_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users create reports"
  on reports for insert
  with check (auth.uid() = reporter_id);

create policy "Admins update reports"
  on reports for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'all',
  published_at timestamptz,
  created_by uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table announcements enable row level security;

create policy "Anyone can view published announcements"
  on announcements for select
  using (published_at is not null and published_at <= now());

create policy "Admins manage announcements"
  on announcements for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create trigger set_announcements_updated_at
  before update on announcements
  for each row execute function set_updated_at();
