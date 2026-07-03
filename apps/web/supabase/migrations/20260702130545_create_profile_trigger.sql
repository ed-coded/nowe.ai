-- Auto-create a profiles row whenever a new user signs up via Supabase Auth.
-- Runs as SECURITY DEFINER so it can write to profiles regardless of the
-- new user's session state (important during email-confirmation flows,
-- where auth.uid() may not yet be usable client-side).

create function public.handle_new_user()
returns trigger
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
