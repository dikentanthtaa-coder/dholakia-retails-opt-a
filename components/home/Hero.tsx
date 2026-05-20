"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import RevealText from "@/components/motion/RevealText";
import HeroVideo from "@/components/motion/HeroVideo";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { EASE_STANDARD } from "@/lib/motion";
import { HOME_HERO, VIDEOS } from "@/lib/media";

/**
 * P01-S01 Hero — 100vh layered cinematic.
 * Hero3LayerParallax (GSAP):
 *   Layer 1 video: ±15px each axis, scale 1.02
 *   Layer 2 gradient: ±5px counter
 *   Layer 3 typography: ±8px counter to layer 1
 * MagneticCTA standard 0.3 on primary; word-by-word H1; sub fade-up; scroll-cue bob.
 */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const layer1 = useRef<HTMLDivElement>(null); // video / image base
  const layer2 = useRef<HTMLDivElement>(null); // gradient overlay
  const layer3 = useRef<HTMLDivElement>(null); // foreground typography

  useMouseParallax(
    containerRef,
    [
      { ref: layer1, amplitude: 15 },
      { ref: layer2, amplitude: 5, counter: true },
      { ref: layer3, amplitude: 8, counter: true },
    ],
    { duration: 0.6, ease: "power2.out" }
  );

  return (
    <section ref={containerRef} data-header-theme="dark" className="relative h-screen min-h-[640px] w-full overflow-hidden text-white">
      {/* Layer 1 — cinematic still (Ken-Burns scale 1.02) with cool-tone editorial filter */}
      <motion.div
        ref={layer1}
        aria-hidden
        className="absolute inset-[-4%]"
        style={{
          background: "radial-gradient(120% 80% at 30% 30%, #1a3a78 0%, #0B1426 55%, #050A14 100%)",
          transform: "scale(1.02)",
        }}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1.02, opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_STANDARD }}
      >
        <HeroVideo
          src={VIDEOS.homeHero}
          posterImageId={HOME_HERO.id}
          posterImageSrc={HOME_HERO.src}
          alt={HOME_HERO.alt}
          darkOverlay="none"
          // LCP candidate — tell next/image to preload + fetchpriority=high.
          priority
        />
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "3px 3px",
          }}
        />
      </motion.div>

      {/* Layer 2 — gradient overlay (counter-cursor) */}
      {/* <motion.div ref={layer2} aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-x-0 top-0 h-1/4"
          style={{ background: "linear-gradient(to bottom, rgba(11,20,38,0.55) 35%, rgba(11,20,38,0) 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/5"
          style={{ background: "linear-gradient(to top, rgba(11,20,38,0.65) 50%, rgba(11,20,38,0) 100%)" }}
        />
      </motion.div> */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1426]/40 via-[#0B1426]/30 to-[#0B1426]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1426]/60 via-transparent to-transparent" />


      {/* Layer 3 — foreground typography */}
      <motion.div
        ref={layer3}
        className="relative z-10 h-full container-editorial flex flex-col justify-center items-center text-center pt-24 pb-32"
        style={{ position: "relative", height: "100%" }}
      >
        {/* Anchor stack at 55% of viewport per spec */}
        <div className="flex flex-col items-center" style={{ marginTop: "5vh" }}>
          <motion.p
            className="eyebrow text-white/70 mb-6"
            style={{ color: "rgba(255,255,255,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_STANDARD }}
          >
            DHOLAKIA RETAIL PRIVATE LIMITED
          </motion.p>

          <RevealText
            text="Building the Future of Luxury Retail"
            as="h1"
            className="text-white max-w-4xl"
            style={{
              fontSize: "clamp(2.5rem, 5.2vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
            staggerMs={60}
            durationMs={800}
            delay={350}
            triggerOnView={false}
          />

          <motion.p
            className="mt-7 max-w-2xl text-white/80 body-lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: EASE_STANDARD }}
          >
            Dholakia Retail Private Limited serves as the corporate foundation for a
            growing portfolio of luxury jewellery brands, bringing together heritage,
            precision, and a future-facing approach to brand creation.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { delayChildren: 1.4, staggerChildren: 0.08 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
              }}
            >
              <MagneticButton
                href="/the-group"
                strength="standard"
                className="group/cta inline-flex items-center gap-2 h-12 px-7 rounded-[2px] bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-deep)] transition-colors duration-[240ms] text-[0.95rem] tracking-wide"
              >
                Explore the Group
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-[240ms] group-hover/cta:translate-x-1"
                />
              </MagneticButton>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
              }}
            >
              <Link
                href="/portfolio"
                className="group/cta inline-flex items-center gap-2 h-12 px-7 rounded-[2px] border border-white/40 hover:border-white hover:bg-white/5 transition-colors duration-[240ms] text-[0.95rem] tracking-wide text-white"
              >
                View Portfolio
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-[240ms] group-hover/cta:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue — chevron-down with 2→8→2px Y bob, 1.6s ease-in-out infinite */}
      {/* <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ color: "rgba(255,255,255,0.6)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      >
        <span className="text-[0.625rem] tracking-[0.2em] uppercase">Scroll</span>
        <motion.span
          aria-hidden
          animate={{ y: [2, 8, 2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} strokeWidth={1.5} />
        </motion.span>
      </motion.div> */}
    </section>
  );
}
