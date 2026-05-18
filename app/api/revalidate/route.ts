import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { revalidateSecret } from "@/sanity/env";

/**
 * Sanity webhook → on-demand revalidation.
 *
 * Note: /blog and /news (listings + detail pages) are now `force-dynamic`
 * with `cache: "no-store"` Sanity fetches, so they don't strictly need
 * webhook revalidation to stay fresh. We still call `revalidatePath` here
 * because the homepage's <NewsPreview/> is statically rendered with ISR and
 * benefits from instant invalidation when editors publish — and as a safety
 * net if any consumer is ever changed back to caching.
 *
 * Configure in Sanity: Project → API → Webhooks.
 * Trigger on create/update/delete of `post`, `blogPost`, `category`, `author`.
 * Header secret must match SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type?: string;
      slug?: { current?: string };
    }>(req, revalidateSecret);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Bad payload" }, { status: 400 });
    }

    // Homepage NewsPreview pulls the latest news posts — invalidate on any
    // post type so the home grid picks up edits within seconds.
    if (body._type === "post" || body._type === "blogPost") {
      revalidatePath("/");
    }

    // Per-section listings + detail pages.
    if (body._type === "post") {
      revalidatePath("/news");
      if (body.slug?.current) revalidatePath(`/news/${body.slug.current}`);
    }
    // if (body._type === "blogPost") {
    //   revalidatePath("/blog");
    //   if (body.slug?.current) revalidatePath(`/blog/${body.slug.current}`);
    // }
    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
