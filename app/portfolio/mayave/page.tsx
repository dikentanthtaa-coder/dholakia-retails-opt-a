import type { Metadata } from "next";
import MayaveHero from "@/components/mayave/MayaveHero";
import BrandEssence from "@/components/mayave/BrandEssence";
import BrandFacts from "@/components/mayave/BrandFacts";
import Lookbook from "@/components/mayave/Lookbook";
import RelatedJournal from "@/components/mayave/RelatedJournal";
import RelatedNews from "@/components/mayave/RelatedNews";
import PageClosingBand from "@/components/cta/PageClosingBand";

export const metadata: Metadata = {
  title: "Mayavé",
  description:
    "Where silence becomes jewellery. A new chapter in bespoke luxury, crafted for those who seek rarity, intimacy, and refined beauty.",
};

/**
 * Page 4 — Mayavé (`/portfolio/mayave`).
 * Spec P04-S01..S07:
 *   S01 Hero — cinematic 100vh, breadcrumb + wordmark + tagline + CTA
 *   S02 Brand Essence — narrow 640px column, vertical hairline draw
 *   S03 Brand Facts — 4-column hairline-divided dl
 *   S04 Lookbook — masonry, mixed aspect ratios with poetic captions
 *   S05 Related Blog — From the Mayavé journal (3-col grid)
 *   S06 Related News — Mayavé in the news (vertical row list)
 *   S07 Appointment CTA — By appointment, by intention (PageClosingBand)
 *
 * Footer "Mayavé" link routes here from `lib/nav.ts` FOOTER_NAV.brands.
 */
export default function MayavePage() {
  return (
    <>
      <MayaveHero />
      <BrandEssence />
      <BrandFacts />
      <Lookbook />
      {/* <RelatedJournal /> */}
      <RelatedNews />
      <PageClosingBand
        heading="By appointment, by intention."
        body="For private consultations, bespoke discussions, and brand inquiries, connect with Mayavé directly through Dholakia Retail."
        ctaLabel="Arrange a Viewing"
        ctaHref="/contact?type=brand#contact-form"
        variant="off-white"
      />
    </>
  );
}
