/**
 * Optimiza las imágenes pesadas de public/assets (redimensiona + recomprime)
 * MANTENIENDO el mismo nombre y formato, para no tener que cambiar el código.
 *
 * Uso:  node scripts/optimize-images.mjs
 *
 * Las originales están versionadas en git, así que esto es reversible
 * (git checkout -- public/assets) si algún resultado no convence.
 */
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "..", "public", "assets");

const MAX_WIDTH = 1920;       // ancho máximo (solo reduce, nunca amplía)
const MIN_BYTES = 450 * 1024; // solo procesa imágenes desde ~450 KB

const fmt = (b) => (b / 1024).toFixed(0) + " KB";

async function run() {
  const files = await fs.readdir(ASSETS);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const full = path.join(ASSETS, file);
    const before = (await fs.stat(full)).size;
    if (before < MIN_BYTES) continue;

    const img = sharp(full, { failOn: "none" });
    const meta = await img.metadata();
    const pipeline = img.rotate(); // respeta orientación EXIF

    if (meta.width && meta.width > MAX_WIDTH) {
      pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    let out;
    if (ext === ".png") {
      // Cuantización de paleta: reduce mucho el peso de fotos/gráficos PNG.
      out = await pipeline.png({ palette: true, quality: 80, compressionLevel: 9, effort: 9 }).toBuffer();
    } else {
      out = await pipeline.jpeg({ quality: 72, mozjpeg: true }).toBuffer();
    }

    // Solo sobrescribe si realmente quedó más liviana.
    if (out.length < before) {
      await fs.writeFile(full, out);
      totalBefore += before;
      totalAfter += out.length;
      console.log(`✓ ${file.padEnd(30)} ${fmt(before).padStart(9)} → ${fmt(out.length).padStart(9)}  (-${(100 - (out.length / before) * 100).toFixed(0)}%)`);
    } else {
      console.log(`· ${file.padEnd(30)} sin cambios (ya estaba optimizada)`);
    }
  }

  console.log("\n──────────────────────────────");
  console.log(`Total: ${fmt(totalBefore)} → ${fmt(totalAfter)}  (ahorro ${fmt(totalBefore - totalAfter)})`);
}

run().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
