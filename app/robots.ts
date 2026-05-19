import type { MetadataRoute } from "next";

// Required for `output: "export"` (GitHub Pages build): tells Next.js
// to emit this route as a plain static file at build time rather than
// treating it as a dynamic Route Handler.
export const dynamic = "force-static";

/**
 * robots.txt.
 *
 *   • Public pages are crawlable.
 *   • /studio is the Sanity Studio embed; we don't want it indexed.
 *   • /api routes are server endpoints with no value to crawlers.
 *   • Sitemap link points crawlers at app/sitemap.ts so they discover all
 *     dynamic CMS-backed routes (news, blog, careers).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio/", "/api/", "/api"],
      },
    ],
    sitemap: "https://dholakiaretail.com/sitemap.xml",
    host: "https://dholakiaretail.com",
  };
}
