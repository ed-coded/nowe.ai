-- Developer features (multi-project, multi-unit inventory) served through
-- the same unified Agent role/dashboard — no separate account type.

create type unit_status as enum ('available', 'reserved', 'sold', 'rented');

create table projects (
  id uuid primary key default gen_random_uuid(),
  developer_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  description text,
  city text not null,
  region text,
  address text,
  status property_status not null default 'draft',
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_developer_id_idx on projects (developer_id);
create index projects_status_idx on projects (status);

alter table projects enable row level security;

create policy "Anyone can view published projects"
  on projects for select
  using (status = 'published' or developer_id = auth.uid());

create policy "Developers manage their own projects"
  on projects for all
  using (auth.uid() = developer_id)
  with check (auth.uid() = developer_id);

create trigger set_projects_updated_at
  before update on projects
  for each row execute function set_updated_at();

create table units (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  unit_number text not null,
  unit_type text,
  price numeric not null,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  floor integer,
  size_sqm numeric,
  status unit_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, unit_number)
);

create index units_project_id_idx on units (project_id);
create index units_status_idx on units (status);

alter table units enable row level security;

create policy "Anyone can view units of published projects"
  on units for select
  using (
    exists (
      select 1 from projects
      where projects.id = units.project_id
        and (projects.status = 'published' or projects.developer_id = auth.uid())
    )
  );

create policy "Developers manage units of their own projects"
  on units for all
  using (
    exists (
      select 1 from projects
      where projects.id = units.project_id
        and projects.developer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from projects
      where projects.id = units.project_id
        and projects.developer_id = auth.uid()
    )
  );

create trigger set_units_updated_at
  before update on units
  for each row execute function set_updated_at();

-- Optional traceability: a unit can later be promoted into the searchable
-- properties table once listed individually. Exact developer-listing UX
-- (auto-create vs manual) is left for the property-management phase.
alter table properties add column unit_id uuid references units (id) on delete set null;
create index properties_unit_id_idx on properties (unit_id);
