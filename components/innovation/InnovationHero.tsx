"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import RevealText from "@/components/motion/RevealText";
import EditorialImage from "@/components/motion/EditorialImage";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_STANDARD } from "@/lib/motion";
import { INNOVATION_HERO } from "@/lib/media";

/**
 * P07-S01 Hero — Precision Is the New Luxury.
 * 100vh full-bleed. Background: abstract crystal-lattice / blueprint macro.
 * Hero3LayerParallax + optional blueprint grid layer that drifts opposite
 *   (Vernier-scale optical effect).
 * Cursor-reveal: 200px circular sharper-version reveal around cursor.
 * H1 word-by-word. Mouse Tracking on image disabled (reveal effect only).
 */
export default function InnovationHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerBg = useRef<HTMLDivElement>(null);
  const layerGrid = useRef<HTMLDivElement>(null);
  const layerType = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Hero3LayerParallax: bg ±15px, grid ±5px counter, type ±8px counter
  useMouseParallax(
    sectionRef,
    [
      { ref: layerBg, amplitude: 15 },
      { ref: layerGrid, amplitude: 5, counter: true },
      { ref: layerType, amplitude: 8, counter: true },
    ],
    { duration: 0.6, ease: "power2.out" }
  );

  // 200px circular cursor-reveal — CSS mask tracks cursor
  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const reveal = section.querySelector<HTMLDivElement>("[data-reveal]");
    if (!reveal) return;

    const setX = gsap.quickTo(reveal, "--rx" as any, { duration: 0.4, ease: "power2.out" });
    const setY = gsap.quickTo(reveal, "--ry" as any, { duration: 0.4, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      setX(e.clientX - rect.left);
      setY(e.clientY - rect.top);
    };
    section.addEventListener("mousemove", onMove, { passive: true });
    return () => section.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      className="relative h-screen min-h-[640px] w-full overflow-hidden text-white"
    >
      {/* Layer 1 — base lab/crystal-lattice photograph + SVG geometry overlay */}
      <motion.div
        ref={layerBg}
        aria-hidden
        className="absolute inset-[-2%]"
        style={{
          background:
            "radial-gradient(70% 80% at 35% 45%, #1a2e55 0%, #0B1426 50%, #050A14 100%)",
          transform: "scale(1.02)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_STANDARD }}
      >
        <EditorialImage src={INNOVATION_HERO} fill priority sizes="100vw" darkOverlay="cinematic" />
        {/* Crystal lattice geometry */}
       
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

      {/* Layer 2 — blueprint grid drifting opposite */}
      <motion.div
        ref={layerGrid}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(155,181,255,0.5) 0px, rgba(155,181,255,0.5) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(155,181,255,0.5) 0px, rgba(155,181,255,0.5) 1px, transparent 1px, transparent 40px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ duration: 1.2, ease: EASE_STANDARD }}
      />

      {/* Cursor-reveal layer — sharper lattice exposed within 200px circular mask */}
      <div
        data-reveal
        aria-hidden
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={
          {
            background:
              "radial-gradient(circle at 50% 50%, rgba(155,181,255,0.18) 0%, rgba(155,181,255,0.08) 40%, transparent 70%)",
            ["--rx" as any]: "50%",
            ["--ry" as any]: "50%",
            WebkitMaskImage:
              "radial-gradient(200px 200px at var(--rx) var(--ry), #000 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(200px 200px at var(--rx) var(--ry), #000 0%, #000 60%, transparent 100%)",
          } as React.CSSProperties
        }
      />

      {/* Bottom gradient for legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(5,10,20,0.85) 0%, rgba(5,10,20,0.35) 50%, rgba(5,10,20,0) 100%)",
        }}
      />

      {/* Layer 3 — typography (lower-left) */}
      <div
        ref={layerType}
        className="relative z-10 h-full container-editorial flex items-end pb-24 md:pb-32 pt-32"
      >
        <div className="max-w-3xl">
          <motion.p
            className="eyebrow mb-6"
            style={{ color: "var(--color-accent-soft)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_STANDARD }}
          >
            Innovation
          </motion.p>
          <RevealText
            text="Precision Is the New Luxury"
            as="h1"
            className="text-white mb-7"
            style={{
              fontSize: "clamp(2.5rem, 5.2vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
            staggerMs={60}
            durationMs={800}
            delay={400}
            triggerOnView={false}
          />
          <motion.p
            className="body-lead text-white/80 max-w-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4, ease: EASE_STANDARD }}
          >
            Innovation makes luxury more consistent, more scalable, and more
            relevant to the next generation of consumers.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
