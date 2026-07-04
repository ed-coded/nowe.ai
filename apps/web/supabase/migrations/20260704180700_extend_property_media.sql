-- Generalized to support video, floor plans, and documents in addition to
-- images. Non-destructive: existing rows default to media_type = 'image'.

alter table property_images rename to property_media;
alter table property_media rename column image_url to file_url;
alter table property_media
  add column media_type text not null default 'image'
  check (media_type in ('image', 'video', 'floor_plan', 'document'));

alter table property_media rename constraint property_images_pkey to property_media_pkey;
alter table property_media rename constraint property_images_property_id_fkey to property_media_property_id_fkey;

alter index property_images_property_id_idx rename to property_media_property_id_idx;

alter policy "Anyone can view images of published properties" on property_media
  rename to "Anyone can view media of published properties";
alter policy "Owners can manage images of their own listings" on property_media
  rename to "Owners can manage media of their own listings";
