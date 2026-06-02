"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

type Guest = { first_name: string; last_name: string; meal: string };
type Track = { trackId: number; trackName: string; artistName: string; artworkUrl100: string };
type Wish = { song_title: string; artist: string; cover_url: string };

// ─── Data ────────────────────────────────────────────────────────────────────

const MEALS = ["Beef", "Chicken", "Vegetarian"];

const events = [
  { time: "17:00", title: "Apéro", description: "Welcome drinks and canapés by the lake", icon: "🥂" },
  { time: "18:30", title: "Dinner", description: "A festive dinner with family and friends", icon: "🍽️" },
  { time: "20:00", title: "Cake Cutting", description: "The sweetest moment of the evening", icon: "🎂" },
  { time: "21:00", title: "Dance Party", description: "The night is young — let's celebrate!", icon: "🎶" },
  { time: "00:00", title: "Last Dance", description: "One final dance to close a perfect evening", icon: "✨" },
];

// ─── Section divider ──────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0 2rem", margin: "0" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(183,110,121,0.35))" }} />
      <span style={{ color: "#b76e79", fontSize: "1rem" }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(183,110,121,0.35))" }} />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const seaBlue = "#5879a2";

  // RSVP state
  const [count, setCount] = useState<number>(1);
  const [guests, setGuests] = useState<Guest[]>([{ first_name: "", last_name: "", meal: "Beef" }]);
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
      while (updated.length < newCount) updated.push({ first_name: "", last_name: "", meal: "Beef" });
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
    <div style={{ background: "#fdf8f5" }}>

      {/* ── HOME ── */}
      <section id="home" style={{ background: `linear-gradient(to bottom, ${seaBlue} 0%, ${seaBlue} 55%, #fdf8f5 85%)` }}>
        <main
          className="flex flex-col items-center justify-start px-6 text-center"
          style={{ paddingTop: "5rem", paddingBottom: "0", gap: "0" }}
        >
          <p className="fade-in-up" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Scheherazade New', serif", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", marginBottom: "0.4rem", lineHeight: 1.4 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="fade-in-up font-light" style={{ color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.1em", fontSize: "clamp(2rem, 8vw, 4rem)", lineHeight: 1.1, marginBottom: "0.6rem" }}>
            Sarah &amp; Ihssan
          </h1>
          <div className="fade-in-up" style={{ position: "relative", width: "100vw", maxWidth: "520px", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "22%", background: `linear-gradient(to bottom, ${seaBlue}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
            <video src="/video.mp4" autoPlay muted loop playsInline style={{ width: "100%", display: "block", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "1.2rem", left: 0, right: 0, textAlign: "center", padding: "0 1rem", zIndex: 2 }}>
              <p style={{ fontSize: "1.1rem", color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.25rem", fontFamily: "Georgia, serif" }}>
                6 September 2026 &nbsp;<span style={{ fontWeight: 200, opacity: 0.7 }}>|</span>&nbsp; 17:00
              </p>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em", fontFamily: "Georgia, serif" }}>
                Sonne Boutiquehotel &amp; Seerestaurant<br />Seestrasse 120, 8700 Küsnacht
              </p>
            </div>
          </div>
        </main>
      </section>

      <Divider />

      {/* ── JOIN US ── */}
      <section id="join-us" style={{ background: "#fdf8f5", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Join Us</h2>
            <p style={{ color: "#7a4a50", fontSize: "0.95rem", marginTop: "0.75rem" }}>
              Please register by <strong style={{ color: "#b76e79" }}>1 August 2026</strong>
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="text-center">
              <h3 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 300, marginBottom: "1rem" }}>See you on the 6th!</h3>
              <p style={{ color: "#7a4a50", fontSize: "1rem" }}>Thank you for registering. We can&apos;t wait to celebrate with you.</p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit}>
              <div className="mb-8">
                <label style={{ display: "block", color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1rem", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
                  How many people are you registering?
                </label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => handleCountChange(count - 1)} style={{ width: 40, height: 40, border: "1px solid #b76e79", background: "transparent", color: "#b76e79", fontSize: "1.5rem", cursor: "pointer" }}>−</button>
                  <span style={{ color: "#3d2020", fontFamily: "Georgia, serif", fontSize: "1.5rem", minWidth: "2rem", textAlign: "center" }}>{count}</span>
                  <button type="button" onClick={() => handleCountChange(count + 1)} style={{ width: 40, height: 40, border: "1px solid #b76e79", background: "transparent", color: "#b76e79", fontSize: "1.5rem", cursor: "pointer" }}>+</button>
                </div>
              </div>
              <div className="flex flex-col gap-4 mb-8">
                {guests.map((guest, i) => (
                  <div key={i} style={{ border: "1px solid rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.05)", padding: "1.25rem" }}>
                    <p style={{ color: "#b76e79", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Guest {i + 1}</p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <input type="text" placeholder="First Name" value={guest.first_name} onChange={(e) => handleGuestChange(i, "first_name", e.target.value)} style={{ background: "#fff", border: "1px solid rgba(183,110,121,0.3)", color: "#3d2020", padding: "0.6rem 0.75rem", fontSize: "0.9rem", outline: "none", fontFamily: "Georgia, serif" }} />
                      <input type="text" placeholder="Last Name" value={guest.last_name} onChange={(e) => handleGuestChange(i, "last_name", e.target.value)} style={{ background: "#fff", border: "1px solid rgba(183,110,121,0.3)", color: "#3d2020", padding: "0.6rem 0.75rem", fontSize: "0.9rem", outline: "none", fontFamily: "Georgia, serif" }} />
                      <select value={guest.meal} onChange={(e) => handleGuestChange(i, "meal", e.target.value)} style={{ background: "#fff", border: "1px solid rgba(183,110,121,0.3)", color: "#3d2020", padding: "0.6rem 0.75rem", fontSize: "0.9rem", outline: "none", fontFamily: "Georgia, serif", cursor: "pointer" }}>
                        {MEALS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              {rsvpError && <p style={{ color: "#c0504d", fontSize: "0.9rem", marginBottom: "1rem" }}>{rsvpError}</p>}
              <button type="submit" disabled={rsvpLoading} style={{ width: "100%", padding: "1rem", background: "rgba(183,110,121,0.12)", border: "1px solid #b76e79", color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: rsvpLoading ? "not-allowed" : "pointer" }}>
                {rsvpLoading ? "Sending..." : "Confirm Attendance"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Divider />

      {/* ── PROGRAM ── */}
      <section id="program" style={{ background: "#fdf8f5", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Program</h2>
            <p style={{ color: "#7a4a50", fontSize: "0.95rem", marginTop: "0.75rem", opacity: 0.8 }}>6 September 2026 &nbsp;·&nbsp; Küsnacht</p>
          </div>
          <div className="relative flex flex-col gap-8">
            <div style={{ position: "absolute", left: "5rem", top: 0, bottom: 0, width: "1px", background: "linear-gradient(to bottom, transparent, #b76e79 5%, #b76e79 95%, transparent)", opacity: 0.35 }} />
            {events.map((event, i) => (
              <div key={i} className="flex items-center gap-0">
                <div style={{ width: "4.5rem", textAlign: "center", flexShrink: 0 }}>
                  <span style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1rem", letterSpacing: "0.05em" }}>{event.time}</span>
                </div>
                <div style={{ position: "relative", zIndex: 1, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: "1rem" }}>
                  <div style={{ width: 12, height: 12, background: "#b76e79", transform: "rotate(45deg)" }} />
                </div>
                <div style={{ flex: 1, marginLeft: "1.25rem", border: "1px solid rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.06)", padding: "0.9rem 1.1rem" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: "1.1rem" }}>{event.icon}</span>
                    <h3 style={{ color: "#3d2020", fontFamily: "Georgia, serif", fontSize: "1.05rem", fontWeight: 400 }}>{event.title}</h3>
                  </div>
                  <p style={{ color: "#7a4a50", fontSize: "0.8rem", lineHeight: 1.6 }}>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ background: "#fdf8f5", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Gallery</h2>
          <div style={{ marginTop: "3rem", border: "1px solid rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.06)", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📷</div>
            <p style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "0.75rem", fontWeight: 300 }}>Coming Soon</p>
            <p style={{ color: "#7a4a50", fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "400px", margin: "0 auto" }}>
              After the big day, this is where all the beautiful memories will live. Check back after 6 September 2026.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── DIRECTIONS ── */}
      <section id="directions" style={{ background: "#fdf8f5", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Directions</h2>
          </div>
          <div className="text-center mb-8 p-6" style={{ border: "1px solid rgba(183,110,121,0.4)", background: "rgba(183,110,121,0.06)" }}>
            <p style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1.3rem", marginBottom: "0.4rem" }}>Sonne — Boutiquehotel &amp; Seerestaurant</p>
            <p style={{ color: "#7a4a50", fontSize: "1rem", letterSpacing: "0.1em" }}>Seestrasse 120, 8700 Küsnacht</p>
          </div>
          <div className="mb-8 overflow-hidden" style={{ border: "2px solid rgba(183,110,121,0.4)", aspectRatio: "16/9" }}>
            <iframe src="https://www.google.com/maps?q=Seestrasse+120,+8700+Küsnacht&output=embed" width="100%" height="100%" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div style={{ border: "1px solid rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.05)", padding: "1.5rem" }}>
              <h3 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>🚂 By Train</h3>
              <p style={{ color: "#7a4a50", fontSize: "0.9rem", lineHeight: 1.7 }}>Take the S6 from Zürich HB direction Rapperswil.<br />Exit at <strong style={{ color: "#b76e79" }}>Küsnacht ZH</strong>.<br />5 min walk to the venue along the lake.</p>
            </div>
            <div style={{ border: "1px solid rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.05)", padding: "1.5rem" }}>
              <h3 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>🚗 By Car</h3>
              <p style={{ color: "#7a4a50", fontSize: "0.9rem", lineHeight: 1.7 }}>From Zürich city centre, take the Seestrasse (road along the lake) southbound.<br />The restaurant is directly on the lake in Küsnacht.</p>
            </div>
          </div>
          <div style={{ border: "1px solid rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.05)", padding: "1.5rem" }}>
            <h3 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>🅿️ Parking</h3>
            <p style={{ color: "#7a4a50", fontSize: "0.9rem", lineHeight: 1.7 }}>Parking information coming soon.</p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── MUSIC ── */}
      <section id="music" style={{ background: "#fdf8f5", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Music</h2>
            <p style={{ color: "#7a4a50", fontSize: "0.95rem", marginTop: "0.75rem", lineHeight: 1.7 }}>What song should we play? Search and add your wish to our wedding playlist.</p>
          </div>
          <div className="mb-8">
            <div style={{ position: "relative" }}>
              <input type="text" placeholder="Search for a song or artist..." value={query} onChange={(e) => { setQuery(e.target.value); setSelected(null); }} style={{ width: "100%", background: "#fff", border: "1px solid rgba(183,110,121,0.4)", color: "#3d2020", padding: "0.85rem 1rem", fontSize: "1rem", outline: "none", fontFamily: "Georgia, serif", boxSizing: "border-box" }} />
              {searchLoading && <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#b76e79", fontSize: "0.8rem" }}>...</span>}
            </div>
            {results.length > 0 && !selected && (
              <div style={{ border: "1px solid rgba(183,110,121,0.3)", borderTop: "none" }}>
                {results.map((track) => (
                  <button key={track.trackId} onClick={() => { setSelected(track); setResults([]); setQuery(track.trackName); }} className="flex items-center gap-3 w-full text-left" style={{ padding: "0.75rem 1rem", background: "rgba(183,110,121,0.04)", borderBottom: "1px solid rgba(183,110,121,0.1)", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(183,110,121,0.12)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(183,110,121,0.04)")}>
                    <Image src={track.artworkUrl100} alt={track.trackName} width={40} height={40} style={{ flexShrink: 0 }} />
                    <div>
                      <p style={{ color: "#3d2020", fontSize: "0.9rem", fontFamily: "Georgia, serif" }}>{track.trackName}</p>
                      <p style={{ color: "#b76e79", fontSize: "0.8rem" }}>{track.artistName}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selected && (
            <div className="flex items-center gap-4 mb-6" style={{ border: "1px solid rgba(183,110,121,0.4)", background: "rgba(183,110,121,0.08)", padding: "1rem" }}>
              <Image src={selected.artworkUrl100} alt={selected.trackName} width={56} height={56} />
              <div className="flex-1">
                <p style={{ color: "#3d2020", fontFamily: "Georgia, serif", fontSize: "1rem" }}>{selected.trackName}</p>
                <p style={{ color: "#b76e79", fontSize: "0.85rem" }}>{selected.artistName}</p>
              </div>
              <button onClick={() => { setSelected(null); setQuery(""); }} style={{ color: "#b76e79", background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
          )}
          {selected && (
            <button onClick={handleMusicSubmit} disabled={saving} style={{ width: "100%", padding: "1rem", background: "rgba(183,110,121,0.12)", border: "1px solid #b76e79", color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", marginBottom: "2rem" }}>
              {saving ? "Adding..." : "Add to Playlist ♪"}
            </button>
          )}
          {musicSubmitted === "added" && <p style={{ color: "#b76e79", textAlign: "center", fontSize: "1rem", marginBottom: "2rem" }}>✦ Song added to the playlist!</p>}
          {musicSubmitted === "duplicate" && <p style={{ color: "#c0504d", textAlign: "center", fontSize: "1rem", marginBottom: "2rem" }}>This song is already on the playlist!</p>}
          {wishes.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px" style={{ background: "rgba(183,110,121,0.3)" }} />
                <span style={{ color: "#b76e79", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Playlist so far</span>
                <div className="flex-1 h-px" style={{ background: "rgba(183,110,121,0.3)" }} />
              </div>
              <div className="flex flex-col gap-3">
                {wishes.map((wish, i) => (
                  <div key={i} className="flex items-center gap-3" style={{ border: "1px solid rgba(183,110,121,0.2)", background: "rgba(183,110,121,0.04)", padding: "0.75rem 1rem" }}>
                    {wish.cover_url && <Image src={wish.cover_url} alt={wish.song_title} width={40} height={40} />}
                    <div>
                      <p style={{ color: "#3d2020", fontSize: "0.9rem", fontFamily: "Georgia, serif" }}>{wish.song_title}</p>
                      <p style={{ color: "#b76e79", fontSize: "0.8rem" }}>{wish.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Divider />

      {/* ── GIFTS ── */}
      <section id="gifts" style={{ background: "#fdf8f5", paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>Gifts</h2>
          <div style={{ marginTop: "3rem", border: "1px solid rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.06)", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🎁</div>
            <p style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "1rem", fontWeight: 300 }}>Coming Soon</p>
            <p style={{ color: "#7a4a50", fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "420px", margin: "0 auto" }}>
              Your presence at our wedding is the greatest gift of all. If you wish to contribute to our honeymoon or future together, a gift option will be available here soon.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
