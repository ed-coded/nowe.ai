import { createClient } from "@/utils/supabase/server";

/**
 * `property-media` is a private bucket (20260707100300) — `property_media.file_url`
 * stores the raw storage object path, not a displayable URL. Every read has
 * to mint a fresh signed URL at request time; this batches that into one
 * Storage API call per page load instead of one per image.
 */

const BUCKET = "property-media";
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60; // 1 hour — regenerated on every request anyway

export async function getSignedMediaUrls(paths: string[]): Promise<Map<string, string>> {
  const uniquePaths = [...new Set(paths)];
  if (uniquePaths.length === 0) return new Map();

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(uniquePaths, SIGNED_URL_EXPIRY_SECONDS);
  if (error || !data) return new Map();

  const map = new Map<string, string>();
  for (const item of data) {
    if (item.path && item.signedUrl && !item.error) map.set(item.path, item.signedUrl);
  }
  return map;
}
