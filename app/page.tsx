"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

type Guest = { first_name: string; last_name: string; meal: string; allergies: string };
type Track = { trackId: number; trackName: string; artistName: string; artworkUrl100: string };
type Wish = { song_title: string; artist: string; cover_url: string };

// ─── Data ────────────────────────────────────────────────────────────────────

const MEALS = [
  {
    id: "Beef (Halal)",
    title: "Beef (Halal)",
    description: "Pan-seared beef entrecôte with homemade Café de Paris sauce, seasonal vegetables and roasted potatoes",
  },
  {
    id: "Fish",
    title: "Fish",
    description: "Crispy skin-on pike-perch fillet with saffron foam, seasonal vegetables and roasted potatoes",
  },
  {
    id: "Vegan",
    title: "Vegan",
    description: "Organic lemon-thyme raviolo grande on saffron-coconut sauce with seasonal market vegetables and smoked tofu",
  },
];

const events = [
  { time: "17:00", title: "Apéro", description: "Welcome drinks and canapés by the lake", icon: "🥂" },
  { time: "18:30", title: "Dinner", description: "A festive dinner with family and friends", icon: "🍽️" },
  { time: "20:00", title: "Cake Cutting", description: "The sweetest moment of the evening", icon: "🎂" },
  { time: "21:00", title: "Dance Party", description: "The night is young — let's celebrate!", icon: "🎶" },
  { time: "00:00", title: "Last Dance", description: "One final dance to close a perfect evening", icon: "✨" },
];

// ─── Program icons ───────────────────────────────────────────────────────────

const c = "#6b5a45";
const s = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function IconGlasses() {
  // wider viewBox so glasses don't clip when swinging outward
  return (
    <svg width="72" height="52" viewBox="-10 0 72 52" fill="none" stroke={c} strokeWidth="1.6" {...s}>
      {/* Left flute */}
      <g style={{ transformOrigin: "14px 44px", animation: "clinkLeft 2.4s ease-in-out infinite" }}>
        <path d="M10,8 L8,36 L20,36 L18,8 Z" />
        <line x1="14" y1="36" x2="14" y2="44" />
        <line x1="10" y1="44" x2="18" y2="44" />
        <line x1="10" y1="12" x2="19" y2="12" strokeOpacity="0.4" />
      </g>
      {/* Right flute */}
      <g style={{ transformOrigin: "38px 44px", animation: "clinkRight 2.4s ease-in-out infinite" }}>
        <path d="M34,8 L32,36 L44,36 L42,8 Z" />
        <line x1="38" y1="36" x2="38" y2="44" />
        <line x1="34" y1="44" x2="42" y2="44" />
        <line x1="33" y1="12" x2="42" y2="12" strokeOpacity="0.4" />
      </g>
      {/* Sparkle */}
      <g style={{ transformOrigin: "26px 10px", animation: "sparkle 2.4s ease-in-out infinite" }}>
        <line x1="26" y1="6" x2="26" y2="14" strokeWidth="1.2" />
        <line x1="22" y1="10" x2="30" y2="10" strokeWidth="1.2" />
        <line x1="23" y1="7" x2="29" y2="13" strokeWidth="1" />
        <line x1="29" y1="7" x2="23" y2="13" strokeWidth="1" />
      </g>
    </svg>
  );
}

function IconCandle() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke={c} strokeWidth="1.6" {...s}>
      {/* Flame */}
      <path
        d="M26,6 C24,10 21,13 21,17 C21,21 23,23 26,23 C29,23 31,21 31,17 C31,13 28,10 26,6 Z"
        style={{ transformOrigin: "26px 17px", animation: "flicker 1.8s ease-in-out infinite" }}
      />
      {/* Candle body */}
      <rect x="20" y="24" width="12" height="22" rx="1" />
      {/* Wick */}
      <line x1="26" y1="23" x2="26" y2="25" strokeWidth="1" />
    </svg>
  );
}

function IconCake() {
  const fill1 = "rgba(107,90,69,0.13)";
  const fill2 = "rgba(107,90,69,0.22)";
  return (
    <svg width="52" height="56" viewBox="0 0 52 56" fill="none" stroke={c} strokeWidth="1.3" {...s}>
      <g style={{ transformOrigin: "26px 36px", animation: "float 3.2s ease-in-out infinite" }}>
        {/* ── Bottom tier ── */}
        <rect x="4" y="36" width="44" height="12" rx="1" fill={fill1} />
        {/* 3-D top face ellipse */}
        <ellipse cx="26" cy="36" rx="22" ry="5.5" fill={fill2} />
        {/* Frosting drips */}
        {[9,17,26,35,43].map((x,i) => (
          <line key={i} x1={x} y1="36" x2={x} y2={38+i%2} stroke={c} strokeOpacity="0.5"
                style={{ animation: `frostDrip ${2+i*0.3}s ease-in-out ${i*0.2}s infinite` }} />
        ))}
        {/* Dots row */}
        {[12,20,26,32,40].map((x,i) => (
          <circle key={i} cx={x} cy="42" r="1.2" fill={c} stroke="none" />
        ))}

        {/* ── Middle tier ── */}
        <rect x="11" y="23" width="30" height="14" rx="1" fill={fill1} />
        <ellipse cx="26" cy="23" rx="15" ry="4" fill={fill2} />
        {[16,22,26,30,36].map((x,i) => (
          <circle key={i} cx={x} cy="30" r="1" fill={c} stroke="none" opacity="0.7" />
        ))}

        {/* ── Top tier ── */}
        <rect x="17" y="13" width="18" height="11" rx="1" fill={fill1} />
        <ellipse cx="26" cy="13" rx="9" ry="2.5" fill={fill2} />

        {/* ── Candle ── */}
        <rect x="23.5" y="6" width="5" height="8" rx="0.8" fill="rgba(107,90,69,0.1)" />
        {/* Flame */}
        <path d="M26,1 C24.5,3 23,5.5 23,7.5 C23,9.5 24.5,11 26,11 C27.5,11 29,9.5 29,7.5 C29,5.5 27.5,3 26,1 Z"
              fill={c} stroke="none"
              style={{ transformOrigin: "26px 7.5px", animation: "flicker 1.6s ease-in-out infinite" }} />
      </g>
    </svg>
  );
}

function IconDance() {
  return (
    <svg width="52" height="56" viewBox="0 0 52 56" fill="none" stroke={c} strokeWidth="1.2" {...s}>
      <defs>
        <clipPath id="discoclip">
          <circle cx="26" cy="34" r="19" />
        </clipPath>
      </defs>
      {/* Mount */}
      <line x1="26" y1="0" x2="26" y2="15" strokeWidth="0.9" />
      <line x1="21" y1="15" x2="31" y2="15" strokeWidth="0.9" />

      {/* Ball fill */}
      <circle cx="26" cy="34" r="19" fill="rgba(107,90,69,0.07)" />

      {/* Tile grid — clipped to sphere */}
      <g clipPath="url(#discoclip)" strokeOpacity="0.3" strokeWidth="0.7">
        {[20,24,28,32,36,38,42,46].map(y => (
          <line key={`h${y}`} x1="7" y1={y} x2="45" y2={y} />
        ))}
        {[11,15,19,23,26,29,33,37,41].map(x => (
          <line key={`v${x}`} x1={x} y1="15" x2={x} y2="53" />
        ))}
      </g>

      {/* Ball outline */}
      <circle cx="26" cy="34" r="19" />

      {/* Highlight arc — top sheen */}
      <path d="M 12,24 A 18,18 0 0,1 40,24" strokeOpacity="0.2" strokeWidth="4" />

      {/* Twinkling light reflections */}
      {([
        [19, 27, 2.2, 0],
        [31, 24, 1.6, 0.5],
        [22, 38, 1.9, 1.0],
        [35, 33, 1.4, 0.3],
        [16, 36, 1.3, 0.8],
        [29, 42, 1.5, 1.3],
      ] as [number,number,number,number][]).map(([x, y, r, delay]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={c} stroke="none"
                style={{ animation: `twinkleStar 1.8s ease-in-out ${delay}s infinite` }} />
      ))}
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke={c} strokeWidth="1.6" {...s}>
      {/* Moon */}
      <path
        d="M22,8 C14,11 9,19 9,26 C9,35 17,43 26,43 C33,43 40,38 42,31 C38,33 33,33 29,30 C23,26 21,19 22,8 Z"
        style={{ animation: "moonPulse 3s ease-in-out infinite" }}
      />
      {/* Stars */}
      <g style={{ transformOrigin: "38px 12px", animation: "twinkleStar 2s ease-in-out infinite" }}>
        <line x1="38" y1="9" x2="38" y2="15" strokeWidth="1.3" />
        <line x1="35" y1="12" x2="41" y2="12" strokeWidth="1.3" />
      </g>
      <g style={{ transformOrigin: "44px 22px", animation: "twinkleStar 2s ease-in-out 0.7s infinite" }}>
        <line x1="44" y1="20" x2="44" y2="24" strokeWidth="1.1" />
        <line x1="42" y1="22" x2="46" y2="22" strokeWidth="1.1" />
      </g>
      <g style={{ transformOrigin: "34px 4px", animation: "twinkleStar 2s ease-in-out 1.4s infinite" }}>
        <line x1="34" y1="2" x2="34" y2="6" strokeWidth="1.1" />
        <line x1="32" y1="4" x2="36" y2="4" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

const programIcons: Record<string, () => React.ReactElement> = {
  "Apéro": IconGlasses,
  "Dinner": IconCandle,
  "Cake Cutting": IconCake,
  "Dance Party": IconDance,
  "Last Dance": IconMoon,
};

// ─── Section divider ──────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0 2rem", margin: "0" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(107,90,69,0.35))" }} />
      <span style={{ color: "#6b5a45", fontSize: "1rem" }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(107,90,69,0.35))" }} />
    </div>
  );
}

// ─── Meal Dropdown ───────────────────────────────────────────────────────────

function MealDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = MEALS.find((m) => m.id === value) ?? MEALS[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "#fff",
          border: "1px solid rgba(107,90,69,0.3)",
          color: "#4a3728",
          padding: "0.6rem 0.75rem",
          fontSize: "0.9rem",
          fontFamily: "'Jost', sans-serif",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{selected.title}</span>
        <span style={{ color: "#6b5a45", fontSize: "0.7rem" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#fff",
          border: "1px solid rgba(107,90,69,0.3)",
          borderTop: "none",
          zIndex: 10,
          animation: "dropdownOpen 0.2s ease both",
          boxShadow: "0 4px 16px rgba(107,90,69,0.12)",
        }}>
          {MEALS.map((meal) => (
            <button
              key={meal.id}
              type="button"
              onClick={() => { onChange(meal.id); setOpen(false); }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.75rem",
                background: meal.id === value ? "rgba(107,90,69,0.08)" : "#fff",
                border: "none",
                borderBottom: "1px solid rgba(107,90,69,0.1)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(107,90,69,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = meal.id === value ? "rgba(107,90,69,0.08)" : "#fff")}
            >
              <p style={{ color: "#4a3728", fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", marginBottom: "0.2rem" }}>{meal.title}</p>
              <p style={{ color: "#8a7060", fontSize: "0.75rem", lineHeight: 1.4 }}>{meal.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const heroTop = "#5879a2";
  const heroMid = "#5879a2";

  // RSVP state
  const [count, setCount] = useState<number>(1);
  const [guests, setGuests] = useState<Guest[]>([{ first_name: "", last_name: "", meal: "Beef (Halal)", allergies: "" }]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-09-06T15:00:00Z'); // 17:00 CEST
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

  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  // Music state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [selected, setSelected] = useState<Track | null>(null);
  const [musicSubmitted, setMusicSubmitted] = useState<false | "added" | "duplicate">(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load wishes
  useEffect(() => {
    supabase.from("music_wishes").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setWishes(data);
    });
  }, [musicSubmitted === "added"]);

  // iTunes search
  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=6`);
        const data = await res.json();
        setResults(data.results || []);
      } catch { setResults([]); }
      setSearchLoading(false);
    }, 400);
  }, [query]);

  // RSVP handlers
  function handleCountChange(n: number) {
    const newCount = Math.max(1, Math.min(10, n));
    setCount(newCount);
    setGuests((prev) => {
      const updated = [...prev];
      while (updated.length < newCount) updated.push({ first_name: "", last_name: "", meal: "Beef (Halal)", allergies: "" });
      return updated.slice(0, newCount);
    });
  }

  function handleGuestChange(i: number, field: keyof Guest, value: string) {
    setGuests((prev) => { const u = [...prev]; u[i] = { ...u[i], [field]: value }; return u; });
  }

  async function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRsvpError("");
    for (const g of guests) {
      if (!g.first_name.trim() || !g.last_name.trim()) { setRsvpError("Please fill in all names."); return; }
    }
    setRsvpLoading(true);
    const { error } = await supabase.from("rsvp").insert(guests);
    setRsvpLoading(false);
    if (error) { setRsvpError("Something went wrong. Please try again."); return; }
    setRsvpSubmitted(true);
  }

  // Music handlers
  async function handleMusicSubmit() {
    if (!selected) return;
    setSaving(true);
    const { data: existing } = await supabase.from("music_wishes").select("id").eq("song_title", selected.trackName).eq("artist", selected.artistName).limit(1);
    if (existing && existing.length > 0) {
      setSaving(false); setMusicSubmitted("duplicate"); setTimeout(() => setMusicSubmitted(false), 3000); return;
    }
    await supabase.from("music_wishes").insert({ song_title: selected.trackName, artist: selected.artistName, cover_url: selected.artworkUrl100 });
    setSaving(false); setMusicSubmitted("added"); setSelected(null); setQuery(""); setResults([]);
    setTimeout(() => setMusicSubmitted(false), 3000);
  }

  return (
    <div style={{ background: "#fdf7f0" }}>

      {/* ── HOME ── */}
      <section id="home" style={{ background: `linear-gradient(to bottom, ${heroTop} 0%, ${heroTop} 55%, #fdf7f0 85%)` }}>
        <main
          className="flex flex-col items-center justify-start px-6 text-center"
          style={{ paddingTop: "5rem", paddingBottom: "0", gap: "0" }}
        >
          <p className="fade-in-up" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Scheherazade New', serif", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", marginBottom: "0.4rem", lineHeight: 1.4 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="fade-in-up font-light" style={{ color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", letterSpacing: "0.1em", fontSize: "clamp(2rem, 8vw, 4rem)", lineHeight: 1.1, marginBottom: "0.6rem" }}>
            Sarah &amp; Ihssan
          </h1>
          <div className="fade-in-up" style={{ position: "relative", width: "100vw", maxWidth: "520px", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "22%", background: `linear-gradient(to bottom, ${heroMid}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
            <video src="/video.mp4" autoPlay muted loop playsInline style={{ width: "100%", display: "block", objectFit: "cover" }} />
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
          <div style={{ textAlign: "center", padding: "1.2rem 0 0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1rem, 5vw, 2.5rem)" }}>
              {([
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Sec" },
              ] as const).map(({ value, label }) => (
                <div key={label} style={{ textAlign: "center", minWidth: "3rem" }}>
                  <div style={{ fontSize: "clamp(1.6rem, 6vw, 2.4rem)", fontWeight: 300, color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1 }}>
                    {String(value).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontFamily: "'Jost', sans-serif", marginTop: "0.25rem" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </section>

      <Divider />

      {/* ── JOIN US ── */}
      <section id="join-us" className="scroll-section" style={{ background: "#faf6f1", paddingTop: "4rem", paddingBottom: "4rem", minHeight: "60vh" }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Join Us</h2>
            <p style={{ color: "#8a7060", fontSize: "0.95rem", marginTop: "0.75rem" }}>
              Please register by <strong style={{ color: "#6b5a45" }}>1 August 2026</strong>
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="text-center" style={{ animation: "fadeIn 0.8s ease both", padding: "3rem 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#6b5a45" }}>✦</div>
              <h3 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "2rem", fontWeight: 300, marginBottom: "1rem" }}>See you on the 6th!</h3>
              <p style={{ color: "#8a7060", fontSize: "1rem" }}>Thank you for registering. We can&apos;t wait to celebrate with you.</p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit}>
              <div className="mb-8">
                <label style={{ display: "block", color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1rem", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
                  How many people are you registering?
                </label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => handleCountChange(count - 1)} style={{ width: 40, height: 40, border: "1px solid #6b5a45", background: "transparent", color: "#6b5a45", fontSize: "1.5rem", cursor: "pointer" }}>−</button>
                  <span style={{ color: "#4a3728", fontFamily: "'Jost', sans-serif", fontSize: "1.5rem", minWidth: "2rem", textAlign: "center" }}>{count}</span>
                  <button type="button" onClick={() => handleCountChange(count + 1)} style={{ width: 40, height: 40, border: "1px solid #6b5a45", background: "transparent", color: "#6b5a45", fontSize: "1.5rem", cursor: "pointer" }}>+</button>
                </div>
              </div>
              <div className="flex flex-col gap-4 mb-8">
                {guests.map((guest, i) => (
                  <div key={i} style={{ border: "1px solid rgba(107,90,69,0.3)", background: "rgba(107,90,69,0.05)", padding: "1.25rem" }}>
                    <p style={{ color: "#6b5a45", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Guest {i + 1}</p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <input type="text" placeholder="First Name" value={guest.first_name} onChange={(e) => handleGuestChange(i, "first_name", e.target.value)} style={{ background: "#fff", border: "1px solid rgba(107,90,69,0.3)", color: "#4a3728", padding: "0.6rem 0.75rem", fontSize: "0.9rem", outline: "none", fontFamily: "'Jost', sans-serif" }} />
                      <input type="text" placeholder="Last Name" value={guest.last_name} onChange={(e) => handleGuestChange(i, "last_name", e.target.value)} style={{ background: "#fff", border: "1px solid rgba(107,90,69,0.3)", color: "#4a3728", padding: "0.6rem 0.75rem", fontSize: "0.9rem", outline: "none", fontFamily: "'Jost', sans-serif" }} />
                      <MealDropdown value={guest.meal} onChange={(v) => handleGuestChange(i, "meal", v)} />
                    </div>
                    <input type="text" placeholder="Any allergies?" value={guest.allergies} onChange={(e) => handleGuestChange(i, "allergies", e.target.value)} style={{ marginTop: "0.6rem", width: "100%", background: "#fff", border: "1px solid rgba(107,90,69,0.3)", color: "#4a3728", padding: "0.6rem 0.75rem", fontSize: "0.9rem", outline: "none", fontFamily: "'Jost', sans-serif", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              {rsvpError && <p style={{ color: "#c0504d", fontSize: "0.9rem", marginBottom: "1rem" }}>{rsvpError}</p>}
              <button type="submit" disabled={rsvpLoading} style={{ width: "100%", padding: "1rem", background: "rgba(107,90,69,0.12)", border: "1px solid #6b5a45", color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: rsvpLoading ? "not-allowed" : "pointer" }}>
                {rsvpLoading ? "Sending..." : "Confirm"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Divider />

      {/* ── PROGRAM ── */}
      <section id="program" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Program</h2>
          </div>
          {/* Grid: time | gap | line | gap(bigger) | icon | gap | title
               1fr on time+title balances the icon at exactly 50% */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              {/* Vertical line — at left edge of the gap-to-icon column */}
              <div style={{ position: "absolute", left: "6rem", top: 0, bottom: 0, width: "1px", background: "linear-gradient(to bottom, transparent, #6b5a45 5%, #6b5a45 95%, transparent)", opacity: 0.3 }} />

              {events.map((event, i) => {
                const Icon = programIcons[event.title];
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "6rem 2.5rem auto 8rem", alignItems: "center", padding: "0.55rem 0" }}>
                    {/* Time — right-aligned in col 1 */}
                    <div style={{ textAlign: "right", paddingRight: "0.75rem" }}>
                      <span style={{ color: "#8a7060", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em", fontWeight: 300 }}>
                        {event.time}
                      </span>
                    </div>
                    {/* Gap col 2 — dot centered on the line */}
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <div style={{ position: "absolute", left: 0, transform: "translateX(-50%)", width: 7, height: 7, borderRadius: "50%", background: "#6b5a45", opacity: 0.55 }} />
                    </div>
                    {/* Icon col 3 */}
                    <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
                      {Icon && <Icon />}
                    </div>
                    {/* Title col 4 */}
                    <div style={{ paddingLeft: "1rem" }}>
                      <span style={{ color: "#4a3728", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.05em" }}>
                        {event.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── GALLERY ── */}
      <section id="gallery" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Gallery</h2>
          <div style={{ marginTop: "3rem", border: "1px solid rgba(107,90,69,0.3)", background: "rgba(107,90,69,0.06)", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📷</div>
            <p style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1.4rem", marginBottom: "0.75rem", fontWeight: 300 }}>Coming Soon</p>
            <p style={{ color: "#8a7060", fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "400px", margin: "0 auto" }}>
              After the big day, this is where all the beautiful memories will live. Check back after 6 September 2026.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── DIRECTIONS ── */}
      <section id="directions" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Directions</h2>
          </div>
          <div className="text-center mb-8 p-6" style={{ border: "1px solid rgba(107,90,69,0.4)", background: "rgba(107,90,69,0.06)" }}>
            <p style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1.3rem", marginBottom: "0.4rem" }}>Sonne — Boutiquehotel &amp; Seerestaurant</p>
            <p style={{ color: "#8a7060", fontSize: "1rem", letterSpacing: "0.1em" }}>Seestrasse 120, 8700 Küsnacht</p>
          </div>
          <div className="mb-8 overflow-hidden" style={{ border: "2px solid rgba(107,90,69,0.4)", aspectRatio: "16/9" }}>
            <iframe src="https://www.google.com/maps?q=Seestrasse+120,+8700+Küsnacht&output=embed" width="100%" height="100%" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="mb-6">
            <div style={{ border: "1px solid rgba(107,90,69,0.3)", background: "rgba(107,90,69,0.05)", padding: "1.5rem" }}>
              <h3 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1.1rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>🚂 By Train</h3>
              <p style={{ color: "#8a7060", fontSize: "0.9rem", lineHeight: 1.7 }}>Take the S6 from Zürich HB direction Rapperswil.<br />Exit at <strong style={{ color: "#6b5a45" }}>Küsnacht ZH</strong>.<br />5 min walk to the venue along the lake.</p>
            </div>
          </div>
          <div style={{ border: "1px solid rgba(107,90,69,0.3)", background: "rgba(107,90,69,0.05)", padding: "1.5rem" }}>
            <h3 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1.1rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>🅿️ Parking</h3>
            <p style={{ color: "#8a7060", fontSize: "0.9rem", lineHeight: 1.7 }}>Parking information coming soon.</p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── MUSIC ── */}
      <section id="music" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Music</h2>
            <p style={{ color: "#8a7060", fontSize: "0.95rem", marginTop: "0.75rem", lineHeight: 1.7 }}>What song should we play? Search and add your wish to our wedding playlist.</p>
          </div>
          <div className="mb-8">
            <div style={{ position: "relative" }}>
              <input type="text" placeholder="Search for a song or artist..." value={query} onChange={(e) => { setQuery(e.target.value); setSelected(null); }} style={{ width: "100%", background: "#fff", border: "1px solid rgba(107,90,69,0.4)", color: "#4a3728", padding: "0.85rem 1rem", fontSize: "1rem", outline: "none", fontFamily: "'Jost', sans-serif", boxSizing: "border-box" }} />
              {searchLoading && <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#6b5a45", fontSize: "0.8rem" }}>...</span>}
            </div>
            {results.length > 0 && !selected && (
              <div style={{ border: "1px solid rgba(107,90,69,0.3)", borderTop: "none" }}>
                {results.map((track) => (
                  <button key={track.trackId} onClick={() => { setSelected(track); setResults([]); setQuery(track.trackName); }} className="flex items-center gap-3 w-full text-left" style={{ padding: "0.75rem 1rem", background: "rgba(107,90,69,0.04)", borderBottom: "1px solid rgba(107,90,69,0.1)", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(107,90,69,0.12)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(107,90,69,0.04)")}>
                    <Image src={track.artworkUrl100} alt={track.trackName} width={40} height={40} style={{ flexShrink: 0 }} />
                    <div>
                      <p style={{ color: "#4a3728", fontSize: "0.9rem", fontFamily: "'Jost', sans-serif" }}>{track.trackName}</p>
                      <p style={{ color: "#6b5a45", fontSize: "0.8rem" }}>{track.artistName}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selected && (
            <div className="flex items-center gap-4 mb-6" style={{ border: "1px solid rgba(107,90,69,0.4)", background: "rgba(107,90,69,0.08)", padding: "1rem" }}>
              <Image src={selected.artworkUrl100} alt={selected.trackName} width={56} height={56} />
              <div className="flex-1">
                <p style={{ color: "#4a3728", fontFamily: "'Jost', sans-serif", fontSize: "1rem" }}>{selected.trackName}</p>
                <p style={{ color: "#6b5a45", fontSize: "0.85rem" }}>{selected.artistName}</p>
              </div>
              <button onClick={() => { setSelected(null); setQuery(""); }} style={{ color: "#6b5a45", background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
          )}
          {selected && (
            <button onClick={handleMusicSubmit} disabled={saving} style={{ width: "100%", padding: "1rem", background: "rgba(107,90,69,0.12)", border: "1px solid #6b5a45", color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", marginBottom: "2rem" }}>
              {saving ? "Adding..." : "Add to Playlist ♪"}
            </button>
          )}
          {musicSubmitted === "added" && <p style={{ color: "#6b5a45", textAlign: "center", fontSize: "1rem", marginBottom: "2rem" }}>✦ Song added to the playlist!</p>}
          {musicSubmitted === "duplicate" && <p style={{ color: "#c0504d", textAlign: "center", fontSize: "1rem", marginBottom: "2rem" }}>This song is already on the playlist!</p>}
        </div>
      </section>

      <Divider />

      {/* ── GIFTS ── */}
      <section id="gifts" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Gifts</h2>
          <div style={{ marginTop: "3rem", border: "1px solid rgba(107,90,69,0.3)", background: "rgba(107,90,69,0.06)", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🎁</div>
            <p style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1.4rem", marginBottom: "1rem", fontWeight: 300 }}>Coming Soon</p>
            <p style={{ color: "#8a7060", fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "420px", margin: "0 auto" }}>
              Your presence at our wedding is the greatest gift of all. If you wish to contribute to our honeymoon or future together, a gift option will be available here soon.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
