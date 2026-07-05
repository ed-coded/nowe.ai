-- Phase 5: Property Management & Real Listings.
-- Additive-only — every new column is nullable or has a safe default, so
-- existing rows (there are none yet; Property CRUD didn't exist before this
-- phase) and existing queries are unaffected.
--
-- These fields close the gap between the real `properties` schema and the
-- MockProperty shape the renter-facing AI search/UI already expects
-- (services/ai/mockProperties.ts), so propertySearchService can swap its
-- mock implementation for a real one with no UI changes.

alter table properties
  add column neighborhood text,
  add column currency text not null default 'GHS',
  add column price_unit text not null default 'month' check (price_unit in ('month', 'year')),
  add column area numeric,
  add column amenities text[] not null default '{}',
  add column is_furnished boolean not null default false,
  add column is_verified boolean not null default false,
  add column safety_score integer check (safety_score is null or (safety_score between 0 and 100)),
  add column avg_commute_minutes integer check (avg_commute_minutes is null or avg_commute_minutes >= 0);

create index properties_neighborhood_idx on properties (neighborhood);
