#!/usr/bin/env node
/**
 * restore-gh-pages.mjs — undo the side effects of prepare-gh-pages.mjs.
 *
 * Moves the `_api_disabled_gh_pages` / `_studio_disabled_gh_pages`
 * folders back, and reverts the `revalidate = false` patches to their
 * canonical numeric values. Safe to run multiple times — each step
 * checks for the disabled/patched state before acting.
 *
 * Usage:
 *   node scripts/restore-gh-pages.mjs
 *
 * In CI you usually don't need this — the runner clones a fresh tree
 * each build. It exists for local sanity (e.g. you ran prepare locally
 * to test the GH Pages build and now want to run Netlify dev).
 */

import { existsSync, renameSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Mirror the canonical revalidate values from prepare-gh-pages.mjs.
const REVALIDATE_VALUES = {
  "app/page.tsx": 300,
  "app/careers/page.tsx": 60,
  "app/careers/[slug]/page.tsx": 60,
};

const RESTORES = [
  ["app/_api_disabled_gh_pages", "app/api"],
  ["app/_studio_disabled_gh_pages", "app/studio"],
];

for (const [from, to] of RESTORES) {
  const fromAbs = resolve(ROOT, from);
  const toAbs = resolve(ROOT, to);
  if (existsSync(toAbs)) {
    console.log(`✓ already restored: ${to}`);
    continue;
  }
  if (!existsSync(fromAbs)) {
    console.log(`· nothing to restore: ${from}`);
    continue;
  }
  renameSync(fromAbs, toAbs);
  console.log(`→ restored ${to}`);
}

for (const [rel, num] of Object.entries(REVALIDATE_VALUES)) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) continue;
  const src = readFileSync(abs, "utf8");
  const next = src.replace(
    /export const revalidate = false;\s*\/\* gh-pages-patched \*\//g,
    `export const revalidate = ${num};`,
  );
  if (next !== src) {
    writeFileSync(abs, next);
    console.log(`→ restored revalidate = ${num} in ${rel}`);
  }
}

// Reverse the force-static + stub generateStaticParams patches.
const FORCE_DYNAMIC_FILES = [
  "app/blog/[slug]/page.tsx",
  "app/news/[slug]/page.tsx",
];

for (const rel of FORCE_DYNAMIC_FILES) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) continue;
  let src = readFileSync(abs, "utf8");
  let changed = false;

  if (src.includes('/* gh-pages-static-params-stub */')) {
    src = src.replace(
      /export const dynamic = "force-static"; \/\* gh-pages-static-params-stub \*\//g,
      'export const dynamic = "force-dynamic";',
    );
    changed = true;
  }

  if (src.includes('/* gh-pages-static-params-stub */-fn')) {
    src = src.replace(
      /\n\n\/\/ \/\* gh-pages-static-params-stub \*\/-fn[^\n]*\nexport async function generateStaticParams\(\) {\s*return \[\];\s*}\s*\n/g,
      "",
    );
    changed = true;
  }

  if (changed) {
    writeFileSync(abs, src);
    console.log(`→ restored force-dynamic in ${rel}`);
  }
}

console.log("");
console.log("restore-gh-pages: done.");
