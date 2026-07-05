"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Bell, Share2, Settings, Pencil, Check, X, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useActiveChatStore } from "@/store/activeChatStore";
import { useConversationMetaStore } from "@/store/conversationMetaStore";
import { useUiStore } from "@/store/uiStore";
import { signOutAction } from "@/services/auth/signOutAction";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard/history": "Search History",
  "/dashboard/saved": "Saved Properties",
  "/dashboard/inspections": "Inspection Requests",
  "/dashboard/messages": "Messages",
  "/dashboard/notifications": "Notifications",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

export function DashboardTopBar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const chatId = useActiveChatStore((s) => s.chatId);
  const activeTitle = useActiveChatStore((s) => s.title);
  const setActiveChat = useActiveChatStore((s) => s.setActiveChat);
  const rename = useConversationMetaStore((s) => s.rename);
  const customTitle = useConversationMetaStore((s) => (chatId ? s.meta[chatId]?.customTitle : null));
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  const isHome = pathname === "/dashboard";
  const displayTitle = isHome
    ? customTitle ?? activeTitle ?? "New Search"
    : (PAGE_TITLES[pathname] ??
      (pathname.startsWith("/dashboard/properties/") ? "Property Details" : "Dashboard"));

  const canEditTitle = isHome && chatId !== null;

  const startEditing = () => {
    setDraftTitle(displayTitle);
    setEditing(true);
  };

  const commitEdit = () => {
    if (chatId && draftTitle.trim()) {
      rename(chatId, draftTitle.trim());
      setActiveChat(chatId, draftTitle.trim());
    }
    setEditing(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: displayTitle, url });
      } catch {
        // user cancelled the native share sheet — no-op
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
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

        <div className="flex items-center gap-2 min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-1.5 min-w-0 w-full">
              <input
                autoFocus
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                  if (e.key === "Escape") setEditing(false);
                }}
                onBlur={commitEdit}
                className="bg-[var(--surface)] border border-[var(--accent)] rounded-lg px-2.5 py-1 text-sm text-[var(--text-primary)] outline-none min-w-0 flex-1 max-w-xs"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={commitEdit}
                aria-label="Save title"
                className="text-[var(--success)] p-1 rounded hover:bg-[var(--surface)] focus-ring flex-shrink-0"
              >
                <Check size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setEditing(false)}
                aria-label="Cancel"
                className="text-[var(--text-muted)] p-1 rounded hover:bg-[var(--surface)] focus-ring flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={canEditTitle ? startEditing : undefined}
              className={`group flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)] min-w-0 ${
                canEditTitle ? "cursor-text" : "cursor-default"
              }`}
            >
              <span className="truncate">{displayTitle}</span>
              {canEditTitle && (
                <Pencil
                  size={12}
                  className="text-[var(--text-faint)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring"
          >
            <Share2 size={16} />
          </button>

          <Link
            href="/dashboard/notifications"
            aria-label="Notifications"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring"
          >
            <Bell size={16} />
          </Link>

          <Link
            href="/dashboard/settings"
            aria-label="Settings"
            className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring"
          >
            <Settings size={16} />
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
                <Link href="/dashboard/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="w-full">
                  Settings
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
