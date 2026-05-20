import type { Metadata } from "next";
import SustainabilityHero from "@/components/sustainability/SustainabilityHero";
import PillarGrid from "@/components/sustainability/PillarGrid";
import GroupContext from "@/components/sustainability/GroupContext";
import Manifesto from "@/components/sustainability/Manifesto";
import PageClosingBand from "@/components/cta/PageClosingBand";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "The future of jewellery must consider not only beauty, but how it is created, verified, and carried forward.",
};

/**
 * Page 6 — Sustainability (`/sustainability`).
 * Spec P06-S01..S04:
 *   S01 Hero — Luxury, Reconsidered (DocumentaryDeepParallax)
 *   S02 Responsibility Pillars — 4-col grid (Card3DTilt 4°, CardSubtleLift)
 *   S03 Wider Group Context — full-bleed parallax band
 *   S04 Manifesto — long-form editorial (640px column, hairlines)
 */
export default function SustainabilityPage() {
  return (
    <>
      <SustainabilityHero />
      <PillarGrid />
      <GroupContext />
      <Manifesto />
      <PageClosingBand
        heading="Read the full sustainability report."
        body="Quarterly updates, audited metrics, and the long-form record from the Sustainability Desk."
        ctaLabel="Contact the Sustainability Desk"
        ctaHref="/contact?type=press#contact-form"
        variant="navy"
      />
    </>
  );
}
