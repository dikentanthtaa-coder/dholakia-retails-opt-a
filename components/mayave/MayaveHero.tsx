"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import HeroVideo from "@/components/motion/HeroVideo";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { EASE_STANDARD } from "@/lib/motion";
import { MAYAVE_HERO, VIDEOS } from "@/lib/media";

/**
 * P04-S01 Mayavé Hero.
 * 100vh full-bleed cinematic. Cooler grade, deeper shadow, more silver-tone.
 * Hero3LayerParallax with deeper amplitude — bg ±20px, gradient ±5px counter,
 * wordmark on own layer ±6px (reduced).
 * Image scale 1.04 → 1.0 entry. Wordmark fade-up + scale 0.96 → 1.0 (1.4s).
 * Tagline word-by-word at 80ms stagger. CTA fade-up.
 * ButtonHoverFill on Book a Private Viewing (deeper end-state).
 */
export default function MayaveHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerBg = useRef<HTMLDivElement>(null);
  const layerOverlay = useRef<HTMLDivElement>(null);
  const layerWordmark = useRef<HTMLDivElement>(null);

  useMouseParallax(
    sectionRef,
    [
      { ref: layerBg, amplitude: 20 },
      { ref: layerOverlay, amplitude: 5, counter: true },
      { ref: layerWordmark, amplitude: 6, counter: true },
    ],
    { duration: 0.6, ease: "power2.out" }
  );

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      className="relative h-screen min-h-[640px] w-full overflow-hidden text-white"
    >
      {/* Layer 1 — cinematic background (silver-tone cool grade, deep blacks) */}
      <motion.div
        ref={layerBg}
        aria-hidden
        className="absolute inset-[-3%]"
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE_STANDARD }}
        // style={{
        //   background:
        //     "radial-gradient(60% 70% at 55% 45%, #2a3552 0%, #14193a 50%, #06091a 100%)",
        // }}
      >
        <HeroVideo
          src={VIDEOS.mayaveHero}
          posterImageId={MAYAVE_HERO.id}
          posterImageSrc={MAYAVE_HERO.src}
          alt={MAYAVE_HERO.alt}
          priority
        />

        {/* Film grain */}
        {/* <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "3px 3px",
          }}
        /> */}
      </motion.div>

      {/* Layer 2 — overlay gradients (top + bottom) */}
      {/* <motion.div
        ref={layerOverlay}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-x-0 top-0 h-1/4"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,9,26,0.7) 0%, rgba(6,9,26,0) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(to top, rgba(6,9,26,0.85) 0%, rgba(6,9,26,0.3) 60%, rgba(6,9,26,0) 100%)",
          }}
        />
      </motion.div> */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/40 to-[#0B1426]/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1426] via-[#0B1426]/40 to-[#0B1426]/30" /> */}

      {/* Top-left breadcrumb — DM Sans caps, white at 60% opacity */}
      <motion.nav
        aria-label="Breadcrumb"
        className="absolute z-10 top-32 lg:top-32 left-0 right-0 container-editorial flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE_STANDARD }}
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        <Link
          href="/"
          className="text-[0.7rem] tracking-[0.14em] uppercase hover:text-white transition-colors duration-200"
        >
          Dholakia Retail
        </Link>
        <ChevronRight size={12} strokeWidth={1.5} />
        <Link
          href="/portfolio"
          className="text-[0.7rem] tracking-[0.14em] uppercase hover:text-white transition-colors duration-200"
        >
          Portfolio
        </Link>
        <ChevronRight size={12} strokeWidth={1.5} />
        <span className="text-[0.7rem] tracking-[0.14em] uppercase text-white">
          Mayavé
        </span>
      </motion.nav>

      {/* Layer 3 — Wordmark + tagline + CTA (lower-center) */}
      <div
        ref={layerWordmark}
        className="relative z-10 h-full container-editorial flex flex-col items-center justify-end pb-24 md:pb-32 pt-32 text-center"
      >
        <motion.p
          className="eyebrow mb-5"
          style={{ color: "var(--color-accent-soft)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE_STANDARD }}
        >
          Mayavé
        </motion.p>

        {/* Wordmark — fade-up + scale 0.96 → 1.0, 1.4s */}
        <motion.h1
          className="font-[family-name:var(--font-display)] text-white mb-6"
          style={{
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            letterSpacing: "0.06em",
            lineHeight: 1,
            fontWeight: 500,
          }}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: EASE_STANDARD }}
        >
          Mayavé
        </motion.h1>

        {/* Tagline — word-by-word, 80ms (slower poetic) */}
        <RevealText
          text="Where Silence Becomes Jewellery"
          as="h2"
          className="text-white/90 mb-8 font-[family-name:var(--font-display)] italic"
          style={{
            fontSize: "clamp(1.25rem, 2.4vw, 2rem)",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            fontWeight: 400,
          }}
          staggerMs={80}
          durationMs={800}
          delay={1200}
          triggerOnView={false}
        />

        <motion.p
          className="text-white/70 max-w-xl mb-10"
          style={{ fontSize: "1.0625rem", fontWeight: 300, lineHeight: 1.55 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2, ease: EASE_STANDARD }}
        >
          A new chapter in bespoke luxury, crafted for those who seek rarity,
          intimacy, and refined beauty.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5, ease: EASE_STANDARD }}
        >
          <Link
            href="/contact?type=brand#contact-form"
            className="group/cta inline-flex items-center gap-2 h-12 px-8 rounded-[2px] bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-deep)] transition-colors duration-[320ms] text-[0.95rem] tracking-wide"
          >
            Book a Private Viewing
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-[240ms] group-hover/cta:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.8 }}
      >
        <motion.span
          animate={{ y: [2, 8, 2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          <ChevronDown size={24} strokeWidth={1.5} />
        </motion.span>
      </motion.div>
    </section>
  );
}
