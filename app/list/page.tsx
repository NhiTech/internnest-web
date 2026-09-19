"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const ACCENT = "#6C63FF";
const CITIES = [
  { id: "sf", name: "San Francisco" }, { id: "ny", name: "New York" },
  { id: "bos", name: "Boston" }, { id: "chi", name: "Chicago" },
  { id: "atl", name: "Atlanta" }, { id: "sea", name: "Seattle" },
  { id: "la", name: "Los Angeles" }, { id: "dc", name: "Washington, DC" },
];
const SIZES = ["Studio", "1 Bedroom", "2 Bedroom", "Shared Room"];

const page: React.CSSProperties = {
  minHeight: "100vh", background: "#0A0A0F", color: "#fff",
  fontFamily: "'DM Sans', sans-serif", display: "flex",
  alignItems: "flex-start", justifyContent: "center", padding: "48px 20px",
  position: "relative", overflow: "hidden",
};
const card: React.CSSProperties = {
  position: "relative", zIndex: 1, width: "100%", maxWidth: 560,
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

export default function ListPage() {
  const [authState, setAuthState] = useState<"checking" | "in" | "out">("checking");
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<"form" | "done">("form");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [f, setF] = useState({
    title: "", city: CITIES[0].id, neighborhood: "", size: SIZES[0],
    price: "", startDate: "", endDate: "", leaseType: "sublease",
    amenities: "",
  });
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [lease, setLease] = useState<File | null>(null);
  const [rightToSublease, setRightToSublease] = useState(false);
  const [landlordOk, setLandlordOk] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthState("in"); // stub mode — allow posting locally
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) { setUserId(data.user.id); setAuthState("in"); }
      else setAuthState("out");
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!rightToSublease || !landlordOk) {
      setError("Please confirm both attestations before posting.");
      return;
    }
    if (!f.startDate || !f.endDate) {
      setError("Sublease start and end dates are required.");
      return;
    }
    setSending(true);

    // Save a display-ready copy locally so it shows immediately in the Housing tab.
    try {
      const user = JSON.parse(localStorage.getItem("internnest_user") || "{}");
      const local = JSON.parse(localStorage.getItem("internnest_local_listings") || "[]");
      local.push({
        id: Date.now(), cityId: f.city, title: f.title,
        price: parseInt(f.price) || 0, type: f.size,
        dates: `${f.startDate} – ${f.endDate}`,
        amenities: f.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        poster: user.name || "You", posterCompany: user.company || "",
        verified: true, img: "🏠", neighborhood: f.neighborhood || undefined,
      });
      localStorage.setItem("internnest_local_listings", JSON.stringify(local));
    } catch {}

    if (isSupabaseConfigured && supabase) {
      try {
        // upload lease doc + photos to storage
        const stamp = Date.now();
        let leaseUrl: string | null = null;
        if (lease) {
          const path = `${userId}/${stamp}-${lease.name}`;
          const { error: e1 } = await supabase.storage.from("leases").upload(path, lease);
          if (e1) throw e1;
          leaseUrl = path;
        }
        const photoPaths: string[] = [];
        if (photos) {
          for (const file of Array.from(photos)) {
            const path = `${userId}/${stamp}-${file.name}`;
            const { error: e2 } = await supabase.storage.from("listing-photos").upload(path, file);
            if (!e2) photoPaths.push(path);
          }
        }
        const { error: e3 } = await supabase.from("listings").insert({
          owner_id: userId,
          city_id: f.city,
          title: f.title,
          neighborhood: f.neighborhood,
          type: f.size,
          price: parseInt(f.price) || 0,
          start_date: f.startDate,
          end_date: f.endDate,
          lease_type: f.leaseType,
          amenities: f.amenities.split(",").map((a) => a.trim()).filter(Boolean),
          right_to_sublease: rightToSublease,
          landlord_permission: landlordOk,
          lease_doc: leaseUrl,
          photos: photoPaths,
          status: "pending", // awaits review
        });
        if (e3) throw e3;
        setStatus("done");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong uploading your listing.");
      } finally {
        setSending(false);
      }
    } else {
      setSending(false);
      setStatus("done");
    }
  };

  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        input:focus,select:focus{border-color:${ACCENT}!important;box-shadow:0 0 0 3px ${ACCENT}22}
        select option{background:#1a1a2e;color:#fff}`}</style>
      <div style={{ position: "fixed", top: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}12, transparent 65%)`, pointerEvents: "none" }} />

      <div style={card}>
        <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Back to InternNest</a>

        {authState === "checking" ? (
          <p style={{ paddingTop: 24, color: "rgba(255,255,255,0.5)" }}>Loading…</p>
        ) : authState === "out" ? (
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ fontSize: 40 }}>🔒</div>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, marginTop: 10 }}>Verify to list your place</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
              Only verified student interns can post listings — keeps housing trustworthy.
            </p>
            <a href="/login" style={{ display: "inline-block", marginTop: 22, padding: "13px 30px", borderRadius: 100, background: ACCENT, color: "#fff", fontWeight: 600, textDecoration: "none" }}>Log in / Sign up →</a>
          </div>
        ) : status === "done" ? (
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ fontSize: 40 }}>✅</div>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, marginTop: 10 }}>Listing submitted!</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
              Thanks for helping fellow interns. We&apos;ll review it and publish it shortly.
            </p>
            <a href="/" style={{ display: "inline-block", marginTop: 22, padding: "13px 30px", borderRadius: 100, background: ACCENT, color: "#fff", fontWeight: 600, textDecoration: "none" }}>Back to listings →</a>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 34, fontWeight: 400, marginTop: 18 }}>List your place</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 6, marginBottom: 24 }}>
              Short-term &amp; sublease housing for fellow verified interns.
            </p>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={label}>Title</label>
                <input required style={input} placeholder="1BR near Meta, June–Aug" value={f.title} onChange={set("title")} /></div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={label}>Lease type</label>
                  <select style={{ ...input, appearance: "none", cursor: "pointer" }} value={f.leaseType} onChange={set("leaseType")}>
                    <option value="sublease">Sublease</option>
                    <option value="month_to_month">Month-to-month</option>
                  </select></div>
                <div><label style={label}>Size</label>
                  <select style={{ ...input, appearance: "none", cursor: "pointer" }} value={f.size} onChange={set("size")}>
                    {SIZES.map((s) => <option key={s}>{s}</option>)}
                  </select></div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={label}>City</label>
                  <select style={{ ...input, appearance: "none", cursor: "pointer" }} value={f.city} onChange={set("city")}>
                    {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select></div>
                <div><label style={label}>Neighborhood</label>
                  <input style={input} placeholder="e.g. Midtown" value={f.neighborhood} onChange={set("neighborhood")} /></div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={label}>Price / month ($)</label>
                  <input required type="number" style={input} placeholder="2000" value={f.price} onChange={set("price")} /></div>
                <div><label style={label}>Amenities (comma-separated)</label>
                  <input style={input} placeholder="WiFi, Furnished, Parking" value={f.amenities} onChange={set("amenities")} /></div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={label}>Available from *</label>
                  <input required type="date" style={input} value={f.startDate} onChange={set("startDate")} /></div>
                <div><label style={label}>Available until *</label>
                  <input required type="date" style={input} value={f.endDate} onChange={set("endDate")} /></div>
              </div>

              <div><label style={label}>Photos</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setPhotos(e.target.files)} style={{ ...input, padding: 10 }} /></div>

              <div><label style={label}>Lease / proof of right to sublease (optional, private)</label>
                <input type="file" accept="image/*,application/pdf" onChange={(e) => setLease(e.target.files?.[0] ?? null)} style={{ ...input, padding: 10 }} /></div>

              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                <input type="checkbox" checked={rightToSublease} onChange={(e) => setRightToSublease(e.target.checked)} style={{ marginTop: 3 }} />
                I confirm I have the right to sublease this place.
              </label>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                <input type="checkbox" checked={landlordOk} onChange={(e) => setLandlordOk(e.target.checked)} style={{ marginTop: 3 }} />
                My lease allows subletting / I have landlord permission.
              </label>

              {error && <p style={{ color: "#ff6b6b", fontSize: 13 }}>{error}</p>}

              <button type="submit" disabled={sending} style={{ marginTop: 6, padding: "14px", borderRadius: 100, border: "none", background: ACCENT, color: "#fff", fontSize: 15, fontWeight: 700, cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1, boxShadow: `0 4px 24px ${ACCENT}40` }}>
                {sending ? "Submitting…" : "Submit listing"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
