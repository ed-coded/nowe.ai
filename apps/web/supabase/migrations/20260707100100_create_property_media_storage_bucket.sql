-- Phase 5: Property Management & Real Listings — storage bucket for listing
-- photos. Public bucket (published listing photos need to be viewable by
-- anonymous visitors on public listing pages); write access is restricted to
-- the owning agent via a folder-per-user convention (`{owner_id}/...`),
-- the standard Supabase Storage RLS pattern.

insert into storage.buckets (id, name, public)
values ('property-media', 'property-media', true)
on conflict (id) do nothing;

create policy "Public can view property media"
  on storage.objects for select
  using (bucket_id = 'property-media');

create policy "Owners can upload their own property media"
  on storage.objects for insert
  with check (
    bucket_id = 'property-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owners can update their own property media"
  on storage.objects for update
  using (
    bucket_id = 'property-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owners can delete their own property media"
  on storage.objects for delete
  using (
    bucket_id = 'property-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
