export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f5" }}>
      <main
        className="flex flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: "100vh", paddingTop: "5rem", paddingBottom: "2rem", gap: "0" }}
      >
        {/* Top ornament */}
        <div className="fade-in-up text-2xl" style={{ color: "#b76e79", marginBottom: "0.5rem" }}>
          ✦ ❧ ✦
        </div>

        {/* Bismillah */}
        <p className="fade-in-up" style={{ color: "#b76e79", fontFamily: "serif", fontSize: "clamp(1.5rem, 4vw, 2.4rem)", marginBottom: "0.3rem" }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        {/* Video */}
        <div
          className="fade-in-up"
          style={{
            width: "100vw",
            maxWidth: "520px",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            marginBottom: "1.2rem",
            marginTop: "1rem",
          }}
        >
          <video
            src="/video.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", display: "block", objectFit: "cover" }}
          />
        </div>

        {/* Date & Location */}
        <p
          className="fade-in-up-delay tracking-[0.2em] uppercase"
          style={{ fontSize: "1rem", color: "#3d2020", marginBottom: "0.3rem" }}
        >
          6 September 2026 &nbsp;·&nbsp; 17:00
        </p>
        <p
          className="fade-in-up-delay tracking-wider"
          style={{ fontSize: "0.85rem", color: "#7a4a50", letterSpacing: "0.1em" }}
        >
          Sonne Boutiquehotel &amp; Seerestaurant<br />Seestrasse 120, 8700 Küsnacht
        </p>
      </main>
    </div>
  );
}
