const page: React.CSSProperties = {
  minHeight: "100vh", background: "#0A0A0F", color: "#fff",
  fontFamily: "'DM Sans', sans-serif", padding: "48px 20px",
};
const wrap: React.CSSProperties = { maxWidth: 720, margin: "0 auto", lineHeight: 1.7 };
const h2: React.CSSProperties = { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, marginTop: 28, marginBottom: 6 };
const p: React.CSSProperties = { color: "rgba(255,255,255,0.7)", fontSize: 15, marginTop: 8 };

export const metadata = { title: "Privacy Policy — InternNest" };

export default function Privacy() {
  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif&display=swap');`}</style>
      <div style={wrap}>
        <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Back to InternNest</a>
        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 40, fontWeight: 400, marginTop: 16 }}>Privacy Policy</h1>
        <p style={{ ...p, color: "rgba(255,255,255,0.45)" }}>Last updated: 2026. Starting template — review with legal counsel before launch.</p>

        <h2 style={h2}>What we collect</h2>
        <p style={p}>Your <b>.edu</b> email (for student verification), and the profile info you provide — name, school, company, internship city, dates, budget, interests, bio, and optional LinkedIn. If you post a listing, the details and any files you upload.</p>

        <h2 style={h2}>How we use it</h2>
        <p style={p}>To verify you&apos;re a student, personalize housing and community, connect you with other verified interns, and operate the service. We don&apos;t sell your personal data.</p>

        <h2 style={h2}>What&apos;s visible to others</h2>
        <p style={p}>Your profile (name, company, city, interests, bio, LinkedIn) is visible to other verified interns so you can connect. Your email and uploaded lease documents are <b>not</b> public.</p>

        <h2 style={h2}>Storage &amp; deletion</h2>
        <p style={p}>Data is stored with our infrastructure providers (e.g. Supabase, Vercel). You can request deletion of your account and data by contacting us.</p>

        <h2 style={h2}>Contact</h2>
        <p style={p}>Questions about your data? Reach out to the InternNest team.</p>
      </div>
    </div>
  );
}
