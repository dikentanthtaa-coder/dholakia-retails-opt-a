"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import RevealText from "@/components/motion/RevealText";
import HeroVideo from "@/components/motion/HeroVideo";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { EASE_STANDARD } from "@/lib/motion";
import { HOME_BRAND_FILM_POSTER, VIDEOS, resolveImageUrl } from "@/lib/media";

/**
 * P01-S06 Brand Film.
 * 70vh full-bleed; True Black 40% overlay over 16:9 poster.
 * PosterGentleDrift ±10px each axis, scale 1.03 base.
 * MagneticCTA strong (120px proximity, 0.4) on play button.
 * Section entry: poster fades in 800ms.
 * Play: scale 0→1 with overshoot spring (1.1→1.0), 600ms.
 * Subtle ripple: continuous 3s loop, 0.3 opacity → 0.
 * Modal: poster fades to True Black 240ms; modal scale 0.96→1.0 + fade-in 400ms.
 */
export default function BrandFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useMouseParallax(sectionRef, [{ ref: posterRef, amplitude: 10 }], {
    duration: 0.6,
    ease: "power2.out",
  });

  return (
    <section ref={sectionRef} data-header-theme="dark" className="relative w-full overflow-hidden text-white" style={{ height: "70vh", minHeight: 480 }}>
      {/* Poster with True Black 40% overlay */}
      <motion.div
        ref={posterRef}
        className="absolute inset-[-3%]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE_STANDARD }}
        style={{ transform: "scale(1.03)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 80% at 50% 60%, #1a2542 0%, #08101F 70%, #03060C 100%)",
          }}
        >
          <HeroVideo
            src={VIDEOS.brandFilm}
            posterImageId={HOME_BRAND_FILM_POSTER.id}
            posterImageSrc={HOME_BRAND_FILM_POSTER.src}
            alt={HOME_BRAND_FILM_POSTER.alt}
            darkOverlay="none"
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Full-band click target launches modal */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-label="Watch the film"
        className="relative z-10 h-full w-full flex flex-col items-center justify-center group"
        style={{ cursor: "pointer" }}
      >
        {/* Play button + ripple */}
        <MagneticButton
          strength="strong"
          onClick={() => setOpen(true)}
          className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-accent-primary)] transition-transform"
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 140, damping: 12, duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-[var(--color-accent-primary)]"
          />
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--color-accent-primary)" }}
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          />
          <Play size={28} strokeWidth={1.5} className="relative text-white" fill="white" />
        </MagneticButton>

        <motion.p
          className="eyebrow mt-10 mb-4"
          style={{ color: "rgba(255,255,255,0.7)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE_STANDARD }}
        >
          Film
        </motion.p>

        <RevealText
          text="A quiet look inside the house."
          as="h2"
          className="text-white max-w-3xl text-center px-6"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15, letterSpacing: "-0.015em" }}
          staggerMs={60}
          durationMs={700}
        />

        <motion.span
          className="mt-7 inline-flex items-center gap-2 text-[0.9rem] tracking-wide text-white/85 border-b border-white/40 pb-1 group-hover:text-white group-hover:border-white transition-colors"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.7, ease: EASE_STANDARD }}
        >
          Watch the film
        </motion.span>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Brand film"
            initial={{ background: "rgba(0,0,0,0)" }}
            animate={{ background: "rgba(0,0,0,0.95)" }}
            exit={{ background: "rgba(0,0,0,0)" }}
            transition={{ duration: 0.24, ease: EASE_STANDARD }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/30 text-white inline-flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            <motion.div
              className="relative w-full max-w-5xl aspect-video rounded-sm overflow-hidden bg-black"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_STANDARD }}
            >
              {/*
                P01-S06 Brand Film modal video.
                Public Pexels stock clip (commercial license) — placeholder for the
                production 45-60s atelier film. Filtered cool-tone via CSS.
              */}
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={resolveImageUrl(HOME_BRAND_FILM_POSTER, 1920, 75)}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: "grayscale(0.5) contrast(1.05) brightness(0.85)",
                }}
              >
                <source src={VIDEOS.brandFilm} type="video/mp4" />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
