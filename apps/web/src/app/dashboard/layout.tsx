import { requireRole } from "@/services/auth/requireRole";
import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";

// Gates the entire /dashboard/* route group in one place, replacing the
// per-page requireRole() calls from the Phase 4 shell.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["user"], { unauthenticatedRedirect: "/signin" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">
        <DashboardTopBar userEmail={user?.email ?? ""} />
        <div className="container-home py-6 md:py-10 max-w-5xl flex-1 w-full">{children}</div>
      </div>
      <MobileNav />
    </div>
  );
}
