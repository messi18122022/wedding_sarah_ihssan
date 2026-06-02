"use client";

import { useState, useEffect } from "react";

const links = [
  { id: "join-us", label: "Join Us" },
  { id: "program", label: "Program" },
  { id: "gallery", label: "Gallery" },
  { id: "directions", label: "Directions" },
  { id: "music", label: "Music" },
  { id: "gifts", label: "Gifts" },
];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  }

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(253,248,245,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "2px solid #b76e79",
        borderTop: "3px solid #b76e79",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between" style={{ height: "4.5rem" }}>
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1.3rem", letterSpacing: "0.15em", background: "none", border: "none", cursor: "pointer" }}
        >
          S &amp; I
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                color: active === id ? "#b76e79" : "#7a4a50",
                fontSize: "0.85rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                borderBottom: active === id ? "1px solid #b76e79" : "1px solid transparent",
                paddingBottom: "2px",
                transition: "color 0.2s",
                fontFamily: "Georgia, serif",
                background: "none",
                border: "none",
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderBottomColor: active === id ? "#b76e79" : "transparent",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: 22, height: 1.5, background: "#b76e79" }} />
          <span style={{ display: "block", width: 22, height: 1.5, background: "#b76e79" }} />
          <span style={{ display: "block", width: 22, height: 1.5, background: "#b76e79" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden flex flex-col items-center gap-6 py-6"
          style={{ borderTop: "1px solid rgba(183,110,121,0.2)" }}
        >
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                color: active === id ? "#b76e79" : "#7a4a50",
                fontSize: "0.8rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
