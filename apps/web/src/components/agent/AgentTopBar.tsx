"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Bell, Menu, Plus, ListChecks, Users, CalendarDays } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUiStore } from "@/store/uiStore";
import { fetchNotifications } from "@/services/notifications/notificationService";
import { signOutAction } from "@/services/auth/signOutAction";

export function AgentTopBar({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const [query, setQuery] = useState("");

  const { data: notifications = [] } = useQuery({
    queryKey: ["agent-notifications"],
    queryFn: fetchNotifications,
  });
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/agent/dashboard/customers?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-[var(--border)]">
      <div className="flex items-center justify-between gap-3 h-14 px-4 md:px-6">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring flex-shrink-0"
        >
          <Menu size={17} />
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-sm min-w-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers, leads..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Quick actions"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-3 py-1.5 rounded-lg transition-colors focus-ring"
            >
              <Plus size={14} />
              Quick actions
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[var(--card)] border border-[var(--border)] min-w-48">
              <DropdownMenuItem>
                <Link href="/agent/dashboard/leads" className="flex items-center gap-2 w-full">
                  <Users size={14} /> View Leads
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/agent/dashboard/tasks" className="flex items-center gap-2 w-full">
                  <ListChecks size={14} /> View Tasks
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/agent/dashboard/calendar" className="flex items-center gap-2 w-full">
                  <CalendarDays size={14} /> View Calendar
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/agent/dashboard/notifications"
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent)]" />
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 rounded-full focus-ring">
              <Avatar>
                <AvatarFallback className="bg-[var(--accent)] text-white text-xs">
                  {userEmail.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[var(--card)] border border-[var(--border)] min-w-48">
              <div className="px-2 py-1.5 text-xs text-[var(--text-faint)] truncate">{userEmail}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/agent/dashboard/verification" className="w-full">
                  Verification
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <form action={signOutAction} className="w-full">
                  <button type="submit" className="w-full text-left">
                    Sign out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
