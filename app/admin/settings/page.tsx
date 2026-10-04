"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";
import { mergeProfile, type SettingsRow } from "@/lib/profile-defaults";

type Values = Record<string, string>;

const HTTPS = /^https?:\/\/\S+$/i;

const toList = (v: string) => v.split(/[\n,]/).map((t) => t.trim()).filter(Boolean);

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card-premium rounded-2xl p-6">
      <h2 className="relative z-10 text-base font-extrabold text-gray-900 dark:text-white">{title}</h2>
      {hint && <p className="relative z-10 mb-4 mt-0.5 text-xs text-gray-500">{hint}</p>}
      <div className={`relative z-10 space-y-4 ${hint ? "" : "mt-4"}`}>{children}</div>
    </section>
  );
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Values>({});
  const [openToWork, setOpenToWork] = useState(true);
  const [errors, setErrors] = useState<Values>({});

  useEffect(() => {
    createClient()
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load settings: " + error.message + " — run the latest supabase/schema.sql");
        // Pre-fill every field with what the website is showing right now.
        const p = mergeProfile(error ? null : (data as SettingsRow | null));
        setValues({
          name: p.name, brand: p.brand, role: p.role,
          headline_before: p.headlineBefore, headline_accent: p.headlineAccent, headline_after: p.headlineAfter,
          hero_description: p.heroDescription, about_story: p.aboutStory,
          seo_description: p.seoDescription, footer_tagline: p.footerTagline,
          email: p.email, whatsapp: p.whatsapp,
          github_url: p.github, linkedin_url: p.linkedin, facebook_url: p.facebook,
          twitter_url: p.twitter, youtube_url: p.youtube, instagram_url: p.instagram,
          location: p.location, timezone: p.timezone, years_experience: p.yearsExperience,
          availability_text: p.availability, booking_url: p.bookingUrl,
          tech_marquee: p.techMarquee.join(", "), core_stack: p.coreStack.join(", "),
        });
        setOpenToWork(p.openToWork);
        setLoading(false);
      });
  }, []);

  const set = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  const field = (name: string, label: string, extra?: { placeholder?: string; help?: string; type?: string }) => (
    <div>
      <Input label={label} type={extra?.type ?? "text"} value={values[name] ?? ""} onChange={set(name)} error={errors[name]} placeholder={extra?.placeholder} />
      {extra?.help && <p className="mt-1 text-xs text-gray-500">{extra.help}</p>}
    </div>
  );

  const area = (name: string, label: string, rows: number, help?: string) => (
    <div>
      <Textarea label={label} rows={rows} value={values[name] ?? ""} onChange={set(name)} error={errors[name]} />
      {help && <p className="mt-1 text-xs text-gray-500">{help}</p>}
    </div>
  );

  const validate = () => {
    const next: Values = {};
    const urlFields: [string, string][] = [
      ["github_url", "GitHub"], ["linkedin_url", "LinkedIn"], ["facebook_url", "Facebook"],
      ["twitter_url", "X / Twitter"], ["youtube_url", "YouTube"], ["instagram_url", "Instagram"],
    ];
    urlFields.forEach(([k, label]) => {
      const v = (values[k] ?? "").trim();
      if (v && !HTTPS.test(v)) next[k] = `${label}: must be a full link starting with https://`;
    });
    const booking = (values.booking_url ?? "").trim();
    if (booking && !/^https:\/\/\S+$/i.test(booking)) next.booking_url = "Must be a link starting with https://";
    const email = (values.email ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address";
    const wa = (values.whatsapp ?? "").trim();
    if (wa && !/^\+?[\d\s-]{6,20}$/.test(wa)) next.whatsapp = "Digits only, with country code (e.g. 8801XXXXXXXXX)";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast.error("Please fix the highlighted fields"); return; }
    setSaving(true);
    const text = (k: string) => (values[k] ?? "").trim() || null;
    const link = (k: string) => (values[k] ?? "").trim(); // empty string = hide this link
    const payload = {
      id: 1,
      name: text("name"), brand: text("brand"), role: text("role"),
      headline_before: text("headline_before"), headline_accent: text("headline_accent"), headline_after: text("headline_after"),
      hero_description: text("hero_description"), about_story: text("about_story"),
      seo_description: text("seo_description"), footer_tagline: text("footer_tagline"),
      email: text("email"), whatsapp: (values.whatsapp ?? "").replace(/\D/g, ""),
      github_url: link("github_url"), linkedin_url: link("linkedin_url"), facebook_url: link("facebook_url"),
      twitter_url: link("twitter_url"), youtube_url: link("youtube_url"), instagram_url: link("instagram_url"),
      location: text("location"), timezone: text("timezone"), years_experience: text("years_experience"),
      availability_text: text("availability_text"), booking_url: link("booking_url") || null,
      open_to_work: openToWork,
      tech_marquee: toList(values.tech_marquee ?? ""), core_stack: toList(values.core_stack ?? ""),
    };
    const { error } = await createClient().from("site_settings").upsert(payload);
    setSaving(false);
    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Saved — the website updates within a minute");
  };

  return (
    <>
      <AdminHeader title="Site & Profile" subtitle="Your name, texts, links and availability — everything shown across the website" />
      <main className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={save} noValidate className="mx-auto max-w-3xl space-y-6 pb-24">
            <Section title="Identity" hint="Used in the navbar, footer, page titles and search results.">
              <div className="grid gap-4 sm:grid-cols-2">
                {field("name", "Full name")}
                {field("brand", "Short brand name", { help: "Shown as “Brand.dev” in the navbar." })}
              </div>
              {field("role", "Job title", { placeholder: "Software & ML Engineer" })}
            </Section>

            <Section title="Hero (top of the page)" hint="The headline is built from three parts; the middle part is highlighted in colour.">
              {field("headline_before", "Headline — first part")}
              {field("headline_accent", "Headline — highlighted part")}
              {field("headline_after", "Headline — last part")}
              {area("hero_description", "Intro paragraph", 4)}
            </Section>

            <Section title="About" hint="Appears in the “My story” card.">
              {area("about_story", "My story", 9, "Leave a blank line between paragraphs. Wrap words in **double asterisks** to make them bold.")}
              {field("years_experience", "Years of experience", { placeholder: "3+" })}
              {field("core_stack", "Core stack", { help: "Comma separated list shown as tags in the About section." })}
              {field("tech_marquee", "Scrolling tech strip", { help: "Comma separated list shown in the strip under the hero." })}
            </Section>

            <Section title="Contact & social links" hint="Leave a link empty to hide it everywhere. Use full links starting with https://.">
              <div className="grid gap-4 sm:grid-cols-2">
                {field("email", "Email", { type: "email" })}
                {field("whatsapp", "WhatsApp number", { placeholder: "8801XXXXXXXXX", help: "Digits only, with country code. Empty = hide." })}
              </div>
              {field("github_url", "GitHub", { placeholder: "https://github.com/username" })}
              {field("linkedin_url", "LinkedIn", { placeholder: "https://linkedin.com/in/username" })}
              {field("facebook_url", "Facebook", { placeholder: "https://facebook.com/username" })}
              {field("twitter_url", "X (Twitter)", { placeholder: "https://x.com/username" })}
              {field("youtube_url", "YouTube", { placeholder: "https://youtube.com/@channel" })}
              {field("instagram_url", "Instagram", { placeholder: "https://instagram.com/username" })}
            </Section>

            <Section title="Location & availability">
              <div className="grid gap-4 sm:grid-cols-2">
                {field("location", "Location", { placeholder: "Dhaka, Bangladesh" })}
                {field("timezone", "Time zone", { placeholder: "GMT+6" })}
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={openToWork} onChange={(e) => setOpenToWork(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-500" />
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">I&apos;m open to new work</span>
                  <span className="block text-xs text-gray-500">Shows the green availability badge. Untick it when you&apos;re fully booked.</span>
                </span>
              </label>
              {field("availability_text", "Availability text", { placeholder: "Open to remote roles & contracts worldwide" })}
              {field("booking_url", "Booking link", { type: "url", placeholder: "https://cal.com/your-name/30min", help: "Cal.com, Calendly… When set, “Book a call” buttons appear." })}
            </Section>

            <Section title="Search engines & footer">
              {area("seo_description", "Site description (SEO)", 3, "Shown in Google results and link previews. Aim for 150–160 characters.")}
              {area("footer_tagline", "Footer text", 3)}
            </Section>

            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/90 p-4 backdrop-blur dark:border-white/10 dark:bg-gray-950/90 lg:left-64">
              <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
                <p className="hidden text-xs text-gray-500 sm:block">Changes appear on the website within about a minute.</p>
                <Button type="submit" isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>Save changes</Button>
              </div>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
