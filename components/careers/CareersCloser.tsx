"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P10-S04 Careers Closing Statement.
 * 100vh band on Off-White, centered 720px column.
 * Display Italic statement → 30-word body → two CTAs side-by-side.
 * 32px gap between statement, body, CTAs.
 * Statement word-by-word; body fade-up 12px Y; CTAs stagger 80ms.
 * ButtonHoverFill on both CTAs.
 */
export default function CareersCloser() {
  return (
    <section
      className="bg-[var(--color-bg-elevated)] flex items-center"
      style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "120px" }}
    >
      <div className="container-editorial w-full">
        <div className="max-w-[720px] mx-auto text-center">
          <RevealText
            text="Speak to us about a career."
            as="h2"
            className="text-[var(--color-text-primary)] mb-8 font-[family-name:var(--font-display)] italic"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              fontWeight: 500,
            }}
            staggerMs={60}
            durationMs={800}
          />

          <motion.p
            className="body-lead text-[var(--color-text-body)] mb-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE_STANDARD }}
          >
            Send your profile, your portfolio, or simply a note. Every serious
            application is read by a human.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.8 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
              }}
            >
              <Link
                href="/contact?type=careers#contact-form"
                className="group/cta inline-flex items-center gap-2 h-12 px-7 rounded-[2px] bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-deep)] transition-colors duration-[240ms] text-[0.95rem] tracking-wide"
              >
                Share your profile
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
                href="/contact"
                className="group/cta inline-flex items-center gap-2 h-12 px-7 rounded-[2px] border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors duration-[240ms] text-[0.95rem] tracking-wide"
              >
                Visit Contact
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
