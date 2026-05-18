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
 */
const nextConfig: NextConfig = {
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
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
    qualities: [40, 60, 75, 85],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "fastly.picsum.photos", pathname: "/**" },
    ],
  },
  async redirects() {
    // Spec §1.13 — canonical About route is /the-group; old /about path redirects.
    return [
      { source: "/about", destination: "/the-group", permanent: true },
      { source: "/about/:path*", destination: "/the-group/:path*", permanent: true },
    ];
  },
  async headers() {
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
