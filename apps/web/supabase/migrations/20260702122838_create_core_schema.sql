-- Core schema for Home (per agent-guide/database.md)
-- Enums, tables, indexes, and RLS policies for the MVP.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type user_role as enum ('user', 'landlord', 'admin');
create type property_status as enum ('draft', 'published', 'archived');
create type booking_status as enum ('pending', 'approved', 'rejected', 'completed');

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  phone text,
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view all profiles"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------

create table properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  description text,
  property_type text not null,
  price numeric not null,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  address text,
  city text not null,
  region text,
  latitude numeric,
  longitude numeric,
  is_featured boolean not null default false,
  status property_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index properties_city_idx on properties (city);
create index properties_price_idx on properties (price);
create index properties_property_type_idx on properties (property_type);
create index properties_status_idx on properties (status);

alter table properties enable row level security;

create policy "Anyone can view published properties"
  on properties for select
  using (status = 'published' or auth.uid() = owner_id);

create policy "Owners can manage their own listings"
  on properties for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- property_images
-- ---------------------------------------------------------------------------

create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties (id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index property_images_property_id_idx on property_images (property_id);

alter table property_images enable row level security;

create policy "Anyone can view images of published properties"
  on property_images for select
  using (
    exists (
      select 1 from properties
      where properties.id = property_images.property_id
        and (properties.status = 'published' or properties.owner_id = auth.uid())
    )
  );

create policy "Owners can manage images of their own listings"
  on property_images for all
  using (
    exists (
      select 1 from properties
      where properties.id = property_images.property_id
        and properties.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from properties
      where properties.id = property_images.property_id
        and properties.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- favorites
-- ---------------------------------------------------------------------------

create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  property_id uuid not null references properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, property_id)
);

create index favorites_user_id_idx on favorites (user_id);
create index favorites_property_id_idx on favorites (property_id);

alter table favorites enable row level security;

create policy "Users can manage their own favorites"
  on favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------

create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  property_id uuid not null references properties (id) on delete cascade,
  booking_date timestamptz not null,
  status booking_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index bookings_user_id_idx on bookings (user_id);
create index bookings_property_id_idx on bookings (property_id);

alter table bookings enable row level security;

create policy "Users can view their own bookings"
  on bookings for select
  using (
    auth.uid() = user_id
    or auth.uid() = (select owner_id from properties where properties.id = bookings.property_id)
  );

create policy "Users can create their own bookings"
  on bookings for insert
  with check (auth.uid() = user_id);

create policy "Users or property owners can update booking status"
  on bookings for update
  using (
    auth.uid() = user_id
    or auth.uid() = (select owner_id from properties where properties.id = bookings.property_id)
  );

-- ---------------------------------------------------------------------------
-- chats
-- ---------------------------------------------------------------------------

create table chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index chats_user_id_idx on chats (user_id);

alter table chats enable row level security;

create policy "Users can manage their own chats"
  on chats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- chat_messages
-- ---------------------------------------------------------------------------

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats (id) on delete cascade,
  sender_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index chat_messages_chat_id_idx on chat_messages (chat_id);

alter table chat_messages enable row level security;

create policy "Users can view messages in their own chats"
  on chat_messages for select
  using (
    exists (
      select 1 from chats
      where chats.id = chat_messages.chat_id
        and chats.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their own chats"
  on chat_messages for insert
  with check (
    exists (
      select 1 from chats
      where chats.id = chat_messages.chat_id
        and chats.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger set_properties_updated_at
  before update on properties
  for each row execute function set_updated_at();
