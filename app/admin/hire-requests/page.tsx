"use client";

import { useEffect, useState, useCallback } from "react";
import { Briefcase, Trash2, Eye, DollarSign, Clock } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { HireRequest } from "@/types";

type Status = HireRequest["status"];

const STATUS_OPTIONS: Status[] = ["pending", "reviewing", "accepted", "rejected"];

export default function AdminHireRequestsPage() {
  const [requests,  setRequests]  = useState<HireRequest[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<HireRequest | null>(null);
  const [filter,    setFilter]    = useState<"all" | Status>("all");

  const fetchRequests = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("hire_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const updateStatus = async (id: string, status: Status) => {
    const supabase = createClient();
    const { error } = await supabase.from("hire_requests").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Status updated to ${status}`);
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    fetchRequests();
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this hire request?")) return;
    const supabase = createClient();
    await supabase.from("hire_requests").delete().eq("id", id);
    toast.success("Request deleted");
    if (selected?.id === id) setSelected(null);
    fetchRequests();
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts = STATUS_OPTIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = requests.filter((r) => r.status === s).length;
    return acc;
  }, { all: requests.length });

  return (
    <>
      <AdminHeader title="Hire Requests" subtitle={`${counts.pending ?? 0} pending requests`} />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", ...STATUS_OPTIONS] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filter === s
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25"
                  : "card-premium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
              }`}
            >
              {s} ({counts[s] ?? 0})
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Briefcase} title="No hire requests found" />
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((req) => (
              <div key={req.id} className="card-premium rounded-2xl p-5 flex flex-col gap-3 group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {req.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-gray-900 dark:text-white truncate">{req.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{req.email}</p>
                      {req.company && <p className="text-xs text-brand-500 font-medium">{req.company}</p>}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold flex-shrink-0 ${
                    req.status === "pending"    ? "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400"  :
                    req.status === "accepted"   ? "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400"  :
                    req.status === "rejected"   ? "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400"    :
                                                   "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400"
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                    <span className="truncate">{req.project_type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-3.5 h-3.5 text-green-400" />
                    <span className="truncate">{req.budget}</span>
                  </div>
                  {req.timeline && (
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 col-span-2">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      {req.timeline}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{req.message}</p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/60">
                  <span className="text-xs text-gray-400">{formatDate(req.created_at)}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelected(req)}
                      className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/40 text-gray-400 hover:text-brand-500 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteRequest(req.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Hire Request Details"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Name",         value: selected.name },
                { label: "Email",        value: selected.email },
                { label: "Company",      value: selected.company || "—" },
                { label: "Project Type", value: selected.project_type },
                { label: "Budget",       value: selected.budget },
                { label: "Timeline",     value: selected.timeline || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Message</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
                {selected.message}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                      selected.status === s
                        ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20"
                        : "card-premium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a href={`mailto:${selected.email}`} className="flex-1">
                <Button className="w-full" size="sm">Reply via Email</Button>
              </a>
              <Button variant="danger" size="sm" onClick={() => deleteRequest(selected.id)}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
