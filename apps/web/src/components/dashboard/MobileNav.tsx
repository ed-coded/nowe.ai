"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Heart,
  MessageSquare,
  User,
  Menu,
  CalendarClock,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/branding";
import { useUiStore } from "@/store/uiStore";
import { signOutAction } from "@/services/auth/signOutAction";
import { ConversationList } from "./ConversationList";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const BOTTOM_NAV_ITEMS = [
  { label: "Search", href: "/dashboard", icon: Sparkles },
  { label: "Saved", href: "/dashboard/saved", icon: Heart },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const SECONDARY_NAV_ITEMS = [
  { label: "Saved Properties", href: "/dashboard/saved", icon: Heart },
  { label: "Inspection Requests", href: "/dashboard/inspections", icon: CalendarClock },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const open = useUiStore((s) => s.mobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch justify-between px-2">
          {BOTTOM_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
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
            <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <Image src={brand.logo.icon} alt={brand.logo.alt} width={32} height={32} className="w-full h-full object-contain p-0.5" />
              </div>
              <SheetTitle className="text-[var(--text-primary)]">{brand.name}</SheetTitle>
            </Link>
          </SheetHeader>

          <div className="px-3 pt-3">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors focus-ring"
            >
              <Sparkles size={16} />
              New Search
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-3">
            <ConversationList onNavigate={() => setOpen(false)} />
          </div>

          <nav className="px-3 py-2 border-t border-[var(--border)] space-y-1 flex-shrink-0">
            {SECONDARY_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors focus-ring",
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
