"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";
import EditorialImage from "@/components/motion/EditorialImage";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { EASE_STANDARD } from "@/lib/motion";
import { INNOVATION_QUALITY } from "@/lib/media";

/**
 * P07-S04 Quality & Relevance.
 * Editorial band on Off-White. Centered narrow column.
 * Heading → 100-word body → optional supporting metric or detail image.
 * EditorialImageDrift on optional image (±10px, scale 1.04).
 * Heading word-by-word; body fade-up.
 */
export default function QualityRelevance() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useMouseParallax(sectionRef, [{ ref: imageRef, amplitude: 10 }], {
    duration: 0.5,
    ease: "power2.out",
  });

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--color-bg-elevated)]"
      style={{ paddingTop: "160px", paddingBottom: "160px" }}
    >
      <div className="container-editorial">
        <div className="mx-auto max-w-[720px] text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: EASE_STANDARD }}
          >
            <Hairline width={80} className="mb-8 mx-auto" color="var(--color-text-primary)" />
          </motion.div>

          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE_STANDARD }}
          >
            Quality &amp; Relevance
          </motion.p>

          <RevealText
            text="Why this matters for a luxury brand house."
            as="h2"
            className="text-[var(--color-text-primary)] mb-8 font-[family-name:var(--font-display)]"
            style={{
              fontSize: "clamp(1.875rem, 3.4vw, 3rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.015em",
            }}
            staggerMs={60}
            durationMs={700}
          />

          <motion.p
            className="body-lead text-[var(--color-text-body)] max-w-[640px] mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE_STANDARD }}
          >
            Technology strengthens control, consistency, and credibility —
            qualities that matter deeply when building enduring luxury brands.
          </motion.p>
        </div>

        {/* Optional supporting detail image — abstract, type-led restraint */}
        <motion.div
          ref={imageRef}
          className="relative mx-auto mt-20 overflow-hidden border border-[rgba(11,20,38,0.10)]"
          style={{ maxWidth: "1200px", aspectRatio: "16 / 9", transform: "scale(1.04)" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE_STANDARD }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0e1c3a 0%, #14275C 55%, #08203D 100%)",
            }}
          >
            <EditorialImage src={INNOVATION_QUALITY} fill sizes="(min-width: 1024px) 1200px, 100vw" />
          </div>
          
          {/* film grain */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
              backgroundSize: "3px 3px",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
