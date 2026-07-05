"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building,
  Users,
  Contact,
  MessageSquare,
  CalendarDays,
  CalendarClock,
  ListChecks,
  ShieldCheck,
  Building2,
  Home,
  Users2,
  Wallet,
  Bell,
  Menu,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/branding";
import { useUiStore } from "@/store/uiStore";
import { signOutAction } from "@/services/auth/signOutAction";
import type { AgentType } from "@/types/auth";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const BOTTOM_NAV_ITEMS = [
  { label: "Home", href: "/agent/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Leads", href: "/agent/dashboard/leads", icon: Users },
  { label: "Customers", href: "/agent/dashboard/customers", icon: Contact },
  { label: "Messages", href: "/agent/dashboard/messages", icon: MessageSquare },
];

const SHEET_NAV_ITEMS = [
  { label: "Listings", href: "/agent/dashboard/listings", icon: Building },
  { label: "Inspections", href: "/agent/dashboard/inspections", icon: CalendarClock },
  { label: "Calendar", href: "/agent/dashboard/calendar", icon: CalendarDays },
  { label: "Tasks", href: "/agent/dashboard/tasks", icon: ListChecks },
  { label: "Verification", href: "/agent/dashboard/verification", icon: ShieldCheck },
  { label: "Notifications", href: "/agent/dashboard/notifications", icon: Bell },
];

const DEVELOPER_NAV_ITEMS = [{ label: "Projects", href: "/agent/dashboard/projects", icon: Building2 }];

const LANDLORD_NAV_ITEMS = [
  { label: "My Properties", href: "/agent/dashboard/properties", icon: Home },
  { label: "Tenants", href: "/agent/dashboard/tenants", icon: Users2 },
  { label: "Rent Collection", href: "/agent/dashboard/rent-collection", icon: Wallet },
];

export function AgentMobileNav({ agentType }: { agentType: AgentType | null }) {
  const pathname = usePathname();
  const open = useUiStore((s) => s.mobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);

  const extraItems =
    agentType === "developer" ? DEVELOPER_NAV_ITEMS : agentType === "landlord" ? LANDLORD_NAV_ITEMS : [];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch justify-between px-2">
          {BOTTOM_NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors focus-ring",
                  isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                )}
              >
                <Icon size={19} />
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] text-[var(--text-muted)] focus-ring"
          >
            <Menu size={19} />
            More
          </button>
        </div>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-[var(--surface)] border-[var(--border)] flex flex-col p-0">
          <SheetHeader className="p-4 border-b border-[var(--border)]">
            <Link href="/agent/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <Image src={brand.logo.icon} alt={brand.logo.alt} width={32} height={32} className="w-full h-full object-contain p-0.5" />
              </div>
              <SheetTitle className="text-[var(--text-primary)]">
                {brand.name} <span className="text-[var(--text-faint)] font-normal">CRM</span>
              </SheetTitle>
            </Link>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            <div className="space-y-1">
              {SHEET_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors focus-ring",
                      isActive
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
                    )}
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                );
              })}
            </div>

            {extraItems.length > 0 && (
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1.5">
                  {agentType === "developer" ? "Developer" : "Landlord"}
                </p>
                <div className="space-y-1">
                  {extraItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors focus-ring",
                          isActive
                            ? "bg-[var(--accent)] text-white"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
                        )}
                      >
                        <Icon size={17} />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          <div className="p-3 border-t border-[var(--border)] flex-shrink-0">
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)] transition-colors focus-ring"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
