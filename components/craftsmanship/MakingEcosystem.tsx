"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import CursorPerspective from "@/components/motion/CursorPerspective";
import RevealText from "@/components/motion/RevealText";
import HeroVideo from "@/components/motion/HeroVideo";
import { EASE_STANDARD } from "@/lib/motion";
import { CRAFT_MAKING_ECOSYSTEM, VIDEOS } from "@/lib/media";

/**
 * P05-S03 Making Ecosystem.
 * Split-screen 50/50 full-bleed.
 * Left: silent video loop of Surat facility (drone or interior).
 * Right (Off-White, 80px padding): eyebrow → H2 → 60-word body → text-link 'Visit the Surat workshop'.
 *
 * Motion · Parallax · Tracking
 *   Mouse Parallax: Hero3LayerParallax on left video pane. Right pane static.
 *   Mouse Tracking: CursorPerspective ±2° on left video. Disabled on right pane.
 *
 * Motion timeline
 *   → Video plays on viewport entry
 *   → Right pane: stagger-reveal of eyebrow → heading → body → link
 */
export default function MakingEcosystem() {
  const leftRef = useRef<HTMLDivElement>(null);
  const layerVideo = useRef<HTMLDivElement>(null);
  const layerOverlay = useRef<HTMLDivElement>(null);
  const layerLabel = useRef<HTMLDivElement>(null);

  // Hero3LayerParallax (left only)
  useMouseParallax(
    leftRef,
    [
      { ref: layerVideo, amplitude: 15 },
      { ref: layerOverlay, amplitude: 5, counter: true },
      { ref: layerLabel, amplitude: 8, counter: true },
    ],
    { duration: 0.6, ease: "power2.out" }
  );

  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        {/* LEFT — video pane with parallax + cursor perspective */}
        <div ref={leftRef} className="relative overflow-hidden text-white aspect-[4/5] lg:aspect-auto">
          <CursorPerspective maxAngle={2} className="absolute inset-0">
            {/* Layer 1 — Surat facility video. Falls back to poster image
                automatically (Pexels stock loop, commercially licensed). */}
            <motion.div
              ref={layerVideo}
              aria-hidden
              className="absolute inset-[-3%]"
              initial={{ scale: 1.04, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease: EASE_STANDARD }}
              style={{
                background:
                  "linear-gradient(135deg, #14213d 0%, #0B1426 60%, #060B17 100%)",
              }}
            >
              <HeroVideo
                src={VIDEOS.makingEcosystem}
                posterImageId={CRAFT_MAKING_ECOSYSTEM.id}
                posterImageSrc={CRAFT_MAKING_ECOSYSTEM.src}
                alt={CRAFT_MAKING_ECOSYSTEM.alt}
                darkOverlay="none"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </motion.div>

            {/* Layer 2 — overlay */}
            <motion.div
              ref={layerOverlay}
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(80% 60% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)",
              }}
            />

            {/* Industrial / blueprint texture */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 80px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 80px)",
              }}
            />

            {/* Layer 3 — facility label */}
            <motion.div
              ref={layerLabel}
              className="absolute inset-x-0 bottom-0 px-8 py-8 pointer-events-none"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.6, ease: EASE_STANDARD }}
            >
              <p className="text-[0.7rem] tracking-[0.16em] uppercase text-white/70 font-[family-name:var(--font-mono)]">
                Gem &amp; Jewellery Park · Surat
              </p>
            </motion.div>
          </CursorPerspective>
        </div>

        {/* RIGHT — Off-White content, 80px padding, static */}
        <div
          className="bg-[var(--color-bg-elevated)] flex items-center"
          style={{ padding: "80px" }}
        >
          <motion.div
            className="max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.p
              className="mb-5"
              style={{
                color: "var(--color-accent-primary)",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
              }}
            >
              Making Ecosystem
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.4 } },
              }}
            >
              <RevealText
                text="Where design, manufacturing, and finish meet"
                as="h2"
                className="text-[var(--color-text-primary)] mb-7 font-[family-name:var(--font-display)]"
                style={{
                  fontSize: "clamp(1.875rem, 3.2vw, 2.75rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  fontWeight: 500,
                }}
                staggerMs={60}
                durationMs={700}
              />
            </motion.div>

            <motion.p
              className="body-lead text-[var(--color-text-body)] mb-10"
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_STANDARD } },
              }}
            >
              Across the wider Dholakia ecosystem, craft is strengthened by
              systems, expertise, and a commitment to quality at every stage.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
              }}
            >
              <Link
                href="/craftsmanship#workshop"
                className="group inline-flex items-center gap-2 text-[var(--color-accent-primary)] font-medium tracking-wide"
              >
                <span className="border-b border-transparent group-hover:border-[var(--color-accent-primary)] pb-0.5 transition-colors">
                  Visit the Surat workshop
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
