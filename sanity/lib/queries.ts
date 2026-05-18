import { cache } from "react";
import { groq } from "next-sanity";
import { client } from "./client";

export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: { x: number; y: number };
  metadata?: { lqip?: string };
};

export type Author = {
  _id: string;
  name: string;
  role?: string;
  picture?: SanityImage;
  bio?: string;
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  order?: number;
};

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  thumbnail: SanityImage & { metadata?: { lqip?: string } };
  category?: Category | null;
  author?: { name: string; picture?: SanityImage } | null;
};

export type Post = PostListItem & {
  coverImage?: SanityImage | null;
  // Portable Text — typed as unknown[] to keep this file framework-agnostic
  body: unknown[];
  author?: Author | null;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  } | null;
};

const POST_LIST_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  thumbnail{
    ...,
    "metadata": asset->metadata{ lqip }
  },
  "category": category->{
    _id,
    title,
    "slug": slug.current,
    order
  },
  "author": author->{ name, picture }
`;

const POSTS_LIST_QUERY = groq`*[_type == "post" && defined(slug.current)
  && (!defined($category) || category->slug.current == $category)
  && (!defined($q) || title match $q || excerpt match $q)
] | order(publishedAt desc)[0...$limit]{
  ${POST_LIST_PROJECTION}
}`;

const POST_BY_SLUG_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  ${POST_LIST_PROJECTION},
  coverImage{ ..., "metadata": asset->metadata{ lqip } },
  body,
  "author": author->{
    _id,
    name,
    role,
    picture,
    bio
  },
  seo{ metaTitle, metaDescription, ogImage }
}`;

const FEATURED_POST_QUERY = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0]{
  ${POST_LIST_PROJECTION},
  coverImage{ ..., "metadata": asset->metadata{ lqip } }
}`;

const RELATED_POSTS_QUERY = groq`*[_type == "post" && defined(slug.current) && slug.current != $slug
  && (category._ref == $categoryId)
] | order(publishedAt desc)[0...3]{
  ${POST_LIST_PROJECTION}
}`;

const CATEGORIES_QUERY = groq`*[_type == "category"] | order(coalesce(order, 99) asc, title asc){
  _id,
  title,
  "slug": slug.current,
  order
}`;

const SLUGS_QUERY = groq`*[_type == "post" && defined(slug.current)][].slug.current`;

/* React.cache memoises within a single request for SSR/RSC dedup */

/**
 * News (post) fetches use `next: { revalidate: 60, tags: ["post"] }`.
 *
 * Trade-off: a published post may take up to 60s to surface on the homepage,
 * but every visitor in that window reads the response from the Next.js Data
 * Cache instead of hitting Sanity — typical homepage TTFB drops from
 * ~400ms to <50ms. The /api/revalidate webhook flushes the `post` tag on
 * publish (sanity → Next /api/revalidate → revalidateTag), so editors still
 * get the "publish → live in seconds" feel via cache invalidation rather
 * than per-request fetching. /news + /blog pages remain `force-dynamic`,
 * which overrides this hint and reads fresh.
 */

export const getPosts = cache(async (
  opts: { category?: string; q?: string; limit?: number } = {}
): Promise<PostListItem[]> => {
  if (!client) return [];
  const { category, q, limit = 24 } = opts;
  try {
    return await client.fetch(
      POSTS_LIST_QUERY,
      { category: category ?? null, q: q ? `${q}*` : null, limit },
      { next: { revalidate: 60, tags: ["post"] } }
    );
  } catch (err) {
    console.warn("[getPosts] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  if (!client) return null;
  try {
    return await client.fetch(
      POST_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60, tags: ["post"] } }
    );
  } catch (err) {
    console.warn("[getPostBySlug] Sanity fetch failed — returning null.", err);
    return null;
  }
});

export const getFeaturedPost = cache(async (): Promise<PostListItem | null> => {
  if (!client) return null;
  try {
    return await client.fetch(
      FEATURED_POST_QUERY,
      {},
      { next: { revalidate: 60, tags: ["post"] } }
    );
  } catch (err) {
    console.warn("[getFeaturedPost] Sanity fetch failed — returning null.", err);
    return null;
  }
});

export const getRelatedPosts = cache(async (
  slug: string,
  categoryId?: string
): Promise<PostListItem[]> => {
  if (!client || !categoryId) return [];
  try {
    return await client.fetch(
      RELATED_POSTS_QUERY,
      { slug, categoryId },
      { next: { revalidate: 60, tags: ["post"] } }
    );
  } catch (err) {
    console.warn("[getRelatedPosts] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!client) return [];
  try {
    return await client.fetch(
      CATEGORIES_QUERY,
      {},
      { next: { revalidate: 60, tags: ["post"] } }
    );
  } catch (err) {
    console.warn("[getCategories] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});

export const getAllSlugs = cache(async (): Promise<string[]> => {
  if (!client) return [];
  try {
    return await client.fetch(SLUGS_QUERY, {}, { next: { revalidate: 60, tags: ["post"] } });
  } catch (err) {
    console.warn("[getAllSlugs] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});

/* ─── Careers ──────────────────────────────────────────────────────────── */

export type CareerListItem = {
  _id: string;
  title: string;
  slug: string;
  functionArea: string;
  location: string;
  employmentType: string;
  shortDescription: string;
  publishDate: string;
  closingDate?: string | null;
  active?: boolean;
};

export type Career = CareerListItem & {
  leadParagraph?: string | null;
  responsibilities?: string[] | null;
  requirements?: string[] | null;
  successMetrics?: string | null;
  teamDescription?: string | null;
  teamValues?: string[] | null;
  manager?: Author | null;
  compensationSummary?: string | null;
  benefits?: { icon?: string; label?: string }[] | null;
  applicationInstructions?: string | null;
};

const CAREER_LIST_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  functionArea,
  location,
  employmentType,
  shortDescription,
  publishDate,
  closingDate,
  active
`;

const CAREERS_LIST_QUERY = groq`*[_type == "career" && defined(slug.current) && active == true
  && (!defined($functionArea) || functionArea == $functionArea)
] | order(publishDate desc)[0...$limit]{
  ${CAREER_LIST_PROJECTION}
}`;

const CAREER_BY_SLUG_QUERY = groq`*[_type == "career" && slug.current == $slug][0]{
  ${CAREER_LIST_PROJECTION},
  leadParagraph,
  responsibilities,
  requirements,
  successMetrics,
  teamDescription,
  teamValues,
  "manager": manager->{
    _id, name, role, picture, bio
  },
  compensationSummary,
  benefits[]{ icon, label },
  applicationInstructions
}`;

const RELATED_CAREERS_QUERY = groq`*[_type == "career" && active == true
  && defined(slug.current) && slug.current != $slug
  && functionArea == $functionArea
] | order(publishDate desc)[0...3]{
  ${CAREER_LIST_PROJECTION}
}`;

const CAREER_SLUGS_QUERY = groq`*[_type == "career" && defined(slug.current)][].slug.current`;

export const getCareers = cache(async (
  opts: { functionArea?: string; limit?: number } = {}
): Promise<CareerListItem[]> => {
  if (!client) return [];
  const { functionArea: fn, limit = 50 } = opts;
  try {
    return await client.fetch(
      CAREERS_LIST_QUERY,
      { functionArea: fn ?? null, limit },
      { next: { revalidate: 60, tags: ["career"] } }
    );
  } catch (err) {
    console.warn("[getCareers] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});

export const getCareerBySlug = cache(async (slug: string): Promise<Career | null> => {
  if (!client) return null;
  try {
    return await client.fetch(
      CAREER_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60, tags: ["career", `career:${slug}`] } }
    );
  } catch (err) {
    console.warn("[getCareerBySlug] Sanity fetch failed — returning null.", err);
    return null;
  }
});

export const getRelatedCareers = cache(async (
  slug: string,
  fn: string
): Promise<CareerListItem[]> => {
  if (!client) return [];
  try {
    return await client.fetch(
      RELATED_CAREERS_QUERY,
      { slug, functionArea: fn },
      { next: { revalidate: 60, tags: ["career"] } }
    );
  } catch (err) {
    console.warn("[getRelatedCareers] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});

export const getAllCareerSlugs = cache(async (): Promise<string[]> => {
  if (!client) return [];
  try {
    return await client.fetch(CAREER_SLUGS_QUERY, {}, { next: { revalidate: 60 } });
  } catch (err) {
    console.warn("[getAllCareerSlugs] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});

/* ─── Blog (Journal) ───────────────────────────────────────────────────── */

export type BlogPostListItem = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  publishDate: string;
  readTime?: number | null;
  thumbnail: SanityImage & { metadata?: { lqip?: string } };
  author?: { name: string; picture?: SanityImage } | null;
  featured?: boolean;
};

export type BlogPost = BlogPostListItem & {
  featuredImage?: SanityImage | null;
  heroImage?: SanityImage | null;
  body: unknown[];
  author?: Author | null;
};

const BLOG_LIST_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishDate,
  readTime,
  featured,
  thumbnail{ ..., "metadata": asset->metadata{ lqip } },
  "author": author->{ name, picture }
`;

const BLOG_LIST_QUERY = groq`*[_type == "blogPost" && defined(slug.current)
  && (!defined($category) || category == $category)
  && (!defined($cursor) || publishDate < $cursor)
] | order(publishDate desc)[0...$limit]{
  ${BLOG_LIST_PROJECTION}
}`;

const BLOG_FEATURED_QUERY = groq`*[_type == "blogPost" && defined(slug.current) && featured == true]
  | order(publishDate desc)[0]{
  ${BLOG_LIST_PROJECTION},
  featuredImage{ ..., "metadata": asset->metadata{ lqip } }
}`;

const BLOG_BY_SLUG_QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  ${BLOG_LIST_PROJECTION},
  featuredImage{ ..., "metadata": asset->metadata{ lqip } },
  heroImage{ ..., "metadata": asset->metadata{ lqip } },
  body,
  "author": author->{
    _id, name, role, picture, bio
  }
}`;

const BLOG_RELATED_QUERY = groq`*[_type == "blogPost" && defined(slug.current)
  && slug.current != $slug && category == $category
] | order(publishDate desc)[0...3]{
  ${BLOG_LIST_PROJECTION}
}`;

const BLOG_SLUGS_QUERY = groq`*[_type == "blogPost" && defined(slug.current)][].slug.current`;

/**
 * Blog (Journal) fetches — 60s ISR + `tags: ["post"]` for webhook flushes.
 * Same trade-off as news above.
 */

export const getBlogPosts = cache(async (
  opts: { category?: string; cursor?: string; limit?: number } = {}
): Promise<BlogPostListItem[]> => {
  if (!client) return [];
  const { category, cursor, limit = 9 } = opts;
  try {
    return await client.fetch(
      BLOG_LIST_QUERY,
      { category: category ?? null, cursor: cursor ?? null, limit },
      { next: { revalidate: 60, tags: ["post"] } }
    );
  } catch (err) {
    console.warn("[getBlogPosts] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});

export const getFeaturedBlogPost = cache(async (): Promise<BlogPost | null> => {
  if (!client) return null;
  try {
    return await client.fetch(BLOG_FEATURED_QUERY, {}, { next: { revalidate: 60, tags: ["post"] } });
  } catch (err) {
    console.warn("[getFeaturedBlogPost] Sanity fetch failed — returning null.", err);
    return null;
  }
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!client) return null;
  try {
    return await client.fetch(
      BLOG_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60, tags: ["post"] } }
    );
  } catch (err) {
    console.warn("[getBlogPostBySlug] Sanity fetch failed — returning null.", err);
    return null;
  }
});

export const getRelatedBlogPosts = cache(async (
  slug: string,
  category: string
): Promise<BlogPostListItem[]> => {
  if (!client) return [];
  try {
    return await client.fetch(
      BLOG_RELATED_QUERY,
      { slug, category },
      { next: { revalidate: 60, tags: ["post"] } }
    );
  } catch (err) {
    console.warn("[getRelatedBlogPosts] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});

export const getAllBlogSlugs = cache(async (): Promise<string[]> => {
  if (!client) return [];
  try {
    return await client.fetch(BLOG_SLUGS_QUERY, {}, { next: { revalidate: 60, tags: ["post"] } });
  } catch (err) {
    console.warn("[getAllBlogSlugs] Sanity fetch failed — returning empty list.", err);
    return [];
  }
});
