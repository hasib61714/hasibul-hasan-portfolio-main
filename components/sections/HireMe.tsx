"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, CheckCircle2, MessageSquare, User, Mail, Clock, ShieldCheck, Globe2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Honeypot } from "@/components/ui/Honeypot";
import { hireSchema, type HireInput } from "@/lib/validation";
import toast from "react-hot-toast";

const PROJECT_TYPES = [
  "Web Application",
  "SaaS / Internal Tool",
  "E-Commerce",
  "Landing Page / Marketing Site",
  "API / Backend Development",
  "Machine Learning / AI",
  "AR/VR",
  "Mobile App",
  "Consulting / Code Review",
  "Full-time Role",
  "Other",
];

const BUDGET_RANGES = [
  "< $500",
  "$500 – $1,000",
  "$1,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Let's discuss",
];

const TIMELINES = [
  "ASAP (< 1 week)",
  "Short-term (1–4 weeks)",
  "Medium-term (1–3 months)",
  "Long-term (3+ months)",
  "Flexible",
];

const PERKS = [
  { icon: Clock,       title: "Reply within 24 hours", desc: "Every serious inquiry gets a thoughtful response." },
  { icon: Globe2,      title: "Works across time zones", desc: "Based in GMT+6 with flexible overlap for EU & US teams." },
  { icon: ShieldCheck, title: "Secure by default",     desc: "Typed, tested and reviewed code with security in mind." },
];

export function HireMe() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HireInput>({ resolver: zodResolver(hireSchema) });

  const onSubmit = async (data: HireInput) => {
    try {
      const res = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to send");
      }
      setSubmitted(true);
      reset();
      toast.success("Request sent! I'll be in touch soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="hire" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-max">
        <SectionHeader
          badge="Hire me"
          title="Let's build something"
          highlight="great together"
          subtitle="Tell me about your project or role. I work with startups, agencies and product teams around the world."
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <ul className="space-y-4 lg:pt-2">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="card-premium flex gap-4 rounded-2xl p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-md">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                role="status"
                className="card-premium rounded-2xl p-10 text-center sm:p-12"
              >
                <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-emerald-500" />
                <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Request sent!</h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Thank you for reaching out. I&apos;ll review your details and get back to you within 24 hours.
                </p>
                <Button onClick={() => setSubmitted(false)}>Submit another request</Button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="card-premium relative space-y-5 rounded-2xl p-6 sm:p-8"
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
                    label="Email address *"
                    type="email"
                    placeholder="jane@company.com"
                    autoComplete="email"
                    leftIcon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                <Input
                  label="Company / organization"
                  placeholder="Acme Inc. (optional)"
                  autoComplete="organization"
                  leftIcon={<Briefcase className="h-4 w-4" />}
                  {...register("company")}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Project type *" error={errors.project_type?.message} {...register("project_type")}>
                    <option value="">Select type…</option>
                    {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                  <Select label="Budget (USD) *" error={errors.budget?.message} {...register("budget")}>
                    <option value="">Select budget…</option>
                    {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </Select>
                </div>

                <Select label="Timeline" {...register("timeline")}>
                  <option value="">Select timeline…</option>
                  {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>

                <Textarea
                  label="Project description *"
                  placeholder="Tell me about your goals, the problem you're solving and any technical requirements…"
                  rows={5}
                  error={errors.message?.message}
                  {...register("message")}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  leftIcon={<MessageSquare className="h-5 w-5" />}
                >
                  Send hire request
                </Button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
