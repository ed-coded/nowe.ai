-- Lets the dedicated agent signup flow (/agent/signup) request role='agent'
-- and an agent_type at signup time, via auth signUp's options.data. This is
-- safe because it only runs at INSERT (new account creation) — it cannot be
-- used to escalate an EXISTING account's role, which remains blocked by the
-- prevent_profiles_role_update trigger and only changeable via
-- admin_set_user_role(). Only 'agent' may ever be requested this way —
-- 'admin' is never assignable through user-supplied signup metadata.

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
as $$
declare
  requested_role user_role;
  requested_agent_type text;
begin
  requested_role := case
    when new.raw_user_meta_data ->> 'requested_role' = 'agent' then 'agent'::user_role
    else 'user'::user_role
  end;

  requested_agent_type := case
    when requested_role = 'agent'
      and new.raw_user_meta_data ->> 'agent_type' in ('real_estate_agent', 'landlord', 'developer')
      then new.raw_user_meta_data ->> 'agent_type'
    else null
  end;

  insert into public.profiles (id, email, full_name, role, agent_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    requested_role,
    requested_agent_type
  );
  return new;
end;
$$ language plpgsql;
