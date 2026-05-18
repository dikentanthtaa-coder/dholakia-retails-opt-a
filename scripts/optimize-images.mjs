#!/usr/bin/env node
/**
 * One-shot image optimizer.
 *
 * Walks `public/media/**` (excluding `*-opt/**` and existing webp/avif),
 * and writes a sibling `.webp` and `.avif` next to each source image.
 * Heavy PNGs are also re-encoded as smaller JPEGs (so the registry can
 * point at a much smaller fallback for legacy browsers / OG images).
 *
 * Skips files that already have a converted output newer than the source.
 *
 * Run with:  node scripts/optimize-images.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd(), "public", "media");
const MAX_WIDTH = 2400; // retina-ready ceiling
const WEBP_QUALITY = 78;
const AVIF_QUALITY = 55; // AVIF is ~30% smaller at equivalent quality
const JPEG_QUALITY = 80;

const exts = new Set([".png", ".jpg", ".jpeg"]);

/** @param {string} dir */
async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.endsWith("-opt")) continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

/** @param {string} src @param {string} out */
async function isFresh(src, out) {
  try {
    const [s, o] = await Promise.all([fs.stat(src), fs.stat(out)]);
    return o.mtimeMs >= s.mtimeMs && o.size > 0;
  } catch {
    return false;
  }
}

async function ensureDir(p) {
  await fs.mkdir(path.dirname(p), { recursive: true });
}

const stats = { converted: 0, skipped: 0, savedBytes: 0 };

async function convert(src) {
  try {
    return await convertInner(src);
  } catch (e) {
    console.warn(`skip ${path.relative(ROOT, src)} — ${e.message}`);
  }
}

async function convertInner(src) {
  const ext = path.extname(src).toLowerCase();
  if (!exts.has(ext)) return;

  const base = src.slice(0, -ext.length);
  const webp = `${base}.webp`;
  const avif = `${base}.avif`;
  const jpg = `${base}.jpg`;

  const srcStat = await fs.stat(src);
  const isPng = ext === ".png";

  // Load once, pipeline twice.
  const pipeline = sharp(src, { failOn: "none" })
    .rotate() // honour EXIF
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });

  // WebP
  if (!(await isFresh(src, webp))) {
    await ensureDir(webp);
    const buf = await pipeline
      .clone()
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toBuffer();
    await fs.writeFile(webp, buf);
    stats.converted++;
    stats.savedBytes += srcStat.size - buf.byteLength;
    console.log(
      `webp  ${path.relative(ROOT, webp)}  ${(srcStat.size / 1024).toFixed(
        0
      )}KB → ${(buf.byteLength / 1024).toFixed(0)}KB`
    );
  } else {
    stats.skipped++;
  }

  // AVIF (only for >300KB sources; AVIF encode is slow)
  if (srcStat.size > 300 * 1024 && !(await isFresh(src, avif))) {
    await ensureDir(avif);
    const buf = await pipeline
      .clone()
      .avif({ quality: AVIF_QUALITY, effort: 4 })
      .toBuffer();
    await fs.writeFile(avif, buf);
    stats.converted++;
    console.log(
      `avif  ${path.relative(ROOT, avif)}  → ${(buf.byteLength / 1024).toFixed(0)}KB`
    );
  }

  // For massive PNGs, also write a JPEG fallback (smaller than PNG for photos).
  // Only do this when the source is a PNG > 800KB.
  if (isPng && srcStat.size > 800 * 1024 && !(await isFresh(src, jpg))) {
    await ensureDir(jpg);
    const buf = await pipeline
      .clone()
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer();
    await fs.writeFile(jpg, buf);
    stats.converted++;
    console.log(
      `jpeg  ${path.relative(ROOT, jpg)}  → ${(buf.byteLength / 1024).toFixed(0)}KB`
    );
  }
}

async function main() {
  console.log(`Scanning ${ROOT}`);
  const files = [];
  for await (const f of walk(ROOT)) files.push(f);
  // Run in small batches to avoid blowing up memory.
  const BATCH = 4;
  for (let i = 0; i < files.length; i += BATCH) {
    await Promise.all(files.slice(i, i + BATCH).map(convert));
  }
  console.log(
    `\nDone. converted=${stats.converted} skipped=${stats.skipped} saved≈${(
      stats.savedBytes /
      1024 /
      1024
    ).toFixed(1)}MB`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
