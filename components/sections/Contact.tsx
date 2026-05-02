"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  User,
  Phone,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { WHATSAPP_NUMBER, PHONE_NUMBER, EMAIL_ADDRESS } from "@/lib/utils";

const contactSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const CONTACT_INFO = [
  {
    icon:  Mail,
    label: "Email",
    values: [EMAIL_ADDRESS],
    href:   `mailto:${EMAIL_ADDRESS}`,
    color:  "from-brand-500 to-brand-600",
  },
  {
    icon:  Phone,
    label: "Phone",
    values: [`+${WHATSAPP_NUMBER}`, `+${PHONE_NUMBER}`],
    href:   `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Hasibul%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect!`,
    color:  "from-green-500 to-emerald-600",
  },
  {
    icon:  MapPin,
    label: "Location",
    values: ["Dag-18325, Faidabad Chowrasta,", "Dakshinkhan, Uttara, Dhaka-1230"],
    href:   "https://maps.google.com/?q=Dakshinkhan,Uttara,Dhaka,Bangladesh",
    color:  "from-accent-500 to-accent-600",
  },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      reset();
      toast.success("Message sent! I'll get back to you soon.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-max">
        <SectionHeader
          badge="Contact"
          title="Get In"
          highlight="Touch"
          subtitle="Have a question or want to work together? I'd love to hear from you."
        />

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-premium rounded-2xl p-6 flex flex-col gap-6"
          >
            {/* Heading */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Let's Start a Conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                Whether you're looking to hire, collaborate on a project, or just want to
                say hello — my inbox is always open!
              </p>
            </div>

            {/* Contact cards */}
            <div className="flex flex-col gap-3 flex-1">
              {CONTACT_INFO.map(({ icon: Icon, label, values, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/60 dark:border-gray-700/40 group transition-all duration-200 flex-1"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
                    {values.map((v) => (
                      <p key={v} className="font-bold text-gray-900 dark:text-white leading-snug">{v}</p>
                    ))}
                  </div>
                </a>
              ))}
            </div>

            {/* WhatsApp CTA — pinned to bottom */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Hasibul%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect!`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                leftIcon={<MessageCircle className="w-5 h-5" />}
              >
                Chat on WhatsApp
              </Button>
            </a>
          </motion.div>

          {/* Right — contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            {submitted ? (
              <div className="card-premium rounded-2xl p-10 text-center flex-1 flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">✉️</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  Thanks for reaching out. I typically reply within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="card-premium rounded-2xl p-6 flex flex-col gap-5 flex-1"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="Your Name *"
                    placeholder="John Doe"
                    leftIcon={<User className="w-4 h-4" />}
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="john@example.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <Input
                  label="Subject"
                  placeholder="What's this about?"
                  {...register("subject")}
                />
                <div className="flex-1 flex flex-col">
                  <Textarea
                    label="Message *"
                    placeholder="Tell me what you have in mind..."
                    rows={5}
                    error={errors.message?.message}
                    className="flex-1"
                    {...register("message")}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-auto"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
