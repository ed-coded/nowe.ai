import { Users, ShieldCheck, Flag, Megaphone } from "lucide-react";
import { requireAdminAccess } from "@/services/auth/requireAdminAccess";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const EMPTY_STATES = [
  {
    icon: Users,
    title: "Users & Agents",
    description: "User and agent management tools are coming soon.",
  },
  {
    icon: ShieldCheck,
    title: "Verification Requests",
    description: "Pending agent verification requests will appear here for review.",
  },
  {
    icon: Flag,
    title: "Reports",
    description: "Abuse and moderation reports will show up here.",
  },
  {
    icon: Megaphone,
    title: "Announcements",
    description: "Platform-wide announcements will be managed here.",
  },
];

// Placeholder shell only — proves the RBAC/passphrase gate end-to-end.
// The real admin dashboard (moderation, analytics, system settings) is
// built in a later phase.
export default async function NoweAdminPage() {
  const { user, role } = await requireAdminAccess();

  return (
    <DashboardShell
      role={role}
      email={user.email ?? ""}
      title="Admin Portal"
      clearAdminGateOnSignOut
    >
      <div className="grid sm:grid-cols-2 gap-6">
        {EMPTY_STATES.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <div className="w-9 h-9 rounded-lg bg-[var(--surface)] flex items-center justify-center mb-2">
                <Icon size={16} className="text-[var(--accent)]" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[var(--text-faint)]">Nothing here yet.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
