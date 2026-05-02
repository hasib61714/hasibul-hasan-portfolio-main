import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const hireSchema = z.object({
  name:         z.string().min(2).max(100),
  email:        z.string().email().max(255),
  company:      z.string().max(200).optional(),
  project_type: z.string().min(1).max(100),
  budget:       z.string().min(1).max(50),
  timeline:     z.string().max(100).optional(),
  message:      z.string().min(20).max(3000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = hireSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();
    const { error } = await supabase.from("hire_requests").insert({
      name:         parsed.data.name,
      email:        parsed.data.email,
      company:      parsed.data.company  ?? null,
      project_type: parsed.data.project_type,
      budget:       parsed.data.budget,
      timeline:     parsed.data.timeline ?? null,
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
