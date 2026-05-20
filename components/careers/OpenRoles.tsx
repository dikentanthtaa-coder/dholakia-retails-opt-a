"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, X } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import TiltCard from "@/components/motion/TiltCard";
import Hairline from "@/components/motion/Hairline";
import { EASE_STANDARD } from "@/lib/motion";
import type { CareerListItem } from "@/sanity/lib/queries";

/**
 * Open Roles list — anchor target #open-roles for the careers page.
 * Each row: function eyebrow → role title → meta (location · type · date) → 'View role →'.
 * RowSubtleHighlight pattern. Card3DTilt 2°.
 * Rows stagger-enter 60ms apart, fade-up 8px Y.
 */

const FUNCTION_LABELS: Record<string, string> = {
  design: "Design",
  brand: "Brand",
  merchandising: "Merchandising",
  retail: "Retail",
  operations: "Operations",
  corporate: "Corporate Functions",
};

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OpenRoles({
  roles,
  activeFunction,
}: {
  roles: CareerListItem[];
  activeFunction?: string;
}) {
  const activeLabel = activeFunction ? FUNCTION_LABELS[activeFunction] : null;
  return (
    <section
      id="open-roles"
      className="bg-white scroll-mt-24"
      style={{ paddingTop: "120px", paddingBottom: "120px" }}
    >
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <motion.p
              className="eyebrow mb-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: EASE_STANDARD }}
            >
              Open Roles
            </motion.p>
            <RevealText
              text={activeLabel ? `Open roles in ${activeLabel}.` : "Currently hiring."}
              as="h2"
              className="text-[var(--color-text-primary)]"
              style={{
                fontSize: "clamp(1.875rem, 3.4vw, 3rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.015em",
              }}
              staggerMs={50}
              durationMs={650}
            />
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            {roles.length > 0 && (
              <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] text-[0.875rem] tabular-nums">
                {roles.length} open {roles.length === 1 ? "role" : "roles"}
              </p>
            )}
            {activeLabel && (
              <Link
                href="/careers#open-roles"
                className="inline-flex items-center gap-2 h-8 pl-4 pr-3 rounded-full border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] text-[0.8rem] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors duration-[240ms]"
              >
                {activeLabel}
                <X size={14} strokeWidth={1.5} />
              </Link>
            )}
          </div>
        </div>

        {roles.length === 0 ? (
          <div className="border border-black/10 p-12 text-center">
            <p
              className="font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-3"
              style={{ fontSize: "1.5rem", fontWeight: 500 }}
            >
              No open roles right now.
            </p>
            <p className="text-[var(--color-text-body)] mb-6 max-w-md mx-auto">
              We hire as the work demands. If you'd like us to hold your
              profile, send a note to our talent team.
            </p>
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
          </div>
        ) : (
          <motion.ol
            className="list-none"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <Hairline width="100%" color="rgba(11,20,38,0.10)" durationMs={600} />
            {roles.map((r, i) => (
              <motion.li
                key={r._id}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: EASE_STANDARD },
                  },
                }}
              >
                <TiltCard angle="gentle" scale={1.002}>
                  <Link
                    href={`/careers/${r.slug}`}
                    className="group/row relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-7 md:py-8 transition-colors duration-200 hover:bg-[var(--color-bg-elevated)]/60"
                  >
                    {/* Left border draw on hover */}
                    <span className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-[var(--color-accent-primary)] origin-top scale-y-0 group-hover/row:scale-y-100 transition-transform duration-200 ease-out" />

                    <div className="md:col-span-3 transition-[padding] duration-200 group-hover/row:pl-2">
                      <p className="text-[0.7rem] tracking-[0.14em] uppercase text-[var(--color-accent-primary)] font-medium">
                        {FUNCTION_LABELS[r.functionArea] ?? r.functionArea}
                      </p>
                    </div>
                    <div className="md:col-span-6">
                      <h3
                        className="font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-2 transition-transform duration-[240ms] group-hover/row:translate-y-1"
                        style={{ fontSize: "1.375rem", fontWeight: 500, lineHeight: 1.25 }}
                      >
                        {r.title}
                      </h3>
                      <p className="text-[var(--color-text-body)] text-[0.9rem] leading-relaxed line-clamp-2 max-w-xl">
                        {r.shortDescription}
                      </p>
                    </div>
                    <div className="md:col-span-3 flex md:items-center md:justify-end">
                      <div className="flex flex-col gap-1.5 md:items-end">
                        <span className="inline-flex items-center gap-1.5 text-[0.8rem] text-[var(--color-text-muted)]">
                          <MapPin size={12} strokeWidth={1.5} />
                          {r.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[0.8rem] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] tabular-nums">
                          <Clock size={12} strokeWidth={1.5} />
                          {r.employmentType}
                        </span>
                        <span className="inline-flex items-center gap-2 text-[var(--color-accent-primary)] text-[0.85rem] font-medium mt-2">
                          View role
                          <ArrowRight
                            size={14}
                            strokeWidth={1.5}
                            className="transition-transform duration-[240ms] group-hover/row:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
                {i < roles.length - 1 && (
                  <Hairline width="100%" color="rgba(11,20,38,0.10)" durationMs={600} />
                )}
              </motion.li>
            ))}
            <Hairline width="100%" color="rgba(11,20,38,0.10)" durationMs={600} />
          </motion.ol>
        )}
      </div>
    </section>
  );
}
