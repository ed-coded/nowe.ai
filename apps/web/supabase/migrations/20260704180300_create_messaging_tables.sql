-- Human agent<->renter messaging. Kept separate from the existing
-- chats/chat_messages tables, which stay scoped to the AI assistant only —
-- their shape (free-text sender_type, no recipient concept) is purpose-built
-- for that and shouldn't be overloaded for two-party human conversations.

create table conversations (
  id uuid primary key default gen_random_uuid(),
  renter_id uuid not null references profiles (id) on delete cascade,
  agent_id uuid not null references profiles (id) on delete cascade,
  property_id uuid references properties (id) on delete set null,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (renter_id, agent_id, property_id)
);

create index conversations_renter_id_idx on conversations (renter_id);
create index conversations_agent_id_idx on conversations (agent_id);

alter table conversations enable row level security;

create policy "Participants manage their own conversations"
  on conversations for all
  using (auth.uid() = renter_id or auth.uid() = agent_id)
  with check (auth.uid() = renter_id or auth.uid() = agent_id);

create trigger set_conversations_updated_at
  before update on conversations
  for each row execute function set_updated_at();

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations (id) on delete cascade,
  sender_id uuid not null references profiles (id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index messages_conversation_id_idx on messages (conversation_id);

alter table messages enable row level security;

create policy "Participants view messages in their own conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
        and (conversations.renter_id = auth.uid() or conversations.agent_id = auth.uid())
    )
  );

create policy "Participants send messages in their own conversations"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
        and (conversations.renter_id = auth.uid() or conversations.agent_id = auth.uid())
    )
  );

create policy "Participants mark messages read in their own conversations"
  on messages for update
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
        and (conversations.renter_id = auth.uid() or conversations.agent_id = auth.uid())
    )
  );

create or replace function public.touch_conversation_last_message()
returns trigger
language plpgsql
as $$
begin
  update conversations
  set last_message_at = new.created_at, updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger touch_conversation_on_message
  after insert on messages
  for each row execute function public.touch_conversation_last_message();
