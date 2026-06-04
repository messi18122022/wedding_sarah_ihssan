"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/app/contexts/LanguageContext";

// ─── Types ───────────────────────────────────────────────────────────────────

type Guest = { first_name: string; last_name: string; meal: string; allergies: string };
type Track = { trackId: number; trackName: string; artistName: string; artworkUrl100: string };
type Wish = { song_title: string; artist: string; cover_url: string };

// ─── Data ────────────────────────────────────────────────────────────────────

const PARKING = [
  { name: "Parking", distance: "4 min (250 m)", lat: 47.3176693, lng: 8.5805212 },
  { name: "Parkplatz", distance: "7 min (350 m)", lat: 47.3177522, lng: 8.581487 },
  { name: "Parkplatz Zürichstrasse", distance: "5 min (260 m)", lat: 47.3189029, lng: 8.5815061 },
  { name: "SBB P+Rail Küsnacht ZH", distance: "4 min (250 m)", lat: 47.3205211, lng: 8.5799631 },
];

const events = [
  { time: "17:00", title: "Apéro", icon: "🥂" },
  { time: "18:30", title: "Dinner", icon: "🍽️" },
  { time: "20:00", title: "Cake Cutting", icon: "🎂" },
  { time: "21:00", title: "Dance Party", icon: "🎶" },
  { time: "00:00", title: "Last Dance", icon: "✨" },
];

// ─── Program icons ───────────────────────────────────────────────────────────

const c = "#6b5a45";
const s = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function IconGlasses() {
  return (
    <svg width="72" height="52" viewBox="-10 0 72 52" fill="none" stroke={c} strokeWidth="1.6" {...s}>
      <g style={{ transformOrigin: "14px 44px", animation: "clinkLeft 2.4s ease-in-out infinite" }}>
        <path d="M10,8 L8,36 L20,36 L18,8 Z" />
        <line x1="14" y1="36" x2="14" y2="44" />
        <line x1="10" y1="44" x2="18" y2="44" />
        <line x1="10" y1="12" x2="19" y2="12" strokeOpacity="0.4" />
      </g>
      <g style={{ transformOrigin: "38px 44px", animation: "clinkRight 2.4s ease-in-out infinite" }}>
        <path d="M34,8 L32,36 L44,36 L42,8 Z" />
        <line x1="38" y1="36" x2="38" y2="44" />
        <line x1="34" y1="44" x2="42" y2="44" />
        <line x1="33" y1="12" x2="42" y2="12" strokeOpacity="0.4" />
      </g>
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
      <path
        d="M26,6 C24,10 21,13 21,17 C21,21 23,23 26,23 C29,23 31,21 31,17 C31,13 28,10 26,6 Z"
        style={{ transformOrigin: "26px 17px", animation: "flicker 1.8s ease-in-out infinite" }}
      />
      <rect x="20" y="24" width="12" height="22" rx="1" />
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
        <rect x="4" y="36" width="44" height="12" rx="1" fill={fill1} />
        <ellipse cx="26" cy="36" rx="22" ry="5.5" fill={fill2} />
        {[9,17,26,35,43].map((x,i) => (
          <line key={i} x1={x} y1="36" x2={x} y2={38+i%2} stroke={c} strokeOpacity="0.5"
                style={{ animation: `frostDrip ${2+i*0.3}s ease-in-out ${i*0.2}s infinite` }} />
        ))}
        {[12,20,26,32,40].map((x,i) => (
          <circle key={i} cx={x} cy="42" r="1.2" fill={c} stroke="none" />
        ))}
        <rect x="11" y="23" width="30" height="14" rx="1" fill={fill1} />
        <ellipse cx="26" cy="23" rx="15" ry="4" fill={fill2} />
        {[16,22,26,30,36].map((x,i) => (
          <circle key={i} cx={x} cy="30" r="1" fill={c} stroke="none" opacity="0.7" />
        ))}
        <rect x="17" y="13" width="18" height="11" rx="1" fill={fill1} />
        <ellipse cx="26" cy="13" rx="9" ry="2.5" fill={fill2} />
        <rect x="23.5" y="6" width="5" height="8" rx="0.8" fill="rgba(107,90,69,0.1)" />
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
      <line x1="26" y1="0" x2="26" y2="15" strokeWidth="0.9" />
      <line x1="21" y1="15" x2="31" y2="15" strokeWidth="0.9" />
      <circle cx="26" cy="34" r="19" fill="rgba(107,90,69,0.07)" />
      <g clipPath="url(#discoclip)" strokeOpacity="0.3" strokeWidth="0.7">
        {[20,24,28,32,36,38,42,46].map(y => (
          <line key={`h${y}`} x1="7" y1={y} x2="45" y2={y} />
        ))}
        {[11,15,19,23,26,29,33,37,41].map(x => (
          <line key={`v${x}`} x1={x} y1="15" x2={x} y2="53" />
        ))}
      </g>
      <circle cx="26" cy="34" r="19" />
      <path d="M 12,24 A 18,18 0 0,1 40,24" strokeOpacity="0.2" strokeWidth="4" />
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
      <path
        d="M22,8 C14,11 9,19 9,26 C9,35 17,43 26,43 C33,43 40,38 42,31 C38,33 33,33 29,30 C23,26 21,19 22,8 Z"
        style={{ animation: "moonPulse 3s ease-in-out infinite" }}
      />
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
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = t.meals.find((m) => m.id === value) ?? t.meals[0];

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
          {t.meals.map((meal) => (
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

function toArabicNumerals(str: string) {
  return str.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
}

export default function Home() {
  const { t, lang } = useLang();
  const heroTop = "#5879a2";
  const heroMid = "#5879a2";

  // RSVP state
  const [count, setCount] = useState<number>(1);
  const [guests, setGuests] = useState<Guest[]>([{ first_name: "", last_name: "", meal: "Beef (Halal)", allergies: "" }]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-09-06T15:00:00Z');
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

  const [parkingIdx, setParkingIdx] = useState(0);
  const parkingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    parkingTimer.current = setInterval(() => setParkingIdx((i) => (i + 1) % PARKING.length), 4000);
    return () => { if (parkingTimer.current) clearInterval(parkingTimer.current); };
  }, []);

  function stopParkingTimer() {
    if (parkingTimer.current) { clearInterval(parkingTimer.current); parkingTimer.current = null; }
  }

  function parkingNav(dir: 1 | -1) {
    stopParkingTimer();
    setParkingIdx((i) => (i + dir + PARKING.length) % PARKING.length);
  }
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

  useEffect(() => {
    supabase.from("music_wishes").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setWishes(data);
    });
  }, [musicSubmitted === "added"]);

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
      if (!g.first_name.trim() || !g.last_name.trim()) { setRsvpError(t.joinUs.error); return; }
    }
    setRsvpLoading(true);
    const { error } = await supabase.from("rsvp").insert(guests);
    setRsvpLoading(false);
    if (error) { setRsvpError("Something went wrong. Please try again."); return; }
    setRsvpSubmitted(true);
  }

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
          <p className="fade-in-up keep-scheherazade" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Scheherazade New', serif", fontSize: "clamp(1.2rem, 3.5vw, 1.9rem)", marginBottom: "0.4rem", lineHeight: 1.4 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="fade-in-up font-light keep-cormorant" style={{ color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", letterSpacing: "0.1em", fontSize: "clamp(2rem, 8vw, 4rem)", lineHeight: 1.1, marginBottom: "0.6rem" }}>
            Sarah &amp; Ihssan
          </h1>
          <div className="fade-in-up" style={{ position: "relative", width: "100vw", maxWidth: "520px", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "22%", background: `linear-gradient(to bottom, ${heroMid}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
            <video src="/video.mp4" autoPlay muted loop playsInline style={{ width: "100%", display: "block", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))", pointerEvents: "none" }} />
            <div dir="ltr" style={{ position: "absolute", bottom: "1.2rem", left: 0, right: 0, textAlign: "center", padding: "0 1rem", zIndex: 2 }}>
              <p className="keep-jost" style={{ fontSize: "1.1rem", color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.25rem", fontFamily: "'Jost', sans-serif" }}>
                6 September 2026 &nbsp;<span style={{ fontWeight: 200, opacity: 0.7 }}>|</span>&nbsp; 17:00
              </p>
              <p className="keep-jost" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em", fontFamily: "'Jost', sans-serif" }}>
                Sonne Boutiquehotel &amp; Seerestaurant<br />Seestrasse 120, 8700 Küsnacht
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div style={{ textAlign: "center", padding: "1.4rem 0 1.5rem", width: "100%" }}>
            <div dir="ltr" style={{ display: "flex", justifyContent: "center", gap: "clamp(1.2rem, 5vw, 2.5rem)" }}>
              {countdownItems.map(({ value, label }) => (
                <div key={label} style={{ textAlign: "center", minWidth: "3rem" }}>
                  <div className="keep-cormorant" style={{ fontSize: "clamp(1.8rem, 7vw, 2.6rem)", fontWeight: 300, color: "#4a3728", fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1 }}>
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

      <Divider />

      {/* ── JOIN US ── */}
      <section id="join-us" className="scroll-section" style={{ background: "#faf6f1", paddingTop: "4rem", paddingBottom: "4rem", minHeight: "60vh" }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.joinUs.title}</h2>
            <p style={{ color: "#8a7060", fontSize: "0.95rem", marginTop: "0.75rem" }}>
              {t.joinUs.deadlinePre} <strong style={{ color: "#6b5a45" }}>{t.joinUs.deadlineDate}</strong>{t.joinUs.deadlinePost ? ` ${t.joinUs.deadlinePost}` : ""}
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="text-center" style={{ animation: "fadeIn 0.8s ease both", padding: "3rem 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#6b5a45" }}>✦</div>
              <h3 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "2rem", fontWeight: 300, marginBottom: "1rem" }}>{t.joinUs.successTitle}</h3>
              <p style={{ color: "#8a7060", fontSize: "1rem" }}>{t.joinUs.successText}</p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit}>
              <div className="mb-8">
                <label style={{ display: "block", color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1rem", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
                  {t.joinUs.howMany}
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
                    <p style={{ color: "#6b5a45", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{t.joinUs.guest} {i + 1}</p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <input type="text" placeholder={t.joinUs.firstName} value={guest.first_name} onChange={(e) => handleGuestChange(i, "first_name", e.target.value)} style={{ background: "#fff", border: "1px solid rgba(107,90,69,0.3)", color: "#4a3728", padding: "0.6rem 0.75rem", fontSize: "0.9rem", outline: "none", fontFamily: "'Jost', sans-serif" }} />
                      <input type="text" placeholder={t.joinUs.lastName} value={guest.last_name} onChange={(e) => handleGuestChange(i, "last_name", e.target.value)} style={{ background: "#fff", border: "1px solid rgba(107,90,69,0.3)", color: "#4a3728", padding: "0.6rem 0.75rem", fontSize: "0.9rem", outline: "none", fontFamily: "'Jost', sans-serif" }} />
                      <MealDropdown value={guest.meal} onChange={(v) => handleGuestChange(i, "meal", v)} />
                    </div>
                    <input type="text" placeholder={t.joinUs.allergies} value={guest.allergies} onChange={(e) => handleGuestChange(i, "allergies", e.target.value)} style={{ marginTop: "0.6rem", width: "100%", background: "#fff", border: "1px solid rgba(107,90,69,0.3)", color: "#4a3728", padding: "0.6rem 0.75rem", fontSize: "0.9rem", outline: "none", fontFamily: "'Jost', sans-serif", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              {rsvpError && <p style={{ color: "#c0504d", fontSize: "0.9rem", marginBottom: "1rem" }}>{rsvpError}</p>}
              <button type="submit" disabled={rsvpLoading} style={{ width: "100%", padding: "1rem", background: "rgba(107,90,69,0.12)", border: "1px solid #6b5a45", color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: rsvpLoading ? "not-allowed" : "pointer" }}>
                {rsvpLoading ? t.joinUs.sending : t.joinUs.confirm}
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
            <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.program.title}</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div dir="ltr" style={{ position: "relative" }}>
              <div style={{ position: "absolute", insetInlineStart: "6rem", top: 0, bottom: 0, width: "1px", transform: "translateX(-50%)", background: "linear-gradient(to bottom, transparent, #6b5a45 5%, #6b5a45 95%, transparent)", opacity: 0.3 }} />

              {events.map((event, i) => {
                const Icon = programIcons[event.title];
                const displayTitle = t.events[event.title as keyof typeof t.events];
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "6rem 2.5rem auto 8rem", alignItems: "center", padding: "0.55rem 0", position: "relative" }}>
                    <div style={{ position: "absolute", insetInlineStart: "6rem", top: "50%", transform: "translate(-50%, -50%)", width: 8, height: 8, borderRadius: "50%", background: "#6b5a45", opacity: 0.65, zIndex: 2 }} />
                    <div style={{ textAlign: "right", paddingRight: "0.75rem" }}>
                      <span style={{ color: "#8a7060", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em", fontWeight: 300 }}>
                        {lang === "ar" ? toArabicNumerals(event.time) : event.time}
                      </span>
                    </div>
                    <div />
                    <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
                      {Icon && <Icon />}
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <span style={{ color: "#4a3728", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.05em" }}>
                        {displayTitle}
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
          <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.gallery.title}</h2>
          <div style={{ marginTop: "3rem", border: "1px solid rgba(107,90,69,0.3)", background: "rgba(107,90,69,0.06)", padding: "4rem 2rem" }}>
            <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
              <svg width="64" height="56" viewBox="0 0 64 56" fill="none" stroke="#6b5a45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="16" width="56" height="36" rx="4" />
                <circle cx="32" cy="34" r="12" />
                <circle cx="32" cy="34" r="7" />
                <path d="M22,16 L22,10 L30,6 L34,6 L42,10 L42,16" />
                <rect x="48" y="22" width="7" height="5" rx="1" />
                <circle cx="32" cy="34" r="2.5" fill="#6b5a45" stroke="none" />
              </svg>
            </div>
            <p style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1.4rem", marginBottom: "0.75rem", fontWeight: 300 }}>{t.gallery.comingSoon}</p>
            <p style={{ color: "#8a7060", fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "400px", margin: "0 auto" }}>
              {t.gallery.description}
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── DIRECTIONS ── */}
      <section id="directions" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.directions.title}</h2>
          </div>
          <div className="text-center mb-8 p-6" style={{ border: "1px solid rgba(107,90,69,0.4)", background: "rgba(107,90,69,0.06)" }}>
            <p style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1.3rem", marginBottom: "0.4rem" }}>Sonne — Boutiquehotel &amp; Seerestaurant</p>
            <p style={{ color: "#8a7060", fontSize: "1rem", letterSpacing: "0.1em" }}>Seestrasse 120, 8700 Küsnacht</p>
          </div>
          <div className="mb-8 overflow-hidden" style={{ border: "2px solid rgba(107,90,69,0.4)", aspectRatio: "16/9", position: "relative" }}>
            <iframe src="https://www.google.com/maps?q=47.318961,8.578781&z=17&output=embed" width="100%" height="100%" style={{ border: 0, display: "block", pointerEvents: "none" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <a href="https://www.google.com/maps?q=47.318961,8.578781" target="_blank" rel="noopener noreferrer" style={{ position: "absolute", inset: 0, display: "block" }} aria-label="Open in Google Maps" />
          </div>
          <div className="mb-6">
            <div style={{ border: "1px solid rgba(107,90,69,0.3)", background: "rgba(107,90,69,0.05)", padding: "1.5rem" }}>
              <h3 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1.1rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>🚂 {t.directions.byTrain}</h3>
              <p style={{ color: "#8a7060", fontSize: "0.9rem", lineHeight: 1.7 }}>
                {t.directions.trainLine1}<br />
                {t.directions.trainLine2} <strong style={{ color: "#6b5a45" }}>Küsnacht ZH</strong>.<br />
                {t.directions.trainLine3}
              </p>
            </div>
          </div>
          {/* Parking slider */}
          <div style={{ border: "1px solid rgba(107,90,69,0.3)", background: "rgba(107,90,69,0.05)", padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
              <h3 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "1.1rem", letterSpacing: "0.1em" }}>{t.directions.parking}</h3>
              <span style={{ color: "#8a7060", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 200, letterSpacing: "0.05em" }}>{t.directions.parkingSlide}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                onClick={() => parkingNav(-1)}
                style={{ flexShrink: 0, background: "rgba(107,90,69,0.1)", border: "1px solid rgba(107,90,69,0.7)", color: "#4a3728", width: 36, height: 36, cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 400 }}
              >
                ‹
              </button>

              <div onMouseEnter={stopParkingTimer} onTouchStart={stopParkingTimer} style={{ flex: 1, overflow: "hidden", border: "1px solid rgba(107,90,69,0.2)", aspectRatio: "4/3", position: "relative" }}>
                <iframe
                  key={parkingIdx}
                  src={`https://www.google.com/maps?q=${PARKING[parkingIdx].lat},${PARKING[parkingIdx].lng}&z=17&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block", pointerEvents: "none" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a href={`https://www.google.com/maps?q=${PARKING[parkingIdx].lat},${PARKING[parkingIdx].lng}`} target="_blank" rel="noopener noreferrer" onClick={stopParkingTimer} style={{ position: "absolute", inset: 0, display: "block" }} aria-label="Open in Google Maps" />
              </div>

              <button
                onClick={() => parkingNav(1)}
                style={{ flexShrink: 0, background: "rgba(107,90,69,0.1)", border: "1px solid rgba(107,90,69,0.7)", color: "#4a3728", width: 36, height: 36, cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 400 }}
              >
                ›
              </button>
            </div>

            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#4a3728", fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, marginBottom: "0.1rem" }}>
                  {PARKING[parkingIdx].name}
                </p>
                <p style={{ color: "#8a7060", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 200, letterSpacing: "0.05em" }}>
                  🚶 {PARKING[parkingIdx].distance}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {PARKING.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { stopParkingTimer(); setParkingIdx(i); }}
                    style={{ width: 7, height: 7, borderRadius: "50%", background: "#6b5a45", opacity: i === parkingIdx ? 0.8 : 0.2, border: "none", cursor: "pointer", padding: 0 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── MUSIC ── */}
      <section id="music" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.music.title}</h2>
            <p style={{ color: "#8a7060", fontSize: "0.95rem", marginTop: "0.75rem", lineHeight: 1.7 }}>{t.music.subtitle}</p>
          </div>
          <div className="mb-8">
            <div style={{ position: "relative" }}>
              <input type="text" placeholder={t.music.placeholder} value={query} onChange={(e) => { setQuery(e.target.value); setSelected(null); }} style={{ width: "100%", background: "#fff", border: "1px solid rgba(107,90,69,0.4)", color: "#4a3728", padding: "0.85rem 1rem", fontSize: "1rem", outline: "none", fontFamily: "'Jost', sans-serif", boxSizing: "border-box" }} />
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
              {saving ? t.music.adding : t.music.addToPlaylist}
            </button>
          )}
          {musicSubmitted === "added" && <p style={{ color: "#6b5a45", textAlign: "center", fontSize: "1rem", marginBottom: "2rem" }}>{t.music.added}</p>}
          {musicSubmitted === "duplicate" && <p style={{ color: "#c0504d", textAlign: "center", fontSize: "1rem", marginBottom: "2rem" }}>{t.music.duplicate}</p>}
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
              href="https://revolut.me/messi_18122022"
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

      <Divider />

      {/* ── A NOTE FROM US ── */}
      <section id="note" className="scroll-section" style={{ background: "#fdf7f0", paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 style={{ color: "#6b5a45", fontFamily: "'Jost', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em", marginBottom: "2rem" }}>
            {t.note.title}
          </h2>
          <p style={{ color: "#4a3728", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.15rem, 3vw, 1.4rem)", fontWeight: 300, lineHeight: 1.9, fontStyle: "italic", marginBottom: "1.5rem" }}>
            {t.note.text}
          </p>
          <p style={{ color: "#6b5a45", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.3rem", fontWeight: 300, marginTop: "2rem", letterSpacing: "0.08em" }}>
            — Sarah &amp; Ihssan
          </p>
        </div>
      </section>

    </div>
  );
}
