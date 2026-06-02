export default function Gallery() {
  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f5", paddingTop: "4.5rem" }}>
      <main className="max-w-3xl mx-auto px-6 py-12 text-center">

        {/* Header */}
        <div style={{ animation: "fadeInUp 0.6s ease 0.1s both" }}>
          <div style={{ color: "#b76e79", fontSize: "1.5rem", marginBottom: "0.5rem" }}>✦ ❧ ✦</div>
          <h1 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>
            Gallery
          </h1>
          <div style={{ color: "#b76e79", fontSize: "1.5rem", marginTop: "0.5rem" }}>✦ ❧ ✦</div>
        </div>

        {/* Placeholder */}
        <div
          style={{
            marginTop: "3rem",
            border: "1px solid rgba(183,110,121,0.3)",
            background: "rgba(183,110,121,0.06)",
            padding: "4rem 2rem",
            animation: "fadeInUp 0.6s ease 0.3s both",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📷</div>
          <p style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "0.75rem", fontWeight: 300 }}>
            Coming Soon
          </p>
          <p style={{ color: "#7a4a50", fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "400px", margin: "0 auto" }}>
            After the big day, this is where all the beautiful memories will live. Check back after 6 September 2026.
          </p>
        </div>

        {/* Bottom ornament */}
        <div style={{ color: "#b76e79", fontSize: "1.5rem", marginTop: "3rem", animation: "fadeInUp 0.6s ease 0.5s both" }}>
          ✦ ❧ ✦
        </div>

      </main>
    </div>
  );
}
