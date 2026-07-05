import { Home, MessageSquare, Users, CalendarClock } from "lucide-react";
import { requireRole } from "@/services/auth/requireRole";
import { createClient } from "@/utils/supabase/server";
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
    icon: Home,
    title: "Active Listings",
    description: "Property and unit management tools are coming soon — you'll be able to create, edit, and track listings here.",
  },
  {
    icon: Users,
    title: "Leads",
    description: "Inquiries and leads from renters will appear here, organized by stage.",
  },
  {
    icon: CalendarClock,
    title: "Scheduled Inspections",
    description: "Upcoming property viewings you've confirmed will show up here.",
  },
  {
    icon: MessageSquare,
    title: "Messages",
    description: "Conversations with renters interested in your listings will appear here.",
  },
];

export default async function AgentDashboardPage() {
  const role = await requireRole(["agent"], {
    unauthenticatedRedirect: "/agent/signin",
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DashboardShell role={role} email={user?.email ?? ""} title="Agent Dashboard">
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
