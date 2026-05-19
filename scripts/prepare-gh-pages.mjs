#!/usr/bin/env node
/**
 * prepare-gh-pages.mjs — neutralise server-only routes before a static
 * `output: export` build for GitHub Pages.
 *
 * Why this exists
 *   `output: export` (GH Pages) refuses to build Route Handlers that
 *   define POST/PUT/PATCH/DELETE — only GET is allowed. The site also
 *   embeds Sanity Studio at /studio (a dynamic catch-all that depends
 *   on the Node runtime). On Netlify/Vercel these all work fine; on
 *   GH Pages they have to be excluded.
 *
 * What it does
 *   1. Moves `app/api/`     → `app/_api_disabled_gh_pages/`
 *   2. Moves `app/studio/`  → `app/_studio_disabled_gh_pages/`
 *   3. Patches the few `export const revalidate = <number>` declarations
 *      down to `revalidate = false` so static export accepts them.
 *
 *   Folders prefixed with `_` are private folders in the Next.js App
 *   Router — they're excluded from routing automatically.
 *
 * Reversal
 *   Run `node scripts/restore-gh-pages.mjs` (created alongside) or just
 *   `git checkout -- .` after the build. The script is idempotent: it
 *   skips any move that's already been done, so it's safe to run twice.
 *
 * Usage (CI)
 *   GITHUB_PAGES=true node scripts/prepare-gh-pages.mjs
 *   GITHUB_PAGES=true npx --no-install next build
 *   node scripts/restore-gh-pages.mjs   # optional, for local re-use
 */

import { existsSync, renameSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── 1. Disable server-only routes ─────────────────────────────────────
const MOVES = [
  ["app/api", "app/_api_disabled_gh_pages"],
  ["app/studio", "app/_studio_disabled_gh_pages"],
];

for (const [from, to] of MOVES) {
  const fromAbs = resolve(ROOT, from);
  const toAbs = resolve(ROOT, to);
  if (existsSync(toAbs)) {
    console.log(`✓ already disabled: ${from}`);
    continue;
  }
  if (!existsSync(fromAbs)) {
    console.log(`· not present, skipping: ${from}`);
    continue;
  }
  renameSync(fromAbs, toAbs);
  console.log(`→ moved ${from} → ${to}`);
}

// ── 2. Patch `revalidate = <number>` to `revalidate = false` ──────────
//
// `output: export` only allows `revalidate: false` (cache forever) — any
// numeric value triggers a build error. We rewrite the literal in-place
// so the file still parses correctly on the regular Netlify build (the
// restore script puts it back).
const REVALIDATE_FILES = [
  "app/page.tsx",
  "app/careers/page.tsx",
  "app/careers/[slug]/page.tsx",
];

for (const rel of REVALIDATE_FILES) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    console.log(`· not present, skipping: ${rel}`);
    continue;
  }
  const src = readFileSync(abs, "utf8");
  // Match `export const revalidate = <digits>` (with optional semicolon).
  const next = src.replace(
    /export const revalidate\s*=\s*\d+\s*;?/g,
    "export const revalidate = false; /* gh-pages-patched */",
  );
  if (next !== src) {
    writeFileSync(abs, next);
    console.log(`→ patched revalidate in ${rel}`);
  } else {
    console.log(`· no numeric revalidate found in ${rel}`);
  }
}

// ── 3. Patch `dynamic = "force-dynamic"` and inject generateStaticParams ──
//
// `output: export` rejects `force-dynamic` outright. For Sanity-backed
// catch-all routes we flip them to `force-static` and append a stub
// `generateStaticParams() { return []; }`. Pages with no params are
// simply not emitted on GH Pages (the list pages /blog and /news still
// work and link out to wherever the user wants — fix later by pulling
// the slug list from Sanity at build time if you want full coverage).
const FORCE_DYNAMIC_PATCH_FILES = [
  "app/blog/[slug]/page.tsx",
  "app/news/[slug]/page.tsx",
];

const APPENDED_MARKER = "/* gh-pages-static-params-stub */";

for (const rel of FORCE_DYNAMIC_PATCH_FILES) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    console.log(`· not present, skipping: ${rel}`);
    continue;
  }
  let src = readFileSync(abs, "utf8");
  let changed = false;

  if (/export const dynamic\s*=\s*["']force-dynamic["']/.test(src)) {
    src = src.replace(
      /export const dynamic\s*=\s*["']force-dynamic["']\s*;?/g,
      `export const dynamic = "force-static"; ${APPENDED_MARKER}`,
    );
    changed = true;
  }

  if (!src.includes("generateStaticParams") && !src.includes(APPENDED_MARKER + "-fn")) {
    src += `\n\n// ${APPENDED_MARKER}-fn — emits no slug pages on GH Pages.\nexport async function generateStaticParams() {\n  return [];\n}\n`;
    changed = true;
  }

  if (changed) {
    writeFileSync(abs, src);
    console.log(`→ patched dynamic + injected generateStaticParams in ${rel}`);
  } else {
    console.log(`· already patched: ${rel}`);
  }
}

console.log("");
console.log("prepare-gh-pages: done.");
