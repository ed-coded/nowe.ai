import { createClient } from "@/utils/supabase/client";

/**
 * Real Supabase Storage bucket `property-media` (see
 * 20260707100300_harden_property_media_storage_security.sql) — private
 * bucket, write access folder-scoped to the owning agent via RLS
 * (`{owner_id}/{propertyId}/...`). Runs client-side since it needs a real
 * browser File object.
 *
 * The bucket is private, so there's no permanent public URL to store —
 * `property_media.file_url` holds the raw storage path, and every read
 * mints a fresh signed URL at request time (see propertyMediaUrl.ts).
 */

const BUCKET = "property-media";

export interface UploadedPropertyImage {
  storagePath: string;
}

export async function uploadPropertyImage(propertyId: string, file: File): Promise<UploadedPropertyImage> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const storagePath = `${user.id}/${propertyId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw new Error("Failed to upload image");

  const { error: insertError } = await supabase.from("property_media").insert({
    property_id: propertyId,
    file_url: storagePath,
    media_type: "image",
    sort_order: 0,
  });
  if (insertError) throw new Error("Failed to save image reference");

  return { storagePath };
}
