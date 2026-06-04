"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLang } from "@/app/contexts/LanguageContext";

const BelowFold = dynamic(() => import("./components/BelowFold"), { ssr: false });

export default function Home() {
  const { t } = useLang();
  const heroTop = "#5879a2";
  const heroMid = "#5879a2";

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [belowFoldReady, setBelowFoldReady] = useState(false);

  useEffect(() => {
    const target = new Date("2026-09-06T15:00:00Z");
    function tick() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Load below-fold content once the browser is idle after the hero has painted
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setBelowFoldReady(true));
      return () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => setBelowFoldReady(true), 200);
      return () => clearTimeout(id);
    }
  }, []);

  const countdownItems = [
    { value: timeLeft.days, label: t.countdown.days },
    { value: timeLeft.hours, label: t.countdown.hours },
    { value: timeLeft.minutes, label: t.countdown.min },
    { value: timeLeft.seconds, label: t.countdown.sec },
  ];

  return (
    <div style={{ background: "#fdf7f0" }}>

      {/* ── HOME ── */}
      <section id="home" style={{ background: `linear-gradient(to bottom, ${heroTop} 0%, ${heroTop} 55%, #fdf7f0 85%)` }}>
        <main
          className="flex flex-col items-center justify-start px-6 text-center"
          style={{ paddingTop: "5rem", paddingBottom: "0", gap: "0" }}
        >
          <p className="fade-in-up" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Scheherazade New', serif", fontSize: "clamp(1.2rem, 3.5vw, 1.9rem)", marginBottom: "0.4rem", lineHeight: 1.4 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="fade-in-up font-light" style={{ color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", letterSpacing: "0.1em", fontSize: "clamp(2rem, 8vw, 4rem)", lineHeight: 1.1, marginBottom: "0.6rem" }}>
            Sarah &amp; Ihssan
          </h1>
          <div className="fade-in-up" style={{ position: "relative", width: "100vw", maxWidth: "520px", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "22%", background: `linear-gradient(to bottom, ${heroMid}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
            <video
              src="/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              style={{ width: "100%", display: "block", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "1.2rem", left: 0, right: 0, textAlign: "center", padding: "0 1rem", zIndex: 2 }}>
              <p style={{ fontSize: "1.1rem", color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.25rem", fontFamily: "'Jost', sans-serif" }}>
                6 September 2026 &nbsp;<span style={{ fontWeight: 200, opacity: 0.7 }}>|</span>&nbsp; 17:00
              </p>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em", fontFamily: "'Jost', sans-serif" }}>
                Sonne Boutiquehotel &amp; Seerestaurant<br />Seestrasse 120, 8700 Küsnacht
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div style={{ textAlign: "center", padding: "1.4rem 0 1.5rem", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1.2rem, 5vw, 2.5rem)" }}>
              {countdownItems.map(({ value, label }) => (
                <div key={label} style={{ textAlign: "center", minWidth: "3rem" }}>
                  <div style={{ fontSize: "clamp(1.8rem, 7vw, 2.6rem)", fontWeight: 300, color: "#4a3728", fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1 }}>
                    {String(value).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "0.62rem", letterSpacing: "0.2em", color: "#8a7060", textTransform: "uppercase", fontFamily: "'Jost', sans-serif", marginTop: "0.3rem" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </section>

      {belowFoldReady && <BelowFold />}
    </div>
  );
}
