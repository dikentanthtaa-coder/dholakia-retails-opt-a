import type { NextConfig } from "next";

/**
 * Site-wide performance configuration.
 *
 * Image pipeline:
 *   - AVIF first, WebP fallback — modern browsers get the smallest payload.
 *   - 30-day minimum CDN cache for transformed images (default is 60s).
 *   - Quality 65/75/85 allowlisted (Next.js 16 requires explicit qualities).
 *   - Device/image size lists tuned to our actual breakpoints (sm 640, md 768,
 *     lg 1024, xl 1280, 2xl 1536). The defaults include sizes nobody uses on
 *     this layout and inflate the srcset.
 *
 * Bundle:
 *   - lucide-react is allowlisted by default in optimizePackageImports, but we
 *     pin framer-motion as well since the whole library can balloon a route.
 *
 * Headers:
 *   - /media/* is a fully hashed asset path — 1 year immutable cache.
 *   - /_next/image is set by Next; we don't touch it.
 *   - Standard security hardening: X-Content-Type-Options, Referrer-Policy.
 *
 * GitHub Pages build (GITHUB_PAGES=true):
 *   - Switches to `output: "export"` (static HTML export — no Node runtime).
 *   - Disables image optimization (no /_next/image endpoint on GH Pages).
 *   - Uses trailingSlash so /about/ resolves to /about/index.html.
 *   - Optional GITHUB_PAGES_BASE_PATH sets basePath/assetPrefix for project
 *     repos that deploy under <user>.github.io/<repo>/.
 *   - `headers()` and `redirects()` are stripped in this mode (silently
 *     ignored by Next's static export — kept here so Netlify builds keep
 *     them).
 */
const IS_GH_PAGES = process.env.GITHUB_PAGES === "true";
const GH_PAGES_BASE_PATH = process.env.GITHUB_PAGES_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  ...(IS_GH_PAGES
    ? {
        output: "export" as const,
        // GH Pages serves directory indexes only; /foo would 404 without this.
        trailingSlash: true,
        // No /_next/image endpoint on a static host — pass URLs through raw.
        images: { unoptimized: true },
        ...(GH_PAGES_BASE_PATH
          ? { basePath: GH_PAGES_BASE_PATH, assetPrefix: GH_PAGES_BASE_PATH }
          : {}),
      }
    : {}),
  // Pin Turbopack root — project path contains spaces which the auto-inferer
  // mishandles, causing "We couldn't find the Next.js package" failures.
  turbopack: {
    root: process.cwd(),
  },
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@portabletext/react",
    ],
    // Hint Next.js to inline tiny critical CSS chunks into the streamed HTML.
    inlineCss: true,
  },
  // On GH Pages we already set `images: { unoptimized: true }` in the spread
  // above. This block is the rich production config used by Netlify/Vercel
  // where the Image Optimization API exists.
  ...(IS_GH_PAGES
    ? {}
    : {
        images: {
          formats: ["image/avif" as const, "image/webp" as const],
          deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2400],
          imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
          qualities: [40, 60, 75, 85],
          minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
          remotePatterns: [
            { protocol: "https" as const, hostname: "cdn.sanity.io", pathname: "/**" },
            { protocol: "https" as const, hostname: "images.unsplash.com", pathname: "/**" },
            { protocol: "https" as const, hostname: "images.pexels.com", pathname: "/**" },
            { protocol: "https" as const, hostname: "picsum.photos", pathname: "/**" },
            { protocol: "https" as const, hostname: "fastly.picsum.photos", pathname: "/**" },
          ],
        },
      }),
  async redirects() {
    // Static export ignores redirects() entirely — return empty so the
    // build doesn't warn, but keep the real list for server builds.
    if (IS_GH_PAGES) return [];
    // Spec §1.13 — canonical About route is /the-group; old /about path redirects.
    return [
      { source: "/about", destination: "/the-group", permanent: true },
      { source: "/about/:path*", destination: "/the-group/:path*", permanent: true },
    ];
  },
  async headers() {
    // Static export can't emit response headers — return empty on GH Pages.
    if (IS_GH_PAGES) return [];
    const longCache = "public, max-age=31536000, immutable";
    return [
      {
        // Committed media files are stable per filename — cache hard.
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: longCache },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: longCache }],
      },
      {
        source: "/(icon.svg|favicon.ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        // Site-wide security + perf headers.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
