const page: React.CSSProperties = {
  minHeight: "100vh", background: "#0A0A0F", color: "#fff",
  fontFamily: "'DM Sans', sans-serif", padding: "48px 20px",
};
const wrap: React.CSSProperties = { maxWidth: 720, margin: "0 auto", lineHeight: 1.7 };
const h2: React.CSSProperties = { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, marginTop: 28, marginBottom: 6 };
const p: React.CSSProperties = { color: "rgba(255,255,255,0.7)", fontSize: 15, marginTop: 8 };

export const metadata = { title: "Terms of Service — InternNest" };

export default function Terms() {
  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif&display=swap');`}</style>
      <div style={wrap}>
        <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Back to InternNest</a>
        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 40, fontWeight: 400, marginTop: 16 }}>Terms of Service</h1>
        <p style={{ ...p, color: "rgba(255,255,255,0.45)" }}>Last updated: 2026. This is a starting template — review with legal counsel before launch.</p>

        <h2 style={h2}>1. Who can use InternNest</h2>
        <p style={p}>InternNest is for verified students completing internships. You must sign up with a valid <b>.edu</b> email. You&apos;re responsible for keeping your account secure.</p>

        <h2 style={h2}>2. Listings &amp; subleases</h2>
        <p style={p}>InternNest is a platform that connects interns; we don&apos;t own, manage, or inspect any listing. Users posting a sublease affirm they have the legal right to sublet and any required landlord permission. You are responsible for your own lease terms and agreements. Verify any place before committing.</p>

        <h2 style={h2}>3. Payments &amp; safety</h2>
        <p style={p}>InternNest does not process rent or deposits. <b>Never send money off-platform</b> (Zelle, Venmo, wire) before verifying a place and person. We are not liable for disputes, losses, or agreements between users.</p>

        <h2 style={h2}>4. Conduct</h2>
        <p style={p}>No fraudulent, discriminatory, harassing, or illegal activity. We may remove listings or accounts that violate these terms. Report bad actors to us.</p>

        <h2 style={h2}>5. No warranty / liability</h2>
        <p style={p}>The service is provided &ldquo;as is.&rdquo; InternNest is not responsible for the accuracy of listings, the conduct of users, or any housing outcome. Use at your own discretion.</p>

        <h2 style={h2}>6. Changes</h2>
        <p style={p}>We may update these terms; continued use means you accept the changes. Questions? Contact the InternNest team.</p>
      </div>
    </div>
  );
}
