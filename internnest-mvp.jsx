"use client";
import { useState, useRef, useEffect } from "react";
import InternHub from "./intern-hub-mvp.jsx";

import { FALLBACK_NEIGHBORHOODS } from "./lib/fallback-data";
import { getNeighborhoods } from "./lib/data";

// ─── SCORING ALGORITHM ───
function scoreNeighborhoods(city, priorities, industry, budget, neighborhoodData) {
  const data = neighborhoodData[city];
  if (!data) return [];

  const weights = { commute: 0.33, cost: 0.33, safety: 0.33 };
  if (priorities.includes("commute")) weights.commute += 0.2;
  if (priorities.includes("cost")) weights.cost += 0.2;
  if (priorities.includes("safety")) weights.safety += 0.2;
  if (priorities.includes("vibe")) {
    weights.commute += 0.05;
    weights.cost += 0.05;
    weights.safety += 0.05;
  }
  const total = weights.commute + weights.cost + weights.safety;
  weights.commute /= total;
  weights.cost /= total;
  weights.safety /= total;

  return data.neighborhoods
    .map((n) => {
      let score =
        n.commuteScore * weights.commute +
        n.costScore * weights.cost +
        n.safetyScore * weights.safety;

      if (industry && n.bestFor.some((b) => b.toLowerCase() === industry.toLowerCase())) {
        score += 1.2;
      }

      if (budget) {
        if (budget === "under1500" && n.avgRent <= 1500) score += 0.8;
        else if (budget === "1500-2000" && n.avgRent >= 1400 && n.avgRent <= 2100) score += 0.8;
        else if (budget === "2000-2500" && n.avgRent >= 1900 && n.avgRent <= 2600) score += 0.8;
        else if (budget === "over2500" && n.avgRent >= 2400) score += 0.5;
      }

      return { ...n, score: Math.round(score * 10) / 10 };
    })
    .sort((a, b) => b.score - a.score);
}

// ─── SUB COMPONENTS ───

const ScoreBar = ({ label, value, max = 10, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", width: 70, fontFamily: "var(--font-body)", flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 10, transition: "width 0.6s ease" }} />
    </div>
    <span style={{ fontSize: 12, fontWeight: 700, color, width: 24, textAlign: "right", fontFamily: "var(--font-body)" }}>{value}</span>
  </div>
);

const NeighborhoodCard = ({ n, rank, isTop }) => (
  <div style={{
    background: isTop ? `linear-gradient(135deg, ${n.color}12, ${n.color}04)` : "rgba(255,255,255,0.025)",
    border: isTop ? `2px solid ${n.color}40` : "1px solid rgba(255,255,255,0.07)",
    borderRadius: 22,
    padding: 28,
    position: "relative",
    animation: `fadeSlideUp 0.5s ease ${rank * 0.1}s both`,
  }}>
    {isTop && (
      <div style={{
        position: "absolute", top: -13, left: 24,
        background: n.color, color: "#fff", padding: "5px 16px", borderRadius: 100,
        fontSize: 12, fontWeight: 700, fontFamily: "var(--font-body)",
        letterSpacing: "0.04em",
      }}>
        ✦ BEST MATCH
      </div>
    )}

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: isTop ? 26 : 22, color: "#fff" }}>
            {n.name}
          </span>
          <span style={{
            background: `${n.color}20`, color: n.color, padding: "3px 10px", borderRadius: 100,
            fontSize: 12, fontWeight: 700, fontFamily: "var(--font-body)",
          }}>
            #{rank + 1}
          </span>
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontStyle: "italic", fontFamily: "var(--font-body)" }}>
          {n.vibe}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: n.color, fontFamily: "var(--font-body)" }}>
          ${n.avgRent.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>/month avg</div>
      </div>
    </div>

    <div style={{ marginBottom: 18 }}>
      <ScoreBar label="Commute" value={n.commuteScore} color={n.color} />
      <ScoreBar label="Cost" value={n.costScore} color={n.color} />
      <ScoreBar label="Safety" value={n.safetyScore} color={n.color} />
    </div>

    <div style={{
      background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 16, marginBottom: 14,
      border: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Transit</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>🚇 {n.transitNotes}</div>
    </div>

    <div style={{
      background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 16, marginBottom: 14,
      border: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Short-term-lease-friendly buildings</div>
      {n.buildings.map((b) => (
        <div key={b} style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 4, fontFamily: "var(--font-body)" }}>
          → {b}
        </div>
      ))}
    </div>

    <div style={{
      padding: "12px 16px", borderRadius: 12,
      background: `${n.color}10`, border: `1px solid ${n.color}20`,
      fontSize: 14, color: n.color, fontFamily: "var(--font-body)",
    }}>
      💡 {n.highlight}
    </div>

    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body)" }}>Best for:</span>
      {n.bestFor.map((b) => (
        <span key={b} style={{
          padding: "3px 10px", borderRadius: 100, background: "rgba(255,255,255,0.06)",
          fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)",
        }}>
          {b}
        </span>
      ))}
    </div>
  </div>
);

// ─── MAIN APP ───
export default function InternNestMVP() {
  const [neighborhoodData, setNeighborhoodData] = useState(FALLBACK_NEIGHBORHOODS);

  useEffect(() => {
    async function loadData() {
      const atlNbs = await getNeighborhoods('atl');
      const nycNbs = await getNeighborhoods('nyc');
      setNeighborhoodData(prev => ({
        ...prev,
        atl: { ...prev.atl, neighborhoods: atlNbs.length > 0 ? atlNbs : prev.atl.neighborhoods },
        nyc: { ...prev.nyc, neighborhoods: nycNbs.length > 0 ? nycNbs : prev.nyc.neighborhoods },
      }));
    }
    loadData();
  }, []);

  const [mode, setMode] = useState("explore"); // quiz | explore
  const [step, setStep] = useState("landing"); // landing | form | results | feedback
  const [formData, setFormData] = useState({
    name: "", email: "", school: "", city: "", company: "",
    industry: "", startDate: "", endDate: "", budget: "",
    priorities: [], wantCommunity: true,
  });
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState({ useful: null, timeSaved: null, wouldPay: null, wouldRefer: null, comments: "" });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const topRef = useRef(null);

  const scrollTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePriorityToggle = (p) => {
    setFormData((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(p)
        ? prev.priorities.filter((x) => x !== p)
        : [...prev.priorities, p],
    }));
  };

  const handleSubmit = () => {
    const ranked = scoreNeighborhoods(
      formData.city,
      formData.priorities,
      formData.industry,
      formData.budget,
      neighborhoodData
    );
    setResults(ranked);
    setStep("results");
    setTimeout(scrollTop, 100);
  };

  const accentColor = formData.city === "nyc" ? "#4ECDC4" : formData.city === "atl" ? "#E8871E" : "#6C63FF";
  const cityData = neighborhoodData[formData.city];

  const inputStyle = {
    width: "100%", padding: "14px 18px", borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
    color: "#fff", fontSize: 15, fontFamily: "var(--font-body)", outline: "none",
    transition: "border 0.2s ease",
  };

  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)",
    marginBottom: 8, display: "block", fontFamily: "var(--font-body)",
    letterSpacing: "0.03em",
  };

  if (mode === "explore") return <InternHub />;

  return (
    <div style={{
      minHeight: "100vh", background: "#08080D", color: "#fff",
      fontFamily: "'Sora', 'DM Sans', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Sora:wght@300;400;500;600;700;800&display=swap');
        :root {
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'Sora', sans-serif;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 10px; }
        input:focus, select:focus, textarea:focus {
          border-color: ${accentColor} !important;
          box-shadow: 0 0 0 3px ${accentColor}18;
        }
        select option { background: #1a1a2e; color: #fff; }
      `}</style>

      {/* Ambient BG */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-15%", width: 700, height: 700,
          borderRadius: "50%", background: `radial-gradient(circle, ${accentColor}0A 0%, transparent 65%)`,
          animation: "pulseGlow 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-25%", left: "-10%", width: 550, height: 550,
          borderRadius: "50%", background: `radial-gradient(circle, ${accentColor}06 0%, transparent 65%)`,
        }} />
      </div>

      <div ref={topRef} style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto", padding: "0 20px" }}>

        {/* ═══ NAV ═══ */}
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "22px 0", animation: "fadeSlideUp 0.5s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => { setStep("landing"); setResults([]); setMode("quiz"); }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>⌂</div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>InternNest</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mode === "quiz" && step !== "landing" && (
              <button onClick={() => { setStep("landing"); setResults([]); }} style={{
                padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: 13,
                cursor: "pointer", fontFamily: "var(--font-body)",
              }}>
                ← Back
              </button>
            )}
          </div>
        </nav>


        {/* ═══════════════════════ QUIZ MODE ═══════════════════════ */}
        {mode === "quiz" && step === "landing" && (
          <div style={{ animation: "fadeSlideUp 0.6s ease" }}>
            {/* Hero */}
            <section style={{ textAlign: "center", padding: "60px 0 50px" }}>
              <div style={{
                display: "inline-block", padding: "6px 18px", borderRadius: 100,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 28,
                fontFamily: "var(--font-body)", letterSpacing: "0.04em",
              }}>
                Summer 2026 — Atlanta & New York City
              </div>

              <h1 style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(38px, 6vw, 58px)",
                fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.015em",
                maxWidth: 600, margin: "0 auto",
              }}>
                Your internship city,{" "}
                <span style={{ fontStyle: "italic", color: accentColor }}>decoded.</span>
              </h1>

              <p style={{
                fontSize: 17, color: "rgba(255,255,255,0.45)", marginTop: 22,
                maxWidth: 480, margin: "22px auto 0", lineHeight: 1.7,
                fontFamily: "var(--font-body)",
              }}>
                Tell us where you're interning. We'll match you with the right neighborhood, transit tips, and a community of other interns — free.
              </p>

              <button onClick={() => { setStep("form"); setTimeout(scrollTop, 100); }} style={{
                marginTop: 36, padding: "16px 44px", borderRadius: 100, border: "none",
                background: accentColor, color: "#fff", fontSize: 16, fontWeight: 700,
                cursor: "pointer", fontFamily: "var(--font-body)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: `0 4px 24px ${accentColor}40`,
              }}
                onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 32px ${accentColor}50`; }}
                onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 24px ${accentColor}40`; }}
              >
                Get My Neighborhood Match →
              </button>
            </section>

            {/* How it works */}
            <section style={{ padding: "40px 0 60px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {[
                  { step: "01", title: "Tell us about your internship", desc: "City, dates, company, budget, and what matters most to you.", icon: "📝" },
                  { step: "02", title: "Get matched to neighborhoods", desc: "We rank neighborhoods by commute, cost, safety, and vibe — personalized for you.", icon: "🗺️" },
                  { step: "03", title: "Join your intern community", desc: "We'll add you to a Slack/GroupMe with other interns in your city this summer.", icon: "💬" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)", borderRadius: 20, padding: 26,
                    border: "1px solid rgba(255,255,255,0.06)",
                    animation: `fadeSlideUp 0.5s ease ${0.15 + i * 0.1}s both`,
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, color: accentColor, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8, fontFamily: "var(--font-body)" }}>STEP {item.step}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 19, marginBottom: 8 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Social proof */}
            <section style={{
              padding: "36px 0 50px", textAlign: "center",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 20, fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
                BUILT FOR INTERNS AT
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", opacity: 0.35, fontSize: 15, fontWeight: 600 }}>
                {["Google", "Goldman Sachs", "McKinsey", "Meta", "Coca-Cola", "Amazon", "Deloitte"].map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ═══════════════════════ INTAKE FORM ═══════════════════════ */}
        {mode === "quiz" && step === "form" && (
          <div style={{ padding: "32px 0 60px", animation: "fadeSlideUp 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400 }}>
                Tell us about your <span style={{ fontStyle: "italic", color: accentColor }}>summer</span>
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 10, fontFamily: "var(--font-body)" }}>
                Takes ~2 minutes. We'll use this to find your best neighborhood.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {/* Row: Name + Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Your name *</label>
                  <input style={inputStyle} placeholder="First Last" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input style={inputStyle} type="email" placeholder="you@school.edu" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              {/* School + Company */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>School</label>
                  <input style={inputStyle} placeholder="University of..." value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Company / org you're interning at</label>
                  <input style={inputStyle} placeholder="e.g. Google, Deloitte" value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                </div>
              </div>

              {/* City */}
              <div>
                <label style={labelStyle}>Internship city *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { id: "atl", label: "Atlanta", emoji: "🍑" },
                    { id: "nyc", label: "New York City", emoji: "🗽" },
                  ].map((c) => (
                    <div key={c.id} onClick={() => setFormData({ ...formData, city: c.id })} style={{
                      padding: "18px 22px", borderRadius: 16, cursor: "pointer",
                      background: formData.city === c.id ? `${c.id === "atl" ? "#E8871E" : "#4ECDC4"}15` : "rgba(255,255,255,0.03)",
                      border: formData.city === c.id ? `2px solid ${c.id === "atl" ? "#E8871E" : "#4ECDC4"}50` : "1px solid rgba(255,255,255,0.08)",
                      transition: "all 0.25s ease",
                      display: "flex", alignItems: "center", gap: 14,
                    }}>
                      <span style={{ fontSize: 30 }}>{c.emoji}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: formData.city === c.id ? "#fff" : "rgba(255,255,255,0.6)" }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry + Budget */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Industry</label>
                  <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })}>
                    <option value="">Select...</option>
                    {["Tech", "Finance", "Consulting", "Healthcare", "Startups", "Creative", "Government", "Nonprofit", "Legal", "Media", "Education"].map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Monthly budget</label>
                  <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })}>
                    <option value="">Select...</option>
                    <option value="under1500">Under $1,500</option>
                    <option value="1500-2000">$1,500 – $2,000</option>
                    <option value="2000-2500">$2,000 – $2,500</option>
                    <option value="over2500">$2,500+</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Start date</label>
                  <input style={inputStyle} type="date" value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>End date</label>
                  <input style={inputStyle} type="date" value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>

              {/* Priorities */}
              <div>
                <label style={labelStyle}>What matters most? (select all that apply)</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { id: "commute", label: "Short commute", icon: "🚇" },
                    { id: "cost", label: "Low cost", icon: "💰" },
                    { id: "safety", label: "Safety", icon: "🛡️" },
                    { id: "vibe", label: "Neighborhood vibe", icon: "✨" },
                  ].map((p) => (
                    <div key={p.id} onClick={() => handlePriorityToggle(p.id)} style={{
                      padding: "10px 18px", borderRadius: 100, cursor: "pointer",
                      background: formData.priorities.includes(p.id) ? `${accentColor}20` : "rgba(255,255,255,0.04)",
                      border: formData.priorities.includes(p.id) ? `1.5px solid ${accentColor}60` : "1px solid rgba(255,255,255,0.08)",
                      color: formData.priorities.includes(p.id) ? accentColor : "rgba(255,255,255,0.55)",
                      fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 500,
                      transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: 8,
                    }}>
                      {p.icon} {p.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Community opt-in */}
              <div onClick={() => setFormData({ ...formData, wantCommunity: !formData.wantCommunity })} style={{
                display: "flex", gap: 14, alignItems: "center", padding: "18px 22px",
                background: "rgba(255,255,255,0.03)", borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                  background: formData.wantCommunity ? accentColor : "transparent",
                  border: formData.wantCommunity ? "none" : "2px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease", fontSize: 14, color: "#fff",
                }}>
                  {formData.wantCommunity && "✓"}
                </div>
                <div>
                  <div style={{ fontSize: 15, color: "#fff", fontFamily: "var(--font-body)", fontWeight: 500 }}>
                    Add me to the intern community
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 3, fontFamily: "var(--font-body)" }}>
                    Join a Slack/GroupMe with other interns in your city this summer
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.email || !formData.city}
                style={{
                  padding: "16px 40px", borderRadius: 100, border: "none",
                  background: (!formData.name || !formData.email || !formData.city) ? "rgba(255,255,255,0.1)" : accentColor,
                  color: (!formData.name || !formData.email || !formData.city) ? "rgba(255,255,255,0.3)" : "#fff",
                  fontSize: 16, fontWeight: 700, cursor: (!formData.name || !formData.email || !formData.city) ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-body)", marginTop: 8,
                  boxShadow: (!formData.name || !formData.email || !formData.city) ? "none" : `0 4px 24px ${accentColor}40`,
                  transition: "all 0.3s ease", alignSelf: "center",
                }}
              >
                Show Me My Matches →
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════ RESULTS ═══════════════════════ */}
        {mode === "quiz" && step === "results" && cityData && (
          <div style={{ padding: "32px 0 60px", animation: "fadeSlideUp 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: accentColor, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: "var(--font-body)" }}>
                {cityData.emoji} {cityData.city} — Neighborhood Matches for {formData.name.split(" ")[0] || "You"}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 400 }}>
                Your top picks, <span style={{ fontStyle: "italic", color: accentColor }}>ranked</span>
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 10, fontFamily: "var(--font-body)", maxWidth: 500, margin: "10px auto 0" }}>
                Based on your priorities{formData.industry ? `, ${formData.industry} industry` : ""}{formData.budget ? ", and budget" : ""}.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {results.map((n, i) => (
                <NeighborhoodCard key={n.name} n={n} rank={i} isTop={i === 0} />
              ))}
            </div>

            {/* Community CTA */}
            {formData.wantCommunity && (
              <div style={{
                marginTop: 36, padding: 32, borderRadius: 22, textAlign: "center",
                background: `linear-gradient(135deg, ${accentColor}14, ${accentColor}06)`,
                border: `1px solid ${accentColor}30`,
                animation: "fadeSlideUp 0.5s ease 0.4s both",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>💬</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 8 }}>
                  Join the {cityData.city} Intern Community
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 20, fontFamily: "var(--font-body)", maxWidth: 400, margin: "0 auto 20px" }}>
                  Connect with other interns arriving in {cityData.city} this summer. Share tips, find roommates, plan events.
                </div>
                <button style={{
                  padding: "14px 36px", borderRadius: 100, border: "none",
                  background: accentColor, color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "var(--font-body)",
                  boxShadow: `0 4px 24px ${accentColor}40`,
                }}>
                  Join Slack Community →
                </button>
              </div>
            )}

            {/* ═══ FEEDBACK SURVEY (MVE MEASUREMENT) ═══ */}
            <div style={{
              marginTop: 40, padding: 32, borderRadius: 22,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            }}>
              {!feedbackSubmitted ? (
                <>
                  <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ fontSize: 13, color: accentColor, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8, fontFamily: "var(--font-body)" }}>
                      QUICK FEEDBACK
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>
                      Help us make this better
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6, fontFamily: "var(--font-body)" }}>
                      3 quick questions — takes 30 seconds
                    </div>
                  </div>

                  {/* Q1: Useful? */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 12, fontFamily: "var(--font-body)", fontWeight: 500 }}>
                      Would you use this to help make your housing decision?
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {["Definitely", "Probably", "Not sure", "No"].map((opt) => (
                        <button key={opt} onClick={() => setFeedback({ ...feedback, useful: opt })} style={{
                          padding: "9px 18px", borderRadius: 100, fontSize: 13, fontFamily: "var(--font-body)",
                          background: feedback.useful === opt ? `${accentColor}20` : "rgba(255,255,255,0.04)",
                          border: feedback.useful === opt ? `1.5px solid ${accentColor}60` : "1px solid rgba(255,255,255,0.08)",
                          color: feedback.useful === opt ? accentColor : "rgba(255,255,255,0.5)",
                          cursor: "pointer", fontWeight: 500, transition: "all 0.2s ease",
                        }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2: Time saved */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 12, fontFamily: "var(--font-body)", fontWeight: 500 }}>
                      Did this save you time vs. researching on your own?
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {["Saved hours", "Saved some time", "About the same", "I'd rather do it myself"].map((opt) => (
                        <button key={opt} onClick={() => setFeedback({ ...feedback, timeSaved: opt })} style={{
                          padding: "9px 18px", borderRadius: 100, fontSize: 13, fontFamily: "var(--font-body)",
                          background: feedback.timeSaved === opt ? `${accentColor}20` : "rgba(255,255,255,0.04)",
                          border: feedback.timeSaved === opt ? `1.5px solid ${accentColor}60` : "1px solid rgba(255,255,255,0.08)",
                          color: feedback.timeSaved === opt ? accentColor : "rgba(255,255,255,0.5)",
                          cursor: "pointer", fontWeight: 500, transition: "all 0.2s ease",
                        }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q3: Pay/Refer */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 12, fontFamily: "var(--font-body)", fontWeight: 500 }}>
                      Would you pay for a premium version or refer a friend?
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {["Would pay", "Would refer", "Both", "Neither"].map((opt) => (
                        <button key={opt} onClick={() => setFeedback({ ...feedback, wouldPay: opt })} style={{
                          padding: "9px 18px", borderRadius: 100, fontSize: 13, fontFamily: "var(--font-body)",
                          background: feedback.wouldPay === opt ? `${accentColor}20` : "rgba(255,255,255,0.04)",
                          border: feedback.wouldPay === opt ? `1.5px solid ${accentColor}60` : "1px solid rgba(255,255,255,0.08)",
                          color: feedback.wouldPay === opt ? accentColor : "rgba(255,255,255,0.5)",
                          cursor: "pointer", fontWeight: 500, transition: "all 0.2s ease",
                        }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div style={{ marginBottom: 20 }}>
                    <textarea
                      placeholder="Anything else? What would make this more useful?"
                      value={feedback.comments}
                      onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                      style={{
                        ...inputStyle, minHeight: 80, resize: "vertical",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                  </div>

                  <button onClick={() => setFeedbackSubmitted(true)} style={{
                    padding: "12px 32px", borderRadius: 100, border: "none",
                    background: accentColor, color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "var(--font-body)",
                  }}>
                    Submit Feedback
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>🙌</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 8 }}>Thanks, {formData.name.split(" ")[0]}!</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}>
                    Your feedback helps us build something interns actually need.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          padding: "32px 0 40px", borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>⌂</div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>InternNest</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-body)" }}>
            © 2026 InternNest · Built for interns, by interns
          </div>
        </footer>
      </div>
    </div>
  );
}
