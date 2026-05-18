"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import EditorialImage from "@/components/motion/EditorialImage";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { EASE_STANDARD } from "@/lib/motion";
import { MAYAVE_LOOKBOOK } from "@/lib/media";

/**
 * P04-S04 Lookbook — Bento Grid.
 *
 * Six tiles in a deliberate bento composition: a 4-column grid with two tall
 * "anchor" portraits flanking the row, two squares in between, a wide
 * landscape filling the second row's centre, and a full-width closing plate.
 * Pronounced rounded corners + tight gaps so the page reads as a single
 * composition. Captions sit as overlays inside the tiles with a dark gradient
 * that strengthens on hover.
 *
 * Composition (desktop, 4 cols × 3 rows):
 *
 *   ┌─────┬─────┬─────┬─────┐
 *   │     │  2  │  3  │     │
 *   │  1  ├─────┴─────┤  4  │   ← row 1 (tiles 2 + 3 are squares)
 *   │     │     5     │     │   ← row 2 (tile 5 is wide landscape)
 *   ├─────┴─────┴─────┴─────┤
 *   │           6           │   ← row 3 (tile 6 is full-width)
 *   └───────────────────────┘
 */

const CAPTIONS = [
  "Stillness in detail",
  "Light in proportion",
  "The private surface",
  "Jewellery as whisper",
  "Restraint as form",
  "Material memory",
];

type Tile = {
  caption: string;
  src: { id: string; alt: string };
  spanClass: string;
};

// Hand-tuned bento spans for a 4-col, row-dense grid.
const SPANS = [
  "lg:col-span-1 lg:row-span-2", // 1 — tall anchor (left)
  "lg:col-span-1 lg:row-span-1", // 2 — square
  "lg:col-span-1 lg:row-span-1", // 3 — square
  "lg:col-span-1 lg:row-span-2", // 4 — tall anchor (right)
  "lg:col-span-2 lg:row-span-1", // 5 — wide landscape (centre of row 2)
  "lg:col-span-4 lg:row-span-1", // 6 — closing full-width plate
];

const TILES: Tile[] = MAYAVE_LOOKBOOK.slice(0, 6).map((src, i) => ({
  caption: CAPTIONS[i] ?? CAPTIONS[i % CAPTIONS.length],
  src,
  spanClass: SPANS[i],
}));

export default function Lookbook() {
  return (
    <section
      className="bg-white"
      style={{ paddingTop: "160px", paddingBottom: "160px" }}
    >
      <div className="container-editorial">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_auto] gap-y-6 gap-x-16 items-end mb-12 md:mb-16">
          <div>
            <motion.p
              className="eyebrow mb-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: EASE_STANDARD }}
            >
              Lookbook
            </motion.p>
            <RevealText
              text="The visual heart of Mayavé."
              as="h2"
              className="text-[var(--color-text-primary)] font-[family-name:var(--font-display)]"
              style={{
                fontSize: "clamp(1.875rem, 3.6vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
                fontWeight: 500,
              }}
              staggerMs={50}
              durationMs={650}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_STANDARD }}
            className="hidden lg:block text-right font-[family-name:var(--font-display)] italic text-[var(--color-text-muted)]"
            style={{ fontSize: "1rem", fontWeight: 400 }}
          >
            Six frames, one mood.
          </motion.p>
        </div>

        {/* Bento grid — auto-flow dense so row-span anchors don't leave gaps */}
        <motion.ol
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 grid-flow-row-dense gap-3 md:gap-4 list-none auto-rows-[220px] sm:auto-rows-[260px] lg:auto-rows-[240px] xl:auto-rows-[280px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {TILES.map((t, i) => (
            <LookbookTile key={i} tile={t} index={i} />
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function LookbookTile({ tile, index }: { tile: Tile; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useMouseParallax(cardRef, [{ ref: imgRef, amplitude: 8 }], {
    duration: 0.5,
    ease: "power2.out",
  });

  // Span-aware `sizes` for Next/Image srcset selection.
  const cols = parseInt(tile.spanClass.match(/col-span-(\d+)/)?.[1] ?? "1", 10);
  const desktopVw = Math.round((cols / 4) * 100);
  const sizes = `(min-width: 1024px) ${desktopVw}vw, (min-width: 640px) 50vw, 100vw`;

  return (
    <motion.li
      className={`${tile.spanClass} group/tile`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: EASE_STANDARD },
        },
      }}
    >
      <figure
        ref={cardRef}
        className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer transition-shadow duration-[500ms] ease-out hover:shadow-[0_24px_70px_-16px_rgba(11,20,38,0.35)]"
      >
        {/* Image — slow hover zoom + mouse parallax */}
        <motion.div
          ref={imgRef}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: "scale(1.04)",
            background: "linear-gradient(135deg, #1a2b4f 0%, #050A14 100%)",
          }}
        >
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover/tile:scale-[1.06]">
            <EditorialImage src={tile.src} fill sizes={sizes} />
          </div>
        </motion.div>

        {/* Bottom gradient — always present, strengthens on hover */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none transition-opacity duration-[500ms] opacity-85 group-hover/tile:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(5,10,20,0.82) 0%, rgba(5,10,20,0.35) 55%, rgba(5,10,20,0) 100%)",
          }}
        />

        {/* Top-right arrow affordance */}
        <span
          aria-hidden
          className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-md text-white opacity-0 -translate-y-1 group-hover/tile:opacity-100 group-hover/tile:translate-y-0 transition-all duration-[400ms]"
        >
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </span>

        {/* Top-left index marker */}
        <span
          aria-hidden
          className="absolute top-4 left-4 text-[0.65rem] tracking-[0.22em] uppercase text-white/75 font-[family-name:var(--font-mono)] tabular-nums"
        >
          {String(index + 1).padStart(2, "0")} — {String(TILES.length).padStart(2, "0")}
        </span>

        {/* Caption overlay — pulls up on hover */}
        <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6 transition-transform duration-[600ms] ease-out group-hover/tile:-translate-y-1">
          <span
            aria-hidden
            className="block h-px w-8 bg-white/60 origin-left scale-x-100 group-hover/tile:bg-[var(--color-accent-primary)] group-hover/tile:scale-x-[2.5] transition-all duration-[600ms] ease-out mb-3"
          />
          <p
            className="font-[family-name:var(--font-display)] italic text-white"
            style={{
              fontSize: "clamp(1rem, 1.2vw, 1.3rem)",
              lineHeight: 1.25,
              fontWeight: 400,
              letterSpacing: "-0.005em",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            {tile.caption}
          </p>
        </figcaption>
      </figure>
    </motion.li>
  );
}
