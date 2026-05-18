#!/usr/bin/env node
// Generates a manifest of tiny base64 LQIP previews for every committed
// public/media/*.webp image, so <EditorialImage> can render a blurred-up
// placeholder via Next.js's built-in placeholder="blur" path without
// runtime layout shift.
//
// Output: lib/media-blur.json — a { "/media/foo.webp": "data:image/webp;..." } map.
//
// Run with:  node scripts/generate-blur-manifest.mjs
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd(), "public", "media");
const OUT = path.resolve(process.cwd(), "lib", "media-blur.json");

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function main() {
  const manifest = {};
  for await (const file of walk(ROOT)) {
    if (!/\.(webp|jpg|jpeg|png)$/i.test(file)) continue;
    try {
      const buf = await sharp(file, { failOn: "none" })
        .resize(16, null, { fit: "inside" })
        .webp({ quality: 30 })
        .toBuffer();
      const key = "/" + path.relative(path.resolve("public"), file).replace(/\\/g, "/");
      manifest[key] = `data:image/webp;base64,${buf.toString("base64")}`;
    } catch {
      // unsupported file — skip silently
    }
  }
  await fs.writeFile(OUT, JSON.stringify(manifest, null, 0));
  console.log(`Wrote ${Object.keys(manifest).length} entries → ${path.relative(process.cwd(), OUT)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
