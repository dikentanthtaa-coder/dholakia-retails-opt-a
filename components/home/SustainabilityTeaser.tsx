"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import RevealText from "@/components/motion/RevealText";
import EditorialImage from "@/components/motion/EditorialImage";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { EASE_STANDARD } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME_SUSTAINABILITY_TEASER } from "@/lib/media";

/**
 * P01-S07 Sustainability Teaser.
 * 100vh full-bleed parallax band.
 * DocumentaryDeepParallax: bg image -20% to +20% on cursor X-axis (horizontal),
 *   combined with scroll-based parallax (image moves at 30% scroll speed),
 *   foreground typography drifts ±6px counter to background. GSAP power3.out, 0.8s.
 * Image scaled 1.2× base for overflow buffer.
 * MagneticCTA on 'Explore Sustainability'.
 * Background: continuous slow zoom 1.0→1.04 over 30s, infinite reverse.
 */
export default function SustainabilityTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Cursor X: bg translates, fg counter-drifts
  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const section = sectionRef.current;
    const bg = bgRef.current;
    const fg = fgRef.current;
    if (!section || !bg || !fg) return;

    const xBg = gsap.quickTo(bg, "x", { duration: 0.8, ease: "power3.out" });
    const xFg = gsap.quickTo(fg, "x", { duration: 0.8, ease: "power3.out" });
    const yFg = gsap.quickTo(fg, "y", { duration: 0.8, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      // bg: ±20% of overflow on cursor X. With 1.2× scale, overflow ~10% per side → 10% of element width.
      xBg(nx * (rect.width * 0.1));
      // fg: ±6px counter
      xFg(-nx * 6);
      yFg(-ny * 6);
    };

    const onLeave = () => {
      xBg(0); xFg(0); yFg(0);
    };

    section.addEventListener("mousemove", onMove, { passive: true });
    section.addEventListener("mouseleave", onLeave);

    // Scroll-based parallax — rAF-batched so the handler can fire at scroll
    // rate without forcing a layout read every frame.
    let rafScroll = 0;
    const computeScroll = () => {
      rafScroll = 0;
      const rect = section.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const yOffset = progress * 0.3 * rect.height * -0.5;
      gsap.set(bg, { y: yOffset });
    };
    const onScroll = () => {
      if (rafScroll) return;
      rafScroll = requestAnimationFrame(computeScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    computeScroll();

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (rafScroll) cancelAnimationFrame(rafScroll);
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} data-header-theme="dark" className="relative h-screen min-h-[640px] w-full overflow-hidden text-white">
      {/* Layer 1 — bg, 1.2× scale for overflow buffer */}
      <motion.div
        ref={bgRef}
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #08203D 0%, #14275C 45%, #2a3552 100%)",
          transform: "scale(1.2)",
          willChange: "transform",
        }}
      >
        <EditorialImage src={HOME_SUSTAINABILITY_TEASER} fill sizes="100vw" darkOverlay="cinematic" />
        <div
          className="absolute inset-0"
          style={{ animation: "kenBurns 30s ease-in-out infinite alternate" }}
        />
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 80px)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(5,10,20,0.7), transparent)" }}
        />
      </motion.div>

      {/* Foreground typography — counter-drift */}
      <div ref={fgRef} className="relative z-10 h-full container-editorial flex items-end pb-24 md:pb-32 pt-32" style={{ willChange: "transform" }}>
        <div className="max-w-2xl">
          <motion.p
            className="eyebrow mb-5"
            style={{ color: "var(--color-accent-soft)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, ease: EASE_STANDARD }}
          >
            Responsibility
          </motion.p>

          <RevealText
            text="Luxury with a stronger sense of accountability."
            as="h2"
            className="text-white mb-7"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            staggerMs={60}
            durationMs={700}
            delay={200}
          />

          <motion.p
            className="text-white/80 body-lead mb-10 max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE_STANDARD }}
          >
            The future of jewellery depends on beauty, traceability, and how
            brilliance is created. Responsibility is not a side note. It is part
            of the value itself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE_STANDARD }}
          >
            <MagneticButton
              href="/sustainability"
              strength="standard"
              className="group/cta inline-flex items-center gap-2 h-12 px-7 rounded-[2px] bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-deep)] transition-colors duration-[240ms] text-[0.95rem] tracking-wide"
            >
              Explore Sustainability
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-[240ms] group-hover/cta:translate-x-1"
              />
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
