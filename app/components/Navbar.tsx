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
        background: "rgba(253,247,240,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(107,90,69,0.3)",
        borderTop: "2px solid #6b5a45",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between" style={{ height: "4.5rem", position: "relative" }}>
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ color: "#6b5a45", fontFamily: "Georgia, serif", fontSize: "1.3rem", letterSpacing: "0.15em", background: "none", border: "none", cursor: "pointer" }}
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
                color: active === id ? "#6b5a45" : "#2d1a0e",
                fontSize: "0.8rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "'Jost', sans-serif",
                fontWeight: active === id ? 400 : 300,
                borderBottom: "none",
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderBottomColor: active === id ? "#6b5a45" : "transparent",
                paddingBottom: "2px",
                transition: "color 0.2s",
                background: "none",
                border: "none",
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
          <span style={{ display: "block", width: 22, height: 1.5, background: "#6b5a45" }} />
          <span style={{ display: "block", width: 22, height: 1.5, background: "#6b5a45" }} />
          <span style={{ display: "block", width: 22, height: 1.5, background: "#6b5a45" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden flex flex-col items-center gap-6 py-6"
          style={{ borderTop: "1px solid rgba(107,90,69,0.15)" }}
        >
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                color: "#6b5a45",
                fontSize: "0.8rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontFamily: "'Jost', sans-serif",
                fontWeight: 400,
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
