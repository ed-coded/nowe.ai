import { requireAdminAccess } from "@/services/auth/requireAdminAccess";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { listAnnouncements } from "@/services/admin/announcementService";
import { AnnouncementsManager } from "@/features/admin/AnnouncementsManager";

export default async function AdminAnnouncementsPage() {
  const { user, role } = await requireAdminAccess();
  const announcements = await listAnnouncements();

  return (
    <DashboardShell role={role} email={user.email ?? ""} title="Announcements">
      <AnnouncementsManager announcements={announcements} />
    </DashboardShell>
  );
}
