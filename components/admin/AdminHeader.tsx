"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  const [email,   setEmail]   = useState<string>("");
  const [unread,  setUnread]  = useState(0);
  const pathname = usePathname();

  // Fetch user email once on mount — it never changes during navigation
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  // Refresh unread count on every route change
  useEffect(() => {
    createClient()
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .then(({ count }) => setUnread(count ?? 0));
  }, [pathname]);

  const initials = email ? email.slice(0, 2).toUpperCase() : "AD";

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80">
      {/* top accent line */}
      <div className="h-px bg-gradient-to-r from-brand-500/60 via-accent-500/60 to-transparent" />
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Title area */}
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {action && <div>{action}</div>}
          <ThemeToggle />
          <button
            title="Notifications"
            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-extrabold shadow-lg shadow-brand-500/20">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
