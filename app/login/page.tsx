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
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const eduOk = /\.edu\s*$/i.test(email.trim());

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!eduOk) { setError("Use your school's .edu email — students only."); return; }
    setBusy(true);
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim() });
      setBusy(false);
      if (error) { setError(error.message); return; }
      setStep("code");
    } else {
      setBusy(false);
      window.location.href = "/"; // stub
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
      setBusy(false);
      if (error) { setError("Invalid or expired code — try again."); return; }
      window.location.href = "/";
    } else {
      setBusy(false);
      window.location.href = "/";
    }
  };

  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        input:focus{border-color:${ACCENT}!important;box-shadow:0 0 0 3px ${ACCENT}22}`}</style>
      <div style={{ position: "fixed", bottom: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}12, transparent 65%)`, pointerEvents: "none" }} />

      <div style={card}>
        <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Back to InternNest</a>

        {step === "email" ? (
          <>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 34, fontWeight: 400, marginTop: 18 }}>Welcome back</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 6, marginBottom: 24 }}>
              Enter your <b>.edu</b> email — we&apos;ll send a 6-digit code.
            </p>
            <form onSubmit={sendCode} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={label}>School email (.edu)</label>
                <input required type="email" style={input} placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
                {email && !eduOk && <p style={{ color: "#f0b34a", fontSize: 12, marginTop: 6 }}>Students only — use your .edu email.</p>}</div>
              {error && <p style={{ color: "#ff6b6b", fontSize: 13 }}>{error}</p>}
              <button type="submit" disabled={busy} style={{ marginTop: 6, padding: "14px", borderRadius: 100, border: "none", background: ACCENT, color: "#fff", fontSize: 15, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.6 : 1 }}>
                {busy ? "Sending…" : "Send code"}
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                New here? <a href="/signup" style={{ color: ACCENT, textDecoration: "none" }}>Create an account</a>
              </p>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 34, fontWeight: 400, marginTop: 18 }}>Enter your code</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 6, marginBottom: 24 }}>
              We sent a 6-digit code to <b>{email}</b>.
            </p>
            <form onSubmit={verify} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input required inputMode="numeric" style={{ ...input, textAlign: "center", fontSize: 24, letterSpacing: 8 }} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value)} />
              {error && <p style={{ color: "#ff6b6b", fontSize: 13 }}>{error}</p>}
              <button type="submit" disabled={busy} style={{ padding: "14px", borderRadius: 100, border: "none", background: ACCENT, color: "#fff", fontSize: 15, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.6 : 1 }}>
                {busy ? "Verifying…" : "Verify & log in"}
              </button>
              <button type="button" onClick={() => setStep("email")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: 13, cursor: "pointer" }}>← Use a different email</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
