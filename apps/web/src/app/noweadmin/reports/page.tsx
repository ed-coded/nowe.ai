import { requireAdminAccess } from "@/services/auth/requireAdminAccess";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { listReports } from "@/services/admin/reportService";
import { ReportsList } from "@/features/admin/ReportsList";

export default async function AdminReportsPage() {
  const { user, role } = await requireAdminAccess();
  const reports = await listReports();

  return (
    <DashboardShell role={role} email={user.email ?? ""} title="Reports">
      <ReportsList reports={reports} />
    </DashboardShell>
  );
}
