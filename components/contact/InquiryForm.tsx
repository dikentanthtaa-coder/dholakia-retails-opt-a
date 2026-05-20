"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, AlertCircle, ChevronDown, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import RevealText from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { EASE_STANDARD } from "@/lib/motion";
import {
  contactSchema,
  INQUIRY_OPTIONS,
  CONFIRMATION_BY_TYPE,
  type ContactInput,
} from "@/lib/contact-schema";

/**
 * P12-S04 Contact Form (InquiryForm) — single-column 540px max-width on White.
 * Floating-label inputs (200ms ease-in-out from centred to top-left on focus).
 * Submit ButtonHoverFill — Electric Blue → Royal Blue 240ms.
 * Loading → spinner; success → confirmation panel with inquiry-type-specific copy.
 *
 * Reads URL hand-off `?type=…` from RoutingCards (P12-S02) to pre-select inquiry.
 * Stores submission in Sanity via /api/contact.
 */
export default function InquiryForm() {
  const searchParams = useSearchParams();
  const initialInquiry = searchParams.get("type") ?? "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedType, setSubmittedType] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      organisation: "",
      inquiryType: (INQUIRY_OPTIONS.find((o) => o.value === initialInquiry)?.value ?? "") as ContactInput["inquiryType"],
      message: "",
      website: "",
    },
  });

  // Allow ?inquiry=... deep links to preselect the dropdown
  useEffect(() => {
    if (initialInquiry && INQUIRY_OPTIONS.some((o) => o.value === initialInquiry)) {
      setValue("inquiryType", initialInquiry as ContactInput["inquiryType"], { shouldValidate: true });
    }
  }, [initialInquiry, setValue]);

  // Smooth-scroll the form into view when arriving with #contact-form in the URL.
  // Why: the form is inside <Suspense>, so it mounts after the browser's
  // initial hash-anchor jump — without this, deep links land mid-page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#contact-form") return;
    const el = document.getElementById("contact-form");
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const onSubmit = async (data: ContactInput) => {
    setStatus("loading");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Something went wrong. Please try again.");
      setSubmittedType(data.inquiryType);
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError((err as Error).message);
    }
  };

  return (
    <section
      id="contact-form"
      className="bg-white"
      style={{ paddingTop: "100px", paddingBottom: "100px" }}
    >
      <div className="container-editorial">
        <div className="mx-auto" style={{ maxWidth: "540px" }}>
          <RevealText
            text="Write to us."
            as="h2"
            className="text-[var(--color-text-primary)] mb-10 text-center font-[family-name:var(--font-display)]"
            style={{
              fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              fontWeight: 500,
            }}
            staggerMs={50}
            durationMs={650}
          />

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE_STANDARD }}
                className="flex flex-col items-center text-center bg-[var(--color-bg-elevated)] p-10 rounded-sm"
                role="status"
              >
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent-primary)] text-white mb-5">
                  <Check size={28} strokeWidth={1.5} />
                </span>
                <h3
                  className="font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-3"
                  style={{ fontSize: "1.5rem", fontWeight: 500 }}
                >
                  Thank you.
                </h3>
                <p className="text-[var(--color-text-body)] mb-8 max-w-md">
                  {CONFIRMATION_BY_TYPE[submittedType] ??
                    "We will respond within two business days."}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="text-[var(--color-accent-primary)] text-[0.875rem] font-medium underline-offset-4 hover:underline"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
                noValidate
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
              >
                <FieldFloating
                  label="Full Name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  register={register}
                  error={errors.fullName?.message}
                />
                <FieldFloating
                  label="Company / Organisation"
                  name="organisation"
                  type="text"
                  autoComplete="organization"
                  register={register}
                  error={errors.organisation?.message}
                />
                <FieldFloating
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  register={register}
                  error={errors.email?.message}
                />

                <FieldSelect
                  label="Inquiry Type"
                  name="inquiryType"
                  register={register}
                  error={errors.inquiryType?.message}
                />

                <FieldTextarea
                  label="Message"
                  name="message"
                  rows={5}
                  register={register}
                  error={errors.message?.message}
                />

                {/* Honeypot — visually hidden, bots fill it; humans don't. */}
                <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label>
                    Leave this empty
                    <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
                  </label>
                </div>

                {serverError && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-[0.875rem] text-red-600"
                  >
                    <AlertCircle size={14} strokeWidth={1.5} />
                    {serverError}
                  </motion.p>
                )}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
                  }}
                >
                  <MagneticButton
                    type="submit"
                    strength="standard"
                    onClick={() => {
                      if (!isValid) return;
                    }}
                    className="group/cta inline-flex items-center justify-center gap-3 w-full h-12 px-8 rounded-[2px] bg-[var(--color-accent-primary)] text-white text-[0.95rem] tracking-wide hover:bg-[var(--color-accent-deep)] transition-colors duration-[240ms] disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={18} strokeWidth={1.8} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send inquiry
                        <ArrowRight
                          size={16}
                          strokeWidth={1.5}
                          className="transition-transform duration-[240ms] group-hover/cta:translate-x-1"
                        />
                      </>
                    )}
                  </MagneticButton>
                </motion.div>

                <motion.p
                  className="text-[0.8rem] text-center text-[var(--color-text-muted)] mt-2"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.4 } },
                  }}
                >
                  Every message is read by a human within 2 business days.
                </motion.p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* --- Floating-label primitives ------------------------------------------- */

type RegisterFn = ReturnType<typeof useForm<ContactInput>>["register"];

function FieldFloating({
  label,
  name,
  type,
  autoComplete,
  register,
  error,
}: {
  label: string;
  name: keyof ContactInput;
  type: string;
  autoComplete?: string;
  register: RegisterFn;
  error?: string;
}) {
  return (
    <motion.label
      className="relative block"
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
      }}
    >
      <input
        type={type}
        autoComplete={autoComplete}
        placeholder=" "
        aria-invalid={!!error}
        className={[
          "peer w-full bg-transparent border-b pt-6 pb-2 outline-none text-[1rem] text-[var(--color-text-primary)] placeholder-transparent transition-colors duration-200",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-black/15 focus:border-[var(--color-accent-primary)]",
        ].join(" ")}
        {...register(name)}
      />
      <span
        className="pointer-events-none absolute left-0 top-2 text-[0.7rem] tracking-[0.14em] uppercase text-[var(--color-text-muted)] transition-all duration-200 ease-out
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-[1rem] peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case
          peer-focus:top-2 peer-focus:text-[0.7rem] peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-[var(--color-accent-primary)]"
      >
        {label}
      </span>
      {error && <span className="mt-1 block text-[0.8rem] text-red-600">{error}</span>}
    </motion.label>
  );
}

function FieldTextarea({
  label,
  name,
  rows = 5,
  register,
  error,
}: {
  label: string;
  name: keyof ContactInput;
  rows?: number;
  register: RegisterFn;
  error?: string;
}) {
  return (
    <motion.label
      className="relative block"
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
      }}
    >
      <textarea
        rows={rows}
        placeholder=" "
        aria-invalid={!!error}
        className={[
          "peer w-full bg-transparent border-b pt-6 pb-2 outline-none text-[1rem] text-[var(--color-text-primary)] placeholder-transparent resize-y transition-colors duration-200",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-black/15 focus:border-[var(--color-accent-primary)]",
        ].join(" ")}
        {...register(name)}
      />
      <span
        className="pointer-events-none absolute left-0 top-2 text-[0.7rem] tracking-[0.14em] uppercase text-[var(--color-text-muted)] transition-all duration-200 ease-out
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-[1rem] peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case
          peer-focus:top-2 peer-focus:text-[0.7rem] peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-[var(--color-accent-primary)]"
      >
        {label}
      </span>
      {error && <span className="mt-1 block text-[0.8rem] text-red-600">{error}</span>}
    </motion.label>
  );
}

function FieldSelect({
  label,
  name,
  register,
  error,
}: {
  label: string;
  name: keyof ContactInput;
  register: RegisterFn;
  error?: string;
}) {
  return (
    <motion.label
      className="relative block"
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
      }}
    >
      <span className="absolute left-0 top-2 text-[0.7rem] tracking-[0.14em] uppercase text-[var(--color-text-muted)]">
        {label}
      </span>
      <select
        aria-invalid={!!error}
        defaultValue=""
        className={[
          "w-full appearance-none bg-transparent border-b pt-6 pb-2 pr-8 outline-none text-[1rem] text-[var(--color-text-primary)] transition-colors duration-200",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-black/15 focus:border-[var(--color-accent-primary)]",
        ].join(" ")}
        {...register(name)}
      >
        <option value="" disabled>
          Choose…
        </option>
        {INQUIRY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={1.5}
        className="pointer-events-none absolute right-0 top-7 text-[var(--color-text-muted)]"
      />
      {error && <span className="mt-1 block text-[0.8rem] text-red-600">{error}</span>}
    </motion.label>
  );
}
