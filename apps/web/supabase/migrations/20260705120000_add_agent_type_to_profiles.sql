-- Agent sub-classification, per product requirement: keep exactly 3 RBAC
-- roles (user/agent/admin) and distinguish real-estate-agent/landlord/
-- developer via a profile attribute instead of new roles.

alter table profiles add column agent_type text;

alter table profiles add constraint profiles_agent_type_check
  check (agent_type in ('real_estate_agent', 'landlord', 'developer'));

-- agent_type only makes sense for role = 'agent'.
alter table profiles add constraint profiles_agent_type_requires_agent_role
  check (agent_type is null or role = 'agent');

create index profiles_agent_type_idx on profiles (agent_type);
