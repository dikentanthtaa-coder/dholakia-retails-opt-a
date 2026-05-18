"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock3 } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P03-S04 Future Territories — premium editorial index.
 *
 * A vertical list (not a card grid) inspired by the "next chapters" page of a
 * fashion house's annual report:
 *   • Asymmetric header: eyebrow + display H2 on the left, lede paragraph on the right
 *   • Index table header with column labels (Index / Territory / Status / Explore)
 *   • Four hairline-separated rows; each row is its own composition:
 *       Large italic numeral · Title with hover underline · Description ·
 *       Status pill with pulsing accent dot · Circular arrow-out badge
 *   • Hover: row slides right 8px, accent underline draws under the title,
 *     arrow badge rotates the icon and outlines in Electric Blue,
 *     left-edge "you are here" rule reveals
 *
 * The visual rhythm is deliberately different from the rest of the site's
 * card grids — it reads as a curated index, which suits "things we are
 * building next" better than a 4-up matrix of equal-weight cards.
 */

type Territory = {
  num: string;
  name: string;
  description: string;
  category: string;
  status: "In development" | "In concept";
};

const TERRITORIES: Territory[] = [
  {
    num: "01",
    name: "Bespoke Fine Jewellery",
    description:
      "Private commissions designed in close dialogue with the wearer — pieces shaped by personal occasion, material memory, and the slow conversation between client and atelier.",
    category: "Atelier",
    status: "In development",
  },
  {
    num: "02",
    name: "Bridal & Commitment",
    description:
      "Ceremony pieces conceived to outlast trends. Rings, sets, and heirlooms designed to be reset across generations rather than retired.",
    category: "House Brand",
    status: "In development",
  },
  {
    num: "03",
    name: "Everyday Luxury",
    description:
      "Wearable refinement for daily presence — a quieter language of jewellery designed to be lived in, not put away between occasions.",
    category: "Daily",
    status: "In concept",
  },
  {
    num: "04",
    name: "High Jewellery Editions",
    description:
      "Limited annual editions in rare materials and exhibitive craftsmanship. Museum-grade compositions released with deliberate scarcity.",
    category: "Editions",
    status: "In concept",
  },
];

export default function FutureTerritories() {
  return (
    <section
      id="future"
      className="relative bg-white overflow-hidden"
      style={{ paddingTop: "140px", paddingBottom: "140px" }}
    >
      {/* Faint registration-mark texture behind the headline — adds dimension
          without competing with the typography. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #0B1426 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative container-editorial">
        {/* Asymmetric header — title left, lede right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-y-8 gap-x-16 mb-20 md:mb-24">
          <div>
            <motion.p
              className="eyebrow mb-6"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: EASE_STANDARD }}
            >
              Future Territories · 2026 →
            </motion.p>
            <RevealText
              text="A forward-pointing portfolio."
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
          <div className="lg:pt-4">
            <motion.p
              className="text-[var(--color-text-body)]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE_STANDARD }}
              style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}
            >
              Four chapters being developed in parallel — each shaped for a
              distinct emotional territory inside the broader luxury category.
              The portfolio is intentionally measured: every brand earns its
              place by being unmistakable.
            </motion.p>
          </div>
        </div>

        {/* Index column header (desktop only) */}
        <motion.div
          className="hidden lg:grid grid-cols-[110px_minmax(0,1fr)_220px_72px] items-end gap-x-12 pb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
        >
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            Index
          </span>
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            Territory
          </span>
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            Status
          </span>
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] text-right">
            Explore
          </span>
        </motion.div>

        {/* Top edge — closes the index frame */}
        <span
          aria-hidden
          className="block h-px bg-[var(--color-text-primary)]/15"
        />

        {/* Index rows */}
        <ol className="list-none">
          {TERRITORIES.map((t, i) => (
            <TerritoryRow key={t.num} t={t} index={i} />
          ))}
        </ol>

        {/* Footer caption — a small archive-style note. */}
        <motion.p
          className="mt-10 text-[0.75rem] tracking-[0.14em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE_STANDARD }}
        >
          Index v01 · Subject to revision · Published by Dholakia Retail
        </motion.p>
      </div>
    </section>
  );
}

function TerritoryRow({ t, index }: { t: Territory; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_STANDARD }}
      className="group/row relative border-b border-[var(--color-text-primary)]/15"
    >
      {/* Left edge "active" rule — reveals on hover, evokes a TOC indicator */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-accent-primary)] transition-all duration-500 ease-out group-hover/row:h-3/4"
      />

      {/* Full-width accent under-bar — replaces the dim border on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-[-1px] h-px bg-[var(--color-accent-primary)] origin-left scale-x-0 group-hover/row:scale-x-100 transition-transform duration-[700ms] ease-out"
        style={{ width: "100%" }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[110px_minmax(0,1fr)_220px_72px] items-start lg:items-center gap-y-5 gap-x-12 py-12 md:py-14 transition-[padding,background-color] duration-500 ease-out group-hover/row:pl-4">
        {/* 1 · Numeral */}
        <div className="flex items-baseline gap-4">
          <span
            aria-hidden
            className="font-[family-name:var(--font-display)] italic text-[var(--color-accent-primary)] leading-none transition-all duration-500 ease-out group-hover/row:[transform:translateX(2px)_scale(1.06)]"
            style={{
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              fontWeight: 500,
              opacity: 0.9,
              transformOrigin: "left bottom",
            }}
          >
            {t.num}
          </span>
          {/* mobile status chip — sits inline with the numeral */}
          <span className="lg:hidden inline-flex items-center gap-2 text-[0.7rem] tracking-[0.16em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            {t.status}
          </span>
        </div>

        {/* 2 · Title + description */}
        <div className="max-w-2xl">
          <h3
            className="font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-3 transition-colors duration-500 ease-out group-hover/row:text-[var(--color-accent-primary)]"
            style={{
              fontSize: "clamp(1.5rem, 2.4vw, 2.125rem)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            <span className="relative inline-block">
              {t.name}
              {/* Accent underline draws under the title text only */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 -bottom-1 h-px bg-[var(--color-accent-primary)] origin-left scale-x-0 group-hover/row:scale-x-100 transition-transform duration-500 ease-out"
              />
            </span>
          </h3>
          <p
            className="text-[var(--color-text-body)] leading-relaxed max-w-xl"
            style={{ fontSize: "1rem" }}
          >
            {t.description}
          </p>
          {/* mobile category line */}
          <p className="lg:hidden mt-4 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            <Clock3 size={11} strokeWidth={1.5} /> {t.category}
          </p>
        </div>

        {/* 3 · Status (desktop) */}
        <div className="hidden lg:flex flex-col">
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] mb-2">
            {t.category}
          </span>
          <span className="inline-flex items-center gap-2 text-[0.85rem] text-[var(--color-text-primary)] font-[family-name:var(--font-mono)]">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-[var(--color-accent-primary)] opacity-60 animate-ping" />
              <span className="relative inline-block w-2 h-2 rounded-full bg-[var(--color-accent-primary)]" />
            </span>
            {t.status}
          </span>
        </div>

        {/* 4 · Arrow badge (desktop) */}
        <div className="hidden lg:flex justify-end">
          <span
            aria-hidden
            className="relative inline-flex items-center justify-center w-12 h-12 rounded-full border border-[var(--color-text-primary)]/15 text-[var(--color-text-muted)] transition-all duration-500 ease-out group-hover/row:border-[var(--color-accent-primary)] group-hover/row:text-[var(--color-accent-primary)] group-hover/row:scale-110 group-hover/row:rotate-[12deg]"
          >
            <ArrowUpRight
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-500 ease-out group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </motion.li>
  );
}
