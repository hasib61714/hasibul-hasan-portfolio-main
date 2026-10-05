"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MessageCircle, MapPin, Send, User, Copy, Check, CalendarCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Honeypot } from "@/components/ui/Honeypot";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { useProfile } from "@/components/ProfileProvider";
import { profileHost, socialLinks, whatsappLink, type SocialKey } from "@/lib/profile-defaults";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { mailtoHref, safeUrl } from "@/lib/utils";
import toast from "react-hot-toast";

const SOCIAL_COLORS: Record<string, string> = {
  github: "from-gray-600 to-gray-800",
  linkedin: "from-sky-500 to-blue-600",
  facebook: "from-blue-600 to-indigo-700",
  twitter: "from-gray-700 to-black",
  youtube: "from-red-500 to-red-700",
  instagram: "from-pink-500 to-orange-500",
};

export function Contact() {
  const profile = useProfile();
  const bookingUrl = safeUrl(profile.bookingUrl);
  const whatsapp = whatsappLink(profile);

  const CONTACT_INFO: { icon?: typeof Mail; social?: SocialKey; label: string; value: string; href?: string; color: string }[] = [
    { icon: Mail, label: "Email", value: profile.email, href: mailtoHref(profile.email), color: "from-brand-500 to-brand-600" },
    ...(whatsapp
      ? [{ icon: MessageCircle, label: "WhatsApp", value: `+${profile.whatsapp.replace(/\D/g, "")}`, href: whatsapp, color: "from-emerald-500 to-emerald-600" }]
      : []),
    ...socialLinks(profile, ["linkedin", "github", "twitter", "youtube", "instagram", "facebook"]).map((l) => ({
      social: l.key,
      label: l.label,
      value: profileHost(l.href),
      href: l.href,
      color: SOCIAL_COLORS[l.key] ?? "from-brand-500 to-accent-500",
    })),
    { icon: MapPin, label: "Location", value: `${profile.location} (${profile.timezone})`, color: "from-accent-500 to-accent-600" },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed");
      }
      setSubmitted(true);
      reset();
      toast.success("Message sent! I'll get back to you soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — please copy it manually.");
    }
  };

  return (
    <section id="contact" className="section-padding overflow-hidden bg-gray-50/70 dark:bg-gray-900/40">
      <div className="container-max">
        <SectionHeader
          badge="Contact"
          title="Get in"
          highlight="touch"
          subtitle="A question, an opportunity or just want to say hello? My inbox is always open."
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-premium flex flex-col gap-6 rounded-2xl p-6"
          >
            <div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Let&apos;s start a conversation</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Whether you&apos;re hiring, planning a project or want to collaborate, reach out on
                whichever channel suits you. I usually reply within 24 hours.
              </p>
            </div>

            <ul className="flex flex-1 flex-col gap-3">
              {CONTACT_INFO.map(({ icon: Icon, social, label, value, href }) => {
                const inner = (
                  <>
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-md transition-transform duration-300 group-hover:scale-105`}>
                      {social ? <SocialIcon name={social} className="h-5 w-5" /> : Icon ? <Icon className="h-5 w-5" /> : null}
                    </span>
                    <span className="min-w-0">
                      <span className="mb-0.5 block font-mono text-[11px] uppercase tracking-widest text-gray-500">{label}</span>
                      <span className="block text-sm font-semibold [overflow-wrap:anywhere] leading-snug sm:text-base text-gray-900 dark:text-white">{value}</span>
                    </span>
                  </>
                );
                const cls = "group flex flex-1 items-center gap-3 rounded-xl border border-gray-200/70 bg-gray-50 p-3 transition-colors dark:border-white/[0.07] dark:bg-white/[0.03] sm:gap-4 sm:p-4";
                return (
                  <li key={label} className="flex">
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className={`${cls} hover:border-brand-400/50 hover:bg-white dark:hover:bg-white/[0.06]`}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                <CalendarCheck className="h-4 w-4" /> Book a 30-minute call
              </a>
            )}
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-brand-400/60 hover:text-brand-600 dark:border-white/10 dark:text-gray-300 dark:hover:text-brand-300"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Email copied" : "Copy email address"}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            {submitted ? (
              <div role="status" className="card-premium flex flex-1 flex-col items-center justify-center rounded-2xl p-10 text-center">
                <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-7 w-7" />
                </span>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Message sent!</h3>
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                  Thanks for reaching out. I typically reply within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>Send another message</Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="card-premium relative flex flex-1 flex-col gap-5 rounded-2xl p-6"
              >
                <Honeypot {...register("website")} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Your name *"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    leftIcon={<User className="h-4 w-4" />}
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="jane@company.com"
                    autoComplete="email"
                    leftIcon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <Input label="Subject" placeholder="What's this about?" {...register("subject")} />
                <div className="flex flex-1 flex-col">
                  <Textarea
                    label="Message *"
                    placeholder="Tell me what you have in mind…"
                    rows={6}
                    error={errors.message?.message}
                    containerClassName="flex-1"
                    className="min-h-36 flex-1"
                    {...register("message")}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="mt-auto w-full"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  Send message
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
