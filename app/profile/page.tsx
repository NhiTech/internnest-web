"use client";

import { useEffect, useState } from "react";

const ACCENT = "#6C63FF";

type Profile = {
  name?: string; email?: string; school?: string; city?: string;
  company?: string; startDate?: string; endDate?: string; budget?: string;
  bio?: string; interests?: string[]; linkedin?: string;
};

const page: React.CSSProperties = {
  minHeight: "100vh", background: "#0A0A0F", color: "#fff",
  fontFamily: "'DM Sans', sans-serif", display: "flex",
  justifyContent: "center", padding: "48px 20px",
  position: "relative", overflow: "hidden",
};
const card: React.CSSProperties = {
  position: "relative", zIndex: 1, width: "100%", maxWidth: 520,
  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24, padding: 36, height: "fit-content",
};
const chip: React.CSSProperties = {
  padding: "5px 13px", borderRadius: 100, background: `${ACCENT}18`,
  color: "#c7c2ff", fontSize: 13, fontWeight: 500,
};

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("internnest_user");
      if (s) setP(JSON.parse(s));
    } catch {}
    setLoaded(true);
  }, []);

  const initials = (p?.name || "?").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');`}</style>
      <div style={{ position: "fixed", top: "-15%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}12, transparent 65%)`, pointerEvents: "none" }} />

      <div style={card}>
        <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Back to InternNest</a>

        {!loaded ? null : !p ? (
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ fontSize: 40 }}>👤</div>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, marginTop: 10 }}>No profile yet</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10 }}>Create your intern profile to get started.</p>
            <a href="/signup" style={{ display: "inline-block", marginTop: 22, padding: "13px 30px", borderRadius: 100, background: ACCENT, color: "#fff", fontWeight: 600, textDecoration: "none" }}>Sign up →</a>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400 }}>{p.name}</h1>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
                  {p.company ? `${p.company} intern` : "Intern"}{p.city ? ` · ${p.city}` : ""}
                </p>
              </div>
            </div>

            {p.bio && <p style={{ marginTop: 18, fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{p.bio}</p>}

            {p.interests && p.interests.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                {p.interests.map((i) => <span key={i} style={chip}>{i}</span>)}
              </div>
            )}

            {p.linkedin && (
              <a href={p.linkedin.startsWith("http") ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 18, padding: "10px 20px", borderRadius: 100, background: "#0A66C2", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                in · Connect on LinkedIn →
              </a>
            )}

            <div style={{ marginTop: 22 }}>
              <Row label="School" value={p.school} />
              <Row label="Company" value={p.company} />
              <Row label="City" value={p.city} />
              <Row label="Dates" value={p.startDate && p.endDate ? `${p.startDate} → ${p.endDate}` : undefined} />
              <Row label="Budget" value={p.budget ? `$${p.budget}/mo` : undefined} />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <a href="/signup" style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.15)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Edit profile</a>
              <a href="/" style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: 100, background: ACCENT, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Browse housing</a>
            </div>

            <p style={{ marginTop: 18, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
              This is how other verified interns will see you. Public sharing turns on once accounts are connected.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
