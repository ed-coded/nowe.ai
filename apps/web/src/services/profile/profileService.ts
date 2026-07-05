import { createClient } from "@/utils/supabase/client";

/**
 * Reads/writes `profiles` directly (full_name, phone) plus the new
 * `preferences` jsonb column — shared by the Profile page (preferred
 * locations/budget/property types) and Settings page (notification/privacy
 * toggles). Not subject to the profiles.role hardening trigger, since it
 * never touches `role`.
 */

export interface ProfilePreferences {
  preferredLocations: string[];
  budgetMin: number | null;
  budgetMax: number | null;
  propertyTypes: string[];
  notifyRecommendations: boolean;
  notifyInspectionUpdates: boolean;
  notifyMessages: boolean;
  showProfileToAgents: boolean;
}

export const DEFAULT_PREFERENCES: ProfilePreferences = {
  preferredLocations: [],
  budgetMin: null,
  budgetMax: null,
  propertyTypes: [],
  notifyRecommendations: true,
  notifyInspectionUpdates: true,
  notifyMessages: true,
  showProfileToAgents: true,
};

export interface ProfileRecord {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  preferences: ProfilePreferences;
}

export async function fetchProfile(): Promise<ProfileRecord | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, preferences")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    phone: data.phone,
    preferences: { ...DEFAULT_PREFERENCES, ...(data.preferences as Partial<ProfilePreferences> | null) },
  };
}

export async function updateProfileDetails(updates: { fullName: string; phone: string }): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: updates.fullName, phone: updates.phone })
    .eq("id", user.id);

  if (error) throw new Error("Failed to update profile");
}

export async function updatePreferences(preferences: ProfilePreferences): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("profiles").update({ preferences }).eq("id", user.id);
  if (error) throw new Error("Failed to update preferences");
}
