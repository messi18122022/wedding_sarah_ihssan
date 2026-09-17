"use client";

import { useLang } from "@/app/contexts/LanguageContext";
import Gallery from "@/app/components/Gallery";

// ─── Layout ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0 2rem", margin: "0" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(107,90,69,0.35))" }} />
      <span style={{ color: "#6b5a45", fontSize: "1rem" }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(107,90,69,0.35))" }} />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const { t } = useLang();

  // Warmes Grau — hell genug für weisse Schrift darauf (Kontrast ~5.2:1).
  const heroTop = "#6f6c67";
  const heroMid = "#6f6c67";

  return (
    <div style={{ background: "#fdf7f0" }}>

      {/* ── HOME ── */}
      <section id="home" style={{ background: `linear-gradient(to bottom, ${heroTop} 0%, ${heroTop} 55%, #fdf7f0 85%)` }}>
        <main
          className="flex flex-col items-center justify-start px-6 text-center"
          style={{ paddingTop: "5rem", paddingBottom: "3rem", gap: "0" }}
        >
          <p className="fade-in-up keep-scheherazade" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Scheherazade New', serif", fontSize: "clamp(1.2rem, 3.5vw, 1.9rem)", marginBottom: "0.4rem", lineHeight: 1.4 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="fade-in-up font-light keep-cormorant" style={{ color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", letterSpacing: "0.1em", fontSize: "clamp(2rem, 8vw, 4rem)", lineHeight: 1.1, marginBottom: "0.6rem" }}>
            Sarah &amp; Ihssan
          </h1>
          <div className="fade-in-up" style={{ position: "relative", width: "100vw", maxWidth: "520px", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "22%", background: `linear-gradient(to bottom, ${heroMid}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
            {/* Titelbild — liegt fertig skaliert in public/, daher kein next/image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero.jpg"
              alt="Sarah &amp; Ihssan"
              width={1200}
              height={1800}
              fetchPriority="high"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))", pointerEvents: "none" }} />
            <div dir="ltr" style={{ position: "absolute", bottom: "1.2rem", left: 0, right: 0, textAlign: "center", padding: "0 1rem", zIndex: 2 }}>
              <p className="keep-jost" style={{ fontSize: "1.1rem", color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Jost', sans-serif" }}>
                6 September 2026
              </p>
            </div>
          </div>
        </main>
      </section>

      <Divider />

      {/* ── GALLERY ── */}
      <section id="gallery" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.gallery.title}</h2>
          <Gallery />
        </div>
      </section>

      <Divider />

      {/* ── GIFTS ── */}
      <section id="gifts" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.gifts.title}</h2>
          <div style={{ marginTop: "3rem" }}>
            <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="#6b5a45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="26" width="48" height="30" rx="2" />
                <rect x="4" y="18" width="52" height="10" rx="2" />
                <line x1="30" y1="18" x2="30" y2="56" />
                <line x1="4" y1="23" x2="56" y2="23" />
                <path d="M30,18 C26,14 18,10 16,14 C14,18 22,20 30,18" />
                <path d="M30,18 C34,14 42,10 44,14 C46,18 38,20 30,18" />
                <circle cx="30" cy="18" r="2" fill="#6b5a45" stroke="none" />
              </svg>
            </div>

            <p style={{ color: "#4a3728", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.1rem, 3vw, 1.3rem)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.8, maxWidth: "420px", margin: "0 auto 2rem" }}>
              {t.gifts.text}
            </p>

            <a
              href="https://revolut.me/moini77"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "0.9rem 2.5rem",
                border: "1px solid #6b5a45",
                color: "#6b5a45",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 400,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#6b5a45"; e.currentTarget.style.color = "#fdf7f0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b5a45"; }}
            >
              {t.gifts.button}
            </a>

            <p style={{ color: "#8a7060", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 200, marginTop: "1rem", letterSpacing: "0.05em" }}>
              {t.gifts.note}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
