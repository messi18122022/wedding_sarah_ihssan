"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const MEALS = ["Beef", "Chicken", "Vegetarian"];

type Guest = {
  first_name: string;
  last_name: string;
  meal: string;
};

export default function JoinUs() {
  const [count, setCount] = useState<number | "">(1);
  const [guests, setGuests] = useState<Guest[]>([{ first_name: "", last_name: "", meal: "Beef" }]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setGuests((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [field]: value };
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    for (const g of guests) {
      if (!g.first_name.trim() || !g.last_name.trim()) {
        setError("Please fill in all names.");
        return;
      }
    }

    setLoading(true);
    const { error: dbError } = await supabase.from("rsvp").insert(guests);
    setLoading(false);

    if (dbError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f5", paddingTop: "4.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-center px-6" style={{ animation: "fadeInUp 0.6s ease both" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#b76e79" }}>✦</div>
          <h2 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 300, marginBottom: "1rem" }}>
            See you on the 6th!
          </h2>
          <p style={{ color: "#7a4a50", fontSize: "1rem" }}>
            Thank you for registering. We can&apos;t wait to celebrate with you.
          </p>
          <div style={{ fontSize: "3rem", marginTop: "1rem", color: "#b76e79" }}>✦</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f5", paddingTop: "4.5rem" }}>
      <main className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10" style={{ animation: "fadeInUp 0.6s ease 0.1s both" }}>
          <div style={{ color: "#b76e79", fontSize: "1.5rem", marginBottom: "0.5rem" }}>✦ ❧ ✦</div>
          <h1 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>
            Join Us
          </h1>
          <p style={{ color: "#7a4a50", fontSize: "0.95rem", marginTop: "0.75rem" }}>
            Please register by <strong style={{ color: "#b76e79" }}>1 August 2026</strong>
          </p>
          <div style={{ color: "#b76e79", fontSize: "1.5rem", marginTop: "0.5rem" }}>✦ ❧ ✦</div>
        </div>

        <form onSubmit={handleSubmit} style={{ animation: "fadeInUp 0.6s ease 0.3s both" }}>

          {/* Number of guests */}
          <div className="mb-8">
            <label style={{ display: "block", color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1rem", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
              How many people are you registering?
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleCountChange(Number(count) - 1)}
                style={{ width: 40, height: 40, border: "1px solid #b76e79", background: "transparent", color: "#b76e79", fontSize: "1.5rem", cursor: "pointer" }}
              >
                −
              </button>
              <span style={{ color: "#3d2020", fontFamily: "Georgia, serif", fontSize: "1.5rem", minWidth: "2rem", textAlign: "center" }}>
                {count}
              </span>
              <button
                type="button"
                onClick={() => handleCountChange(Number(count) + 1)}
                style={{ width: 40, height: 40, border: "1px solid #b76e79", background: "transparent", color: "#b76e79", fontSize: "1.5rem", cursor: "pointer" }}
              >
                +
              </button>
            </div>
          </div>

          {/* Guest rows */}
          <div className="flex flex-col gap-4 mb-8">
            {guests.map((guest, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid rgba(183,110,121,0.3)",
                  background: "rgba(183,110,121,0.05)",
                  padding: "1.25rem",
                }}
              >
                <p style={{ color: "#b76e79", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  Guest {i + 1}
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={guest.first_name}
                    onChange={(e) => handleGuestChange(i, "first_name", e.target.value)}
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(183,110,121,0.3)",
                      color: "#3d2020",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.9rem",
                      outline: "none",
                      fontFamily: "Georgia, serif",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={guest.last_name}
                    onChange={(e) => handleGuestChange(i, "last_name", e.target.value)}
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(183,110,121,0.3)",
                      color: "#3d2020",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.9rem",
                      outline: "none",
                      fontFamily: "Georgia, serif",
                    }}
                  />
                  <select
                    value={guest.meal}
                    onChange={(e) => handleGuestChange(i, "meal", e.target.value)}
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(183,110,121,0.3)",
                      color: "#3d2020",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.9rem",
                      outline: "none",
                      fontFamily: "Georgia, serif",
                      cursor: "pointer",
                    }}
                  >
                    {MEALS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "#c0504d", fontSize: "0.9rem", marginBottom: "1rem" }}>{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: loading ? "rgba(183,110,121,0.2)" : "rgba(183,110,121,0.12)",
              border: "1px solid #b76e79",
              color: "#b76e79",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Confirm Attendance"}
          </button>

        </form>
      </main>
    </div>
  );
}
