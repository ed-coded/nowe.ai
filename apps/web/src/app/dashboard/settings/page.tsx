"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Moon, Globe, Bell, Lock } from "lucide-react";
import {
  fetchProfile,
  updatePreferences,
  DEFAULT_PREFERENCES,
  type ProfilePreferences,
} from "@/services/profile/profileService";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-[var(--text-faint)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 focus-ring ${
          checked ? "bg-[var(--accent)]" : "bg-[var(--surface)] border border-[var(--border)]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const [prefs, setPrefs] = useState<ProfilePreferences>(DEFAULT_PREFERENCES);
  const [syncedProfileId, setSyncedProfileId] = useState<string | null>(null);

  // Same render-time sync pattern as the Profile page — see
  // HeroSection.tsx for the full rationale.
  if (profile && profile.id !== syncedProfileId) {
    setSyncedProfileId(profile.id);
    setPrefs(profile.preferences);
  }

  const save = useMutation({
    mutationFn: (next: ProfilePreferences) => updatePreferences(next),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Couldn't save settings"),
  });

  const update = (patch: Partial<ProfilePreferences>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    save.mutate(next);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Settings</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Appearance, notifications, and privacy.</p>

      <div className="glass rounded-2xl border border-[var(--border)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon size={15} className="text-[var(--accent)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Appearance</h2>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          nowe.ai currently uses a single dark theme by design — a light mode is not yet available.
        </p>
      </div>

      <div className="glass rounded-2xl border border-[var(--border)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={15} className="text-[var(--accent)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Language</h2>
        </div>
        <select
          disabled
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-faint)] outline-none cursor-not-allowed"
        >
          <option>English (Ghana)</option>
        </select>
        <p className="text-xs text-[var(--text-faint)] mt-2">More languages coming soon.</p>
      </div>

      <div className="glass rounded-2xl border border-[var(--border)] p-6 mb-6 divide-y divide-[var(--border-subtle)]">
        <div className="flex items-center gap-2 pb-3">
          <Bell size={15} className="text-[var(--accent)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Notifications</h2>
        </div>
        <ToggleRow
          label="Personalized recommendations"
          description="New properties that match your saved searches"
          checked={prefs.notifyRecommendations}
          onChange={(checked) => update({ notifyRecommendations: checked })}
        />
        <ToggleRow
          label="Inspection updates"
          description="Status changes on your inspection requests"
          checked={prefs.notifyInspectionUpdates}
          onChange={(checked) => update({ notifyInspectionUpdates: checked })}
        />
        <ToggleRow
          label="Messages"
          description="New messages from the assistant or agents"
          checked={prefs.notifyMessages}
          onChange={(checked) => update({ notifyMessages: checked })}
        />
      </div>

      <div className="glass rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-center gap-2 mb-2">
          <Lock size={15} className="text-[var(--accent)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Privacy</h2>
        </div>
        <ToggleRow
          label="Show my profile to agents"
          description="Let agents see your name when you request an inspection"
          checked={prefs.showProfileToAgents}
          onChange={(checked) => update({ showProfileToAgents: checked })}
        />
      </div>
    </div>
  );
}
