// Packt alle Galeriefotos in eine ZIP-Datei für den "Alle Fotos herunterladen"-Knopf.
//
// Läuft automatisch vor jedem Build (siehe "build" in package.json). Die ZIP
// liegt damit im Deployment, aber nicht im Git-Repo — sie wäre sonst rund
// 84 MB grosser Ballast in der Versionsgeschichte, der sich bei jedem neuen
// Foto komplett wiederholt.
//
// JPEGs sind schon komprimiert, deshalb wird nur gepackt und nicht nochmal
// komprimiert (store) — das ist um ein Vielfaches schneller bei praktisch
// gleicher Dateigrösse.

import { createWriteStream } from "node:fs";
import { mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ZipArchive } from "archiver";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "gallery", "full");
const OUT = join(ROOT, "public", "downloads");
const ZIP = join(OUT, "fotos-sarah-ihssan.zip");

const files = (await readdir(SRC).catch(() => [])).filter((f) => f.endsWith(".jpg")).sort();

if (files.length === 0) {
  console.log("make-photo-zip: keine Fotos in public/gallery/full — ZIP übersprungen");
  process.exit(0);
}

await mkdir(OUT, { recursive: true });

const archive = new ZipArchive({ zlib: { level: 0 } });
const sink = createWriteStream(ZIP);

const done = new Promise((resolve, reject) => {
  sink.on("close", resolve);
  sink.on("error", reject);
  archive.on("error", reject);
  archive.on("warning", (err) => {
    if (err.code === "ENOENT") console.warn("make-photo-zip:", err.message);
    else reject(err);
  });
});

archive.pipe(sink);
for (const file of files) {
  archive.file(join(SRC, file), { name: `Sarah-und-Ihssan/${file}` });
}
archive.finalize();

await done;

const { size } = await stat(ZIP);
console.log(
  `make-photo-zip: ${files.length} Fotos → public/downloads/fotos-sarah-ihssan.zip ` +
    `(${(size / 1024 / 1024).toFixed(0)} MB)`,
);
