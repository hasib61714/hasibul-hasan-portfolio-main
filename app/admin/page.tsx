import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { ProfileUpload } from "@/components/admin/ProfileUpload";
import { createClient } from "@/lib/supabase/server";
import { FolderKanban, Wrench, Award, MessageSquare, Briefcase, FileText, Plus, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardStats() {
  const supabase = await createClient();

  const [projects, skills, certs, messages, hireReqs, docs] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase.from("certificates").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id, is_read, name, email, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("hire_requests").select("id, status, name, project_type, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("documents").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return {
    projectCount:  projects.count  ?? 0,
    skillCount:    skills.count    ?? 0,
    certCount:     certs.count     ?? 0,
    docCount:      docs.count      ?? 0,
    recentMessages: messages.data  ?? [],
    recentHires:   hireReqs.data   ?? [],
    unreadMessages: (messages.data ?? []).filter((m: { is_read: boolean }) => !m.is_read).length,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const STAT_CARDS = [
    { title: "Total Projects",     value: stats.projectCount,  icon: FolderKanban, color: "from-brand-500 to-brand-600"    },
    { title: "Skills",             value: stats.skillCount,    icon: Wrench,       color: "from-purple-500 to-violet-600"  },
    { title: "Certificates",       value: stats.certCount,     icon: Award,        color: "from-green-500 to-emerald-600"  },
    { title: "Active Documents",   value: stats.docCount,      icon: FileText,     color: "from-orange-500 to-amber-500"   },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "from-cyan-500 to-blue-600",
      change: stats.unreadMessages > 0 ? `${stats.unreadMessages} need attention` : "All caught up!",
      trend: stats.unreadMessages > 0 ? "up" as const : "neutral" as const,
    },
    {
      title: "Pending Hire Requests",
      value: stats.recentHires.filter((h: { status: string }) => h.status === "pending").length,
      icon: Briefcase,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your portfolio."
      />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CARDS.map((card) => (
            <StatsCard key={card.title} {...card} />
          ))}
        </div>

        <ProfileUpload />

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Add Project",     href: "/admin/projects",     icon: FolderKanban, color: "from-brand-500 to-brand-600"   },
              { label: "Add Skill",       href: "/admin/skills",       icon: Wrench,       color: "from-purple-500 to-violet-600" },
              { label: "Add Certificate", href: "/admin/certificates", icon: Award,        color: "from-green-500 to-emerald-600" },
              { label: "Upload Document", href: "/admin/documents",    icon: FileText,     color: "from-orange-500 to-amber-500"  },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="card-premium rounded-2xl p-4 flex flex-col items-center gap-2.5 text-center group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Plus className="w-3 h-3" />{label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent messages */}
          <div className="card-premium rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Recent Messages</h2>
                {stats.unreadMessages > 0 && (
                  <p className="text-xs text-brand-500 font-medium">{stats.unreadMessages} unread</p>
                )}
              </div>
              <Link href="/admin/messages" className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-1">
              {stats.recentMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No messages yet</p>
                </div>
              ) : (
                stats.recentMessages.map((msg: { id: string; name: string; email: string; is_read: boolean; created_at: string }) => (
                  <Link
                    key={msg.id}
                    href="/admin/messages"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{msg.name}</p>
                        {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{msg.email}</p>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{formatDate(msg.created_at)}</p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent hire requests */}
          <div className="card-premium rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Hire Requests</h2>
                {stats.recentHires.filter((h: { status: string }) => h.status === "pending").length > 0 && (
                  <p className="text-xs text-amber-500 font-medium">
                    {stats.recentHires.filter((h: { status: string }) => h.status === "pending").length} pending
                  </p>
                )}
              </div>
              <Link href="/admin/hire-requests" className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-1">
              {stats.recentHires.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No hire requests yet</p>
                </div>
              ) : (
                stats.recentHires.map((req: { id: string; name: string; project_type: string; status: string; created_at: string }) => (
                  <Link
                    key={req.id}
                    href="/admin/hire-requests"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {req.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{req.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{req.project_type}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-bold flex-shrink-0 ${
                      req.status === "pending"   ? "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400"  :
                      req.status === "accepted"  ? "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400"  :
                      req.status === "rejected"  ? "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400"    :
                                                    "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400"
                    }`}>
                      {req.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
