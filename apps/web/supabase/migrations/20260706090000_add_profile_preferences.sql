-- User-editable preferences for the renter dashboard (Profile + Settings
-- pages): preferred locations/budget/property types, notification and
-- privacy toggles. A single jsonb column, mirroring the existing
-- saved_searches.filters precedent for genuinely semi-structured,
-- self-editable data — not subject to the profiles.role hardening trigger,
-- since users should be free to update their own preferences.

alter table profiles add column preferences jsonb;
