-- Backend wiring: inspection status changes (approve/reject/complete by the
-- property's owning agent) now notify the requesting renter, using the same
-- create_notification() writer added for messages/verification.

create or replace function public.notify_on_inspection_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_property_title text;
begin
  if new.status is distinct from old.status then
    select title into v_property_title from properties where id = new.property_id;

    perform public.create_notification(
      new.user_id,
      'inspection_update',
      case
        when new.status = 'approved' then 'Inspection approved'
        when new.status = 'rejected' then 'Inspection declined'
        when new.status = 'completed' then 'Inspection completed'
        else 'Inspection update'
      end,
      coalesce(v_property_title, 'Your inspection request') || ' is now ' || new.status || '.',
      '/dashboard/inspections'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notify_on_inspection_status_change on inspections;
create trigger trg_notify_on_inspection_status_change
  after update on inspections
  for each row
  execute function public.notify_on_inspection_status_change();
