import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { brand } from "@/lib/branding";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/services/auth/signOutAction";
import type { UserRole } from "@/types/auth";

const ROLE_LABEL: Record<UserRole, string> = {
  user: "Renter",
  agent: "Agent",
  admin: "Admin",
  landlord: "Agent",
};

interface DashboardShellProps {
  role: UserRole;
  email: string;
  title: string;
  /** Set for the admin dashboard so sign-out also clears the passphrase gate. */
  clearAdminGateOnSignOut?: boolean;
  children: React.ReactNode;
}

export function DashboardShell({
  role,
  email,
  title,
  clearAdminGateOnSignOut,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)]">
        <div className="container-home flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group focus-ring">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden">
              <Image
                src={brand.logo.icon}
                alt={brand.logo.alt}
                width={32}
                height={32}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <span className="font-semibold text-[var(--text-primary)] text-lg tracking-tight">
              {brand.name}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Badge variant="secondary">{ROLE_LABEL[role]}</Badge>
            <span className="hidden sm:inline text-sm text-[var(--text-muted)]">
              {email}
            </span>
            <form action={signOutAction}>
              {clearAdminGateOnSignOut && (
                <input type="hidden" name="clearAdminGate" value="true" />
              )}
              <button
                type="submit"
                className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-2 rounded-lg hover:bg-[var(--surface)] transition-colors focus-ring"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container-home py-10">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}
