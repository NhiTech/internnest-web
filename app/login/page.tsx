"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const ACCENT = "#6C63FF";

const page: React.CSSProperties = {
  minHeight: "100vh", background: "#0A0A0F", color: "#fff",
  fontFamily: "'DM Sans', sans-serif", display: "flex",
  alignItems: "center", justifyContent: "center", padding: "40px 20px",
  position: "relative", overflow: "hidden",
};
const card: React.CSSProperties = {
  position: "relative", zIndex: 1, width: "100%", maxWidth: 400,
  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24, padding: 36,
};
const label: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)",
  marginBottom: 7, display: "block",
};
const input: React.CSSProperties = {
  width: "100%", padding: "13px 16px", borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
  color: "#fff", fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: window.location.origin },
      });
      setSending(false);
      if (error) { setError(error.message); return; }
      setSent(true);
    } else {
      setSending(false);
      window.location.href = "/"; // stub until Supabase is connected
    }
  };

  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        input:focus{border-color:${ACCENT}!important;box-shadow:0 0 0 3px ${ACCENT}22}`}</style>
      <div style={{ position: "fixed", bottom: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}12, transparent 65%)`, pointerEvents: "none" }} />

      <div style={card}>
        <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Back to InternNest</a>

        {sent ? (
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ fontSize: 40 }}>📬</div>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, marginTop: 10 }}>Check your email</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
              We sent a magic login link to <b>{email}</b>. Click it to sign in — no password needed.
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 34, fontWeight: 400, marginTop: 18 }}>Welcome back</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 6, marginBottom: 24 }}>
              Enter your email and we&apos;ll send a secure login link.
            </p>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={label}>Email</label>
                <input required type="email" style={input} placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} /></div>

              {error && <p style={{ color: "#ff6b6b", fontSize: 13 }}>{error}</p>}

              <button type="submit" disabled={sending} style={{ marginTop: 6, padding: "14px", borderRadius: 100, border: "none", background: ACCENT, color: "#fff", fontSize: 15, fontWeight: 700, cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1, boxShadow: `0 4px 24px ${ACCENT}40` }}>
                {sending ? "Sending…" : "Send magic link"}
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                New here? <a href="/signup" style={{ color: ACCENT, textDecoration: "none" }}>Create an account</a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
