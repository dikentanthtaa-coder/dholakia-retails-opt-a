"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P03-S05 Portfolio CTA — question + ghost-outline magnetic CTA on Off-White.
 */
export default function PortfolioCTA() {
  return (
    <section className="bg-[var(--color-bg-elevated)] py-28 md:py-40">
      <div className="container-editorial flex flex-col items-center text-center max-w-3xl">
        <RevealText
          text="Interested in partnerships or future brand development?"
          as="h2"
          className="text-[var(--color-text-primary)] mb-10 font-[family-name:var(--font-display)]"
          style={{
            fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            fontWeight: 500,
          }}
          staggerMs={50}
          durationMs={650}
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE_STANDARD }}
        >
          <MagneticButton
            href="/contact?type=partnership#contact-form"
            strength="standard"
            className="group/cta inline-flex items-center gap-3 h-12 px-8 rounded-[2px] border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors duration-[240ms] text-[0.95rem] tracking-wide"
          >
            Start a conversation
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-[240ms] group-hover/cta:translate-x-1"
            />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
