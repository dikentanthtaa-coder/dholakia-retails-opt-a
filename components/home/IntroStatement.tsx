"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P01-S02 Intro Statement.
 * 90vh band, Off-White, 720px max-width.
 * AmbientTextureDrift on optional facet (±4px, 0.8s ease).
 * Hairline 80px draws left-to-right (800ms).
 * Eyebrow 200ms before heading; heading word-by-word; body fade-up 12px Y after heading.
 */
export default function IntroStatement() {
  const ref = useRef<HTMLElement>(null);
  const textureRef = useRef<HTMLDivElement>(null);

  useMouseParallax(ref, [{ ref: textureRef, amplitude: 4 }], {
    duration: 0.8,
    ease: "power2.out",
  });

  return (
    <section
      ref={ref}
      data-header-theme="light"
      className="relative bg-[var(--color-bg-elevated)] overflow-hidden flex items-center"
      style={{ minHeight: "90vh", paddingTop: "200px", paddingBottom: "200px" }}
    >
      {/* AmbientTextureDrift layer */}
      <motion.div
        ref={textureRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #0B1426 0%, transparent 70%)",
        }}
      />

      {/* Background video */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          src="/media/mayave/MAYAVE_4K.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="relative container-editorial flex flex-col items-center text-center max-w-[780px]">
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
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
        >
          A House of Brands
        </motion.p>

        <RevealText
          text="A corporate foundation for modern luxury."
          as="h2"
          className="text-white mb-8"
          style={{
            fontSize: "clamp(2rem, 3.8vw, 3.5rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
          }}
          staggerMs={60}
          durationMs={700}
          delay={200}
        />

        <motion.p
          className="body-lead text-white/80 max-w-[640px]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE_STANDARD }}
        >
          Headquartered in Surat, Gujarat, Dholakia Retail is built to create,
          guide, and grow distinguished jewellery brands with authenticity,
          discipline, and long-term relevance.
        </motion.p>
      </div>
    </section>
  );
}
