import Link from "next/link";
import { Users, ShieldCheck, Flag, Megaphone } from "lucide-react";
import { requireAdminAccess } from "@/services/auth/requireAdminAccess";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { listPendingVerificationRequests } from "@/services/verification/verificationService";
import { listAllProfiles } from "@/services/admin/adminUserService";
import { listReports } from "@/services/admin/reportService";
import { listAnnouncements } from "@/services/admin/announcementService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Every card here is now real: Users & Agents, Verification, Reports, and
// Announcements all read/write the live schema (Phase 2) — this proves the
// RBAC/passphrase gate end-to-end AND is the actual admin portal, not a
// placeholder shell.
export default async function NoweAdminPage() {
  const { user, role } = await requireAdminAccess();
  const [profiles, pendingVerification, reports, announcements] = await Promise.all([
    listAllProfiles(),
    listPendingVerificationRequests(),
    listReports(),
    listAnnouncements(),
  ]);

  const openReports = reports.filter((r) => r.status === "open" || r.status === "reviewing").length;
  const publishedAnnouncements = announcements.filter((a) => a.publishedAt).length;

  const cards = [
    {
      href: "/noweadmin/users",
      icon: Users,
      title: "Users & Agents",
      description: "View every account and manage renter/agent roles.",
      stat: `${profiles.length} total accounts`,
    },
    {
      href: "/noweadmin/verification",
      icon: ShieldCheck,
      title: "Verification Requests",
      description: "Review and approve pending agent verification requests.",
      stat: pendingVerification.length === 0 ? "Nothing pending" : `${pendingVerification.length} pending review`,
    },
    {
      href: "/noweadmin/reports",
      icon: Flag,
      title: "Reports",
      description: "Abuse and moderation reports needing action.",
      stat: openReports === 0 ? "Nothing open" : `${openReports} open`,
    },
    {
      href: "/noweadmin/announcements",
      icon: Megaphone,
      title: "Announcements",
      description: "Create and publish platform-wide announcements.",
      stat: `${publishedAnnouncements} published, ${announcements.length - publishedAnnouncements} draft`,
    },
  ];

  return (
    <DashboardShell
      role={role}
      email={user.email ?? ""}
      title="Admin Portal"
      clearAdminGateOnSignOut
    >
      <div className="grid sm:grid-cols-2 gap-6">
        {cards.map(({ href, icon: Icon, title, description, stat }) => (
          <Link key={href} href={href}>
            <Card className="hover:border-[var(--accent)] transition-colors h-full">
              <CardHeader>
                <div className="w-9 h-9 rounded-lg bg-[var(--surface)] flex items-center justify-center mb-2">
                  <Icon size={16} className="text-[var(--accent)]" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[var(--accent)] font-medium">{stat}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
