import { SITE } from "@/lib/site";

interface Notification {
  subject: string;
  text: string;
  replyTo?: string;
}

/**
 * Emails the site owner when someone submits a form, via Resend (https://resend.com).
 * Fully optional: without RESEND_API_KEY it does nothing, and it never throws, so a mail
 * problem can't make a visitor's submission fail.
 *
 *   RESEND_API_KEY   required to enable notifications
 *   NOTIFY_EMAIL     recipient (defaults to the email in lib/site.ts)
 *   NOTIFY_FROM      sender, e.g. "Portfolio <notify@yourdomain.com>" (defaults to Resend's sandbox sender)
 */
export async function notifyOwner({ subject, text, replyTo }: Notification): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "Portfolio <onboarding@resend.dev>",
        to: [process.env.NOTIFY_EMAIL || SITE.email],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("Notification email failed:", res.status, await res.text());
  } catch (err) {
    console.error("Notification email error:", err);
  }
}
