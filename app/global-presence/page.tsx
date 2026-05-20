import type { Metadata } from "next";
import PresenceHero from "@/components/global-presence/PresenceHero";
import EcosystemFootprint from "@/components/global-presence/EcosystemFootprint";
import Partnerships from "@/components/global-presence/Partnerships";
import PageClosingBand from "@/components/cta/PageClosingBand";

export const metadata: Metadata = {
  title: "Global Presence & Partnerships",
  description:
    "Built in Surat. Positioned for broader markets. Dholakia Retail draws strength from Surat's place within the diamond ecosystem while aligning to a broader global growth story.",
};

/**
 * Page 8 — Global Presence & Partnerships (`/global-presence`).
 * Spec P08-S01..S04:
 *   S01 Hero — interactive world-map background (markers pulse + reveal city on hover)
 *   S02 Ecosystem Footprint — 3-column location card grid with connector line
 *   S03 Partnerships — editorial statement on Off-White
 *   S04 CTA — PageClosingBand → /contact?type=partnership
 *
 * Footer "Global Presence" link routes here from `lib/nav.ts` FOOTER_NAV.responsibility.
 */
export default function GlobalPresencePage() {
  return (
    <>
      <PresenceHero />
      <EcosystemFootprint />
      <Partnerships />
      <PageClosingBand
        heading="Partner with the House."
        body="For retail development, strategic alliances, and brand expansion conversations, connect with Dholakia Retail directly."
        ctaLabel="Partner with the House"
        ctaHref="/contact?type=partnership#contact-form"
        variant="navy"
      />
    </>
  );
}
