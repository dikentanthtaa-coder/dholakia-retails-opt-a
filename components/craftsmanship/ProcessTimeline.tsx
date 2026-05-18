"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Pencil, Gem, Grid3x3, Wrench, Package, Clock3 } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P05-S04 Process Timeline — connected craft track.
 *
 * A horizontal craft timeline (vertical on mobile) where every step sits *on*
 * a continuous track. The track has two layers:
 *   • A dashed navy/15% baseline that traces the full path of the journey
 *   • A solid Electric Blue progress overlay whose length is tied to the
 *     viewport's scroll position over the section, so the path "fills" as
 *     the user reads down the page
 *
 * Each step is a self-contained editorial composition:
 *   • A 72px circular numeral badge that sits on the track. On hover the
 *     badge fills with accent + the numeral inverts to white, plus an outer
 *     pulse ring expands.
 *   • A small duration meta line ("Week 1", "Weeks 2–3" …)
 *   • The Lucide icon, the title (Syne display), the body copy.
 *
 * Background detail: an oversized italic Roman numeral "V" watermark at the
 * back of the section nods at the five-step structure without competing with
 * the typography.
 */

type Step = {
  num: number;
  label: string;
  description: string;
  duration: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const STEPS: Step[] = [
  {
    num: 1,
    label: "Concept",
    description:
      "Idea, audience, and emotional intent shaped on paper before a single stone is sourced.",
    duration: "Week 1",
    Icon: Pencil,
  },
  {
    num: 2,
    label: "Material Understanding",
    description:
      "Stone, metal, and origin examined for provenance, fit, and the brief the piece must serve.",
    duration: "Week 2",
    Icon: Gem,
  },
  {
    num: 3,
    label: "Design Development",
    description:
      "Proportion, balance, and silhouette refined across iterations until the piece reads correct in hand.",
    duration: "Weeks 3–4",
    Icon: Grid3x3,
  },
  {
    num: 4,
    label: "Setting & Finishing",
    description:
      "Stones set, metal worked, surfaces brought to the discipline of mirror polish under the bench loupe.",
    duration: "Weeks 5–7",
    Icon: Wrench,
  },
  {
    num: 5,
    label: "Presentation",
    description:
      "The piece authenticated, documented, and readied for its private debut with the client.",
    duration: "Week 8",
    Icon: Package,
  },
];

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  // Tie the accent fill to scroll progress over the section. Starts when the
  // section header enters the lower viewport, completes ~2/3 of the way up.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 35%"],
  });
  const trackScaleX = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const trackScaleY = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#faf9f7] overflow-hidden"
      style={{ paddingTop: "140px", paddingBottom: "140px" }}
    >
      {/* Oversized "V" watermark — 5 in Roman numerals. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-end pr-[3vw] opacity-[0.035] select-none"
      >
        <span
          className="font-[family-name:var(--font-display)] italic text-[var(--color-text-primary)]"
          style={{ fontSize: "clamp(20rem, 42vw, 56rem)", lineHeight: 0.85, fontWeight: 500 }}
        >
          V
        </span>
      </div>

      <div className="relative container-editorial">
        {/* Header — asymmetric, title left + meta right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-y-8 gap-x-16 mb-24 md:mb-28">
          <div>
            <motion.p
              className="eyebrow mb-6"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: EASE_STANDARD }}
            >
              Process Timeline · 5 stages
            </motion.p>
            <RevealText
              text="Five steps from concept to presentation."
              as="h2"
              className="text-[var(--color-text-primary)] font-[family-name:var(--font-display)]"
              style={{
                fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 500,
              }}
              staggerMs={50}
              durationMs={650}
            />
          </div>
          <div className="lg:pt-4 flex flex-col gap-5">
            <motion.p
              className="text-[var(--color-text-body)]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE_STANDARD }}
              style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}
            >
              Every piece moves through five disciplined stages. Time is not
              the goal — but it is the cost of doing the work properly.
            </motion.p>

            {/* Meta chips */}
            <motion.div
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: 0.6, ease: EASE_STANDARD }}
            >
              <span className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.16em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
                <Clock3 size={12} strokeWidth={1.5} />
                Avg duration · 6–8 weeks
              </span>
              <span className="text-[var(--color-text-muted)]/40">·</span>
              <span className="text-[0.7rem] tracking-[0.16em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
                Atelier-led · Surat
              </span>
            </motion.div>
          </div>
        </div>

        {/* ─── Timeline ─── */}
        <div className="relative">
          {/*
            Desktop horizontal track — baseline (dashed navy) + accent fill.
            Positioned at top=36px which is exactly the vertical centre of the
            72px-tall numeral badges below.
          */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-9 left-[10%] right-[10%] h-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(11,20,38,0.18) 0 6px, transparent 6px 12px)",
            }}
          />
          <motion.div
            aria-hidden
            className="hidden lg:block absolute top-9 left-[10%] right-[10%] h-px origin-left bg-[var(--color-accent-primary)]"
            style={{ scaleX: trackScaleX, willChange: "transform" }}
          />

          {/*
            Mobile vertical track — same two layers, just rotated. Sits behind
            the badge column (offset left so the badges stay aligned).
          */}
          <div
            aria-hidden
            className="lg:hidden absolute top-9 bottom-9 left-9 w-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(11,20,38,0.18) 0 6px, transparent 6px 12px)",
            }}
          />
          <motion.div
            aria-hidden
            className="lg:hidden absolute top-9 bottom-9 left-9 w-px origin-top bg-[var(--color-accent-primary)]"
            style={{ scaleY: trackScaleY, willChange: "transform" }}
          />

          {/* Steps */}
          <ol className="relative list-none grid grid-cols-1 lg:grid-cols-5 gap-y-12 lg:gap-y-0 lg:gap-x-6">
            {STEPS.map((s, i) => (
              <Step key={s.num} step={s} index={i} />
            ))}
          </ol>
        </div>

        {/* Footer caption */}
        <motion.p
          className="mt-20 text-center text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
        >
          Bench-side · Surat workshop · Each piece touched by hand
        </motion.p>
      </div>
    </section>
  );
}

function Step({ step, index }: { step: Step; index: number }) {
  const { num, label, description, duration, Icon } = step;

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE_STANDARD }}
      className="group/step relative flex flex-row lg:flex-col items-start lg:items-start gap-6 lg:gap-0 pl-0 lg:pl-0"
    >
      {/* Numeral badge — sits on the track. The 72px ring is centered on the
          track line (top=36px) so the line visually passes *through* the badge. */}
      <div className="relative shrink-0">
        {/* Outer pulse ring — only visible on hover */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-[var(--color-accent-primary)] scale-100 opacity-0 group-hover/step:scale-[1.5] group-hover/step:opacity-25 transition-all duration-700 ease-out"
        />
        <motion.span
          className="relative inline-flex items-center justify-center w-[72px] h-[72px] rounded-full bg-[#faf9f7] border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] font-[family-name:var(--font-display)] italic transition-[background-color,color,box-shadow] duration-500 ease-out group-hover/step:bg-[var(--color-accent-primary)] group-hover/step:text-white group-hover/step:shadow-[0_0_0_8px_rgba(59,111,255,0.08)]"
          style={{ fontSize: "1.05rem", fontWeight: 500, lineHeight: 1 }}
          initial={{ scale: 0, rotate: -8 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            type: "spring",
            stiffness: 170,
            damping: 14,
            delay: 0.25 + index * 0.1,
          }}
        >
          {String(num).padStart(2, "0")}
        </motion.span>
      </div>

      {/* Content column */}
      <div className="flex-1 lg:mt-10 max-w-md lg:max-w-[15rem]">
        {/* Duration pill */}
        <span className="inline-flex items-center gap-2 mb-4 text-[0.65rem] tracking-[0.18em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
          <span className="w-3 h-px bg-[var(--color-accent-primary)]" />
          {duration}
        </span>

        {/* Icon — rotates slightly + scales on hover. */}
        <motion.span
          className="block text-[var(--color-accent-primary)] mb-4 transition-transform duration-500 ease-out group-hover/step:scale-110 group-hover/step:-rotate-[4deg]"
          initial={{ scale: 0, rotate: -8 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            delay: 0.35 + index * 0.1,
            ease: EASE_STANDARD,
          }}
        >
          <Icon size={30} strokeWidth={1.5} />
        </motion.span>

        {/* Title */}
        <h3
          className="font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-3 transition-colors duration-300 group-hover/step:text-[var(--color-accent-primary)]"
          style={{
            fontSize: "clamp(1.125rem, 1.5vw, 1.375rem)",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.005em",
          }}
        >
          {label}
        </h3>

        {/* Description */}
        <p
          className="text-[var(--color-text-body)] leading-relaxed"
          style={{ fontSize: "0.95rem" }}
        >
          {description}
        </p>
      </div>
    </motion.li>
  );
}
