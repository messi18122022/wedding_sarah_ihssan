"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLang } from "@/app/contexts/LanguageContext";
import { galleryPhotos } from "@/app/gallery-photos";

/* Die Fotos liegen unter public/gallery/ bereits in Anzeigegrösse und werden
   deshalb unverändert ausgeliefert — kein next/image, damit keine
   Bildoptimierungen des Hosters anfallen. Styles stehen in globals.css. */
/* eslint-disable @next/next/no-img-element */

export default function Gallery() {
  const { t } = useLang();
  const [openAt, setOpenAt] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setOpenAt(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenAt((i) => (i === null ? i : (i + delta + galleryPhotos.length) % galleryPhotos.length)),
    [],
  );

  // Tastatur: Pfeile blättern, Escape schliesst
  useEffect(() => {
    if (openAt === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAt, close, step]);

  // Seite im Hintergrund nicht mitscrollen lassen, solange ein Bild offen ist
  useEffect(() => {
    if (openAt === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [openAt]);

  // Nachbarbilder vorladen, damit das Blättern nicht ruckelt
  useEffect(() => {
    if (openAt === null) return;
    for (const d of [1, -1]) {
      const neighbour = galleryPhotos[(openAt + d + galleryPhotos.length) % galleryPhotos.length];
      const img = new window.Image();
      img.src = `/gallery/full/${neighbour.id}.jpg`;
    }
  }, [openAt]);

  return (
    <>
      <p
        style={{
          color: "#8a7060",
          fontFamily: "'Jost', sans-serif",
          fontSize: "1rem",
          fontWeight: 300,
          lineHeight: 1.8,
          maxWidth: "460px",
          margin: "1rem auto 0",
        }}
      >
        {t.gallery.subtitle}
      </p>

      <div className="gallery-grid">
        {galleryPhotos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            className="gallery-tile"
            onClick={() => setOpenAt(i)}
            aria-label={`${i + 1} / ${galleryPhotos.length}`}
          >
            <img
              src={`/gallery/thumb/${photo.id}.jpg`}
              alt=""
              width={photo.w}
              height={photo.h}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </button>
        ))}
      </div>

      {openAt !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            if (start === null) return;
            const dx = e.changedTouches[0].clientX - start;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          <button type="button" className="lightbox-close" onClick={close} aria-label={t.gallery.close}>
            ✕
          </button>

          <button
            type="button"
            className="lightbox-arrow lightbox-arrow-prev"
            aria-label={t.gallery.previous}
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
          >
            ‹
          </button>

          <img
            className="lightbox-image"
            src={`/gallery/full/${galleryPhotos[openAt].id}.jpg`}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="lightbox-arrow lightbox-arrow-next"
            aria-label={t.gallery.next}
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
          >
            ›
          </button>

          <p dir="ltr" className="lightbox-counter keep-jost">
            {openAt + 1} / {galleryPhotos.length}
          </p>
        </div>
      )}
    </>
  );
}
