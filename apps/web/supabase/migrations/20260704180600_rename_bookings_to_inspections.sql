-- Renamed per the product's actual terminology (inspection requests, not
-- generic "bookings"). Non-destructive: preserves all data, constraints,
-- and RLS policies. Nothing in the codebase references the old name yet.

alter table bookings rename to inspections;

alter table inspections rename constraint bookings_pkey to inspections_pkey;
alter table inspections rename constraint bookings_user_id_fkey to inspections_user_id_fkey;
alter table inspections rename constraint bookings_property_id_fkey to inspections_property_id_fkey;

alter index bookings_user_id_idx rename to inspections_user_id_idx;
alter index bookings_property_id_idx rename to inspections_property_id_idx;

alter policy "Users can view their own bookings" on inspections
  rename to "Users can view their own inspections";
alter policy "Users can create their own bookings" on inspections
  rename to "Users can create their own inspections";
alter policy "Users or property owners can update booking status" on inspections
  rename to "Users or property owners can update inspection status";
