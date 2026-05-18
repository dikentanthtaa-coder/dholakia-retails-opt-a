"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  width?: number | string;
  className?: string;
  durationMs?: number;
  color?: string;
  delay?: number;
  orientation?: "horizontal" | "vertical";
};

/**
 * SVG draw-in hairline — CSS-only.
 *
 * Replaces a Framer-Motion variant that animated width/height. The
 * intersection observer triggers a class flip, and the rest is a single
 * CSS transition on the transform — cheaper than the Framer scheduler
 * and shaves the FM dependency on every section that uses a hairline.
 *
 * Falls back to "drawn" state when `prefers-reduced-motion: reduce`.
 */
export default function Hairline({
  width = 80,
  className = "",
  durationMs = 800,
  color = "currentColor",
  delay = 0,
  orientation = "horizontal",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isVertical = orientation === "vertical";
  const sizeValue = typeof width === "number" ? `${width}px` : width;

  return (
    <span
      ref={ref}
      aria-hidden
      className={`block ${className}`}
      style={{
        background: color,
        width: isVertical ? "1px" : sizeValue,
        height: isVertical ? sizeValue : "1px",
        transform: active
          ? "scale(1)"
          : isVertical
            ? "scaleY(0)"
            : "scaleX(0)",
        transformOrigin: isVertical ? "top center" : "left center",
        transition: `transform ${durationMs}ms cubic-bezier(0.65, 0, 0.35, 1) ${delay}ms`,
        willChange: "transform",
      }}
    />
  );
}
