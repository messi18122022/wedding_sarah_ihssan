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
        <p className="fade-in-up tracking-wider italic" style={{ fontSize: "1rem", color: "#7a4a50", marginBottom: "1.4rem" }}>
          In the name of God, the Most Gracious, the Most Merciful
        </p>

        {/* Photo with names */}
        <div className="fade-in-up" style={{ marginBottom: "0.4rem", width: "100vw", maxWidth: "520px", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", overflow: "hidden" }}>
          <img
            src="/sarah_ihssan.jpeg"
            alt="Ihssan & Sarah"
            style={{
              width: "115%",
              marginLeft: "-15%",
              display: "block",
              objectFit: "cover",
              filter: "brightness(1.2) contrast(1.1)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          />
        </div>

        {/* Wide divider */}
        <div className="fade-in-up-delay flex items-center gap-4 w-full max-w-sm" style={{ margin: "1.2rem 0" }}>
          <div className="flex-1 h-px" style={{ background: "#b76e79", opacity: 0.4 }} />
          <span style={{ color: "#b76e79" }}>❧ ✦ ❧</span>
          <div className="flex-1 h-px" style={{ background: "#b76e79", opacity: 0.4 }} />
        </div>

        {/* Date & Location */}
        <p
          className="fade-in-up-delay tracking-[0.3em] uppercase"
          style={{ fontSize: "1.4rem", color: "#3d2020", marginBottom: "0.4rem" }}
        >
          6 September 2026 &nbsp;·&nbsp; 17:00
        </p>
        <p
          className="fade-in-up-delay tracking-wider"
          style={{ fontSize: "1.2rem", color: "#7a4a50", letterSpacing: "0.15em" }}
        >
          Sonne Boutiquehotel &amp; Seerestaurant<br />Seestrasse 120, 8700 Küsnacht
        </p>
      </main>
    </div>
  );
}
