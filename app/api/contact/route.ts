import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";
import { notifyOwner } from "@/lib/notify";

const HOUR = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    // Reject cross-site form posts (browsers always send Origin on cross-origin POSTs).
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== request.headers.get("host")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!rateLimit(`contact:${clientIp(request.headers)}`, 5, HOUR)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Honeypot tripped: pretend success so bots learn nothing.
    if (parsed.data.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const supabase = createServiceClient();
    if (!supabase) {
      console.error("Contact API: SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not configured");
      return NextResponse.json({ error: "Messaging is temporarily unavailable" }, { status: 503 });
    }

    // Durable per-sender limit (works across serverless instances).
    const email = parsed.data.email.toLowerCase();
    const { count } = await supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", new Date(Date.now() - HOUR).toISOString());
    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: "Too many messages from this address. Please try again later." }, { status: 429 });
    }

    const { error } = await supabase.from("contacts").insert({
      name:    parsed.data.name,
      email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
      is_read: false,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }

    await notifyOwner({
      subject: `New message from ${parsed.data.name}`,
      replyTo: email,
      text: `${parsed.data.name} <${email}>\n${parsed.data.subject ? `Subject: ${parsed.data.subject}\n` : ""}\n${parsed.data.message}\n\n— Sent via your portfolio contact form`,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
