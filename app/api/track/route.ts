import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  path: z.string().min(1).max(200).regex(/^\/[A-Za-z0-9\-._~/%]*$/),
  referrer: z.string().max(200).optional(),
});

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor/i;

export async function POST(request: NextRequest) {
  const done = () => new NextResponse(null, { status: 204 });
  try {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== request.headers.get("host")) return done();
    if (BOT.test(request.headers.get("user-agent") ?? "")) return done();
    if (!rateLimit(`track:${clientIp(request.headers)}`, 60, 60_000)) return done();

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return done();
    const { path, referrer } = parsed.data;
    if (path.startsWith("/admin") || path.startsWith("/auth") || path.startsWith("/api")) return done();

    const supabase = createServiceClient();
    if (!supabase) return done();
    await supabase.from("page_views").insert({ path, referrer: referrer || null });
  } catch {
    // never surface tracking errors
  }
  return done();
}
