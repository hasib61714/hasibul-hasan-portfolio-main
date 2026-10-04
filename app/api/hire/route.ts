import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { hireSchema } from "@/lib/validation";

const HOUR = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== request.headers.get("host")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!rateLimit(`hire:${clientIp(request.headers)}`, 5, HOUR)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = hireSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const supabase = createServiceClient();
    if (!supabase) {
      console.error("Hire API: SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not configured");
      return NextResponse.json({ error: "Requests are temporarily unavailable" }, { status: 503 });
    }

    const email = parsed.data.email.toLowerCase();
    const { count } = await supabase
      .from("hire_requests")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", new Date(Date.now() - HOUR).toISOString());
    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: "Too many requests from this address. Please try again later." }, { status: 429 });
    }

    const { error } = await supabase.from("hire_requests").insert({
      name:         parsed.data.name,
      email,
      company:      parsed.data.company  || null,
      project_type: parsed.data.project_type,
      budget:       parsed.data.budget,
      timeline:     parsed.data.timeline || null,
      message:      parsed.data.message,
      status:       "pending",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save hire request" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Hire API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
