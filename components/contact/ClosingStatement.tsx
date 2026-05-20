"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * P12-S05 Closing Statement (Direct Email Closer).
 * Editorial band on Off-White; centered Display heading → 30-word body →
 * 4-row email list, hairline-divided. Each row: label (caps) → email
 * (JetBrains Mono Electric Blue with Lucide copy on hover, check on success).
 * RowSubtleHighlight on each row.
 */

const EMAILS: { label: string; address: string }[] = [
  { label: "Business & Partnerships", address: "partnerships@dholakiaretail.com" },
  { label: "Media & Press", address: "press@dholakiaretail.com" },
  { label: "Careers", address: "careers@dholakiaretail.com" },
  { label: "Brand Inquiries", address: "info@dholakiaretail.com" },
];

export default function ClosingStatement() {
  return (
    <section
      className="bg-[var(--color-bg-elevated)]"
      style={{ paddingTop: "120px", paddingBottom: "120px" }}
    >
      <div className="container-editorial max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <RevealText
            text="Or write to us directly."
            as="h2"
            className="text-[var(--color-text-primary)] mb-6 font-[family-name:var(--font-display)] italic"
            style={{
              fontSize: "clamp(1.875rem, 3.4vw, 2.5rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              fontWeight: 400,
            }}
            staggerMs={60}
            durationMs={700}
          />
          <motion.p
            className="body-lead text-[var(--color-text-body)] max-w-xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE_STANDARD }}
          >
            Prefer email? Reach the right desk through the addresses below — every
            inbox is monitored daily.
          </motion.p>
        </div>

        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          <Hairline width="100%" color="rgba(11,20,38,0.10)" durationMs={600} />
          {EMAILS.map((e, i) => (
            <motion.div
              key={e.address}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_STANDARD } },
              }}
            >
              <EmailRow label={e.label} address={e.address} />
              {i < EMAILS.length - 1 && (
                <Hairline width="100%" color="rgba(11,20,38,0.10)" durationMs={600} />
              )}
            </motion.div>
          ))}
          <Hairline width="100%" color="rgba(11,20,38,0.10)" durationMs={600} />
        </motion.dl>
      </div>
    </section>
  );
}

function EmailRow({ label, address }: { label: string; address: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="group relative grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-6 transition-colors duration-200 hover:bg-white/50">
      {/* RowSubtleHighlight: 1px Electric Blue left border draws 200ms */}
      <span className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-[var(--color-accent-primary)] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-out" />

      <dt className="md:col-span-5 flex items-center text-[var(--color-text-muted)] transition-[padding] duration-200 group-hover:pl-2">
        <span className="text-[0.7rem] tracking-[0.14em] uppercase font-medium">
          {label}
        </span>
      </dt>
      <dd className="md:col-span-7 flex items-center justify-between gap-3">
        <a
          href={`mailto:${address}`}
          className="font-[family-name:var(--font-mono)] text-[0.95rem] text-[var(--color-accent-primary)] hover:text-[var(--color-accent-deep)] transition-colors duration-200"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {address}
        </a>
        <button
          type="button"
          aria-label={`Copy ${address}`}
          onClick={onCopy}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)]"
        >
          {copied ? (
            <Check size={16} strokeWidth={1.5} className="text-[var(--color-accent-primary)]" />
          ) : (
            <Copy size={16} strokeWidth={1.5} />
          )}
        </button>
      </dd>
    </div>
  );
}
