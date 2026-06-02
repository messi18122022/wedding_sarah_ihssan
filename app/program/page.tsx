const events = [
  {
    time: "17:00",
    title: "Apéro",
    description: "Welcome drinks and canapés by the lake",
    icon: "🥂",
  },
  {
    time: "18:30",
    title: "Dinner",
    description: "A festive dinner with family and friends",
    icon: "🍽️",
  },
  {
    time: "20:00",
    title: "Cake Cutting",
    description: "The sweetest moment of the evening",
    icon: "🎂",
  },
  {
    time: "21:00",
    title: "Dance Party",
    description: "The night is young — let's celebrate!",
    icon: "🎶",
  },
  {
    time: "00:00",
    title: "Last Dance",
    description: "One final dance to close a perfect evening",
    icon: "✨",
  },
];

export default function Program() {
  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f5", paddingTop: "4.5rem" }}>
      <main className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div
          className="text-center mb-12"
          style={{ animation: "fadeInUp 0.6s ease 0.1s both" }}
        >
          <div style={{ color: "#b76e79", fontSize: "1.5rem", marginBottom: "0.5rem" }}>✦ ❧ ✦</div>
          <h1 style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>
            Program
          </h1>
          <p style={{ color: "#7a4a50", fontSize: "0.95rem", marginTop: "0.75rem", opacity: 0.8 }}>
            6 September 2026 &nbsp;·&nbsp; Küsnacht
          </p>
          <div style={{ color: "#b76e79", fontSize: "1.5rem", marginTop: "0.75rem" }}>✦ ❧ ✦</div>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col gap-8">

          {/* Vertical line */}
          <div style={{
            position: "absolute",
            left: "5rem",
            top: 0,
            bottom: 0,
            width: "1px",
            background: "linear-gradient(to bottom, transparent, #b76e79 5%, #b76e79 95%, transparent)",
            opacity: 0.35,
          }}/>

          {events.map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-0"
              style={{ animation: `fadeInUp 0.6s ease ${0.2 + i * 0.15}s both` }}
            >
              {/* Time */}
              <div style={{ width: "4.5rem", textAlign: "center", flexShrink: 0 }}>
                <span style={{ color: "#b76e79", fontFamily: "Georgia, serif", fontSize: "1rem", letterSpacing: "0.05em" }}>
                  {event.time}
                </span>
              </div>

              {/* Diamond dot */}
              <div style={{ position: "relative", zIndex: 1, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: "1rem" }}>
                <div style={{
                  width: 12,
                  height: 12,
                  background: "#b76e79",
                  transform: "rotate(45deg)",
                }}/>
              </div>

              {/* Box */}
              <div style={{
                flex: 1,
                marginLeft: "1.25rem",
                border: "1px solid rgba(183,110,121,0.3)",
                background: "rgba(183,110,121,0.06)",
                padding: "0.9rem 1.1rem",
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: "1.1rem" }}>{event.icon}</span>
                  <h2 style={{ color: "#3d2020", fontFamily: "Georgia, serif", fontSize: "1.05rem", fontWeight: 400 }}>
                    {event.title}
                  </h2>
                </div>
                <p style={{ color: "#7a4a50", fontSize: "0.8rem", lineHeight: 1.6 }}>
                  {event.description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
