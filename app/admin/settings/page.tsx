"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openToWork, setOpenToWork] = useState(true);
  const [availability, setAvailability] = useState("");
  const [booking, setBooking] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    createClient()
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load settings: " + error.message);
        if (data) {
          setOpenToWork(data.open_to_work ?? true);
          setAvailability(data.availability_text ?? "");
          setBooking(data.booking_url ?? "");
        }
        setLoading(false);
      });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = booking.trim();
    if (url && !/^https:\/\/\S+$/i.test(url)) {
      setBookingError("Must be a valid https:// link");
      return;
    }
    setBookingError("");
    setSaving(true);
    const { error } = await createClient()
      .from("site_settings")
      .upsert({ id: 1, open_to_work: openToWork, availability_text: availability.trim() || null, booking_url: url || null });
    setSaving(false);
    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Settings saved — the site updates within a minute");
  };

  return (
    <>
      <AdminHeader title="Site settings" subtitle="Availability badge and booking link" />
      <main className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={save} className="card-premium max-w-2xl space-y-6 rounded-2xl p-6">
            <label className="relative z-10 flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={openToWork} onChange={(e) => setOpenToWork(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-500" />
              <span>
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">I&apos;m open to new work</span>
                <span className="block text-xs text-gray-500">Shows the green availability badge in the hero. Untick it when you&apos;re fully booked.</span>
              </span>
            </label>

            <div className="relative z-10">
              <Input
                label="Badge text (optional)"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Open to remote roles & contracts worldwide"
              />
              <p className="mt-1 text-xs text-gray-500">Leave empty to use the default text.</p>
            </div>

            <div className="relative z-10">
              <Input
                label="Booking link (optional)"
                type="url"
                value={booking}
                onChange={(e) => setBooking(e.target.value)}
                error={bookingError}
                placeholder="https://cal.com/your-name/30min"
              />
              <p className="mt-1 text-xs text-gray-500">Cal.com, Calendly… When set, “Book a call” buttons appear in the hero and contact section.</p>
            </div>

            <Button type="submit" isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>Save settings</Button>
          </form>
        )}
      </main>
    </>
  );
}
