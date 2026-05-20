"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Pencil,
  Sparkles,
  ShoppingBag,
  Store,
  Settings2,
  Briefcase,
} from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import TiltCard from "@/components/motion/TiltCard";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P10-S03 Roles & Functions — 6-tile grid.
 * 3-col desktop, 2-col tablet, 1-col mobile.
 * Each tile: function name → arrow. CardGroupAttention; Card3DTilt 3°.
 * Tiles stagger 80ms; hover lift +6px; arrow slides right.
 * Single CTA below grid: 'Share your profile'.
 */

type Function = {
  label: string;
  slug: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const FUNCTIONS: Function[] = [
  { label: "Design", slug: "design", Icon: Pencil },
  { label: "Brand", slug: "brand", Icon: Sparkles },
  { label: "Merchandising", slug: "merchandising", Icon: ShoppingBag },
  { label: "Retail", slug: "retail", Icon: Store },
  { label: "Operations", slug: "operations", Icon: Settings2 },
  { label: "Corporate Functions", slug: "corporate", Icon: Briefcase },
];

export default function FunctionsGrid() {
  return (
    <section
      className="bg-[var(--color-bg-elevated)]"
      style={{ paddingTop: "120px", paddingBottom: "120px" }}
    >
      <div className="container-editorial">
        <div className="max-w-2xl mb-14 md:mb-16">
          <motion.p
            className="eyebrow mb-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE_STANDARD }}
          >
            Roles &amp; Functions
          </motion.p>
          <RevealText
            text="Where you might fit."
            as="h2"
            className="text-[var(--color-text-primary)] font-[family-name:var(--font-display)]"
            style={{
              fontSize: "clamp(1.875rem, 3.4vw, 3rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              fontWeight: 500,
            }}
            staggerMs={50}
            durationMs={650}
          />
        </div>

        <motion.div
          className="group/grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch"
          style={{ perspective: "1000px" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {FUNCTIONS.map(({ label, slug, Icon }) => (
            <motion.div
              key={slug}
              className="h-full"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_STANDARD } },
              }}
            >
              <TiltCard angle="standard" scale={1.005} className="h-full">
                <Link
                  href={`/careers?function=${slug}#open-roles`}
                  className="group/tile relative h-full flex items-center justify-between gap-4 p-7 bg-white border border-black/10 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-[var(--color-accent-primary)] group-hover/grid:[&:not(:hover)]:opacity-70 hover:!opacity-100"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-[var(--color-accent-primary)] inline-flex">
                      <Icon size={24} strokeWidth={1.5} />
                    </span>
                    <span
                      className="font-[family-name:var(--font-display)] text-[var(--color-text-primary)]"
                      style={{ fontSize: "1.125rem", fontWeight: 500 }}
                    >
                      {label}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-[var(--color-text-muted)] transition-transform duration-300 group-hover/tile:translate-x-1 group-hover/tile:text-[var(--color-accent-primary)]"
                  />
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE_STANDARD }}
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
          <Link
            href="#open-roles"
            className="group/cta inline-flex items-center gap-2 h-12 px-7 rounded-[2px] border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors duration-[240ms] text-[0.95rem] tracking-wide"
          >
            View all open roles
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-[240ms] group-hover/cta:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
