"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sprout, FlaskConical, Hexagon, Scissors, Gem } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P07-S03 Process Explainer — Diamond Spine Timeline.
 *
 * Editorial zig-zag layout: a central vertical spine threads through five
 * rotated-square ("diamond") nodes. Content blocks alternate left/right of
 * the spine. Each row is anchored by a ghost italic numeral that acts as a
 * typographic landmark for the stage.
 *
 * Scroll progress drives:
 *   • the accent fill that traces the spine top→bottom
 *   • node activation (the diamond fills with accent as the user passes it)
 *
 * Mobile: spine collapses to the left edge, content reflows to a single
 * column on the right.
 */

type Step = {
  num: number;
  label: string;
  description: string;
  caption: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const STEPS: Step[] = [
  {
    num: 1,
    label: "Diamond Seed",
    description: "A pure carbon seed crystal initiates the growth process.",
    caption: "Origin",
    Icon: Sprout,
  },
  {
    num: 2,
    label: "Controlled Growth",
    description: "Plasma chamber conditions are tuned with precision.",
    caption: "Calibration",
    Icon: FlaskConical,
  },
  {
    num: 3,
    label: "Crystal Development",
    description: "Atom-by-atom layering forms the structured crystal.",
    caption: "Formation",
    Icon: Hexagon,
  },
  {
    num: 4,
    label: "Cutting & Polishing",
    description: "Facets are cut and polished to optical tolerances.",
    caption: "Finish",
    Icon: Scissors,
  },
  {
    num: 5,
    label: "Jewellery Application",
    description: "The finished stone is set into the final piece.",
    caption: "Setting",
    Icon: Gem,
  },
];

export default function ProcessFlowchart() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 40%"],
  });

  const spineScaleY = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f3f4f6] overflow-hidden"
      style={{ paddingTop: "140px", paddingBottom: "140px" }}
    >
      {/* Diagonal-line background pattern — quiet, lab-precision feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(11,20,38,1) 0 1px, transparent 1px 28px)",
        }}
      />

      <div className="relative container-editorial">
        {/* ─── Header — three-column editorial: eyebrow / title / meta ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-y-8 gap-x-12 items-end mb-24 md:mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE_STANDARD }}
            className="flex items-center gap-3"
          >
            <span className="w-10 h-px bg-[var(--color-accent-primary)]" />
            <span className="text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-accent-primary)] font-[family-name:var(--font-mono)]">
              Process · 05 Stages
            </span>
          </motion.div>

          <div>
            <RevealText
              text="From seed to jewellery, in five precise stages."
              as="h2"
              className="text-[var(--color-text-primary)] font-[family-name:var(--font-display)]"
              style={{
                fontSize: "clamp(1.875rem, 3.8vw, 3.25rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.018em",
                fontWeight: 500,
              }}
              staggerMs={50}
              durationMs={650}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_STANDARD }}
            className="text-right hidden lg:block"
          >
            <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] mb-1">
              Discipline
            </p>
            <p
              className="font-[family-name:var(--font-display)] italic text-[var(--color-text-primary)]"
              style={{ fontSize: "1.125rem", fontWeight: 500 }}
            >
              Lab to atelier
            </p>
          </motion.div>
        </div>

        {/* ─── Diamond-Spine Timeline ─── */}
        <div ref={trackRef} className="relative">
          {/*
            DESKTOP — central spine. Dashed baseline + accent fill.
            Positioned at left-1/2 with a 1px width.
          */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(11,20,38,0.18) 0 6px, transparent 6px 12px)",
            }}
          />
          <motion.div
            aria-hidden
            className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px origin-top bg-[var(--color-accent-primary)]"
            style={{ scaleY: spineScaleY, willChange: "transform" }}
          />

          {/*
            MOBILE — spine pinned to left, behind diamond nodes.
          */}
          <div
            aria-hidden
            className="lg:hidden absolute top-0 bottom-0 left-[27px] w-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(11,20,38,0.18) 0 6px, transparent 6px 12px)",
            }}
          />
          <motion.div
            aria-hidden
            className="lg:hidden absolute top-0 bottom-0 left-[27px] w-px origin-top bg-[var(--color-accent-primary)]"
            style={{ scaleY: spineScaleY, willChange: "transform" }}
          />

          <ol className="relative list-none">
            {STEPS.map((s, i) => (
              <Row key={s.num} step={s} index={i} isLast={i === STEPS.length - 1} />
            ))}
          </ol>

          {/* Terminal cap — a small diamond pip + label marking completion */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE_STANDARD }}
            className="hidden lg:flex relative justify-center items-center gap-3 mt-6"
          >
            <span className="w-10 h-px bg-[var(--color-accent-primary)]/30" />
            <span
              aria-hidden
              className="inline-block w-2 h-2 rotate-45 bg-[var(--color-accent-primary)]"
            />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
              Ready to wear
            </span>
            <span className="w-10 h-px bg-[var(--color-accent-primary)]/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function Row({ step, index, isLast }: { step: Step; index: number; isLast: boolean }) {
  const { num, Icon } = step;
  const rowRef = useRef<HTMLLIElement>(null);

  // Activate the diamond node when its row reaches the viewport centre.
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 70%", "start 35%"],
  });
  const nodeFill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const nodeOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.5, 1]);

  const isLeft = index % 2 === 0;

  return (
    <li
      ref={rowRef}
      className={`relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center ${
        isLast ? "pb-0" : "pb-24 lg:pb-32"
      }`}
    >
      {/* ── DESKTOP: alternating editorial blocks ───────────────────────── */}
      {/* LEFT slot */}
      <div className={`hidden lg:block ${isLeft ? "" : "invisible"}`}>
        {isLeft && <ContentCard step={step} index={index} alignRight />}
      </div>

      {/* CENTRE — diamond node sitting on the spine */}
      <div className="hidden lg:flex justify-center px-6">
        <DiamondNode num={num} Icon={Icon} fill={nodeFill} opacity={nodeOpacity} index={index} />
      </div>

      {/* RIGHT slot */}
      <div className={`hidden lg:block ${isLeft ? "invisible" : ""}`}>
        {!isLeft && <ContentCard step={step} index={index} />}
      </div>

      {/* Ghost numeral — gigantic italic backdrop on the opposite side */}
      <span
        aria-hidden
        className={`hidden lg:block pointer-events-none absolute top-1/2 -translate-y-1/2 font-[family-name:var(--font-display)] italic text-[var(--color-accent-primary)] select-none leading-none ${
          isLeft ? "right-0 translate-x-[18%]" : "left-0 -translate-x-[18%]"
        }`}
        style={{
          fontSize: "clamp(10rem, 18vw, 18rem)",
          fontWeight: 500,
          letterSpacing: "-0.05em",
          opacity: 0.06,
        }}
      >
        {String(num).padStart(2, "0")}
      </span>

      {/* ── MOBILE: single-column with left-aligned diamond + content ──── */}
      <div className={`lg:hidden flex flex-row items-start gap-5 ${isLast ? "" : "pb-2"}`}>
        <div className="relative shrink-0 pt-2">
          <DiamondNode num={num} Icon={Icon} fill={nodeFill} opacity={nodeOpacity} index={index} compact />
        </div>
        <div className="flex-1 min-w-0">
          <ContentCard step={step} index={index} mobile />
        </div>
      </div>
    </li>
  );
}

function DiamondNode({
  num,
  Icon,
  fill,
  opacity,
  index,
  compact = false,
}: {
  num: number;
  Icon: Step["Icon"];
  fill: ReturnType<typeof useTransform<number, number>>;
  opacity: ReturnType<typeof useTransform<number, number>>;
  index: number;
  compact?: boolean;
}) {
  const size = compact ? 56 : 88;

  return (
    <motion.div
      initial={{ scale: 0, rotate: 0 }}
      whileInView={{ scale: 1, rotate: 45 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        type: "spring",
        stiffness: 160,
        damping: 16,
        delay: 0.1 + index * 0.05,
      }}
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Outer ring — rotated 45° square (the diamond outline) */}
      <span
        aria-hidden
        className="absolute inset-0 border border-[var(--color-accent-primary)] bg-[#f3f4f6]"
      />

      {/* Accent fill — scales from 0 → 1 as the row activates */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-[var(--color-accent-primary)] origin-center"
        style={{ scale: fill, opacity, willChange: "transform, opacity" }}
      />

      {/* Counter-rotated content holder (so glyphs sit upright inside the diamond) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-accent-primary)]"
        style={{ transform: "rotate(-45deg)" }}
      >
        <motion.span
          className="font-[family-name:var(--font-display)] italic leading-none"
          style={{
            fontSize: compact ? "0.7rem" : "0.85rem",
            fontWeight: 500,
          }}
          animate={{ color: ["#3B6FFF", "#3B6FFF"] }}
        >
          {String(num).padStart(2, "0")}
        </motion.span>
        {!compact && (
          <span className="mt-1.5 inline-flex">
            <Icon size={20} strokeWidth={1.5} />
          </span>
        )}
      </div>

      {/* Pulse ring — subtle, on entrance */}
      {!compact && (
        <motion.span
          aria-hidden
          className="absolute -inset-2 border border-[var(--color-accent-primary)]/30"
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: [0.7, 1.2, 1.05], opacity: [0, 0.5, 0] }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.05, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}

function ContentCard({
  step,
  index,
  alignRight = false,
  mobile = false,
}: {
  step: Step;
  index: number;
  alignRight?: boolean;
  mobile?: boolean;
}) {
  const { num, label, description, caption, Icon } = step;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: 0.15 + index * 0.05, ease: EASE_STANDARD }}
      className={`relative ${mobile ? "" : alignRight ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}
    >
      {/* Stage caption */}
      <div
        className={`flex items-center gap-3 mb-4 ${
          alignRight && !mobile ? "lg:justify-end" : "justify-start"
        }`}
      >
        {!alignRight || mobile ? (
          <span className="w-6 h-px bg-[var(--color-accent-primary)]" />
        ) : null}
        <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
          Stage {String(num).padStart(2, "0")} · {caption}
        </span>
        {alignRight && !mobile ? (
          <span className="w-6 h-px bg-[var(--color-accent-primary)]" />
        ) : null}
      </div>

      {/* Icon — visible on mobile only (desktop puts it in the diamond) */}
      {mobile && (
        <span className="block text-[var(--color-accent-primary)] mb-3">
          <Icon size={26} strokeWidth={1.5} />
        </span>
      )}

      {/* Title */}
      <h3
        className="font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-4"
        style={{
          fontSize: mobile ? "1.25rem" : "clamp(1.5rem, 2.4vw, 2.125rem)",
          lineHeight: 1.12,
          letterSpacing: "-0.012em",
          fontWeight: 500,
        }}
      >
        {label}
      </h3>

      {/* Description */}
      <p
        className={`text-[var(--color-text-body)] ${
          alignRight && !mobile ? "lg:ml-auto" : ""
        }`}
        style={{
          fontSize: mobile ? "0.95rem" : "1.0625rem",
          lineHeight: mobile ? 1.65 : 1.7,
          maxWidth: mobile ? undefined : "26rem",
          marginLeft: alignRight && !mobile ? "auto" : undefined,
        }}
      >
        {description}
      </p>

      {/* Decorative bottom rule */}
      <div
        className={`mt-6 flex items-center gap-2 ${
          alignRight && !mobile ? "lg:justify-end" : ""
        }`}
      >
        <span className="w-2 h-2 rotate-45 border border-[var(--color-accent-primary)]" />
        <span className="text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-text-muted)]/70 font-[family-name:var(--font-mono)]">
          {`0${num} / 05`}
        </span>
      </div>
    </motion.div>
  );
}
