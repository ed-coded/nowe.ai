-- Production-readiness audit finding (blocker #1): the previous UPDATE
-- policy allowed auth.uid() = user_id (the requesting renter) with no
-- WITH CHECK, so a renter could set their own inspection's status to
-- 'approved'/'completed' directly via the REST API, bypassing the agent
-- approval workflow entirely. There is no legitimate renter-side status
-- change in the current feature set (no cancel action exists), so the
-- renter branch is dropped rather than constrained.

drop policy "Users or property owners can update inspection status" on inspections;

create policy "Property owners can update inspection status"
  on inspections for update
  using (auth.uid() = (select owner_id from properties where properties.id = inspections.property_id))
  with check (auth.uid() = (select owner_id from properties where properties.id = inspections.property_id));
