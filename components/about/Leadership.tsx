"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P02-S03 Leadership.
 * 3-col grid (3-col desktop, 2-col tablet, 1-col mobile).
 * Stacked card — full-color portrait (3/4) → name → blue uppercase role →
 * bio → optional monospace meta footer (DIN · Appointed).
 * Cards stagger-enter 100ms apart, fade-up 24px Y.
 * Below: text-link row Governance · Code · Sourcing — underline draws-in 300ms left-to-right.
 */

type Director = {
  name: string;
  role: string;
  bio: string;
  meta?: string;
  image: { src: string; alt: string };
};

const DIRECTORS: Director[] = [
  {
    name: "Mr. Hasmukh Himmatbhai Dholakia",
    role: "Founder, Dholakia Lab Grown Diamond",
    bio: "Founding figure of the Group's manufacturing institution in Surat. Brings multigenerational continuity and the family-stewardship culture that defines the Group's craftsmanship discipline.",
    image: {
      src: "/media/images/Leaders/Hashu_Dholakia.webp",
      alt: "Hashu Dholakia",
    },
  },
  {
    name: "Mr. Rajesh Himmatbhai Dholakia",
    role: "Director, Dholakia Retail Private Limited",
    bio: "Appointed at incorporation in October 2024. Stewards operations, governance, and partner-network growth across the retail entity.",
    meta: "DIN · 02173366 · Appointed 11 Oct 2024",
    image: {
      src: "/media/images/Leaders/Rajesh_Dholakia.webp",
      alt: "Rajesh Himmat Dholakia",
    },
  },
  {
    name: "Mr. Dravya Savjibhai Dholakia",
    role: "Director, Dholakia Retail Private Limited",
    bio: "Appointed at incorporation in October 2024. Stewards brand strategy and the Mayavé portfolio house. Second-generation Dholakia.",
    meta: "DIN · 08897843 · Appointed 11 Oct 2024",
    image: {
      src: "/media/images/Leaders/Dravya_Dholakia.webp",
      alt: "Dravya Savjibhai Dholakia",
    },
  },
];

const POLICY_LINKS = [
  { label: "Governance Framework", href: "/the-group#governance" },
  { label: "Code of Conduct", href: "/the-group#conduct" },
  { label: "Ethical Sourcing Charter", href: "/the-group#sourcing" },
];

export default function Leadership() {
  return (
    <section id="leadership" className="bg-white" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="container-editorial">
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.p
            className="eyebrow mb-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Leadership
          </motion.p>
          <motion.h2
            className="mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE_STANDARD }}
            style={{ fontSize: "clamp(1.875rem, 3.4vw, 3rem)", lineHeight: 1.15, letterSpacing: "-0.015em" }}
          >
            Guided by long-term thinking.
          </motion.h2>
          <motion.p
            className="text-[var(--color-text-body)] leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_STANDARD }}
          >
            The people who steward Dholakia Retail and the wider Group — directors
            of the retail platform alongside the founding voice of the manufacturing
            institution from which the family emerged.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {DIRECTORS.map((d) => (
            <motion.div
              key={d.name}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_STANDARD } },
              }}
            >
              <DirectorCard d={d} />
            </motion.div>
          ))}
        </motion.div>

        {/* Policy links — underline draws in on hover, 300ms left-to-right */}
        <motion.div
          className="mt-20 pt-10 border-t border-black/10 flex flex-wrap items-center gap-x-10 gap-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
        >
          <span className="text-[0.7rem] tracking-[0.14em] uppercase text-[var(--color-text-muted)]">
            Governance
          </span>
          {POLICY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group/link inline-flex items-center gap-2 text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors text-[0.95rem]"
            >
              <span className="relative inline-block">
                {l.label}
                <span
                  className="absolute left-0 right-0 -bottom-1 h-px bg-[var(--color-accent-primary)] origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 ease-out"
                />
              </span>
              <ArrowUpRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5"
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DirectorCard({ d }: { d: Director }) {
  return (
    <article className="group flex flex-col h-full overflow-hidden border border-black/8 bg-white shadow-[0_1px_2px_rgba(11,20,38,0.04),0_8px_24px_-12px_rgba(11,20,38,0.10)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(11,20,38,0.06),0_16px_40px_-16px_rgba(11,20,38,0.18)] rounded-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-elevated">
        <Image
          src={d.image.src}
          alt={d.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-col grow p-7 md:p-8">
        <h3
          className="text-[var(--color-text-primary)]"
          style={{ fontSize: "1.4rem", fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.005em" }}
        >
          {d.name}
        </h3>
        <p className="mt-3 text-[0.72rem] tracking-[0.14em] uppercase text-[var(--color-accent-primary)] font-medium">
          {d.role}
        </p>
        <p className="mt-5 text-[0.95rem] leading-[1.65] text-[var(--color-text-body)]">
          {d.bio}
        </p>
        {d.meta && (
          <p className="mt-auto pt-8 font-mono text-[0.72rem] tracking-[0.04em] text-[var(--color-text-muted)] leading-relaxed">
            {d.meta}
          </p>
        )}
      </div>
    </article>
  );
}
