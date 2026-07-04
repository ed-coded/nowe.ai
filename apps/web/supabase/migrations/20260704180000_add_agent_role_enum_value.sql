-- Adds the 'agent' role required by the 3-role platform (admin/user/agent).
-- Kept as its own migration: Postgres disallows referencing a newly-added
-- enum value in any other statement within the same transaction/batch that
-- added it, and the Supabase CLI runs each migration file as one batch.
--
-- 'landlord' is intentionally left in the enum as a deprecated legacy value
-- rather than rebuilt away — a full enum rebuild would require rewriting
-- the live profiles.role column, every existing row, and every RLS policy
-- referencing it, for no immediate product benefit. Going forward the app
-- only ever assigns/reads 'agent'. A one-time backfill
-- (update profiles set role = 'agent' where role = 'landlord') is a
-- separate, explicitly-approved future step if ever needed.

alter type user_role add value 'agent';
