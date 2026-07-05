-- Corrects 20260707100100: bucket made private + MIME/size-restricted so
-- draft-listing photos are no longer servable via a public CDN URL that
-- bypasses RLS; ownership checks now verify the folder's property-id
-- segment actually belongs to the requesting agent, not just the uid
-- segment; adds admin read/delete for moderation, matching the
-- admin-bypass pattern already used on leads/verification_requests; adds
-- an orphaned-file cleanup queue. Idempotent — safe to re-run.
--
-- Folder convention (unchanged, matches existing app code):
--   {owner_id}/{property_id}/{filename}

insert into storage.buckets (id, name, public)
values ('property-media', 'property-media', false)
on conflict (id) do nothing;

update storage.buckets
set
  public = false,
  file_size_limit = 5242880, -- 5 MB per file
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
where id = 'property-media';

-- Returns null instead of raising on a malformed folder segment, so a
-- crafted/garbage path fails the policy (denied) rather than erroring.
create or replace function safe_uuid(value text)
returns uuid
language plpgsql
immutable
as $$
begin
  return value::uuid;
exception when invalid_text_representation then
  return null;
end;
$$;

drop policy if exists "Public can view property media" on storage.objects;
drop policy if exists "Owners can upload their own property media" on storage.objects;
drop policy if exists "Owners can update their own property media" on storage.objects;
drop policy if exists "Owners can delete their own property media" on storage.objects;
drop policy if exists "View own uploads, published media, or as admin" on storage.objects;
drop policy if exists "Owners can upload media for properties they own" on storage.objects;
drop policy if exists "Owners can update media for properties they own" on storage.objects;
drop policy if exists "Owners can delete their own media, admins can moderate" on storage.objects;

create policy "View own uploads, published media, or as admin"
  on storage.objects for select
  using (
    bucket_id = 'property-media'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from properties p
        where p.id = safe_uuid((storage.foldername(name))[2])
          and p.status = 'published'
      )
      or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    )
  );

create policy "Owners can upload media for properties they own"
  on storage.objects for insert
  with check (
    bucket_id = 'property-media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from properties p
      where p.id = safe_uuid((storage.foldername(name))[2])
        and p.owner_id = auth.uid()
    )
  );

create policy "Owners can update media for properties they own"
  on storage.objects for update
  using (
    bucket_id = 'property-media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from properties p
      where p.id = safe_uuid((storage.foldername(name))[2])
        and p.owner_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'property-media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from properties p
      where p.id = safe_uuid((storage.foldername(name))[2])
        and p.owner_id = auth.uid()
    )
  );

create policy "Owners can delete their own media, admins can moderate"
  on storage.objects for delete
  using (
    bucket_id = 'property-media'
    and (
      (
        (storage.foldername(name))[1] = auth.uid()::text
        and exists (
          select 1 from properties p
          where p.id = safe_uuid((storage.foldername(name))[2])
            and p.owner_id = auth.uid()
        )
      )
      or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    )
  );

-- Orphaned-file cleanup: a row delete on storage.objects (or a DB trigger)
-- cannot remove the underlying object bytes — deletion goes through the
-- Storage API, not raw SQL. This queues the path for a worker (Edge
-- Function/cron using the Storage admin API) to actually delete; it does
-- not delete the file itself. Deleting a `properties` row cascades to
-- `property_media` (existing FK), which fires this trigger per row, so a
-- deleted listing's photos are queued for cleanup automatically.
--
-- `property_media.file_url` now holds the raw storage object path (not a
-- baked URL) — the bucket is private, so every read has to mint a fresh
-- signed URL at request time anyway (see propertyMediaUrl.ts), which makes
-- a separate storage_path column redundant.

create table if not exists storage_cleanup_queue (
  id bigint generated always as identity primary key,
  bucket_id text not null,
  object_path text not null,
  queued_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists storage_cleanup_queue_unprocessed_idx
  on storage_cleanup_queue (queued_at) where processed_at is null;

-- Locked down deliberately: no policies means no anon/authenticated access
-- via the API; only the table owner (this SECURITY DEFINER trigger) and a
-- service-role worker touch it.
alter table storage_cleanup_queue enable row level security;

create or replace function queue_property_media_cleanup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.file_url is not null then
    insert into storage_cleanup_queue (bucket_id, object_path)
    values ('property-media', old.file_url);
  end if;
  return old;
end;
$$;

drop trigger if exists trg_queue_property_media_cleanup on property_media;
create trigger trg_queue_property_media_cleanup
  after delete on property_media
  for each row
  execute function queue_property_media_cleanup();
