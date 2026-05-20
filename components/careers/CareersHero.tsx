"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import EditorialImage from "@/components/motion/EditorialImage";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { EASE_STANDARD } from "@/lib/motion";
import { CAREERS_HERO } from "@/lib/media";

/**
 * P10-S01 Careers Hero — Build with us.
 * 100vh full-bleed with documentary team/atelier background.
 * Hero3LayerParallax. Mouse Tracking disabled. Slow Ken-Burns. H1 word-by-word.
 */
export default function CareersHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerBg = useRef<HTMLDivElement>(null);
  const layerMid = useRef<HTMLDivElement>(null);
  const layerType = useRef<HTMLDivElement>(null);

  useMouseParallax(
    sectionRef,
    [
      { ref: layerBg, amplitude: 12 },
      { ref: layerMid, amplitude: 5, counter: true },
      { ref: layerType, amplitude: 8, counter: true },
    ],
    { duration: 0.6, ease: "power2.out" }
  );

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      className="relative h-screen min-h-[640px] w-full overflow-hidden text-white"
    >
      {/* Layer 1 — documentary atelier-team photograph with Ken-Burns 30s */}
      <motion.div
        ref={layerBg}
        aria-hidden
        className="absolute inset-[-2%]"
        style={{
          background:
            "radial-gradient(70% 80% at 38% 50%, #2a3a5c 0%, #14213d 55%, #060B17 100%)",
          animation: "kenBurns 30s ease-in-out infinite alternate",
        }}
      >
        <EditorialImage src={CAREERS_HERO} fill priority sizes="100vw" darkOverlay="cinematic" />
      </motion.div>
      {/* film grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />
      <motion.div
        ref={layerMid}
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(6,11,23,0.85) 0%, rgba(6,11,23,0.35) 50%, rgba(6,11,23,0) 100%)",
        }}
      />

      {/* Layer 3 — typography lower-left */}
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
            Careers · Dholakia Retail
          </motion.p>
          <RevealText
            text="Build with us."
            as="h1"
            className="text-white mb-7 font-[family-name:var(--font-display)]"
            style={{
              fontSize: "clamp(2.5rem, 5.2vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
            staggerMs={60}
            durationMs={800}
            delay={400}
            triggerOnView={false}
          />
          <motion.p
            className="body-lead text-white/80 max-w-xl mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4, ease: EASE_STANDARD }}
          >
            We hire people who care about craft, who think clearly, and who
            treat the discipline of luxury as a long-term commitment — not a
            short-term aesthetic.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { delayChildren: 1.6, staggerChildren: 0.08 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
              }}
            >
              <Link
                href="#open-roles"
                className="group/cta inline-flex items-center gap-2 h-12 px-7 rounded-[2px] bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-deep)] transition-colors duration-[240ms] text-[0.95rem] tracking-wide text-white"
              >
                View open roles
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-[240ms] group-hover/cta:translate-x-1"
                />
              </Link>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
              }}
            >
              <Link
                href="/contact?type=careers#contact-form"
                className="group/cta inline-flex items-center gap-2 h-12 px-7 rounded-[2px] border border-white/40 hover:border-white hover:bg-white/5 transition-colors duration-[240ms] text-[0.95rem] tracking-wide text-white"
              >
                Submit your profile
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-[240ms] group-hover/cta:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
