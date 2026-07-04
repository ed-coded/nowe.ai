-- Closes a hole in the existing profiles RLS: the current UPDATE policy
-- ("Users can update their own profile" using auth.uid() = id) has no
-- column restriction, so today any signed-in user can change their own
-- `role` to 'agent' or 'admin' directly via the REST API. This migration
-- blocks any client-driven change to profiles.role and provides a single
-- sanctioned, admin-only path to change it.

create or replace function public.prevent_role_self_update()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
     and coalesce(current_setting('app.allow_role_change', true), 'false') <> 'true' then
    raise exception 'role cannot be changed directly; use admin_set_user_role()';
  end if;
  return new;
end;
$$;

create trigger prevent_profiles_role_update
  before update on profiles
  for each row
  execute function public.prevent_role_self_update();

-- The only sanctioned way to change a profile's role. The transaction-local
-- 'app.allow_role_change' flag lets this function's own UPDATE through the
-- trigger above without weakening it for any other caller. security definer
-- so it can be granted to authenticated users while still enforcing the
-- admin check itself, rather than relying on RLS alone.
create or replace function public.admin_set_user_role(target_id uuid, new_role user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'only admins can change user roles';
  end if;

  perform set_config('app.allow_role_change', 'true', true);
  update profiles set role = new_role, updated_at = now() where id = target_id;
  perform set_config('app.allow_role_change', 'false', true);
end;
$$;
