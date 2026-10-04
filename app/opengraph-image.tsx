import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/profile";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const profile = await getProfile();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fff",
          backgroundColor: "#030712",
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(99,102,241,0.55), rgba(3,7,18,0) 55%), radial-gradient(circle at 95% 10%, rgba(139,92,246,0.4), rgba(3,7,18,0) 50%), radial-gradient(circle at 60% 110%, rgba(34,211,238,0.25), rgba(3,7,18,0) 45%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6 60%,#22d3ee)",
            }}
          >
            {"</>"}
          </div>
          <div style={{ fontSize: 30, color: "#a5b4fc", letterSpacing: 2 }}>PORTFOLIO</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{profile.name}</div>
          <div style={{ fontSize: 42, color: "#c7d2fe", fontWeight: 500 }}>{profile.role}</div>
          <div style={{ fontSize: 28, color: "#94a3b8" }}>
            {profile.coreStack.slice(0, 6).join(" · ")}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#86efac" }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#22c55e" }} />
          {profile.availability}
        </div>
      </div>
    ),
    size
  );
}
