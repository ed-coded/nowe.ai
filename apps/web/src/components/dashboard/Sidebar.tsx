"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Heart,
  CalendarClock,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/branding";
import { useUiStore } from "@/store/uiStore";
import { signOutAction } from "@/services/auth/signOutAction";
import { ConversationList } from "./ConversationList";

const SECONDARY_NAV_ITEMS = [
  { label: "Saved Properties", href: "/dashboard/saved", icon: Heart },
  { label: "Inspection Requests", href: "/dashboard/inspections", icon: CalendarClock },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-[var(--border)] flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={brand.logo.icon}
              alt={brand.logo.alt}
              width={32}
              height={32}
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          {!collapsed && (
            <span className="font-semibold text-[var(--text-primary)] text-base tracking-tight truncate">
              {brand.name}
            </span>
          )}
        </Link>
      </div>

      <div className="p-3 flex-shrink-0">
        <Link
          href="/dashboard"
          title={collapsed ? "New Search" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors focus-ring",
            collapsed && "justify-center px-0"
          )}
        >
          <Sparkles size={16} className="flex-shrink-0" />
          {!collapsed && <span>New Search</span>}
        </Link>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-1">
          <ConversationList />
        </div>
      )}
      {collapsed && <div className="flex-1" />}

      <nav className="px-3 py-2 border-t border-[var(--border)] space-y-1 flex-shrink-0">
        {SECONDARY_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors focus-ring",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
              )}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)] space-y-1 flex-shrink-0">
        <Link
          href="/dashboard/profile"
          title={collapsed ? "Profile" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors focus-ring",
            collapsed && "justify-center px-0",
            pathname === "/dashboard/profile"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
          )}
        >
          <User size={17} className="flex-shrink-0" />
          {!collapsed && <span>Profile</span>}
        </Link>
        <Link
          href="/dashboard/settings"
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors focus-ring",
            collapsed && "justify-center px-0",
            pathname === "/dashboard/settings"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
          )}
        >
          <Settings size={17} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
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
