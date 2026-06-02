export default function Home() {
  const seaBlue = "#5879a2";

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(to bottom, ${seaBlue} 0%, ${seaBlue} 55%, #ffffff 85%)` }}>
      <main
        className="flex flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: "100vh", paddingTop: "5rem", paddingBottom: "0", gap: "0" }}
      >
        {/* Bismillah */}
        <p className="fade-in-up" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Scheherazade New', serif", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", marginBottom: "0.4rem", lineHeight: 1.4 }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        {/* Names */}
        <h1
          className="fade-in-up font-light"
          style={{ color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.1em", fontSize: "clamp(2rem, 8vw, 4rem)", lineHeight: 1.1, marginBottom: "0.6rem" }}
        >
          Sarah &amp; Ihssan
        </h1>

        {/* Video with overlaid text */}
        <div
          className="fade-in-up"
          style={{
            position: "relative",
            width: "100vw",
            maxWidth: "520px",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
          }}
        >
          {/* Top fade: sea blue → transparent, bleeds into video */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "22%",
            background: `linear-gradient(to bottom, ${seaBlue}, transparent)`,
            zIndex: 1,
            pointerEvents: "none",
          }} />

          <video
            src="/video.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", display: "block", objectFit: "cover" }}
          />

          {/* Bottom fade for text readability */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))",
            pointerEvents: "none",
          }} />

          {/* Text overlay */}
          <div style={{
            position: "absolute",
            bottom: "1.2rem",
            left: 0,
            right: 0,
            textAlign: "center",
            padding: "0 1rem",
            zIndex: 2,
          }}>
            <p style={{ fontSize: "1.1rem", color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.25rem", fontFamily: "Georgia, serif" }}>
              6 September 2026 &nbsp;<span style={{ fontWeight: 200, opacity: 0.7 }}>|</span>&nbsp; 17:00
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em", fontFamily: "Georgia, serif" }}>
              Sonne Boutiquehotel &amp; Seerestaurant<br />Seestrasse 120, 8700 Küsnacht
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
