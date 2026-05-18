
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { PRIMARY_NAV, HEADER_CTA } from "@/lib/nav";
import { EASE_STANDARD } from "@/lib/motion";

/**
 * Global Header — spec §1.8.
 * Height: 88px desktop / 64px mobile.
 *
 * ── Glass plate ──────────────────────────────────────────────────────────
 *   • 24px scroll → glass slides in. Clean light glassmorphism only:
 *     rgba(255,255,255,0.08) + backdrop-blur(16px) saturate(140%).
 *     No dark tint. The blur preserves whatever sits behind so the section
 *     under the header dictates contrast — not the glass itself.
 *
 * ── Foreground theme (section-aware) ─────────────────────────────────────
 *   The foreground (logo ink, nav colour, hairline) adapts to whichever
 *   surface is currently under the header. Resolution order:
 *
 *     1. Section-level marker [data-header-theme="light|dark"]  ← most precise
 *     2. Page-level marker     <html data-page-theme="light">    (PageTheme)
 *     3. pastHero heuristic    scrollY > 0.8 × innerHeight       (fallback)
 *
 *   Sections declare their tone at their own root. As the user scrolls, the
 *   header probes a point just below itself and uses that section's tone.
 *   Untagged pages still degrade gracefully via the page marker + heuristic.
 *
 *   onLight=true  → navy logo + dark nav + dark hairline
 *   onLight=false → white logo + white nav + low-op white hairline
 *
 * ── Mobile drawer ────────────────────────────────────────────────────────
 *   Midnight Navy panel; nav links stagger-fade-up at 40ms. Header sits
 *   over the navy panel when open, so the logo forces white ink regardless.
 */
export default function Header() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [pageTheme, setPageTheme] = useState<"light" | "dark">("dark");
  const [sectionTheme, setSectionTheme] = useState<"light" | "dark" | null>(null);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Scroll handler — owns three readings:
  //   • scrolled    — glass plate trigger (24px deliberate scroll)
  //   • pastHero    — heuristic for dark-hero pages without section tags
  //   • sectionTheme — current [data-header-theme] section under the header
  // All three update together so they stay in sync, and the work is small
  // enough to run on every passive scroll without rAF batching.
  useEffect(() => {
    const detectSectionTheme = (probeY: number): "light" | "dark" | null => {
      const targets = document.querySelectorAll<HTMLElement>(
        "[data-header-theme]"
      );
      // Choose the deepest (innermost) section that contains the probe point.
      // This lets a nested section override a parent's tone if needed.
      let active: HTMLElement | null = null;
      let bestTop = -Infinity;
      for (const el of Array.from(targets)) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          if (rect.top > bestTop) {
            bestTop = rect.top;
            active = el;
          }
        }
      }
      if (!active) return null;
      const v = active.dataset.headerTheme;
      return v === "light" ? "light" : "dark";
    };

    let raf = 0;
    const compute = () => {
      raf = 0;
      const y = window.scrollY;
      const headerH = window.innerWidth >= 1280 ? 88 : 64;
      const probeY = headerH + 4;
      setScrolled(y > 24);
      setPastHero(y > window.innerHeight * 0.8);
      setSectionTheme(detectSectionTheme(probeY));
    };
    const trigger = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", trigger, { passive: true });
    window.addEventListener("resize", trigger);
    return () => {
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("resize", trigger);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Read the page-theme marker that <PageTheme /> writes onto <html>.
  // Re-runs on pathname change AND on attribute mutations, so the new page's
  // mount-time `data-page-theme` is picked up the same tick it lands.
  useEffect(() => {
    const root = document.documentElement;
    const read = () => {
      const v = root.dataset.pageTheme;
      setPageTheme(v === "light" ? "light" : "dark");
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, {
      attributes: true,
      attributeFilter: ["data-page-theme"],
    });
    return () => obs.disconnect();
  }, [pathname]);

  // Foreground tone — three-tier resolution:
  //   1. Explicit section marker (most precise) — wins outright.
  //   2. Page-level marker — covers legal/404 etc.
  //   3. pastHero heuristic — fallback for untagged pages.
  // Derived early so the divider tween can react to it in the same frame.
  let onLight: boolean;
  if (sectionTheme !== null) {
    onLight = sectionTheme === "light";
  } else if (pageTheme === "light") {
    onLight = true;
  } else {
    onLight = pastHero;
  }

  // Glass crossfade — pure CSS transitions on inline styles. Previously this
  // used GSAP for the same job; the dependency was the only reason `gsap`
  // appeared on every route's client bundle. CSS `transition: background-color,
  // backdrop-filter` is just as smooth at 60fps and ships zero extra JS.
  useEffect(() => {
    const bg = bgRef.current;
    const divider = dividerRef.current;
    if (!bg || !divider) return;

    bg.style.transition =
      "background-color 280ms cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 280ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-backdrop-filter 280ms cubic-bezier(0.4, 0, 0.2, 1)";
    bg.style.backgroundColor = scrolled
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(255, 255, 255, 0)";
    bg.style.backdropFilter = scrolled ? "blur(16px) saturate(140%)" : "blur(0px)";
    (bg.style as CSSStyleDeclaration & { webkitBackdropFilter: string }).webkitBackdropFilter =
      scrolled ? "blur(16px) saturate(140%)" : "blur(0px)";

    divider.style.transition =
      "transform 280ms cubic-bezier(0.4, 0, 0.2, 1), background-color 280ms cubic-bezier(0.4, 0, 0.2, 1)";
    divider.style.transform = `scaleX(${scrolled ? 1 : 0})`;
    divider.style.backgroundColor = onLight
      ? "rgba(11, 20, 38, 0.10)"
      : "rgba(255, 255, 255, 0.12)";
  }, [scrolled, onLight]);

  // Lock body scroll when drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 h-16 xl:h-[88px]"
      >
        {/* GSAP-animated background layer — starts fully transparent.
            On scroll it eases to rgba(255,255,255,0.08) + blur(16px) +
            saturate(140%): clean light glassmorphism, no dark wash. */}
        <div
          ref={bgRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
        />
        {/* 1px hairline divider — scaleX animates in on scroll, colour is
            tweened by the glass effect (white-low-op for dark foreground,
            navy-low-op for light foreground). Initial transparent so the
            first paint doesn't flash a wrong tone before GSAP runs. */}
        <div
          ref={dividerRef}
          aria-hidden
          className="absolute left-0 right-0 bottom-0 h-px origin-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0)",
            transform: "scaleX(0)",
          }}
        />

        <div className="relative container-editorial flex items-center justify-between h-full">
          {/* LEFT — logo. Navy ink only when we're on a light page, above the
              glass threshold, AND the mobile drawer is closed. Anything else
              (dark hero, scrolled glass, or open drawer with its Midnight-Navy
              panel sitting under the header) uses the white-ink variant. */}
          <Logo variant={onLight && !open ? "navy" : "white"} />

          {/* CENTRE — 8 primary nav links. Desktop layout activates at xl
              (1280px) where the full row fits without wrapping; below that
              the mobile drawer takes over. */}
          <nav
            aria-label="Primary"
            className="hidden xl:flex items-center gap-7 2xl:gap-8 whitespace-nowrap"
          >
            {PRIMARY_NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-[14px] py-1 transition-colors duration-200"
                  style={{
                    color: onLight
                      ? "var(--color-text-primary)"
                      : "rgba(255,255,255,0.92)",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-accent-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = onLight
                      ? "var(--color-text-primary)"
                      : "rgba(255,255,255,0.92)";
                  }}
                >
                  {item.label}
                  {/* Active route 1px Electric Blue underline, 2px offset */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 right-0"
                      style={{
                        bottom: "-6px",
                        height: "1px",
                        background: "var(--color-accent-primary)",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT — Contact us CTA + mobile hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href={HEADER_CTA.href}
              aria-label={HEADER_CTA.ariaLabel}
              className="hidden xl:inline-flex items-center gap-2 px-4 whitespace-nowrap transition-[background-color,color] duration-[240ms]"
              style={{
                height: "36px",
                padding: "0 16px",
                borderRadius: "2px",
                background: "var(--color-accent-primary)",
                color: "var(--color-text-inverse)",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-accent-deep)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-accent-primary)";
              }}
            >
              {HEADER_CTA.label}
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 transition-colors"
              style={{
                color: onLight || open
                  ? open ? "#FFFFFF" : "var(--color-text-primary)"
                  : "#FFFFFF",
              }}
            >
              {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer — full-viewport Midnight Navy panel; 40ms stagger fade-up */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              className="xl:hidden fixed inset-0 z-40 flex flex-col"
              style={{
                background: "var(--color-bg-inverse)",
                paddingTop: "var(--header-h-mobile)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE_STANDARD }}
            >
              <motion.nav
                aria-label="Mobile primary"
                className="container-editorial py-10 flex flex-col gap-1 flex-1"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
                  },
                }}
              >
                {PRIMARY_NAV.map((item) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: EASE_STANDARD },
                      },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-4 border-b border-white/10 font-[family-name:var(--font-display)] text-white"
                      style={{ fontSize: "1.5rem", letterSpacing: "-0.01em" }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Contact us pinned to drawer bottom */}
              <motion.div
                className="container-editorial pb-10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: EASE_STANDARD }}
              >
                <Link
                  href={HEADER_CTA.href}
                  aria-label={HEADER_CTA.ariaLabel}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 w-full"
                  style={{
                    height: "48px",
                    background: "var(--color-accent-primary)",
                    color: "var(--color-text-inverse)",
                    borderRadius: "2px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {HEADER_CTA.label}
                  <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
