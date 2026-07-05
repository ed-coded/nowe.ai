"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Mail, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchProfile,
  updateProfileDetails,
  updatePreferences,
  DEFAULT_PREFERENCES,
  type ProfilePreferences,
} from "@/services/profile/profileService";

const PROPERTY_TYPES = ["Apartment", "House", "Studio", "Office"];

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [locations, setLocations] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [syncedProfileId, setSyncedProfileId] = useState<string | null>(null);

  // Sync form state from the fetched profile during render (React's
  // documented pattern for "adjusting state when a prop changes"), not in
  // an effect — see HeroSection.tsx for the same pattern with more detail.
  if (profile && profile.id !== syncedProfileId) {
    setSyncedProfileId(profile.id);
    setFullName(profile.fullName ?? "");
    setPhone(profile.phone ?? "");
    setLocations(profile.preferences.preferredLocations.join(", "));
    setBudgetMin(profile.preferences.budgetMin?.toString() ?? "");
    setBudgetMax(profile.preferences.budgetMax?.toString() ?? "");
    setPropertyTypes(profile.preferences.propertyTypes);
  }

  const saveDetails = useMutation({
    mutationFn: () => updateProfileDetails({ fullName, phone }),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Couldn't update profile"),
  });

  const savePreferences = useMutation({
    mutationFn: () => {
      const preferences: ProfilePreferences = {
        ...DEFAULT_PREFERENCES,
        ...profile?.preferences,
        preferredLocations: locations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        budgetMin: budgetMin ? Number(budgetMin) : null,
        budgetMax: budgetMax ? Number(budgetMax) : null,
        propertyTypes,
      };
      return updatePreferences(preferences);
    },
    onSuccess: () => {
      toast.success("Preferences saved");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Couldn't save preferences"),
  });

  const toggleType = (type: string) => {
    setPropertyTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-xl">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Profile</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        Your personal details and search preferences.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveDetails.mutate();
        }}
        className="glass rounded-2xl border border-[var(--border)] p-6 mb-6 flex flex-col gap-4"
      >
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Personal Details</h2>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Full name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              value={profile?.email ?? ""}
              disabled
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-faint)] outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Phone</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 ..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saveDetails.isPending}
          className="self-start text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
        >
          {saveDetails.isPending ? "Saving..." : "Save Details"}
        </button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          savePreferences.mutate();
        }}
        className="glass rounded-2xl border border-[var(--border)] p-6 flex flex-col gap-4"
      >
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Search Preferences</h2>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
            Preferred locations
          </label>
          <input
            value={locations}
            onChange={(e) => setLocations(e.target.value)}
            placeholder="East Legon, Cantonments, Airport Residential"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Min budget (GHS)</label>
            <input
              type="number"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Max budget (GHS)</label>
            <input
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Property types</label>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  propertyTypes.includes(type)
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={savePreferences.isPending}
          className="self-start text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
        >
          {savePreferences.isPending ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}
