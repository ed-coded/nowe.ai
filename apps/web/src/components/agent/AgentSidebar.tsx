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
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/branding";
import { useUiStore } from "@/store/uiStore";
import { signOutAction } from "@/services/auth/signOutAction";
import type { AgentType } from "@/types/auth";

const PRIMARY_NAV_ITEMS = [
  { label: "Home", href: "/agent/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Listings", href: "/agent/dashboard/listings", icon: Building },
  { label: "Leads", href: "/agent/dashboard/leads", icon: Users },
  { label: "Customers", href: "/agent/dashboard/customers", icon: Contact },
  { label: "Messages", href: "/agent/dashboard/messages", icon: MessageSquare },
  { label: "Inspections", href: "/agent/dashboard/inspections", icon: CalendarClock },
  { label: "Calendar", href: "/agent/dashboard/calendar", icon: CalendarDays },
  { label: "Tasks", href: "/agent/dashboard/tasks", icon: ListChecks },
  { label: "Verification", href: "/agent/dashboard/verification", icon: ShieldCheck },
];

const DEVELOPER_NAV_ITEMS = [{ label: "Projects", href: "/agent/dashboard/projects", icon: Building2 }];

const LANDLORD_NAV_ITEMS = [
  { label: "My Properties", href: "/agent/dashboard/properties", icon: Home },
  { label: "Tenants", href: "/agent/dashboard/tenants", icon: Users2 },
  { label: "Rent Collection", href: "/agent/dashboard/rent-collection", icon: Wallet },
];

export function AgentSidebar({ agentType }: { agentType: AgentType | null }) {
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const extraItems =
    agentType === "developer" ? DEVELOPER_NAV_ITEMS : agentType === "landlord" ? LANDLORD_NAV_ITEMS : [];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-[var(--border)] flex-shrink-0">
        <Link href="/agent/dashboard" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image src={brand.logo.icon} alt={brand.logo.alt} width={32} height={32} className="w-full h-full object-contain p-0.5" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-[var(--text-primary)] text-base tracking-tight truncate">
              {brand.name} <span className="text-[var(--text-faint)] font-normal">CRM</span>
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        <div className="space-y-0.5">
          {PRIMARY_NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors focus-ring",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
                )}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </div>

        {extraItems.length > 0 && (
          <div>
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1.5">
                {agentType === "developer" ? "Developer" : "Landlord"}
              </p>
            )}
            <div className="space-y-0.5">
              {extraItems.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors focus-ring",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
                    )}
                  >
                    <Icon size={17} className="flex-shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-[var(--border)] space-y-1 flex-shrink-0">
        <Link
          href="/agent/dashboard/notifications"
          title={collapsed ? "Notifications" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors focus-ring",
            collapsed && "justify-center px-0",
            pathname === "/agent/dashboard/notifications"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
          )}
        >
          <Bell size={17} className="flex-shrink-0" />
          {!collapsed && <span>Notifications</span>}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)] transition-colors focus-ring",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <form action={signOutAction}>
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)] transition-colors focus-ring",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut size={17} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
