-- Backend wiring: notifications currently have no INSERT policy by design
-- (must only ever be written server-side, never by a client, to prevent
-- spoofing) — this adds the one legitimate server-side writer: a
-- SECURITY DEFINER function, called only from triggers below, never
-- exposed directly to clients.

create or replace function public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_link_url text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into notifications (user_id, type, title, body, link_url)
  values (p_user_id, p_type, p_title, p_body, p_link_url);
end;
$$;

-- New message -> notify the other participant.
create or replace function public.notify_on_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recipient uuid;
  v_sender_name text;
begin
  select case when conversations.renter_id = new.sender_id then conversations.agent_id else conversations.renter_id end
  into v_recipient
  from conversations
  where conversations.id = new.conversation_id;

  select full_name into v_sender_name from profiles where id = new.sender_id;

  perform public.create_notification(
    v_recipient,
    'new_message',
    'New message from ' || coalesce(v_sender_name, 'someone'),
    left(new.body, 140),
    '/dashboard/messages'
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_on_new_message on messages;
create trigger trg_notify_on_new_message
  after insert on messages
  for each row
  execute function public.notify_on_new_message();

-- Verification status change -> notify the agent.
create or replace function public.notify_on_verification_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status and new.status in ('approved', 'rejected') then
    perform public.create_notification(
      new.agent_id,
      'verification_update',
      case when new.status = 'approved' then 'Verification approved' else 'Verification needs attention' end,
      case
        when new.status = 'approved' then 'Your verification request has been approved.'
        else 'Your verification request was not approved — you can submit an updated request.'
      end,
      '/agent/dashboard/verification'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notify_on_verification_status_change on verification_requests;
create trigger trg_notify_on_verification_status_change
  after update on verification_requests
  for each row
  execute function public.notify_on_verification_status_change();
