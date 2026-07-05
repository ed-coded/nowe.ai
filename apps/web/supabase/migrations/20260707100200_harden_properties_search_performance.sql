-- Corrects 20260707100000: constraints re-applied as NOT VALID + VALIDATE
-- (safe on a populated table — no long-lived exclusive lock), plus indexes
-- matching the real search filters (status + price/neighborhood/bedrooms/
-- verification), partial indexes for safety_score/commute, and a GIN index
-- for amenities containment queries. Idempotent — safe to re-run.
--
-- price_unit stays text + CHECK, not a native enum: converting an existing
-- column's type requires ALTER COLUMN ... TYPE, which rewrites the whole
-- table under an exclusive lock. A CHECK constraint can be validated online
-- (below); a native enum is a separate, deliberate maintenance-window
-- migration if ever needed, not something to bundle here.

alter table properties drop constraint if exists properties_price_unit_check;
alter table properties
  add constraint properties_price_unit_check
  check (price_unit in ('month', 'year')) not valid;
alter table properties validate constraint properties_price_unit_check;

alter table properties drop constraint if exists properties_safety_score_check;
alter table properties
  add constraint properties_safety_score_check
  check (safety_score is null or safety_score between 0 and 100) not valid;
alter table properties validate constraint properties_safety_score_check;

alter table properties drop constraint if exists properties_avg_commute_minutes_check;
alter table properties
  add constraint properties_avg_commute_minutes_check
  check (avg_commute_minutes is null or avg_commute_minutes >= 0) not valid;
alter table properties validate constraint properties_avg_commute_minutes_check;

-- Composite indexes: every real search filters on status='published' first,
-- so status leads each composite rather than maintaining separate
-- single-column indexes that Postgres would have to bitmap-AND together.
create index if not exists properties_status_price_idx on properties (status, price);
create index if not exists properties_status_neighborhood_idx on properties (status, neighborhood);
create index if not exists properties_status_verified_idx on properties (status, is_verified);
create index if not exists properties_status_bedrooms_idx on properties (status, bedrooms);

create index if not exists properties_safety_score_idx
  on properties (safety_score) where safety_score is not null;
create index if not exists properties_avg_commute_minutes_idx
  on properties (avg_commute_minutes) where avg_commute_minutes is not null;

create index if not exists properties_amenities_gin_idx
  on properties using gin (amenities);

-- Superseded by properties_status_neighborhood_idx — every real query
-- includes status, so the single-column version only adds write overhead.
drop index if exists properties_neighborhood_idx;
