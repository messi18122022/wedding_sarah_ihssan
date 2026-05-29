export default function Gifts() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f0604", paddingTop: "4.5rem" }}>
      <main className="max-w-2xl mx-auto px-6 py-12 text-center">

        {/* Header */}
        <div style={{ animation: "fadeInUp 0.6s ease 0.1s both" }}>
          <div style={{ color: "#c9a84c", fontSize: "1.5rem", marginBottom: "0.5rem" }}>✦ ❧ ✦</div>
          <h1 style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>
            Gifts
          </h1>
          <div style={{ color: "#c9a84c", fontSize: "1.5rem", marginTop: "0.5rem" }}>✦ ❧ ✦</div>
        </div>

        {/* Placeholder */}
        <div
          style={{
            marginTop: "3rem",
            border: "1px solid rgba(201,168,76,0.3)",
            background: "rgba(201,168,76,0.04)",
            padding: "4rem 2rem",
            animation: "fadeInUp 0.6s ease 0.3s both",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🎁</div>
          <p style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "1rem", fontWeight: 300 }}>
            Coming Soon
          </p>
          <p style={{ color: "#e8d5a3", fontSize: "0.95rem", lineHeight: 1.8, opacity: 0.8, maxWidth: "420px", margin: "0 auto" }}>
            Your presence at our wedding is the greatest gift of all. If you wish to contribute to our honeymoon or future together, a gift option will be available here soon.
          </p>
        </div>

        <div style={{ color: "#c9a84c", fontSize: "1.5rem", marginTop: "3rem", animation: "fadeInUp 0.6s ease 0.5s both" }}>
          ✦ ❧ ✦
        </div>

      </main>
    </div>
  );
}
