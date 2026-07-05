"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { setUserRole, type AdminProfileRecord } from "@/services/admin/adminUserService";

const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  agent: "secondary",
  user: "outline",
  landlord: "outline",
};

export function UsersAgentsList({ profiles }: { profiles: AdminProfileRecord[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = profiles.filter((p) =>
    query.trim()
      ? p.email.toLowerCase().includes(query.trim().toLowerCase()) ||
        (p.fullName ?? "").toLowerCase().includes(query.trim().toLowerCase())
      : true
  );

  const handleRoleChange = (id: string, role: "user" | "agent") => {
    startTransition(async () => {
      try {
        await setUserRole(id, role);
        router.refresh();
        toast.success(`Role updated to ${role}`);
      } catch {
        toast.error("Couldn't update role");
      }
    });
  };

  return (
    <div>
      <div className="relative max-w-sm mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
          <Users size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No users match your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {profile.fullName ?? "Unnamed"}
                  </p>
                  <Badge variant={ROLE_VARIANT[profile.role]} className="capitalize flex-shrink-0">
                    {profile.role}
                  </Badge>
                  {profile.agentType && (
                    <span className="text-[10px] text-[var(--text-faint)] capitalize flex-shrink-0">
                      {profile.agentType.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-faint)] truncate">{profile.email}</p>
              </div>

              {profile.role !== "admin" && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {profile.role !== "user" && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRoleChange(profile.id, "user")}
                      className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-60 border border-[var(--border)] px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Set as User
                    </button>
                  )}
                  {profile.role !== "agent" && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRoleChange(profile.id, "agent")}
                      className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-60 border border-[var(--border)] px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Set as Agent
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
