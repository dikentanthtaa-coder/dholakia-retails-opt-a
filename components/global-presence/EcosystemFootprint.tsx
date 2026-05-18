"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P08-S02 Ecosystem Footprint — "Radiating from Surat" editorial atlas.
 *
 * A hero anchor card (Surat) sits on the left with concentric ripple rings —
 * the visual claim that this is the origin point. Two satellite cards
 * (Mumbai, NY-linked) sit on the right. SVG arcs connect Surat outward to
 * each satellite, with dashed baselines + accent overlays that draw on scroll.
 *
 * Background: a quiet world-dot field + meridian curves. Every card carries
 * coordinates and a distance-from-Surat pill, reinforcing the atlas language.
 *
 * Mobile reflows to a vertical column: Surat hero first, satellites below,
 * connected by short vertical arc segments.
 */

type Location = {
  num: number;
  city: string;
  role: string;
  coords: string;
  tag: string;
  distance: string;
};

const ANCHOR: Location = {
  num: 1,
  city: "Surat",
  role: "Headquarters and diamond ecosystem base",
  coords: "21.17° N · 72.83° E",
  tag: "HQ · Origin",
  distance: "0 km",
};

const SATELLITES: Location[] = [
  {
    num: 2,
    city: "Mumbai",
    role: "Commercial and brand activation hub",
    coords: "19.08° N · 72.88° E",
    tag: "Commercial",
    distance: "285 km",
  },
  {
    num: 3,
    city: "New York-linked group presence",
    role: "Wider Dholakia Group context",
    coords: "40.71° N · 74.01° W",
    tag: "Group reach",
    distance: "12,490 km",
  },
];

export default function EcosystemFootprint() {
  const sectionRef = useRef<HTMLElement>(null);
  const arcsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: arcsRef,
    offset: ["start 80%", "end 60%"],
  });
  const drawProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white overflow-hidden"
      style={{ paddingTop: "160px", paddingBottom: "160px" }}
    >
      {/* ── Background atlas: world-dot field + meridian curves ────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE_STANDARD }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Meridian curves — subtle longitude-style arcs */}
          <g
            stroke="#0B1426"
            strokeWidth="1"
            fill="none"
            opacity="0.05"
            vectorEffect="non-scaling-stroke"
          >
            <path d="M 0 450 Q 400 220, 800 450 T 1600 450" />
            <path d="M 0 450 Q 400 680, 800 450 T 1600 450" />
            <path d="M 0 450 Q 300 300, 800 450 T 1600 450" />
            <path d="M 0 450 Q 300 600, 800 450 T 1600 450" />
          </g>

          {/* Dot field */}
          <g fill="#0B1426" opacity="0.06">
            {Array.from({ length: 340 }).map((_, i) => {
              const cx = 60 + ((i * 23) % 1500);
              const cy = 80 + Math.floor(i / 28) * 26 + ((i * 11) % 16);
              return <circle key={i} cx={cx} cy={cy} r="1.3" />;
            })}
          </g>
        </svg>
      </motion.div>

      <div className="relative container-editorial">
        {/* ── Header — eyebrow line / title / count meta ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-y-8 gap-x-16 items-end mb-20 md:mb-24">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: EASE_STANDARD }}
            >
              <span className="w-10 h-px bg-[var(--color-accent-primary)]" />
              <span className="text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-accent-primary)] font-[family-name:var(--font-mono)]">
                Ecosystem Footprint · 03 nodes
              </span>
            </motion.div>
            <RevealText
              text="From Surat outward."
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
            className="hidden lg:flex items-center gap-4 text-right"
          >
            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] mb-1">
                Reach
              </p>
              <p
                className="font-[family-name:var(--font-display)] italic text-[var(--color-text-primary)]"
                style={{ fontSize: "1.125rem", fontWeight: 500 }}
              >
                One ecosystem, three cities
              </p>
            </div>
            <span
              aria-hidden
              className="inline-block w-2.5 h-2.5 rotate-45 bg-[var(--color-accent-primary)]"
            />
          </motion.div>
        </div>

        {/* ── Atlas board ────────────────────────────────────────────────── */}
        <div ref={arcsRef} className="relative">
          {/* DESKTOP — arcs SVG overlay (anchor → satellites) */}
          <svg
            aria-hidden
            className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-[1]"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            {/* Dashed baseline arcs */}
            <g
              stroke="rgba(11,20,38,0.18)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
            >
              <path d="M 380 230 Q 600 110, 760 170" />
              <path d="M 380 280 Q 600 450, 760 430" />
            </g>
            {/* Accent overlays — drawn by scroll */}
            <motion.path
              d="M 380 230 Q 600 110, 760 170"
              stroke="var(--color-accent-primary)"
              strokeWidth="1.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: drawProgress }}
            />
            <motion.path
              d="M 380 280 Q 600 450, 760 430"
              stroke="var(--color-accent-primary)"
              strokeWidth="1.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: drawProgress }}
            />
            {/* Tip dots where arcs land */}
            <motion.circle
              cx="760"
              cy="170"
              r="3.5"
              fill="var(--color-accent-primary)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: 1.0, ease: EASE_STANDARD }}
            />
            <motion.circle
              cx="760"
              cy="430"
              r="3.5"
              fill="var(--color-accent-primary)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: 1.0, ease: EASE_STANDARD }}
            />
          </svg>

          {/* Card layout grid */}
          <div className="relative z-[2] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12">
            {/* Anchor — Surat (full height, hero) */}
            <AnchorCard loc={ANCHOR} />

            {/* Satellites column */}
            <div className="flex flex-col gap-6">
              {SATELLITES.map((s, i) => (
                <SatelliteCard key={s.city} loc={s} delay={0.15 + i * 0.1} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer strip — coordinate ledger ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE_STANDARD }}
          className="mt-20 pt-8 border-t border-[rgba(11,20,38,0.08)] flex flex-wrap items-center justify-between gap-y-3 gap-x-8"
        >
          <span className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            <Navigation size={12} strokeWidth={1.5} />
            Atlas · Live ecosystem
          </span>
          <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            Anchored in Surat · Reaching outward
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function AnchorCard({ loc }: { loc: Location }) {
  const { num, city, role, coords, tag } = loc;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE_STANDARD }}
      className="group relative bg-[#fafaf8] border border-[rgba(11,20,38,0.10)] overflow-hidden transition-[border-color,transform,box-shadow] duration-500 ease-out hover:border-[var(--color-accent-primary)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(11,20,38,0.06)]"
      style={{ minHeight: 460 }}
    >
      {/* Concentric ripple rings — origin-point motif */}
      <div
        aria-hidden
        className="absolute -right-24 -bottom-24 w-[460px] h-[460px] pointer-events-none"
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-[var(--color-accent-primary)]/15"
            style={{ scale: 0.35 + i * 0.22 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: i === 0 ? 0.4 : 0.25 - i * 0.05 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: EASE_STANDARD }}
          />
        ))}
        {/* Centre dot */}
        <motion.span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[var(--color-accent-primary)]"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.7, ease: EASE_STANDARD }}
        />
      </div>

      <div className="relative p-9 lg:p-12 flex flex-col h-full">
        {/* Top meta row */}
        <div className="flex items-start justify-between gap-6 mb-10">
          <span className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-accent-primary)] font-[family-name:var(--font-mono)] border border-[var(--color-accent-primary)]/35 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rotate-45 bg-[var(--color-accent-primary)]" />
            {tag}
          </span>
          <span
            className="font-[family-name:var(--font-display)] italic text-[var(--color-accent-primary)] leading-none"
            style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 500, letterSpacing: "-0.04em" }}
          >
            {String(num).padStart(2, "0")}
          </span>
        </div>

        {/* MapPin with ripple emphasis */}
        <div className="relative w-16 h-16 mb-8">
          <span className="absolute inset-0 rounded-full bg-[var(--color-accent-primary)]/10" />
          <span className="absolute inset-2 rounded-full bg-[var(--color-accent-primary)]/15" />
          <span className="absolute inset-0 flex items-center justify-center text-[var(--color-accent-primary)]">
            <MapPin size={28} strokeWidth={1.5} />
          </span>
        </div>

        {/* City */}
        <h3
          className="font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-5"
          style={{
            fontSize: "clamp(2rem, 3.4vw, 2.875rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          {city}
        </h3>

        {/* Role */}
        <p
          className="text-[var(--color-text-body)] mb-8 max-w-md"
          style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}
        >
          {role}
        </p>

        {/* Coordinate ledger pinned to bottom */}
        <div className="mt-auto pt-6 border-t border-[rgba(11,20,38,0.08)] flex flex-wrap items-center justify-between gap-y-2 gap-x-6">
          <span className="text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] tabular-nums">
            {coords}
          </span>
          <span className="text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            Origin · 0 km
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function SatelliteCard({ loc, delay }: { loc: Location; delay: number }) {
  const { num, city, role, coords, tag, distance } = loc;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: EASE_STANDARD }}
      className="group relative bg-white border border-[rgba(11,20,38,0.10)] overflow-hidden transition-[border-color,transform,box-shadow] duration-500 ease-out hover:border-[var(--color-accent-primary)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,20,38,0.06)]"
    >
      {/* Vertical accent rail that fills on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-accent-primary)] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"
      />

      <div className="relative p-7 lg:p-9 flex flex-col lg:flex-row gap-6 lg:items-center">
        {/* Left meta column */}
        <div className="lg:w-[140px] shrink-0 flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-3">
          <span
            className="font-[family-name:var(--font-display)] italic text-[var(--color-accent-primary)] leading-none"
            style={{ fontSize: "clamp(2.25rem, 3.4vw, 3rem)", fontWeight: 500, letterSpacing: "-0.04em" }}
          >
            {String(num).padStart(2, "0")}
          </span>
          <span className="inline-flex items-center gap-2 text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            <MapPin size={12} strokeWidth={1.5} className="text-[var(--color-accent-primary)]" />
            {tag}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-3"
            style={{
              fontSize: "clamp(1.25rem, 1.9vw, 1.625rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.012em",
              fontWeight: 500,
            }}
          >
            {city}
          </h3>
          <p
            className="text-[var(--color-text-body)] mb-5"
            style={{ fontSize: "0.9375rem", lineHeight: 1.65 }}
          >
            {role}
          </p>

          {/* Bottom ledger */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-[0.65rem] tracking-[0.18em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] tabular-nums">
              {coords}
            </span>
            <span className="text-[var(--color-text-muted)]/40">·</span>
            <span className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.18em] uppercase text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] tabular-nums">
              <Navigation size={10} strokeWidth={1.5} className="text-[var(--color-accent-primary)]" />
              {distance} from Surat
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
