"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import TiltCard from "@/components/motion/TiltCard";
import EditorialImage from "@/components/motion/EditorialImage";
import { EASE_STANDARD } from "@/lib/motion";
import { MAYAVE_SPOTLIGHT, PORTFOLIO_BRAND_MATRIX_MAYAVE } from "@/lib/media";

/**
 * P03-S02 Brand Matrix — bento 2×2.
 * Cards stagger-enter 100ms apart, fade-up 24px Y. Mayavé extra emphasis (200ms delay).
 * Card3DTilt: 4° on Mayavé, 2° on placeholders.
 * Hover: Electric Blue border draws sequentially (top → right → bottom → left).
 */

type Cell = {
  name: string;
  status: "active" | "placeholder";
  description?: string;
  href?: string;
};

const CELLS: Cell[] = [
  {
    name: "Mayavé",
    status: "active",
    description: "A refined expression of bespoke luxury — where silence becomes jewellery.",
    href: "/portfolio/mayave",
  },
];

export default function BrandMatrix() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="bg-white py-28 md:py-36" aria-label="Brand portfolio matrix">
      <div className="container-editorial">
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          {CELLS.map((cell, i) => (
            <motion.div
              key={`${cell.name}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.6,
                delay: cell.status === "active" ? 0.2 : i * 0.1,
                ease: EASE_STANDARD,
              }}
            >
              <TiltCard
                angle={cell.status === "active" ? "expressive" : "gentle"}
                scale={cell.status === "active" ? 1.015 : 1.005}
                className="will-change-transform"
              >
                {cell.status === "active" ? <ActiveCell cell={cell} /> : <PlaceholderCell />}
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActiveCell({ cell }: { cell: Cell }) {
  return (
    <Link
      href={cell.href ?? "#"}
      className="group relative block aspect-video md:aspect-21/9 overflow-hidden border border-black/10 hover:border-transparent transition-colors duration-300"
      style={{ background: "linear-gradient(135deg, #14213d 0%, #0B1426 60%, #060B17 100%)" }}
    >
      <BorderDraw />
      {/* Mayavé editorial photograph — replaces the SVG facet placeholder */}
      <div className="absolute inset-0">
        <EditorialImage
          src={MAYAVE_SPOTLIGHT}
          fill
          sizes="100vw"
          darkOverlay="cinematic"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(6,11,23,0.85) 0%, rgba(6,11,23,0.3) 60%, rgba(6,11,23,0) 100%)",
        }}
      />

      <div className="absolute inset-0 p-7 md:p-10 flex flex-col justify-end text-white">
        <p className="text-[0.7rem] tracking-[0.14em] uppercase text-accent-soft mb-3">
          Signature Brand
        </p>
        <h3
          className="font-display mb-3 text-white"
          style={{ fontSize: "clamp(2rem, 3.6vw, 2.75rem)", letterSpacing: "0.005em", fontWeight: 500 }}
        >
          {cell.name}
        </h3>
        <p className="max-w-md text-white/75 text-[0.95rem] leading-relaxed mb-5">{cell.description}</p>
        <span className="inline-flex items-center gap-2 text-[var(--color-accent-primary)] font-medium tracking-wide group-hover:text-white transition-colors">
          Discover
          <ArrowUpRight
            size={18}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </span>
      </div>
    </Link>
  );
}

function PlaceholderCell() {
  return (
    <div
      className="group relative block aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-[var(--color-bg-elevated)] border border-black/10 hover:border-transparent transition-opacity duration-500"
      style={{ opacity: 0.85 }}
      aria-label="Future brand territory, in development"
    >
      <BorderDraw />
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden>
          <circle cx="100" cy="100" r="40" stroke="#6B8AC9" strokeWidth="0.6" fill="none" />
          <circle cx="100" cy="100" r="60" stroke="#6B8AC9" strokeWidth="0.6" fill="none" />
          <circle cx="100" cy="100" r="80" stroke="#6B8AC9" strokeWidth="0.6" fill="none" />
        </svg>
      </div>

      <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.18em] uppercase text-(--color-text-muted)">
        <Clock size={12} strokeWidth={1.5} />
        Coming soon
      </span>

      <div className="absolute inset-0 p-7 md:p-10 flex flex-col justify-end">
        <h3
          className="font-display text-(--color-text-primary)/70"
          style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", fontWeight: 500 }}
        >
          Future Brand Territory
        </h3>
      </div>
    </div>
  );
}

function BorderDraw() {
  return (
    <>
      <span className="pointer-events-none absolute top-0 left-0 h-px bg-accent-primary w-0 group-hover:w-full transition-[width] duration-50 ease-out" />
      <span className="pointer-events-none absolute top-0 right-0 w-px bg-accent-primary h-0 group-hover:h-full transition-[height] duration-50 ease-out delay-50" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-px bg-accent-primary w-0 group-hover:w-full transition-[width] duration-50 ease-out delay-100" />
      <span className="pointer-events-none absolute bottom-0 left-0 w-px bg-accent-primary h-0 group-hover:h-full transition-[height] duration-50 ease-out delay-150" />
    </>
  );
}
