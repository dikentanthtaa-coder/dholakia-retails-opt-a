"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Gem, ArrowRight } from "lucide-react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import RevealText from "@/components/motion/RevealText";
import EditorialImage from "@/components/motion/EditorialImage";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { EASE_STANDARD } from "@/lib/motion";
import { MAYAVE_SPOTLIGHT } from "@/lib/media";

const PROOFS = [
  { Icon: Award, title: "Heritage", body: "Drawing on a deep diamond ecosystem heritage." },
  { Icon: ShieldCheck, title: "Ethics", body: "Verifiable sourcing and responsible creation." },
  { Icon: Gem, title: "Bespoke", body: "Designed for intimacy, rarity, and refined detail." },
];

/**
 * P03-S03 Featured Brand — Mayavé.
 * 100vh editorial. Top half (60vh) cinematic with Hero3LayerParallax.
 * Bottom half (40vh) Off-White content stack.
 */
export default function MayaveSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);
  const layer3 = useRef<HTMLDivElement>(null);

  useMouseParallax(
    containerRef,
    [
      { ref: layer1, amplitude: 15 },
      { ref: layer2, amplitude: 5, counter: true },
      { ref: layer3, amplitude: 8, counter: true },
    ],
    { duration: 0.6 }
  );

  return (
    <section className="bg-white">
      <div className="bg-[var(--color-bg-elevated)] py-20 md:py-28">
        <div className="container-editorial flex flex-col items-center text-center max-w-[820px]">
          <motion.p
            className="eyebrow mb-5"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: EASE_STANDARD }}
          >
            Signature House
          </motion.p>

          <RevealText
            text="Where Silence Becomes Jewellery"
            as="h2"
            className="text-[var(--color-text-primary)] mb-7 font-[family-name:var(--font-display)]"
            style={{
              fontSize: "clamp(1.875rem, 3.6vw, 3rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              fontWeight: 500,
            }}
            staggerMs={60}
            durationMs={700}
          />

          <motion.p
            className="text-[var(--color-text-body)] body-lead max-w-xl mb-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_STANDARD }}
          >
            Mayavé represents a more intimate expression of luxury, built around
            refinement, emotion, and the beauty of restraint.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
            }}
          >
            {PROOFS.map(({ Icon, title, body }) => (
              <motion.div
                key={title}
                className="text-center md:text-left flex flex-col items-center md:items-start"
                variants={{
                  hidden: { opacity: 0, y: 16, scale: 0.92 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE_STANDARD } },
                }}
              >
                <Icon size={28} strokeWidth={1.5} className="text-[var(--color-accent-primary)] mb-4" />
                <h3
                  className="text-[var(--color-text-primary)] font-[family-name:var(--font-display)] mb-2"
                  style={{ fontSize: "1.125rem", fontWeight: 500 }}
                >
                  {title}
                </h3>
                <p className="text-[var(--color-text-body)] text-[0.9rem] leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_STANDARD }}
          >
            <MagneticButton
              href="/portfolio/mayave"
              strength="standard"
              className="group/cta inline-flex items-center gap-3 h-12 px-8 rounded-[2px] bg-[var(--color-accent-primary)] text-white text-[0.95rem] tracking-wide hover:bg-[var(--color-accent-deep)] transition-colors duration-[240ms]"
            >
              Explore Mayavé
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
