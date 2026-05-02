"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, Trash2, CheckCheck, Search } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { ContactMessage } from "@/types";

export default function AdminMessagesPage() {
  const [messages,  setMessages]  = useState<ContactMessage[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<ContactMessage | null>(null);
  const [search,    setSearch]    = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "read" | "unread">("all");

  const fetchMessages = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) {
      const supabase = createClient();
      await supabase.from("contacts").update({ is_read: true }).eq("id", msg.id);
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const supabase = createClient();
    await supabase.from("contacts").delete().eq("id", id);
    toast.success("Message deleted");
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  };

  const markAllRead = async () => {
    const supabase = createClient();
    await supabase.from("contacts").update({ is_read: true }).eq("is_read", false);
    toast.success("All marked as read");
    fetchMessages();
  };

  const filtered = messages
    .filter((m) => filterRead === "all" ? true : filterRead === "read" ? m.is_read : !m.is_read)
    .filter((m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
    );

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <>
      <AdminHeader title="Messages" subtitle={`${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`} />

      <main className="flex-1 p-6 flex gap-5 min-h-0">
        {/* List */}
        <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-3">
          {/* Toolbar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
            <button onClick={markAllRead} title="Mark all as read" className="p-2.5 rounded-xl card-premium hover:text-brand-500 transition-colors">
              <CheckCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 p-1 card-premium rounded-xl">
            {(["all", "unread", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterRead(f)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterRead === f
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
              </button>
            ))}
          </div>

          {/* Message list */}
          <div className="flex-1 space-y-1.5 overflow-y-auto">
            {loading ? (
              <LoadingSpinner size="sm" className="py-8" />
            ) : filtered.length === 0 ? (
              <EmptyState icon={Mail} title="No messages found" className="py-10" />
            ) : (
              filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 border-l-2 ${
                    selected?.id === msg.id
                      ? "bg-brand-50 dark:bg-brand-950/40 border-l-brand-500 shadow-sm"
                      : !msg.is_read
                      ? "card-premium border-l-brand-300 dark:border-l-brand-700 hover:border-l-brand-500"
                      : "card-premium border-l-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm font-semibold truncate ${!msg.is_read ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                      {msg.name}
                    </p>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mb-0.5">{msg.email}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{msg.message}</p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-1.5">{formatDate(msg.created_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 hidden lg:flex">
          {selected ? (
            <div className="w-full card-premium rounded-2xl p-7">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-brand-500 hover:text-brand-600 transition-colors">
                    {selected.email}
                  </a>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(selected.created_at)}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge variant={selected.is_read ? "success" : "primary"}>
                    {selected.is_read ? "Read" : "Unread"}
                  </Badge>
                  <button onClick={() => deleteMessage(selected.id)} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selected.subject && (
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                  Subject: {selected.subject}
                </p>
              )}

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {selected.message}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-800">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your message"}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold transition-all shadow-md shadow-brand-500/20"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center card-premium rounded-2xl">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
