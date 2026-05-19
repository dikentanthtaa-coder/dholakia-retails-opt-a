import type { MetadataRoute } from "next";
import {
  getAllSlugs,
  getAllBlogSlugs,
  getAllCareerSlugs,
} from "@/sanity/lib/queries";

// Required for `output: "export"` (GitHub Pages build): the sitemap is
// resolved once at build time. CMS slugs reflect the state of Sanity
// at build — rebuild the site to refresh dynamic routes.
export const dynamic = "force-static";

const SITE_URL = "https://dholakiaretail.com";

/**
 * Sitemap.
 *
 * Static spec routes are emitted with stable priorities. CMS-backed routes
 * (news posts, blog posts, careers) are pulled from Sanity at request time.
 * Each query is wrapped in `.catch(() => [])` so a CMS outage degrades to a
 * sitemap with the static skeleton rather than throwing — important because
 * search engine crawlers will silently drop the site if /sitemap.xml 5xxs.
 *
 * `lastModified: new Date()` is intentionally a per-request timestamp; the
 * page itself is `force-dynamic` (via this file having no revalidate hint),
 * so crawlers see a current `<lastmod>` on every fetch — the cheapest
 * possible "we update regularly" signal.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/the-group", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/portfolio", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/portfolio/mayave", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/craftsmanship", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/sustainability", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/innovation", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/global-presence", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/news", priority: 0.9, changeFrequency: "weekly" as const },
    // { path: "/blog", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/careers", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
    { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/cookies", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const [newsSlugs, blogSlugs, careerSlugs] = await Promise.all([
    getAllSlugs().catch(() => [] as string[]),
    getAllBlogSlugs().catch(() => [] as string[]),
    getAllCareerSlugs().catch(() => [] as string[]),
  ]);

  const newsRoutes: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${SITE_URL}/news/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
  //   url: `${SITE_URL}/blog/${slug}`,
  //   lastModified: now,
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));

  const careerRoutes: MetadataRoute.Sitemap = careerSlugs.map((slug) => ({
    url: `${SITE_URL}/careers/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // return [...staticRoutes, ...newsRoutes, ...blogRoutes, ...careerRoutes];
  return [...staticRoutes, ...newsRoutes, ...careerRoutes];
}
