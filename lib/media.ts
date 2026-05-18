/**
 * Central media registry.
 *
 * Every image/video used outside Sanity is referenced through this module.
 * To swap in licensed/production assets later, edit only this file —
 * every page picks up the change automatically.
 *
 * Source strategy:
 *   - Final Option_A assets (AI-generated + web-sourced) are committed under
 *     `/public/media` and referenced through the optional `src` field.
 *   - When `src` is set it takes precedence over the legacy Unsplash `id`
 *     lookup; the id remains as a deterministic fallback seed.
 *   - Cool-tone CSS filter applied at render via <EditorialImage>.
 *   - On failure, on-brand cool gradient renders behind so layout never breaks.
 */

const UNSPLASH = "https://images.unsplash.com";

type Img = {
  /** Local URL (starts with `/media/...`) when a final asset is available. */
  src?: string;
  /** Unsplash photo id used as deterministic fallback / Picsum seed. */
  id: string;
  alt: string;
  frame: string;
  ratio: "16/9" | "4/5" | "3/2" | "4/3" | "1/1" | "21/9";
};

const img = (
  id: string,
  alt: string,
  frame: string,
  ratio: Img["ratio"],
  src?: string
): Img => ({
  src,
  id,
  alt,
  frame,
  ratio,
});

/* ─── Heroes ──────────────────────────────────────────────────────────── */

export const HOME_HERO = img(
  "1604719312566-8912e9227c6a",
  "Cool-toned macro of a polished diamond with raking light.",
  "P01-S01",
  "16/9",
  "/media/images/P01_S01_home_hero_optA_image.png"
);

export const ABOUT_HERO = img(
  "1521737604893-d14cc237f11d",
  "Documentary editorial portrait — environmental, cool monochrome.",
  "P02-S01",
  "16/9",
  "/media/images/P02_S05_the_group_timeline_optA_image_copy.png"
);

export const MAYAVE_HERO = img(
  "1602173574767-37ac01994b2a",
  "Signature jewellery piece on dark velvet, dramatic raking light.",
  "P04-S01",
  "16/9",
  "/media/images/P01_S05_home_portfolio_preview_optA_image.png"
);

export const CRAFTSMANSHIP_HERO = img(
  "1515562141207-7a88fb7ce338",
  "Artisan hands at work with tweezers on a stone, monochrome cool grade.",
  "P05-S01",
  "16/9",
  "/media/images/P05_S01_craftsmanship_hero_optA_image.png"
);

export const SUSTAINABILITY_HERO = img(
  "1509391366360-2e959784a276",
  "Solar field at blue hour, cool documentary photojournalism.",
  "P06-S01",
  "16/9",
  "/media/images/P06_S01_sustainability_hero_optA_image.png"
);

export const SUSTAINABILITY_GROUP_CONTEXT = img(
  "1466611653911-95081537e5b7",
  "Solar array at scale, blue hour, cool desaturated grade.",
  "P06-S03",
  "16/9",
  "/media/images/P06_S02_sustainability_responsibility_pillars_optB_image.png"
);

export const SUSTAINABILITY_MANIFESTO = img(
  "1532619675605-1ede6c2ed2b0",
  "Calm water surface — restraint in a single image.",
  "P06-S04",
  "16/9"
);

export const INNOVATION_HERO = img(
  "1581094288338-2314dddb7ece",
  "Crystal-lattice macro / lab equipment, cool clinical light.",
  "P07-S01",
  "16/9",
  "/media/images/P07_S01_innovation_hero_optA_image.png"
);

export const INNOVATION_LGD = img(
  "1581090464777-f3220bbe1b8b",
  "CVD chamber / scientific lab interior, cool clinical light.",
  "P07-S02",
  "16/9",
  "/media/images/P07_S02_innovation_lab_grown_diamond_story_optA_image.png"
);

export const INNOVATION_QUALITY = img(
  "1518770660439-4636190af475",
  "Provenance-data overlay on circuit / data scene.",
  "P07-S04",
  "16/9",
  "/media/images/P07_S04_innovation_quality_relevance_optA_image.png"
);

export const INNOVATION_PROCESS_EXPLAINER = img(
  "1581090464777-f3220bbe1b8b",
  "Process explainer — lab-grown diamond growth chamber illustration.",
  "P07-S03",
  "16/9",
  "/media/images/P07_S03_innovation_process_explainer_optA_image.png"
);

export const GLOBAL_HERO = img(
  "1502920917128-1aa500764cbd",
  "Stylised world map / Surat architecture at blue hour.",
  "P08-S01",
  "16/9",
  "/media/images/P08_S01_global_presence_partnerships_hero_optA_image.png"
);

export const GLOBAL_PARTNERSHIPS = img(
  "1497366216548-37526070297c",
  "Architectural facade — partner office references.",
  "P08-S03",
  "16/9"
);

export const NEWS_HERO = img(
  "1495020689067-958852a7765e",
  "Editorial newsroom — papers, ledgers, atmospheric still-life.",
  "P09-S01",
  "16/9"
);

export const CAREERS_HERO = img(
  "1556761175-5973dc0f32e7",
  "Documentary group photograph in a Surat atelier, monochrome cool grade.",
  "P10-S01",
  "16/9",
  "/media/images/P10_S01_careers_hero_optA_image.png"
);

export const CONTACT_HERO = img(
  "1497366754035-f200968a6e72",
  "Quiet architectural interior — calm, cool monochrome.",
  "P12-S01",
  "16/9"
);

export const BLOG_HERO_PATTERN = img(
  "1518791841217-8f162f1e1131",
  "Editorial atmosphere — soft journal aesthetic.",
  "P18-S01",
  "16/9",
  "/media/images/P19_S04_single_blog_post_related_posts_optA_image.png"
);

/* ─── Home page sections ──────────────────────────────────────────────── */

export const HOME_PORTFOLIO_PREVIEW = img(
  "1599643477877-530eb83abc8e",
  "Mayavé piece on cream velvet, raking light, shallow DOF.",
  "P01-S05",
  "4/5",
  "/media/images/P01_S05_home_portfolio_preview_optA_image.png"
);

export const HOME_BRAND_FILM_POSTER = img(
  "1605100804763-247f67b3557e",
  "Atelier scene — hands setting a stone, cinematic monochrome.",
  "P01-S06",
  "16/9",
  "/media/images/P01_S06_home_brand_film_optA_image.png"
);

export const HOME_CORPORATE_SNAPSHOT = img(
  "1497366216548-37526070297c",
  "Surat workshop interior — drone or static interior, cool LUT.",
  "P01-S04",
  "16/9",
  "/media/images/P01_S04_home_corporate_snapshot_optA_image.png"
);

export const HOME_SUSTAINABILITY_TEASER = img(
  "1473341304170-971dccb5ac1e",
  "Environmental landscape at blue hour, restrained luxury reference.",
  "P01-S07",
  "16/9",
  "/media/images/P01_S07_home_sustainability_teaser_optA_image.png"
);

/**
 * P01-S08 News / Press preview placeholder thumbnail. Surfaced when the
 * Sanity newsroom returns no posts so the "Coming Soon" cards still carry
 * an editorial visual rather than the bare gradient.
 */
export const HOME_NEWS_PREVIEW_PLACEHOLDER = img(
  "1495020689067-958852a7765e",
  "Editorial newsroom still-life — placeholder thumbnail until live posts publish.",
  "P01-S08",
  "4/5",
  "/media/images/P01_S08_home_news_press_preview_optA_image.png"
);

/* ─── Portfolio / Mayavé ──────────────────────────────────────────────── */

export const PORTFOLIO_HERO_PATTERN = img(
  "1605100804763-247f67b3557e",
  "Editorial brand mark — atelier overhead.",
  "P03-S01",
  "16/9",
  "/media/images/P03_S01_portfolio_hero_optB_image.png"
);

export const PORTFOLIO_BRAND_MATRIX_MAYAVE = img(
  "1605733513597-a8f8341084e6",
  "Mayavé hero treatment — single signature piece on dark.",
  "P03-S02",
  "16/9",
  "/media/images/P03_S02_portfolio_brand_matrix_optA_image.png"
);

export const MAYAVE_SPOTLIGHT = img(
  "1611652022419-a9419f74343d",
  "Mayavé signature piece, cinematic raking light, cream velvet.",
  "P03-S03",
  "16/9",
  "/media/web/P19_S02_single_blog_post_article_body_optB_image.png"
);

export const MAYAVE_LOOKBOOK: Img[] = [
  img(
    "1611652022419-a9419f74343d",
    "Stillness in detail — pearl-and-pendant on the collarbone, editorial portrait.",
    "P04-S04",
    "4/5",
    "/media/mayave/lookbook_01_stillness.jpg"
  ),
  img(
    "1602173574767-37ac01994b2a",
    "Light in proportion — Mayavé signature piece on deep velvet, raking light.",
    "P04-S04",
    "1/1",
    "/media/mayave/lookbook_02_proportion.jpg"
  ),
  img(
    "1573408301185-9146fe634ad0",
    "The private surface — diamond bracelet, reflective black acrylic.",
    "P04-S04",
    "16/9",
    "/media/mayave/lookbook_03_surface.jpg"
  ),
  img(
    "1599643477877-530eb83abc8e",
    "Jewellery as whisper — emerald solitaire on a gold chain, bokeh atelier light.",
    "P04-S04",
    "4/5",
    "/media/mayave/lookbook_04_whisper.jpg"
  ),
  img(
    "1531995811006-35cb42e1a022",
    "Stillness in detail — layered fine necklaces, fashion editorial crop.",
    "P04-S04",
    "1/1",
    "/media/mayave/lookbook_05_chain.jpg"
  ),
  img(
    "1515562141207-7a88fb7ce338",
    "Light in proportion — strung pearls in a presentation case.",
    "P04-S04",
    "16/9",
    "/media/mayave/lookbook_06_bench.jpg"
  ),
];

export const MAYAVE_RELATED_JOURNAL: Img[] = [
  img(
    "1535556116002-6281ff3e9f36",
    "Restraint and embellishment — gold drop earrings on a marble flatlay.",
    "P04-S05",
    "16/9",
    "/media/mayave/journal_01_restraint.jpg"
  ),
  img(
    "1605100804763-247f67b3557e",
    "Polishing — halo solitaire ring at finishing stage, rose-gold accent.",
    "P04-S05",
    "16/9",
    "/media/mayave/journal_02_polish.jpg"
  ),
  img(
    "1611591437281-460bfbe1220a",
    "Diamond cutter — pavé bracelet macro, rose-gold setting.",
    "P04-S05",
    "16/9",
    "/media/mayave/journal_03_cutter.jpg"
  ),
];

export const MAYAVE_RELATED_NEWS: Img[] = [
  img(
    "1531995811006-35cb42e1a022",
    "Press feature — Mayavé piece in editorial framing.",
    "P04-S06",
    "16/9",
    "/media/images/P04_S06_mayave_related_news_optA_image.png"
  ),
  img(
    "1602173574767-37ac01994b2a",
    "Salon opening — interior architectural photography.",
    "P04-S06",
    "16/9"
  ),
  img(
    "1573408301185-9146fe634ad0",
    "Magazine feature — heritage piece on dark velvet.",
    "P04-S06",
    "16/9"
  ),
];

/* ─── Craftsmanship ───────────────────────────────────────────────────── */

export const CRAFT_PHILOSOPHY_MACRO = img(
  "1611591437281-460bfbe1220a",
  "Craft macro — selective focus on a setting, deep black background.",
  "P05-S02",
  "3/2",
  "/media/images/P05_S02_craftsmanship_craft_philosophy_optA_image.png"
);

export const CRAFT_MAKING_ECOSYSTEM = img(
  "1599643478518-a784e5dc4c8f",
  "Diamond / jewellery production floor, cool LUT, deep blacks.",
  "P05-S03",
  "16/9",
  "/media/web/P05_S03_craftsmanship_making_ecosystem_optA_image.jpg"
);

export const CRAFT_PROCESS_TIMELINE = img(
  "1611591437281-460bfbe1220a",
  "Craftsmanship process timeline — bench-side reference still.",
  "P05-S04",
  "16/9",
  "/media/images/P05_S04_craftsmanship_process_timeline_optA_image.png"
);

/* ─── About / The Group ───────────────────────────────────────────────── */

export const ABOUT_PHILOSOPHY = img(
  "1517394834181-95ed159986c7",
  "Quiet contemplative interior — restraint in image form.",
  "P02-S04",
  "16/9"
);

export const GROUP_LEADERSHIP: Img[] = [
  img(
    "1556157382-97eda2d62296",
    "Founder Director — environmental B&W portrait.",
    "P02-S03",
    "4/5",
    "/media/images/Leaders/Dravya Dholakia.png"
  ),
  img(
    "1573497019418-b400bb3ab074",
    "Managing Director — environmental B&W portrait.",
    "P02-S03",
    "4/5"
  ),
  img(
    "1560250097-0b93528c311a",
    "Director, Brands — environmental B&W portrait.",
    "P02-S03",
    "4/5"
  ),
  img(
    "1519085360753-af0119f7cbe7",
    "Director, Operations — environmental B&W portrait.",
    "P02-S03",
    "4/5"
  ),
];

export const GROUP_TIMELINE: Img[] = [
  img(
    "1497366216548-37526070297c",
    "2024 — corporate base in Surat, architectural photography.",
    "P02-S05",
    "4/5",
    "/media/images/P02_S05_the_group_timeline_optA_image.png"
  ),
  img(
    "1518709268805-4e9042af9f23",
    "Foundation — registered office at Gem & Jewellery Park.",
    "P02-S05",
    "4/5"
  ),
  img(
    "1515562141207-7a88fb7ce338",
    "Next chapter — atelier hands shaping the future portfolio.",
    "P02-S05",
    "4/5"
  ),
];

/* ─── Sanity-bound assets (registered for traceability) ───────────────── */

/**
 * Assets below land in the codebase as committed `/public/media/web/...`
 * files but their on-page placement flows through Sanity. They are kept here
 * so the file paths are traceable from a single registry; CMS uploads should
 * mirror these filenames so future swaps stay consistent.
 */
export const SANITY_BOUND_ASSETS = {
  P09_S04_newsroom_article_grid:
    "/media/web/P09_S04_newsroom_article_grid_optA_image.jpg",
  P11_S03_career_role_team_workshop:
    "/media/web/P11_S03_single_career_role_detail_about_the_team_optA_image.jpg",
  P13_S01_news_article_hero:
    "/media/web/P13_S01_news_article_single_article_hero_optA_image.jpg",
  P13_S02_news_article_body:
    "/media/web/P13_S02_news_article_single_article_body_optA_image.jpg",
  P13_S03_news_article_share:
    "/media/web/P13_S03_news_article_single_article_metadata_share_optA_image.jpg",
  P13_S04_news_article_related:
    "/media/web/P13_S04_news_article_single_related_articles_optA_image.jpg",
  P18_S02_blog_featured: "/media/web/P18_S02_blog_listing_featured_post_optA_image.jpg",
  P18_S04_blog_grid: "/media/web/P18_S04_blog_listing_posts_grid_optA_image.jpg",
  P19_S01_blog_article_hero:
    "/media/web/P19_S01_single_blog_post_blog_article_hero_optA_image.webp",
  P19_S02_blog_article_body:
    "/media/images/P19_S02_single_blog_post_article_body_optA_image.png",
  P19_S03_blog_author_share:
    "/media/web/P19_S03_single_blog_post_author_share_optA_image.jpg",
  P19_S04_blog_related_posts:
    "/media/images/P19_S04_single_blog_post_related_posts_optA_image.png",
} as const;

/* ─── Videos ──────────────────────────────────────────────────────────── */

/**
 * Videos pipeline:
 *   - Local AI MP4s (under `/public/media/videos`) — committed final assets.
 *   - The four web-sourced video URLs (Instagram / TikTok / YouTube) cannot be
 *     embedded as direct mp4 sources, so the existing Pexels references are
 *     retained as the playable fallback for `mayaveHero` and `makingEcosystem`.
 *   - Sections without a current `<video>` consumer still expose their final
 *     mp4 here so a future hookup is a one-line registry edit.
 */
export const VIDEOS = {
  /** P01-S01 Home hero — final AI cinematic loop. */
  homeHero: "/media/videos/P01_S01_Hero_Video_idea_360.mp4",
  /** P01-S04 Corporate Snapshot — final AI cinematic loop. */
  corporateSnapshot: "/media/videos/P01_S04_home_corporate_snapshot_optA_video.mp4",
  /** P01-S05 Portfolio Preview — final AI cinematic loop. */
  portfolioPreview: "/media/videos/P01_S05_home_portfolio_preview_optA_video.mp4",
  /** P01-S06 Brand film modal — final AI cinematic loop. */
  brandFilm: "/media/videos/P01_S06_home_brand_film_optA_video.mp4",
  /** P01-S07 Sustainability Teaser — final AI cinematic loop. */
  sustainabilityTeaser:
    "/media/videos/P01_S07_home_sustainability_teaser_optA_video.mp4",
  /** P05-S01 Craftsmanship hero — final AI cinematic loop. */
  craftsmanshipHero: "/media/videos/P05_S01_craftsmanship_hero_optA_video.mp4",
  /** P06-S03 Sustainability wider group context — final AI cinematic loop. */
  sustainabilityGroupContext:
    "/media/videos/P06_S03_sustainability_wider_group_context_optA_video.mp4",
  /**
   * P04-S01 Mayavé hero — Option_A inventory points to a TikTok page
   * (https://www.tiktok.com/@mon.ete.studio/video/7363778218886843691) which
   * cannot be embedded as a direct mp4 source. Pexels reference clip is kept
   * until a downloaded asset replaces it.
   */
  mayaveHero:
    "https://videos.pexels.com/video-files/4498268/4498268-uhd_3840_2160_25fps.mp4",
  /**
   * P05-S03 Making Ecosystem — Option_A inventory points to a YouTube page
   * (https://www.youtube.com/watch?v=u4BhnemDCH0) which cannot be embedded as
   * a direct mp4 source. Pexels reference clip is kept until replaced.
   */
  makingEcosystem:
    "/media/videos/P05_S01_craftsmanship_hero_optA_video.mp4",
} as const;

/* ─── Helpers ─────────────────────────────────────────────────────────── */

export function unsplashUrl(id: string, width: number, quality = 80): string {
  return `${UNSPLASH}/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/**
 * Resolve the best display URL for an image registry entry.
 * Local committed assets always win over the legacy Unsplash id lookup.
 */
export function resolveImageUrl(
  src: { id: string; src?: string },
  width: number,
  quality = 80
): string {
  return src.src ?? unsplashUrl(src.id, width, quality);
}

export function dims(ratio: Img["ratio"], baseWidth = 2400): { width: number; height: number } {
  const [w, h] = ratio.split("/").map(Number);
  return {
    width: baseWidth,
    height: Math.round((baseWidth * h) / w),
  };
}
