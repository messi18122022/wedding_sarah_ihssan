"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Track = {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
};

type Wish = {
  song_title: string;
  artist: string;
  cover_url: string;
};

export default function Music() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [selected, setSelected] = useState<Track | null>(null);
  const [submitted, setSubmitted] = useState<false | "added" | "duplicate">(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing wishes
  useEffect(() => {
    supabase.from("music_wishes").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setWishes(data);
    });
  }, [submitted === "added"]);

  // Search iTunes
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=6`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 400);
  }, [query]);

  async function handleSubmit() {
    if (!selected) return;
    setSaving(true);

    // Check for duplicate
    const { data: existing } = await supabase
      .from("music_wishes")
      .select("id")
      .eq("song_title", selected.trackName)
      .eq("artist", selected.artistName)
      .limit(1);

    if (existing && existing.length > 0) {
      setSaving(false);
      setSubmitted("duplicate");
      setTimeout(() => setSubmitted(false), 3000);
      return;
    }

    await supabase.from("music_wishes").insert({
      song_title: selected.trackName,
      artist: selected.artistName,
      cover_url: selected.artworkUrl100,
    });
    setSaving(false);
    setSubmitted("added");
    setSelected(null);
    setQuery("");
    setResults([]);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f5", paddingTop: "4.5rem" }}>
      <main className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10" style={{ animation: "fadeInUp 0.6s ease 0.1s both" }}>
          <div style={{ color: "#b76e79", fontSize: "1.5rem", marginBottom: "0.5rem" }}>✦ ❧ ✦</div>
          <h1 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>
            Music
          </h1>
          <p style={{ color: "#7a4a50", fontSize: "0.95rem", marginTop: "0.75rem", lineHeight: 1.7 }}>
            What song should we play? Search and add your wish to our wedding playlist.
          </p>
          <div style={{ color: "#b76e79", fontSize: "1.5rem", marginTop: "0.5rem" }}>✦ ❧ ✦</div>
        </div>

        {/* Search */}
        <div className="mb-8" style={{ animation: "fadeInUp 0.6s ease 0.3s both" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search for a song or artist..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
              style={{
                width: "100%",
                background: "#fff",
                border: "1px solid rgba(183,110,121,0.4)",
                color: "#3d2020",
                padding: "0.85rem 1rem",
                fontSize: "1rem",
                outline: "none",
                fontFamily: "Georgia, serif",
                boxSizing: "border-box",
              }}
            />
            {loading && (
              <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#b76e79", fontSize: "0.8rem" }}>
                ...
              </span>
            )}
          </div>

          {/* Search results */}
          {results.length > 0 && !selected && (
            <div style={{ border: "1px solid rgba(183,110,121,0.3)", borderTop: "none" }}>
              {results.map((track) => (
                <button
                  key={track.trackId}
                  onClick={() => { setSelected(track); setResults([]); setQuery(track.trackName); }}
                  className="flex items-center gap-3 w-full text-left"
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(183,110,121,0.04)",
                    borderBottom: "1px solid rgba(183,110,121,0.1)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(183,110,121,0.12)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(183,110,121,0.04)")}
                >
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

        {/* Selected song */}
        {selected && (
          <div
            className="flex items-center gap-4 mb-6"
            style={{ border: "1px solid rgba(183,110,121,0.4)", background: "rgba(183,110,121,0.08)", padding: "1rem", animation: "fadeInUp 0.4s ease both" }}
          >
            <Image src={selected.artworkUrl100} alt={selected.trackName} width={56} height={56} />
            <div className="flex-1">
              <p style={{ color: "#3d2020", fontFamily: "Georgia, serif", fontSize: "1rem" }}>{selected.trackName}</p>
              <p style={{ color: "#b76e79", fontSize: "0.85rem" }}>{selected.artistName}</p>
            </div>
            <button
              onClick={() => { setSelected(null); setQuery(""); }}
              style={{ color: "#b76e79", background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Submit button */}
        {selected && (
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              width: "100%",
              padding: "1rem",
              background: "rgba(183,110,121,0.12)",
              border: "1px solid #b76e79",
              color: "#b76e79",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: saving ? "not-allowed" : "pointer",
              marginBottom: "2rem",
              animation: "fadeInUp 0.4s ease both",
            }}
          >
            {saving ? "Adding..." : "Add to Playlist ♪"}
          </button>
        )}

        {/* Success / duplicate message */}
        {submitted === "added" && (
          <p style={{ color: "#b76e79", textAlign: "center", fontSize: "1rem", marginBottom: "2rem", animation: "fadeInUp 0.4s ease both" }}>
            ✦ Song added to the playlist!
          </p>
        )}
        {submitted === "duplicate" && (
          <p style={{ color: "#c0504d", textAlign: "center", fontSize: "1rem", marginBottom: "2rem", animation: "fadeInUp 0.4s ease both" }}>
            This song is already on the playlist!
          </p>
        )}

        {/* Existing wishes */}
        {wishes.length > 0 && (
          <div style={{ animation: "fadeInUp 0.6s ease 0.5s both" }}>
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

      </main>
    </div>
  );
}
