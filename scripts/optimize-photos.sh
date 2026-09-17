#!/bin/bash
#
# Bereitet die Hochzeitsfotos fürs Web auf.
#
#   ./scripts/optimize-photos.sh
#
# Erwartet einen Ordner `photos/` im Projektverzeichnis (nicht im Repo, siehe
# .gitignore) mit:
#   • Title.JPG  → wird zum Titelbild der Startseite (public/hero.jpg)
#   • alle übrigen .JPG → Galerie (public/gallery/)
#
# Erzeugt je Foto eine Vorschau (600 px) und eine Vollansicht (1600 px) sowie
# app/gallery-photos.ts mit der Reihenfolge und den Bildmassen. Die Bilder
# werden bewusst hier fertig skaliert und später unverändert ausgeliefert —
# so fallen beim Hosting keine Bildoptimierungen an.
#
# Braucht nur `sips`, das bei macOS dabei ist.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/photos"
OUT="$ROOT/public"
MANIFEST="$ROOT/app/gallery-photos.ts"

THUMB_PX=600   # Vorschau im Raster
FULL_PX=1600   # Vollbild in der Lightbox
HERO_PX=1800   # Titelbild auf der Startseite
THUMB_Q=75
FULL_Q=72
HERO_Q=82

if [ ! -d "$SRC" ]; then
  echo "Ordner $SRC fehlt — dort müssen die Originalfotos liegen." >&2
  exit 1
fi

rm -rf "$OUT/gallery"
mkdir -p "$OUT/gallery/thumb" "$OUT/gallery/full"

if [ -f "$SRC/Title.JPG" ]; then
  echo "Titelbild..."
  sips -Z "$HERO_PX" -s format jpeg -s formatOptions "$HERO_Q" "$SRC/Title.JPG" --out "$OUT/hero.jpg" >/dev/null
fi

# Sortierung nach Aufnahme-/Scandatum, damit die Reihenfolge stabil und
# chronologisch bleibt — auch wenn später Fotos dazukommen.
echo "Galerie sortieren..."
ORDER=$(cd "$SRC" && for f in *.JPG; do
  [ "$f" = "Title.JPG" ] && continue
  printf '%s|%s\n' "$(mdls -raw -name kMDItemContentCreationDate "$f" 2>/dev/null)" "$f"
done | sort | cut -d'|' -f2)

TOTAL=$(printf '%s\n' "$ORDER" | grep -c . || true)
echo "$TOTAL Fotos werden verarbeitet..."

{
  echo "// Automatisch erzeugt von scripts/optimize-photos.sh — nicht von Hand bearbeiten."
  echo ""
  echo "export type GalleryPhoto = { id: string; w: number; h: number };"
  echo ""
  echo "export const galleryPhotos: GalleryPhoto[] = ["
} > "$MANIFEST"

i=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  i=$((i + 1))
  id=$(printf "%03d" "$i")

  sips -Z "$THUMB_PX" -s format jpeg -s formatOptions "$THUMB_Q" "$SRC/$f" --out "$OUT/gallery/thumb/$id.jpg" >/dev/null
  sips -Z "$FULL_PX"  -s format jpeg -s formatOptions "$FULL_Q"  "$SRC/$f" --out "$OUT/gallery/full/$id.jpg"  >/dev/null

  # Breite/Höhe der Vorschau landen im Manifest, damit beim Laden nichts springt.
  dims=$(sips -g pixelWidth -g pixelHeight "$OUT/gallery/thumb/$id.jpg" \
    | awk '/pixelWidth/{w=$2} /pixelHeight/{h=$2} END{print w" "h}')
  echo "  { id: \"$id\", w: ${dims% *}, h: ${dims#* } }," >> "$MANIFEST"

  [ $((i % 25)) -eq 0 ] && echo "  ... $i/$TOTAL"
done <<< "$ORDER"

echo "];" >> "$MANIFEST"

echo ""
echo "Fertig."
[ -f "$OUT/hero.jpg" ] && echo "  Titelbild:  $(du -h "$OUT/hero.jpg" | cut -f1)"
echo "  Vorschauen: $(du -sh "$OUT/gallery/thumb" | cut -f1) ($i Dateien)"
echo "  Vollbilder: $(du -sh "$OUT/gallery/full" | cut -f1) ($i Dateien)"
