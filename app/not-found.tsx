export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0F", color: "#fff",
      fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center",
    }}>
      <div style={{ fontSize: 48 }}>🪺</div>
      <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 40, fontWeight: 400, marginTop: 12 }}>
        This nest is empty
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, marginTop: 8 }}>
        We couldn&apos;t find that page.
      </p>
      <a href="/" style={{ marginTop: 22, padding: "13px 30px", borderRadius: 100, background: "#6C63FF", color: "#fff", fontWeight: 600, textDecoration: "none" }}>
        Back to InternNest →
      </a>
    </div>
  );
}
