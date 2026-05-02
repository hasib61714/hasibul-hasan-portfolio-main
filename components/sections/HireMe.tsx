"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Briefcase, DollarSign, Clock, MessageSquare, User, Mail } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import toast from "react-hot-toast";

const hireSchema = z.object({
  name:         z.string().min(2, "Name must be at least 2 characters"),
  email:        z.string().email("Please enter a valid email"),
  company:      z.string().optional(),
  project_type: z.string().min(1, "Please select a project type"),
  budget:       z.string().min(1, "Please select a budget range"),
  timeline:     z.string().optional(),
  message:      z.string().min(20, "Message must be at least 20 characters"),
});

type HireFormData = z.infer<typeof hireSchema>;

const PROJECT_TYPES = [
  "Web Application",
  "Mobile App",
  "E-Commerce",
  "Landing Page",
  "API Development",
  "UI/UX Design",
  "Consulting",
  "Other",
];

const BUDGET_RANGES = [
  "< $500",
  "$500 – $1,000",
  "$1,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Let's Discuss",
];

const TIMELINES = [
  "ASAP (< 1 week)",
  "Short-term (1–4 weeks)",
  "Medium-term (1–3 months)",
  "Long-term (3+ months)",
  "Flexible",
];

export function HireMe() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HireFormData>({ resolver: zodResolver(hireSchema) });

  const onSubmit = async (data: HireFormData) => {
    try {
      const res = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSubmitted(true);
      reset();
      toast.success("Your request has been sent! I'll be in touch soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="hire" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-max">
        <SectionHeader
          badge="Hire Me"
          title="Let&apos;s Work"
          highlight="Together"
          subtitle="Have a project in mind? I&apos;d love to help bring it to life."
        />

        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 text-center"
            >
              <div className="text-6xl mb-6">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Request Sent!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Thank you for reaching out. I&apos;ll review your project details and get back to you
                within 24 hours.
              </p>
              <Button onClick={() => setSubmitted(false)}>Submit Another Request</Button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit(onSubmit)}
              className="glass-card rounded-2xl p-8 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Your Name *"
                  placeholder="John Doe"
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="john@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <Input
                label="Company / Organization"
                placeholder="Acme Inc. (optional)"
                leftIcon={<Briefcase className="w-4 h-4" />}
                {...register("company")}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Project Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project Type *
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    {...register("project_type")}
                  >
                    <option value="">Select type...</option>
                    {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.project_type && (
                    <p className="text-xs text-red-500">{errors.project_type.message}</p>
                  )}
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Budget Range *
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    {...register("budget")}
                  >
                    <option value="">Select budget...</option>
                    {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.budget && (
                    <p className="text-xs text-red-500">{errors.budget.message}</p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timeline
                </label>
                <select
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  {...register("timeline")}
                >
                  <option value="">Select timeline...</option>
                  {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <Textarea
                label="Project Description *"
                placeholder="Tell me about your project, goals, and any specific requirements..."
                rows={5}
                error={errors.message?.message}
                {...register("message")}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
                leftIcon={<MessageSquare className="w-5 h-5" />}
              >
                Send Hire Request
              </Button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
