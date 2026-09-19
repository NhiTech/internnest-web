"use client";

import { useEffect, useState } from "react";

const ACCENT = "#6C63FF";

type Person = {
  name: string; company: string; city: string;
  school?: string; interests: string[]; linkedin?: string;
};

// Sample interns for the demo. Once Supabase is connected, this page queries the
// real `profiles` table for interns at your company / city.
const PEOPLE: Person[] = [
  { name: "Maya Chen", company: "Meta", city: "San Francisco", school: "Stanford", interests: ["Hiking", "Coffee", "Tech"], linkedin: "linkedin.com/in/example" },
  { name: "Diego Alvarez", company: "Meta", city: "San Francisco", school: "UT Austin", interests: ["Soccer", "Food"], linkedin: "linkedin.com/in/example" },
  { name: "Priya Patel", company: "Google", city: "New York", school: "NYU", interests: ["Art", "Music", "Travel"], linkedin: "linkedin.com/in/example" },
  { name: "Sam Okafor", company: "Google", city: "New York", school: "Georgia Tech", interests: ["Fitness", "Gaming"], linkedin: "linkedin.com/in/example" },
  { name: "Emma Schultz", company: "Amazon", city: "Seattle", school: "UW", interests: ["Coffee", "Hiking", "Reading"], linkedin: "linkedin.com/in/example" },
  { name: "Tyler Brooks", company: "Microsoft", city: "Seattle", school: "MIT", interests: ["Tech", "Sports"], linkedin: "linkedin.com/in/example" },
  { name: "Anusha Rao", company: "Coca-Cola", city: "Atlanta", school: "Emory", interests: ["Food", "Music", "Fitness"], linkedin: "linkedin.com/in/example" },
  { name: "Marcus Bell", company: "Bank of America", city: "Atlanta", school: "Georgia Tech", interests: ["Nightlife", "Sports"], linkedin: "linkedin.com/in/example" },
  { name: "Lena Park", company: "McKinsey", city: "Chicago", school: "Northwestern", interests: ["Travel", "Reading"], linkedin: "linkedin.com/in/example" },
  { name: "Owen Reed", company: "Snapchat", city: "Los Angeles", school: "UCLA", interests: ["Art", "Fitness", "Food"], linkedin: "linkedin.com/in/example" },
];

const page: React.CSSProperties = {
  minHeight: "100vh", background: "#0A0A0F", color: "#fff",
  fontFamily: "'DM Sans', sans-serif", padding: "40px 20px",
  position: "relative", overflow: "hidden",
};
const chip: React.CSSProperties = {
  padding: "4px 11px", borderRadius: 100, background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.6)", fontSize: 12,
};

function PersonCard({ p }: { p: Person }) {
  const initials = p.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const url = p.linkedin ? (p.linkedin.startsWith("http") ? p.linkedin : `https://${p.linkedin}`) : null;
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20 }}>{p.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{p.company} intern · {p.city}{p.school ? ` · ${p.school}` : ""}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
        {p.interests.map((i) => <span key={i} style={chip}>{i}</span>)}
      </div>
      {url && (
        <a href={url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 14, padding: "8px 18px", borderRadius: 100, background: "#0A66C2", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
          in · Connect
        </a>
      )}
    </div>
  );
}

function Section({ title, people }: { title: string; people: Person[] }) {
  if (people.length === 0) return null;
  return (
    <div style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{title}</h2>
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {people.map((p) => <PersonCard key={p.name} p={p} />)}
      </div>
    </div>
  );
}

export default function ConnectPage() {
  const [me, setMe] = useState<{ company?: string; city?: string; name?: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("internnest_user");
      if (s) setMe(JSON.parse(s));
    } catch {}
    setLoaded(true);
  }, []);

  const company = me?.company?.trim().toLowerCase();
  const city = me?.city?.trim().toLowerCase();

  const atCompany = company ? PEOPLE.filter((p) => p.company.toLowerCase() === company) : [];
  const inCity = city
    ? PEOPLE.filter((p) => p.city.toLowerCase() === city && !atCompany.includes(p))
    : [];
  const others = PEOPLE.filter((p) => !atCompany.includes(p) && !inCity.includes(p));

  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');`}</style>
      <div style={{ position: "fixed", top: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}12, transparent 65%)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Back to InternNest</a>
        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 38, fontWeight: 400, marginTop: 16 }}>Find your people</h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 8, maxWidth: 560 }}>
          Other verified interns — starting with your company and city. Connect before you even arrive.
        </p>

        {!loaded ? null : !me ? (
          <div style={{ marginTop: 30, padding: 28, borderRadius: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.6)" }}>Create your profile so we can match you to interns at your company.</p>
            <a href="/signup" style={{ display: "inline-block", marginTop: 16, padding: "12px 28px", borderRadius: 100, background: ACCENT, color: "#fff", textDecoration: "none", fontWeight: 600 }}>Sign up →</a>
          </div>
        ) : (
          <>
            <Section title={me.company ? `Interns at ${me.company}` : "Interns"} people={atCompany} />
            <Section title={me.city ? `Also in ${me.city}` : "In your city"} people={inCity} />
            <Section title="More interns" people={others} />
            <p style={{ marginTop: 30, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
              Sample interns shown for now — real people appear here once accounts are connected (Supabase).
            </p>
          </>
        )}
      </div>
    </div>
  );
}
