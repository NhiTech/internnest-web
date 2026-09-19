"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const ACCENT = "#6C63FF";
const CITIES = [
  "San Francisco", "New York", "Boston", "Chicago",
  "Atlanta", "Seattle", "Los Angeles", "Washington, DC",
];

const page: React.CSSProperties = {
  minHeight: "100vh", background: "#0A0A0F", color: "#fff",
  fontFamily: "'DM Sans', sans-serif", display: "flex",
  alignItems: "center", justifyContent: "center", padding: "40px 20px",
  position: "relative", overflow: "hidden",
};
const card: React.CSSProperties = {
  position: "relative", zIndex: 1, width: "100%", maxWidth: 440,
  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24, padding: 36,
};
const label: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)",
  marginBottom: 7, display: "block", letterSpacing: "0.02em",
};
const input: React.CSSProperties = {
  width: "100%", padding: "13px 16px", borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
  color: "#fff", fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none",
};

export default function SignupPage() {
  const [status, setStatus] = useState<"form" | "sent" | "stub">("form");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    name: "", email: "", school: "", city: CITIES[0],
    company: "", startDate: "", endDate: "", budget: "",
  });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF({ ...f, [k]: e.target.value });
  const eduOk = /\.edu\s*$/i.test(f.email.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!eduOk) {
      setError("Please use your school's .edu email — that's how we verify interns.");
      return;
    }
    setSending(true);

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email: f.email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: f.name, school: f.school, city: f.city, company: f.company,
            start_date: f.startDate, end_date: f.endDate, budget: f.budget,
          },
        },
      });
      setSending(false);
      if (error) { setError(error.message); return; }
      setStatus("sent");
    } else {
      localStorage.setItem("internnest_user", JSON.stringify(f));
      setSending(false);
      setStatus("stub");
    }
  };

  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        input:focus,select:focus{border-color:${ACCENT}!important;box-shadow:0 0 0 3px ${ACCENT}22}
        select option{background:#1a1a2e;color:#fff}`}</style>
      <div style={{ position: "fixed", top: "-15%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}12, transparent 65%)`, pointerEvents: "none" }} />

      <div style={card}>
        <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Back to InternNest</a>

        {status === "sent" ? (
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ fontSize: 40 }}>📬</div>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, marginTop: 10 }}>Check your email</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
              We sent a secure login link to <b>{f.email}</b>. Click it to verify your
              .edu and finish creating your account.
            </p>
          </div>
        ) : status === "stub" ? (
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ fontSize: 40 }}>🪺</div>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, marginTop: 10 }}>You&apos;re in the nest!</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
              Saved locally for now — connect Supabase to send a real .edu verification link.
            </p>
            <a href="/" style={{ display: "inline-block", marginTop: 22, padding: "13px 30px", borderRadius: 100, background: ACCENT, color: "#fff", fontWeight: 600, textDecoration: "none" }}>Browse housing →</a>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 34, fontWeight: 400, marginTop: 18 }}>Create your account</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 6, marginBottom: 24 }}>
              We&apos;ll verify your .edu and personalize housing &amp; community.
            </p>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={label}>Full name</label>
                <input required style={input} placeholder="Jordan Lee" value={f.name} onChange={set("name")} /></div>

              <div><label style={label}>School email (.edu)</label>
                <input required type="email" style={input} placeholder="you@university.edu" value={f.email} onChange={set("email")} />
                {f.email && !eduOk && <p style={{ color: "#f0b34a", fontSize: 12, marginTop: 6 }}>Use your school&apos;s .edu email.</p>}</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={label}>School</label>
                  <input style={input} placeholder="University of…" value={f.school} onChange={set("school")} /></div>
                <div><label style={label}>Company</label>
                  <input style={input} placeholder="e.g. Meta" value={f.company} onChange={set("company")} /></div>
              </div>

              <div><label style={label}>Internship city</label>
                <select style={{ ...input, appearance: "none", cursor: "pointer" }} value={f.city} onChange={set("city")}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select></div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={label}>Start date</label>
                  <input type="date" style={input} value={f.startDate} onChange={set("startDate")} /></div>
                <div><label style={label}>End date</label>
                  <input type="date" style={input} value={f.endDate} onChange={set("endDate")} /></div>
              </div>

              <div><label style={label}>Monthly budget ($)</label>
                <input type="number" style={input} placeholder="2000" value={f.budget} onChange={set("budget")} /></div>

              {error && <p style={{ color: "#ff6b6b", fontSize: 13 }}>{error}</p>}

              <button type="submit" disabled={sending} style={{ marginTop: 6, padding: "14px", borderRadius: 100, border: "none", background: ACCENT, color: "#fff", fontSize: 15, fontWeight: 700, cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1, boxShadow: `0 4px 24px ${ACCENT}40` }}>
                {sending ? "Sending…" : "Create account"}
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                Already have an account? <a href="/login" style={{ color: ACCENT, textDecoration: "none" }}>Log in</a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
