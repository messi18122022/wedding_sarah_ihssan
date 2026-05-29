export default function Directions() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f0604", paddingTop: "4.5rem" }}>
      <main className="page-enter max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div style={{ color: "#c9a84c", fontSize: "1.5rem", marginBottom: "0.5rem" }}>✦ ❧ ✦</div>
          <h1 style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, letterSpacing: "0.1em" }}>
            Directions
          </h1>
          <div style={{ color: "#c9a84c", fontSize: "1.5rem", marginTop: "0.5rem" }}>✦ ❧ ✦</div>
        </div>

        {/* Venue info */}
        <div
          className="text-center mb-8 p-6"
          style={{ border: "1px solid rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.05)" }}
        >
          <p style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.3rem", marginBottom: "0.4rem" }}>
            Sonne — Boutiquehotel &amp; Seerestaurant
          </p>
          <p style={{ color: "#e8d5a3", fontSize: "1rem", letterSpacing: "0.1em" }}>
            Seestrasse 120, 8700 Küsnacht
          </p>
        </div>

        {/* Map */}
        <div
          className="mb-8 overflow-hidden"
          style={{ border: "2px solid rgba(201,168,76,0.4)", aspectRatio: "16/9" }}
        >
          <iframe
            src="https://www.google.com/maps?q=Seestrasse+120,+8700+Küsnacht&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Getting there */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* By train */}
          <div style={{ border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.04)", padding: "1.5rem" }}>
            <h2 style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>
              🚂 By Train
            </h2>
            <p style={{ color: "#e8d5a3", fontSize: "0.9rem", lineHeight: 1.7 }}>
              Take the S6 from Zürich HB direction Rapperswil.<br />
              Exit at <strong style={{ color: "#c9a84c" }}>Küsnacht ZH</strong>.<br />
              5 min walk to the venue along the lake.
            </p>
          </div>

          {/* By car */}
          <div style={{ border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.04)", padding: "1.5rem" }}>
            <h2 style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>
              🚗 By Car
            </h2>
            <p style={{ color: "#e8d5a3", fontSize: "0.9rem", lineHeight: 1.7 }}>
              From Zürich city centre, take the Seestrasse (road along the lake) southbound.<br />
              The restaurant is directly on the lake in Küsnacht.
            </p>
          </div>

        </div>

        {/* Parking */}
        <div style={{ border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.04)", padding: "1.5rem" }}>
          <h2 style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>
            🅿️ Parking
          </h2>
          <p style={{ color: "#e8d5a3", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Parking information coming soon.
          </p>
        </div>

      </main>
    </div>
  );
}
