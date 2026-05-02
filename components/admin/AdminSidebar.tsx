"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Wrench,
  FileText,
  MessageSquare,
  Briefcase,
  LogOut,
  Menu,
  X,
  Code2,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { label: "Dashboard",     href: "/admin",               icon: LayoutDashboard, badgeKey: null        },
  { label: "Projects",      href: "/admin/projects",      icon: FolderKanban,    badgeKey: null        },
  { label: "Skills",        href: "/admin/skills",        icon: Wrench,          badgeKey: null        },
  { label: "Certificates",  href: "/admin/certificates",  icon: Award,           badgeKey: null        },
  { label: "Documents",     href: "/admin/documents",     icon: FileText,        badgeKey: null        },
  { label: "Messages",      href: "/admin/messages",      icon: MessageSquare,   badgeKey: "messages"  },
  { label: "Hire Requests", href: "/admin/hire-requests", icon: Briefcase,       badgeKey: "hires"     },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);
  const [badges, setBadges] = useState({ messages: 0, hires: 0 });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
    Promise.all([
      supabase.from("contacts").select("id", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("hire_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]).then(([msgs, hires]) => {
      setBadges({ messages: msgs.count ?? 0, hires: hires.count ?? 0 });
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/auth/login");
    router.refresh();
  };

  const initials   = email ? email.slice(0, 2).toUpperCase() : "AD";
  const shortEmail = email.length > 24 ? email.slice(0, 24) + "…" : email;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/25">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-extrabold text-sm text-gray-900 dark:text-white">Portfolio CMS</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Content Manager</p>
        </div>
      </div>

      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-3" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon, badgeKey }) => {
          const isActive    = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          const badgeCount  = badgeKey ? badges[badgeKey as keyof typeof badges] : 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 group",
                isActive
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={cn(
                "w-4 h-4 flex-shrink-0 relative z-10",
                isActive ? "text-white" : "group-hover:text-brand-500 transition-colors"
              )} />
              <span className="flex-1 relative z-10">{label}</span>
              {badgeCount > 0 && (
                <span className={cn(
                  "relative z-10 min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center",
                  isActive ? "bg-white/25 text-white" : "bg-brand-500 text-white shadow-sm"
                )}>
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mt-3 mb-3" />

      {/* Bottom links */}
      <div className="px-3 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ExternalLink className="w-4 h-4 group-hover:text-brand-500 transition-colors" />
          <span>View Portfolio</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User chip */}
      <div className="mx-3 mb-4 mt-3 p-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/40 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{shortEmail || "Admin"}</p>
          <p className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Online
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0 flex-col bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-800/80">
        {SidebarContent()}
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        title="Open menu"
        className="lg:hidden fixed bottom-6 left-6 z-50 p-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-xl shadow-brand-500/30"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl overflow-y-auto"
            >
              <button
                onClick={() => setOpen(false)}
                title="Close menu"
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {SidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
