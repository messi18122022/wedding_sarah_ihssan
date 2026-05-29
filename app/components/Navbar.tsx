"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/rsvp", label: "Attendance" },
  { href: "/program", label: "Program" },
  { href: "/gallery", label: "Gallery" },
  { href: "/directions", label: "Directions" },
  { href: "/music", label: "Music" },
  { href: "/gifts", label: "Gifts" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(20, 8, 4, 0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "2px solid #c9a84c",
        borderTop: "3px solid #c9a84c",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between" style={{ height: "4.5rem" }}>
        {/* Logo */}
        <Link href="/" style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.3rem", letterSpacing: "0.15em" }}>
          S &amp; I
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                color: pathname === href ? "#c9a84c" : "#e8d5a3",
                fontSize: "0.85rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                borderBottom: pathname === href ? "1px solid #c9a84c" : "1px solid transparent",
                paddingBottom: "2px",
                transition: "color 0.2s",
                fontFamily: "Georgia, serif",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: 22, height: 1.5, background: "#c9a84c" }}/>
          <span style={{ display: "block", width: 22, height: 1.5, background: "#c9a84c" }}/>
          <span style={{ display: "block", width: 22, height: 1.5, background: "#c9a84c" }}/>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden flex flex-col items-center gap-6 py-6"
          style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                color: pathname === href ? "#c9a84c" : "#e8d5a3",
                fontSize: "0.8rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
