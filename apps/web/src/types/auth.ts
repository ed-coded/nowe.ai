// Mirrors the live `user_role` Postgres enum (see
// supabase/migrations/20260702122838_create_core_schema.sql and
// 20260704180000_add_agent_role_enum_value.sql). 'landlord' is a deprecated
// legacy value kept for existing rows — the app only ever assigns 'agent'.
export type UserRole = "user" | "landlord" | "admin" | "agent";
