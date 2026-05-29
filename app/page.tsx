"use client";

import { useEffect, useState } from "react";

const WEDDING_DATE = new Date("2026-09-06T17:00:00");

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function update() {
      const now = new Date();
      const diff = WEDDING_DATE.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center" style={{ gap: "min(1.5rem, 3vw)" }}>
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="flex items-center justify-center font-bold"
            style={{
              width: "min(5rem, 21vw)",
              height: "min(5rem, 21vw)",
              fontSize: "min(1.75rem, 5.5vw)",
              background: "rgba(201,168,76,0.15)",
              border: "2px solid #c9a84c",
              color: "#c9a84c",
              clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
            }}
          >
            {String(value).padStart(2, "0")}
          </div>
          <span className="text-xs mt-2 tracking-widest uppercase" style={{ color: "#c9a84c" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Persian carpet SVG pattern as background
function CarpetBackground() {
  return (
    <svg
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.08 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="carpet" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Outer diamond */}
          <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="#7b2d3e" strokeWidth="1.5"/>
          {/* Inner diamond */}
          <polygon points="40,16 64,40 40,64 16,40" fill="none" stroke="#c9a84c" strokeWidth="1"/>
          {/* Center star */}
          <polygon points="40,28 44,36 52,36 46,42 48,50 40,45 32,50 34,42 28,36 36,36" fill="#7b2d3e" stroke="#c9a84c" strokeWidth="0.5"/>
          {/* Corner crosses */}
          <line x1="0" y1="0" x2="8" y2="8" stroke="#c9a84c" strokeWidth="0.8"/>
          <line x1="8" y1="0" x2="0" y2="8" stroke="#c9a84c" strokeWidth="0.8"/>
          <line x1="72" y1="0" x2="80" y2="8" stroke="#c9a84c" strokeWidth="0.8"/>
          <line x1="80" y1="0" x2="72" y2="8" stroke="#c9a84c" strokeWidth="0.8"/>
          <line x1="0" y1="72" x2="8" y2="80" stroke="#c9a84c" strokeWidth="0.8"/>
          <line x1="8" y1="72" x2="0" y2="80" stroke="#c9a84c" strokeWidth="0.8"/>
          <line x1="72" y1="72" x2="80" y2="80" stroke="#c9a84c" strokeWidth="0.8"/>
          <line x1="80" y1="72" x2="72" y2="80" stroke="#c9a84c" strokeWidth="0.8"/>
          {/* Side ornaments */}
          <circle cx="40" cy="0" r="2" fill="#c9a84c"/>
          <circle cx="40" cy="80" r="2" fill="#c9a84c"/>
          <circle cx="0" cy="40" r="2" fill="#c9a84c"/>
          <circle cx="80" cy="40" r="2" fill="#c9a84c"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#carpet)"/>
    </svg>
  );
}

// Ornate border frame
function CarpetFrame() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      {/* Outer border */}
      <div style={{
        position: "absolute", inset: "12px",
        border: "2px solid #c9a84c",
        opacity: 0.6,
      }}/>
      {/* Inner border */}
      <div style={{
        position: "absolute", inset: "20px",
        border: "1px solid #7b2d3e",
        opacity: 0.4,
      }}/>
      {/* Corner diamonds */}
      {[
        { top: 6, left: 6 }, { top: 6, right: 6 },
        { bottom: 6, left: 6 }, { bottom: 6, right: 6 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos,
          width: 16, height: 16,
          background: "#c9a84c",
          transform: "rotate(45deg)",
          opacity: 0.8,
        }}/>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Real carpet image as background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "url('/carpet.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}/>
      {/* Dark overlay so text stays readable */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "rgba(20, 8, 4, 0.85)",
      }}/>
      <CarpetFrame />

      <main
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{ zIndex: 2, minHeight: "100vh", paddingTop: "5rem", paddingBottom: "2rem", gap: "0" }}
      >
        {/* Top ornament */}
        <div className="fade-in-up text-2xl" style={{ color: "#c9a84c", marginBottom: "0.5rem" }}>
          ✦ ❧ ✦
        </div>

        {/* Bismillah */}
        <p className="fade-in-up" style={{ color: "#c9a84c", fontFamily: "serif", fontSize: "clamp(1.5rem, 4vw, 2.4rem)", textShadow: "0 2px 12px rgba(0,0,0,0.8)", marginBottom: "0.3rem" }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="fade-in-up tracking-wider italic" style={{ fontSize: "1rem", color: "#e8d5a3", textShadow: "0 1px 6px rgba(0,0,0,0.8)", marginBottom: "1.4rem" }}>
          In the name of God, the Most Gracious, the Most Merciful
        </p>

        {/* Names */}
        <h1
          className="fade-in-up font-light"
          style={{ color: "#c9a84c", fontFamily: "Georgia, serif", letterSpacing: "0.08em", fontSize: "clamp(3.5rem, 11vw, 7rem)", lineHeight: 1.1, marginBottom: 0, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
        >
          Sarah
        </h1>

        {/* Ornamental divider between names */}
        <div className="fade-in-up flex items-center gap-3 w-48" style={{ margin: "0.6rem 0" }}>
          <div className="flex-1 h-px" style={{ background: "#c9a84c" }} />
          <span style={{ color: "#c9a84c", fontSize: "1.4rem" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "#c9a84c" }} />
        </div>

        <h1
          className="fade-in-up font-light"
          style={{ color: "#c9a84c", fontFamily: "Georgia, serif", letterSpacing: "0.08em", fontSize: "clamp(3.5rem, 11vw, 7rem)", lineHeight: 1.1, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
        >
          Ihssan
        </h1>

        {/* Wide divider */}
        <div className="fade-in-up-delay flex items-center gap-4 w-full max-w-sm" style={{ margin: "1.2rem 0" }}>
          <div className="flex-1 h-px" style={{ background: "#c9a84c", opacity: 0.5 }} />
          <span style={{ color: "#c9a84c" }}>❧ ✦ ❧</span>
          <div className="flex-1 h-px" style={{ background: "#c9a84c", opacity: 0.5 }} />
        </div>

        {/* Date & Location */}
        <p
          className="fade-in-up-delay tracking-[0.3em] uppercase"
          style={{ fontSize: "1.4rem", color: "#e8d5a3", marginBottom: "0.4rem", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
        >
          6 September 2026 &nbsp;·&nbsp; 17:00
        </p>
        <p
          className="fade-in-up-delay tracking-wider"
          style={{ fontSize: "1.2rem", color: "#ffffff", opacity: 0.85, letterSpacing: "0.15em", marginBottom: "1.5rem", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
        >
          Sonne Boutiquehotel &amp; Seerestaurant, Küsnacht
        </p>

        {/* Countdown */}
        <div className="fade-in-up-delay-2">
<Countdown />
        </div>
      </main>
    </div>
  );
}
